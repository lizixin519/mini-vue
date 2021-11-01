class Compiler {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.compile(this.el);
    }

    // 编译模版，处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach((node) => {
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode(node)) {
                this.compileElement(node);
            }
            //判断node节点是否有子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach((attr) => {
            let attrName = attr.name;
            // 判断是否是指令
            if (this.isDirective(attrName)) {
                // v-text 去掉text
                attrName = attrName.substr(2);
                let key = attr.value;
                this.update(node, key, attrName);
            }
        });
    }

    update(node, key, attrName) {
        let updateFn = this[`${attrName}Updater`];
        updateFn && updateFn.call(this, node, this.vm[key], key);
    }

    // 处理v-text指令
    textUpdater(node, value, key) {
        node.textContent = value;
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue;
        });
    }
    // 处理v-model指令
    modelUpdater(node, value, key) {
        node.value = value;
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue;
        });
        //  双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        });
    }

    // 编译文本节点， 处理差值表达式
    compileText(node) {
        // 差值表达式{{ msg }}
        let reg = /\{\{(.+?)\}\}/;

        let value = node.textContent;
        if (reg.test(value)) {
            let key = RegExp.$1.trim();
            node.textContent = value.replace(reg, this.vm[key]);
            // 创建watcher对象，当数据变化更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = value.replace(reg, newValue);
            });
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }

    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }

    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
}
