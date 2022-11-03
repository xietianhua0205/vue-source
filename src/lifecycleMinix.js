import { patch } from "./patch.js";

export function mountComponent (vm, el) {
    // 源码
    vm._update(vm._render()) // (1) vm._render 将render 函数变成虚拟dom (2) vm._update 将 vnode 变成真实dom 渲染进页面
}

export function lifecycleMixin (Vue) {
    Vue.prototype._update = function(vnode) {
        console.log(vnode)
        // 将虚拟dom变成真实dom 渲染进入页面
        let vm = this
        // 两个参数 (1) 原来的dom  （2）vnode
        vm.$el = patch(vm.$el, vnode)
    }
}


// (1) render() 函数变成 =》 vnode =》 真实dom
