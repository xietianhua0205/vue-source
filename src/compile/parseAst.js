/**
 *  {
 *      tag:'div',
 *      attrs: [{id:'app'}],
 *      children:[{tag:null,text:'hello'},]
 *  }
 *
 * */
// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名称
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性值
const startTagClose = /^\s*(\/?)>/ // 匹配标签的结束的

// 遍历
// 创建一个 ast 对象
// 数据结构栈代码
function createASTElement(tag, attrs) {
    return {
        tag, // 元素
        attrs, //
        children: [], // 子节点
        type: 1,
        parent: null // 是否有父元素
    }
}

let root; // 根元素
let createParent; // 当前父元素
// 数据结构 栈
let stack = []  // [div,h]

function start(tag, attrs) { // 开始标签
    let element = createASTElement(tag, attrs)
    if (!root) {
        root = element
    }
    createParent = element
    stack.push(element)
}


function charts(text) {  // 获取文本
    text=text.replace(/^\s+|\s+$/g,'') // 替换空格
    if(text){
        createParent.children.push({
            type: 3,
            text
        })
    }
}

function end(tag) { // 结束的标签, 出栈
    // console.log(tag, '结束标签')
    let element = stack.pop()
    createParent = stack[stack.length - 1]
    if (createParent) { // 元素的闭合
        element.parent = createParent.tag
        createParent.children.push(element)
    }
}


export function parseHTML(html) {
    // <div id='app'> hello {{msg}} <h></h></div> // 开始标签  文本  结束标签
    while (html) { // 当html 为空的时候结束
        // 判断标签 <>
        let textEnd = html.indexOf('<') // 0 -1
        if (textEnd === 0) { // 标签
            // 两种情况 （1） 开始标签
            const startTagMatch = parseStartTag() // 开始标签的内容，注意返回值是match
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        // 文本
        let text
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
    }

    function parseStartTag() {
        const start = html.match(startTagOpen) // 1结果 2false
        if (start) {
            // 创建语法树
            let match = {
                tagName: start[1],
                attrs: []
            }
            // 删除开始标签
            advance(start[0].length)
            // 属性; 属性多个; 遍历
            let attr
            let end
            attr = html.match(attribute)
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
    }

    function advance(n) {
        html = html.substring(n)
    }
    return root
}
