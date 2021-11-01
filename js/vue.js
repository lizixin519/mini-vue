class Vue {
    constructor(options) {
        // 通过属性保存选项的数据
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        // 把data中的成员转化成getter和setter,注入到vue实例中
        this._proxyData(this.$data);
        // 创建observer对象，监听数据对象
        new Observer(this.$data);
        new Compiler(this);
    }
    _proxyData(data) {
        // 遍历data中的所有属性
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key];
                },

                set(newValue) {
                    if (newValue === data[key]) {
                        return;
                    }
                    data[key] = newValue;
                },
            });
        });
    }
}
