// 手写将 字符串 转换成  _v("hello "+_s(msg)+" word "+_s(name)+" test 胜多负少"+_s(ccss)) 的模式
let text = "hello {{msg}} word {{name}} test 胜多负少{{ccss}}"
const defaultTagREG = /\{\{((?:.|\r?\n)+?)\}\}/g

let match
let tokens = []
let lastindex = defaultTagREG.lastIndex = 0
let len = text.length // 记录下字符串的长度
while (match = defaultTagREG.exec(text)) {
    let index = match.index
    let input = match.input
    let hasMoitorlength = index + match[0].length
    let frontWord = input.slice(0, index)
    if (frontWord && frontWord.length) {
        tokens.push(JSON.stringify(frontWord))
    }
    tokens.push(`_s(${ match[1].trim() })`)
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
    let temp = input.slice(hasMoitorlength, len)
    if (defaultTagRE.test(temp)) {
        text = input.slice(hasMoitorlength, len)
        len = text.length
        defaultTagREG.lastIndex = 0
    } else {
        const temp = input.slice(hasMoitorlength, len)
        if (temp) {
            tokens.push(JSON.stringify(temp))
        }
    }
}
