// 队列 先进先出, 先进来的先执行
const callbacks = []
let pending = false
let microTimerFunc
microTimerFunc = () => {
    Promise.resolve().then(flushCallback)
}

function flushCallback() {
    console.log(callbacks);
    callbacks.forEach((cb) => {
        cb()
    })
    pending = false
}


function nextTick(cb, ctx) {
    callbacks.push(() => {
        cb.call(ctx)
    })
    if (!pending) {
        microTimerFunc()
        pending = true
    }
}

nextTick(function () {
    console.log(this.name)
}, {name: '张三'})

nextTick(function () {
    console.log(this.age)
}, {age: 18})