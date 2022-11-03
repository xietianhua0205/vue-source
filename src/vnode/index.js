export function renderMixin (Vue) {
    Vue.prototype._c = function(...args) {  // 标签
        // 创建标签
        return createElement(...args)
    }
    Vue.prototype._v = function(text) {  // 文本
        return createText(text)
    }
    Vue.prototype._s = function(val) {  // 双括号里面的值
        return val === null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val
    }

    Vue.prototype._render = function() { // render 函数变成 vnode
        let vm = this
        let render = vm.$options.render
        let vnode = render.call(this)
        return vnode
    }
}

// 创建元素
function createElement (tag, data = {}, ...children) {
    return vnode(tag, data, data.key, children)
}

// 创建虚拟DOM
function vnode (tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        text,
        children
    }
}

function createText(text){
    return vnode(undefined,undefined,undefined,undefined,text)
}

// vnode 节点
/***
 * {
        tag,
        data,
        key,
        text,
        children
    }
 *
 *
 *
 * */
