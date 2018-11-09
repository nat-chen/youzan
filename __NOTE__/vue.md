# Vue 知识点

## 生命周期

## this.$nextTick()


## vm.$mount VS new Vue()
* 两者都返回 vue 实例
* 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中。
* 实例的挂载的元素不能是 body/html