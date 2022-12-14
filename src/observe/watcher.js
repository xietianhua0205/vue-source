//(1) 通过 watcher 实现更新
import {popTarget, pushTarget} from "./dep.js";
import {nextTick} from '../utils/nextTick.js'

let id = 0

class watcher {
    constructor(vm, exprorfn, cb, options) {
        // (1)
        this.vm = vm
        this.exprorfn = exprorfn
        this.cb = cb
        this.user = !!options.user
        this.options = options
        this.id = id++
        this.deps = [] // watcher 存放 dep
        this.depsId = new Set()
        // 判断
        if (typeof exprorfn === 'function') {
            this.getter = exprorfn // 用来更新视图的
        } else { // 属性 {a,b,c}  字符串 变成函数
            this.getter = function () { // 属性 c.c.c
                let path = exprorfn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj // 第一次
            }
        }
        // 4. 执行渲染页面
        this.value = this.get() // 保存watch 初始值
    }

    addDep(dep) {
        // 1.去重
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }

    // 初次渲染
    get() {
        pushTarget(this)  // 给 dep 添加 watcher
        const value = this.getter() // 渲染页面, 渲染页面的时候 才会 _s(),才会触发 插值解析，触发 get
        popTarget() // 给 dep 取消 watcher
        return value
    }

    run() { // old new
        let value = this.get() // new
        let oldValue = this.value // old
        this.value = value
        // 执行handler 这个用户的watcher
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        }
        this.get()
        // 在这里调用 $next()
    }

    // 更新
    update() {  // 注意，不要数据更新后每次都调用get 方法， get 方法回重新渲染
        queueWatcher(this)
    }
}

let pending = false
let queue = [] // 将需要批量更新的watcher 存放到一个列队中
let has = {}

function flushWatcher() {
    setTimeout(() => {
        queue.forEach((watcher) => {
            watcher.run()
            // watcher.cb()
        })
        queue = []
        has = {}
        pending = false
    }, 0)
}

function queueWatcher(watcher) {
    let id = watcher.id // 每个组件都是同一个 watcher
    if (has.id == null) {
        queue.push(watcher)
        has.id = id
        // 防抖: 用户触发多次，只触发一次; 等待同步代码执行完成以后，再执行
        if (!pending) {
            nextTick(flushWatcher) // 相当于我们的定时器
        }
        pending = true
    }
}

export default watcher

// 收集依赖 Vue dep  watcher data:{name,msg}
// dep: dep 和 data 中的属性 一 一 对象
// watcher 在视图上 用了几个，就有几个 watcher
// dep 于 watcher: 一对多 dep.name = [w1,w2] // 可能一个属性在视图上用了很多次

//（2）实现对象收集依赖


//  实现 $nextTick()

// 优化
// 1.  创建 nextTick 方法;

