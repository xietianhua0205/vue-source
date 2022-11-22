import {observer} from './observe/index';
import {nextTick} from './utils/nextTick.js';
import Watcher from './observe/watcher.js';

export function initState(vm) {
    let ops = vm.$options
    if (ops.props) {
        initProps()
    }
    if (ops.data) {
        initData(vm)
    }
    if (ops.watch) {
        initWatch(vm)
    }
    if (ops.methods) {
        initMethods()
    }
}

function initProps() {
}

function initMethods() {
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data // 注意改变  this的指向问题
    // 将data上的所有属性代理到实例上 {a:1,b:1}
    for (let key in data) {
        proxy(vm, "_data", key)
    }
    // data 中的数据进行劫持
    observer(data)
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}


function initWatch(vm) {
    // 1. 获取 watch
    let watch = vm.$options.watch
    // 2. 遍历 {a，b, c}
    for (let key in watch) {
        // 2.1 获取  他的属性对应的值 （判断）
        let handler = watch[key] // 数组 对象 字符 函数
        if (Array.isArray(handler)) {
            handler.forEach((item) => {
                createrWatcher(vm, key, item)
            })
        } else { // 对象 字符串  函数
            // 3. 创建方法来处理, 格式化处理
            createrWatcher(vm, key, handler)
        }
    }

}

// vm.$watch(()=>{ return 'a'}) // 返回值就是 watcher 上面的属性 user = false
function createrWatcher(vm, exprorfn, handler, options) {
    // 3.1 处理 handler
    if (typeof handler === 'object') {
        options = handler; // 用户的配置项
        handler = handler.handler; // 这个是函数
    }
    if (typeof handler === 'string') {
        handler = vm[handler] // 将实例上的方法作为hander  方法的代理 和 data一样
    }
    // 其他的是 函数的情况; watch 最终处理 $watcher 方法
    return vm.$watch(vm, exprorfn, handler, options)

}


export function stateMixin(vm) {
    // 列队: 1. 就是vue 自己的nextTick  2: 用户自己写的 回调函数
    vm.prototype.$nextTick = function (cb) { // nextTick: 数据更新周，获取到最新的dom
        nextTick(cb)
    },
        vm.prototype.$watch = function (Vue,exprorfn, handler, options={}) { // 上面就是格式化处理
            // 实现 watch 方法 就是 new watcher; 渲染走渲染的 watcher  $watch 走 watcher user false
            let watcher = new Watcher(Vue, exprorfn, handler, {...options,user:true})
            if (options.immediate) {
                handler.call(Vue)
            }
        }
}

// nextTick 原理

// watch 基本使用 初始化 干了啥事情