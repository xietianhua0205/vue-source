import {patch} from "./patch.js";
import watcher from "./observe/watcher.js";

export function mountComponent(vm, el) {
    callHook(vm, 'beforeMounted')
    // 源码
    // vm._update(vm._render()) // (1) vm._render 将render 函数变成虚拟dom (2) vm._update 将 vnode 变成真实dom 渲染进页面
    let updateComponent = () => {
        vm._update(vm._render())
    }
    new watcher(vm, updateComponent, () => {
    }, true)
    callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 将虚拟dom变成真实dom 渲染进入页面
        let vm = this
        // 两个参数 (1) 原来的dom  （2）vnode
        vm.$el = patch(vm.$el, vnode)
    }
}


// (1) render() 函数变成 =》 vnode =》 真实dom

// 生命周期调用
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(this)  // 改变生命周期的 this指向
        }
    }
}