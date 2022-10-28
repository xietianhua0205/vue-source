import { ArrayMethods } from './arr'

export function observer (data) {
    if (typeof data !== 'object' || data == null) {
        return data
    }
    // 对象通过类
    return new Observer(data)
}

class Observer {
    constructor (value) {
        Object.defineProperty(value,'__ob__',{
            enumerable: false,
            value: this
        })

        // 判断数组还是对象
        if (Array.isArray(value)) {
            value.__proto__ = ArrayMethods
            // 如果你是数组对象
            this.observeArray(value)  // 处理我们
        } else {
            this.walk(value)
        }
    }

    walk (data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }

    observeArray (value) {
        for (let i = 0; i < value.length; i++) {
            observer(value[i])
        }
    }
}

// 对 对象中的属性进行劫持
function defineReactive (data, key, value) {
    observer(value)  // 深度代理
    Object.defineProperty(data, key, {
        get () {  //  获取的时候触发
            return value
        },
        set (newValue) {  // 修改属性值的时候触发
            if (value === newValue) return  // 修改成一样的值直接返回
            observer(value) // 设置的新值是一个对象需要重新进行观察
            value = newValue
        }
    })
}

// 总结：
// 1. Object.defineProperty, 对对象中某一个属性进行劫持
// 2. 遍历 {a：1， b：2}
// 3. 递归  get  set

// 数组 劫持 { list:[1,2,3], arr:[{a:1}]} , 函数劫持，重写数组的方法

// 数组中追加的对象也需要被劫持？

