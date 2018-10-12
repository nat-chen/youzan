import Vue from 'vue';
import Router from 'vue-router';

import router from './router';
import store from './vuex'; //index.js为默认文件


//根组件注入
new Vue({
  el: '#app',
  router,
  store
})
