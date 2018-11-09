# Vue 实现有赞商城 (知识梳理与实现思路)

## 前置

### 基于 vue-cli 搭建一个多页面应用
* 全局安装 vue-cli：Vue.js官方提供的用于快速创建项目模板的脚手架工具
```bash
$ npm install -g vue-cli 
```

* 创建项目模板：官方提供了五个模板--webpack、webpack-simple、browserify、browserify-simple、simple，选择webpack模板
```bash
$ vue init webpack project-name
```

* 因项目模板默认为单页面应用, 需对项目结构调整为多页面的应用, src 需分为三层, 分别是 components, modules, pages; 细分为如下:
  * 在开发路径src下增加modules和pages文件夹，分别存放模块和页面
  * 组件放到components文件夹下
  * main.js改为index.js,保证页面的入口js文件和模板文件的名称一致
  * index.html(页面模板)、index.js(页面入口文件) 放置 pages/index 文件下

* webpack 配置, 具体详见 [多页面 webpack 配置](https://github.com/tonyfree/blog/issues/1)
  
### Webpack
* Webpack 为一款模块化的打包工具, 默认的输出文件为 main.js (注意 Node 默认为 index.js);


## 首页

### 思路

#### 布局 
* 顶部是一个无缝轮播组件
* 中间为三个推荐的商品链接 (静态)
* 接着是 "最热商品推荐"
* 底部为导航栏组件

#### 顶部
* 使用 swiper 插件, 封装一个轮播组件 Swipe.vue. 为保持组件的复用性, 通过 props 传递数据.
* 传递给 swiper 数据是通过异步获取的, 需添加 `v-if=bannerLists` 的判断. 同时将 `bannerLists` 置于 data 属性中, 以达到数据更新时重新渲染页面.
* swiper 基于对 DOM 节点操作, 需将该组件置于 mounted 的生命周期中.

#### 最热商品推荐
* 引用 mint-ui 移动端分页效果库 (PC 端为 element), 使用 infinite-scroll 的 API 达到获取新的商品列表:
  * 在距离小于 50px 时, 触发 getList 的调用, 异步获取新的数据.
  * loading 为布尔值, 表示是否加载的状态. 当发起异步请求数据时, 将 loading 设为 true, 从而避免同时段多次获取数据.
  ```js
  v-infinite-scroll="getList"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="50"
  ```

* 底部的加载效果: 当发起获取数据时即 loading=true, 添加加载中的效果 (v-show="loading").

#### 底部导航栏
* 因需复用, 置于 components/Foot.vue
* 导航栏由 4 个部分组成, 功能特性一致; 可将每个选项的 name/icon/href 使用一个对象存储后合并为一个数组, 用 v-for 迭代.
* 当点击不同的图标时跳转到其他页面, 此处应有对应项的高亮. 因页面的加载而无法便于标记. 使用的技巧是: 给图标绑定一个点击事件, 页面发生跳转后, 给当前地址栏末尾添加 `index=当前图标的索引`, 当渲染的图标与当前页面地址栏的索引一致时, 添加 active 类, 从而显示高亮效果.
* 使用 qs 库，这个库可以方便我们提取出当前url后面的查询参数。
* 由于在其他页面中，filters属性和底部导航栏组件都可以进行复用，所以这里我们利用mixins属性，来对filters属性和底部导航栏组件的注入进行打包，打包在一个js文件夹下的mixin.js文件中：

```js
let mixin={
  filters:{
      currency(num){
          num=num+''
          let arr=num.split('.')
          if (arr.length===1){
              return num+'.00'
          } else {
              if (arr[1].length===1){
                  return num+'0'
              } else return num
          }
      }
  },
  components:{
      Footnav
  }
}
```

### 知识点 

#### DNS Prefetching 
* DNS 是什么-- Domain Name System，域名系统，作为域名和IP地址相互映射的一个分布式数据库。
* 在 link 标签的 rel 属性添加, 有助于提前解析域名，以免延迟。 

```html
<link rel="dns-prefetch" href="https://dn-kdt-img.qbox.me/">
```

### location
```js
url.href = 'https://developer.mozilla.org:8080/en-US/search?q=URL#search-results-close-container';
url.href;      // https://developer.mozilla.org:8080/en-US/search?q=URL#search-results-close-container
url.protocol;  // https:
url.host;      // developer.mozilla.org:8080
url.hostname;  // developer.mozilla.org
url.port;      // 8080
url.pathname;  // /en-US/search
url.search;    // ?q=URL
url.hash;      // #search-results-close-container
url.origin;    // https://developer.mozilla.org:8080
```


## 目录分类页

### 思路
* 目录分类页并无新的操作，和首页的部分操作类似，就是利用axios从RAP接口中获取数据并渲染到页面中，并对页面中的一些焦点状态进行v-show的处理，以及一些类名的处理，我们可以从目录分类页中通过点击热销商品进入商品详情页，通过点击热门品牌进入商品搜索列表页，在进行这些页面的跳转时，把一些关键的数据传入查询参数中以便跳转页面获取即可。
* 多页面应用通过将数据传入查询参数, 实现不同页面的通信

### 知识点
* `Number.toFixed(2)`: 返回字符串格式的两个小数位的数字
* Vue 中的 data 不能写 undefined. 同没声明无异
* 当项目逻辑不足以复杂时, 往往使用单页面. 多页面项目一般把当前页面 html/css/js 使用统一的命名整合在同名的文件夹.
* PC 使用 FullPage, 移动端使用 swiper









