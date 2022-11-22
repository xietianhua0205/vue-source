import {initMixin} from "./init";
import {lifecycleMixin} from "./lifecycle.js";
import {renderMixin} from './vnode/index.js';
import {initGlobalApi} from './global-api/index.js'
import {stateMixin} from "./initState.js";
import {compileTOFunction} from './compile/index.js';
import {createEL, patch} from './patch.js'

function Vue(options) {
    this._init(options)
}

// 这些方法都是原型上的方法
initMixin(Vue) // 状态初始化
lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加_render
// 全局的方法 Vue.minix extend 等等
initGlobalApi(Vue)
stateMixin(Vue) //  给 vm 添加 $nextTick

// 创建vnode
let vm1 = new Vue({data:{name:"张三"}})
let render1 = compileTOFunction(`<div id="a">{{name}}</div>`)
let vnode1 = render1.call(vm1)
document.body.appendChild(createEL(vnode1))

// 数据更新
let vm2 = new Vue({data:{name:"李四"}})
let render2 = compileTOFunction(`<p id="a">{{name}}</p>`)
let vnode2 = render2.call(vm2)
// patch 比对
patch(vnode1,vnode2)

// 全局的方法 Vue.minix
export default Vue
