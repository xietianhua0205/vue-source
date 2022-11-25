import VNode from "vue/src/core/vdom/vnode.js";

export function patch(oldVnode, vnode) {
    // 原则 将虚拟节点转换成真实的节点
    // 第一次渲染 oldValue 是一个真实的Dom
    if (oldVnode.nodeType === 1) {
        // vnode => 真实Dom
        // (1) 创建 新dom
        let el = createEL(vnode)
        console.log(el);
        // (2) 替换  (1) 获取父节点 (2) 插入 (3) 删除
        let parentEl = oldVnode.parentNode // body
        parentEl.insertBefore(el, oldVnode.nextSibling)
        parentEl.removeChild(oldVnode)
        return el
    } else {  // diff 比对
        //1. 元素标签不一样的情况
        if (oldVnode.tag !== vnode.tag) {
            oldVnode.el.parentNode.replaceChild(createEL(vnode), oldVnode.el)
        }
        // 2. 标签一样 text 属性 <div>1</div>  <div>1</div>   tag: undefined
        if (oldVnode.tag === undefined) {
            if (oldVnode.text !== vnode.text) {
                oldVnode.el.textContent = vnode.text
            }
        }
        // 2.1 属性  （标签一样） <div id='a'>1</div>  <div id='b'>2</div>
        // 方法  1. 直接复制
        let el = vnode.el = oldVnode.el
        updataRpors(vnode, oldVnode.data)

        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) { // 3. 老的有儿子，新的有儿子
            // 创建方法
            // el 需要更新的真实dom
            updateChild(oldChildren, newChildren, el)

        } else if (oldChildren.length > 0) {    // 1. 老的元素有儿子, 新的没有儿子
            el.innerHTML = ''
        } else if (newChildren.length > 0) {   // 2 老没有儿子， 新的有儿子
            for (let i = 0; i < newChildren.length; i++) {
                let child = newChildren[i]
                // 添加到真实的dom中
                el.appendChild(createEL(child))
            }
        }
    }
}

function updateChild(oldChildren, newChildren, el) {
    console.log(oldChildren, newChildren, el)
}

// 添加属性
function updataRpors(vnode, oldProps = {}) { // 第一次属性
    let newProps = vnode.data || {} // 获取当前新节点的属性
    let el = vnode.el  // 获取当前真实节点

    // 判断 老的有属性，新的没有属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            // 删除
            el.removeAttribute(key)
        }
    }
    // 2 处理 老的样式  style={color:red} 新的 style={background:red}
    let newStyle = newProps.style || {} // 获取新的样式
    let oldStyle = oldProps.style || {} // 获取老的样式

    // 如果老的中有，新的节点中没有，需要删除
    for (let key in oldStyle) {
        if (!newProps[key]) {
            el.style = ''
        }
    }


    //  新的
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

// vnode 变成真实的dom
export function createEL(vnode) {
    const {tag, data, key, text, children} = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updataRpors(vnode)
        if (children && children.length) {
            children.forEach((child) => {
                vnode.el.appendChild(createEL(child))
            })
        }
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

//  vue 渲染流程
// vue 渲染流程 =》 数据初始化=》 模板编译=》变成 render函数 =》 通过render函数变成 vnode =》 vnode变成真实dom=》 放到页面上去
