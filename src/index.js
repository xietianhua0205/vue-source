import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle.js";
import { renderMixin } from './vnode/index.js';
import { initGlobalApi } from './global-api/index.js'

function Vue (options) {
    this._init(options)
}

initMixin(Vue) // 状态初始化
lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加_render
// 全局的方法 Vue.minix extend 等等
initGlobalApi(Vue)

// 全局的方法 Vue.minix
export default Vue
