class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        // data中的属性名称
        this.key = key;
        // 回调函数负责更新视图
        this.cb = cb;

        // 当前的watcher对象记录到Dep类的静态属性target
        // 触发get方法，在get方法中调用addSub

        Dep.target = this;

        this.oldValue = vm[key];

        Dep.target = null;
    }

    update() {
        let newValue = this.vm[this.key];
        if (this.oldValue === newValue) {
            return;
        }
        this.cb(newValue);
    }
}