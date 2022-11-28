/**
 *  <div id='app'>hello {{msg}}<h></h></div>
 *
 *  render(){ _c： 解析标签  _v: 解析文本  _s: 解析插槽
 *      return _c('div',{id:app},_v('hell' + _S(msg)),_c...)
 *  }
 *
 * */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 处理属性
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach((item) => {
                let [key, val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        // 拼接字符串
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

// 处理子节点
function genChildren(el) {
    let children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

function gen(node) {  // 文本 ，元素
    if (node.type === 1) {   // 元素
        return generate(node)
    } else { // 文本 （1）只是文本  （2）有 {{}} 插值表达式
        let text = node.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        // 带有 {{}}
        let tokens = []
        let lastIndex = defaultTagRE.lastIndex = 0
        let match
        while (match = defaultTagRE.exec(text)) {
            let index = match.index
            if (index > lastIndex) { // 添加内容
                tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 内容
            }
            //  {{}}
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        // 判断还有没有文本
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex,text.length)))
        }
        return `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    // 注意属性解析 {id:app, style:{color:red;font-size:20px}}
    let children = genChildren(el)
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'},${children ? `${children}` : ''})`
    return code
}
