// 重写数组方法
// step1 获取原来数组的方法
import { observer } from "./index";

let oldArrayProtoMethods = Array.prototype

// step2 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// step3 劫持

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice'
]

methods.forEach(item => {
    ArrayMethods[item] = function(...args) { // {list}
        let result = oldArrayProtoMethods[item].apply(this, args)
        let inserted
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.splice(2); // arr.splice(0,1,{a:6})
                break;
        }
        let ob = this.__ob__
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        //  数组追加对象的情况
        return result
    }
})
