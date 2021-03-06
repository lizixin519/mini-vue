class Dep {
    constructor() {
        // 存储所有的观察者
        this.subs = [];
    }

    // 添加观察者
    addSub(sub) {
        if (sub && sub.update) {
            this.subs.push(sub);
        }
    }

    // 发送通知
    notify() {
        // 调用所有观察者的update方法
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}
