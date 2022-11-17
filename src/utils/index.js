// 对象合并 {created:[]}
export const Hooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'update',
    'beforeDestory',
    'destroyed'
]
// 策略模式
let starts = {}
starts.data = function (parentVal, childVal) {
    return childVal
} // 合并data
// starts.computed = function () {
// } // 合并computed
// starts.watch = function () {
// } // 合并watch
// starts.methods = function () {
// } // 合并methods

// 遍历生命周期
Hooks.forEach(hooks => {
    starts[hooks] = mergeHook
})

function mergeHook(parentVal, childVal) {
    // {created:[a,b,c],watch:[a,b],....}
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

export function mergeOptions(parent, child) { // {} {created}
    // 源码中生命周期的结构： Vue.options =  {created:[a,b,c],watch:[a,b],....} a：可能是全局的方法 也可能是组件里面的 created
    const options = {}
    // 如果有父亲，没有儿子
    for (let key in parent) {
        mergeField(key)
    }
    // 儿子有父亲没有
    for (let key in child) {
        mergeField(key)
    }

    function mergeField(key) {
        // 根据 key  策略模式
        if (starts[key]) { // created
            options[key] = starts[key](parent[key], child[key])
        } else {
            options[key] = child[key]
        }
    }

    return options
}
