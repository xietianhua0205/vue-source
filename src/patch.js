export function patch (oldVnode, vnode) {
    // vnode => 真实Dom
    // (1) 创建 新dom
    let el = createEL(vnode)
    // (2) 替换  (1) 获取父节点 (2) 插入 (3) 删除
    let parentEl = oldVnode.parentNode // body
    parentEl.insertBefore(el, oldVnode.nextSibling)
    parentEl.removeChild(oldVnode)
    return el
}


function createEL (vnode) {
    const { tag, data, key, text, children } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
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
