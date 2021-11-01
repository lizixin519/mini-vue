class Observer {
    constructor(data) {
        this.walk(data);
    }

    walk(data) {
        // 判断data是否是对象
        if (!data || typeof data !== 'object') {
            return;
        }

        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key]);
        });
    }

    defineReactive(obj, key, value) {
        let that = this;
        // 负责收集依赖并发送通知
        let dep = new Dep();
        // 如果value是对象，把value内部属性转化成响应式数据
        this.walk(value);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target);
                return value;
            },

            set(newValue) {
                if (newValue === value) {
                    return;
                }
                value = newValue;
                that.walk(newValue);
                // 发送通知
                dep.notify();
            },
        });
    }
}
