import { initState } from "./initState";

export function initMixin (Vue) {
    Vue.prototype._init = function(options) {
        let vm = this
        vm.$options = options
        // 初始化状态
        initState(vm)
        // 渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el) {
        let vm = this
        el = document.querySelector(el) // 获取元素
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // 获取到 html
                el = el.outerHTML
                console.log(el)
                //
            }
        }
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
