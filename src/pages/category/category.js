import 'css/common.css';
import './category.css';
import url from 'js/api.js';
import axios from 'axios';
import Vue from 'vue';

// import Foot from 'components/Foot.vue';
import mixin from 'js/mixin.js';

new Vue({
  el: '#app',
  data: {
    topLists: null,
    topIndex: 0,
    subData: null,
    rankData: null,
  },
  created() {
    this.getTopList();
    this.getSubList(undefined, 0);
  },
  methods: {
    getTopList() {
      axios.post(url.topLists).then(res => {
        this.topLists = res.data.lists;
      }).catch(err => console.log('loading'));
    },
    getSubList(id, index) {
      this.topIndex = index;
      if (index === 0) {
        this.getRank();
      } else {
        axios.post(url.subLists, { id }).then(res => {
          this.subData = res.data.data;
        }).catch(err => console.log('loading'));;
      }
    },
    getRank() {
      axios.post(url.rank).then(res => {
        this.rankData = res.data.data;
      }).catch(err => console.log('loading'));
    },
    toSearch(list) {
      location.href = `search.html?keyword=${list.name}&id=${list.id}`
    }
  },
  mixins: [mixin],
})