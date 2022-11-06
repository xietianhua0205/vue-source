import {initState} from "./initState";
import {compileTOFunction} from "./compile/index.js";
import {callHook, mountComponent} from './lifecycle.js'
import {mergeOptions} from "./utils/index.js";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
        vm.$options = options
        vm.$options = mergeOptions(Vue.options, options)
        callHook(vm, 'beforeCreated')
        // 初始化状态
        initState(vm)
        callHook(vm, 'created')
        // 渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        let vm = this
        el = document.querySelector(el) // 获取元素
        vm.$el = el  // 将旧的 Dom 对象进行保存
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // 获取到 html
                el = el.outerHTML
                // 变成 AST 语法树
                let render = compileTOFunction(el)
                // 将 render 函数变成虚拟dom--vnode; (2) 将vnode变成真实dom放到页面上去
                options.render = render
            }
        }
        // 挂载组件
        mountComponent(vm, el)
    }
}

// AST 语法树 {}  vnode {}

/**
 *  {
 *      tag:'div',
 *      attrs: [{id:'app'}],
 *      children:[{tag:null,text:'hello'},]
 *  }
 *
 *
 *
 *
 * */
