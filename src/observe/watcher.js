//(1) 通过 watcher 实现更新
class watcher {
    constructor(vm,updateComponent,cb,options) {
        // (1)
        this.vm = vm
        this.exprorfn = updateComponent
        this.cb = cb
        this.options = options
        // 判断
        if(typeof updateComponent === 'function'){
            this.getter = updateComponent
        }
    }
}

export default watcher