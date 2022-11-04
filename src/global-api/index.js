import { mergeOptions } from "../utils/index.js";

export function initGlobalApi (Vue) {
    Vue.options = {}
    // 源码中生命周期的结构： Vue.options =  {created:[a,b,c],watch:[a,b]} a：可能是全局的方法 也可能是组件里面的 created
    Vue.Mixin = function(mixin) { // {}
        this.options =  mergeOptions(this.options, mixin)
    }
}
