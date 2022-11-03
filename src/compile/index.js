import { parseHTML } from "./parseAst.js";
import { generate } from "./generate.js";

/****
 *  render(){
 *      return _c('div',{id:app},_v('hell')+_s(msg),_c)
 *  }
 *
 *
 *
 *
 * */

export function compileTOFunction (el) {
    // step1 将 html 变成  ast 语法树
    let ast = parseHTML(el)
    // step2 ast 语法树 变成 render 函数，  （1） ast 语法树变成 字符串 （2) 字符串变成函数
    let code = generate(ast) // _c _v _s
    // step3 将render 字符串变成 函数
    let render = new Function(`with(this){return ${code}}`)
    return render
}

