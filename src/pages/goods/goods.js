import './goods_common.css';
import './goods_custom.css';
import './goods.css';
import './goods_theme.css';
import './goods_mars.css';
import './goods_sku.css';
import './goods_transition.css';


import Vue from 'vue';
import url from 'js/api.js';
import qs from 'qs';
import axios from 'axios';
import mixin from 'js/mixin.js';


let { id } = qs.parse(location.search.substring(1)); 

new Vue({
  el: '#app', 
  data: {
    id,
    details: null,
    detailTab: ['商品详情', '本店成交'],
    tabIndex: 0,
    dealLists: null,
    bannerLists: [],
    skuType: 1,
    showSku: false,
    skuNum: 1,
    isAddCart: false,
    showAddMessage: false,
  },
  created() {
    this.getDetails();
  },
  watch: {
    tabIndex: function() {
      if (this.tabIndex === 1) {
        this.getDeal();
      }
    },
    showSku: function(newVal, oldVal) {
      document.body.style.overflow = newVal ? 'hidden' : 'auto';
      document.documentElement.style.overflow = newVal ? 'hidden' : 'auto';
      document.body.style.height = newVal ? '100%' : 'auto';
      document.documentElement.style.height = newVal ? '100%' : 'auto';
    }
  },
  methods: {
    getDetails() {
      axios.get(url.details, { id })
        .then(res => {
          this.details = res.data.data;
          this.details.imgs.map((img) => {
            this.bannerLists.push({
              clickUrl: '',
              img: img,
            });
          
        })
      })
    },
    changeTab(index) {
      this.tabIndex = index;
    },
    getDeal() {
      axios.get(url.deal)
        .then(res => {
          this.dealLists = res.data.data.lists;
        });
    },
    chooseSku(type) {
      this.skuType = type;
      this.showSku = true;
    },
    changeSkuNum(num) {
      if (num === -1 && this.skuNum === 1) return;
      this.skuNum += num;
    },
    addCart() {
      axios.get(url.addCart, {
        id,
        number: this.skuNum
      }).then(res => {
        // if (res.data.status === 200) {
          this.showSku = false;
          this.isAddCart = true;
          this.showAddMessage = true;

          setTimeout(() => {
            this.showAddMessage = false;
          }, 1500);
        // }
      })
    }
  },
  mixins: [mixin],
})

