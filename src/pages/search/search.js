import './search.css';
import 'css/common.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import qs from 'qs';

import mixin from 'js/mixin.js';


let { keyword, id } = qs.parse(location.search.substring(1));

new Vue({
  el: '.container',
  data: {
    searchLists: null,
    keyword,
  },
  created() {
    this.getSearchLists();
  },
  methods: {
    getSearchLists() {
      axios.post(url.searchLists, {
        keyword, 
        id,
      }).then(res => {
        this.searchLists = res.data.lists;
      })
    }, 
    goToTop() {
      window.scrollTo(0, 0);
    }
  }, 
  mixins: [mixin],
})