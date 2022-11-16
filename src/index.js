import {initMixin} from "./init";
import {lifecycleMixin} from "./lifecycle.js";
import {renderMixin} from './vnode/index.js';
import {initGlobalApi} from './global-api/index.js'
import {stateMixin} from "./initState.js";

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

// 全局的方法 Vue.minix
export default Vue
