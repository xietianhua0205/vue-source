import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycleMinix.js";
import { renderMixin } from './vnode/index.js';

function Vue (options) {
    this._init(options)
}

initMixin(Vue) // 状态初始化
lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加_render

export default Vue
