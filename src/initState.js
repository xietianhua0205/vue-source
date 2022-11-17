import {observer} from './observe/index';
import {nextTick} from "./utils/nextTick.js";

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
    // 获取 watch
    let watch = vm.$options.watch
    console.log(watch)
    debugger

}

export function stateMixin(vm) {
    // 列队: 1. 就是vue 自己的nextTick  2: 用户自己写的 回调函数
    vm.prototype.$nextTick = function (cb) { // nextTick: 数据更新周，获取到最新的dom
        nextTick(cb)
    }
}
