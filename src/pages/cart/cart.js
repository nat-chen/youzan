import './cart_base.css';
import './cart_trade.css';
import './cart.css';

import Vue from 'vue';
import mixin from 'js/mixin.js';
import axios from 'axios';
import url from 'js/api.js';
import Velocity from 'velocity-animate/velocity.js';
import Cart from 'js/cartService.js';

//以下 checked 仅表示选择按钮

new Vue({
  el: '.container',
  data: {
    lists: null,
    total: 0,
    editingShop: null, //全局编辑值：当前编辑的店铺
    editingShopIndex: -1, //全局编辑值：当前编辑的店铺下标
    removeData: null,
    removePopup: false,
    removeMsg: '',
  },
  created() {
    this.getList();
  },
  computed: {
    allSelected: {
      get() {
        if (this.lists && this.lists.length) {
          return this.lists.every(shop => shop.checked === true)
        }
        return false;
      },
      set(newVal) {
        this.lists.map(shop => {
          shop.checked = newVal;
          shop.goodsList.map(goods => goods.checked = newVal)
        });
      }
    },
    allRemoveSelected: {
      //当处于编辑状态时, 操作全选
      get() {
        if (this.editingShop) {
          return this.editingShop.removeChecked;
        }
        return false;
      },
      set(newVal) {
        if (this.editingShop) {
          this.editingShop.removeChecked = newVal;
          this.editingShop.goodsList.map(goods => {
            goods.removeChecked = newVal
          });
        }
      }
    },
    selectLists() {
      if (this.lists && this.lists.length) {
        let arr = [];
        let total = 0;
        this.lists.map(shop => {
          shop.goodsList.map(goods => {
            if (goods.checked) {
              arr.push(goods);
              total += goods.price * goods.number;
            }
          })
          this.total = total; 
        })
        return arr;
      }
      return [];
    },
    removeLists() {
      if (this.editingShop) {
        let arr = [];
        this.editingShop.goodsList.forEach(goods => {
          if (goods.removeChecked) {
            arr.push(goods);
          }
        })
        return arr;
      }
      return [];
    }
    
  },
  methods: {
    getList() {
      axios.get(url.cartLists).then(res => {
        this.lists = res.data.cartList.map(shop => {
          shop.editing = false;
          shop.editingMsg = '编辑';
          shop.removeChecked = false;
          shop.goodsList.map(goods => {
            goods.checked = true;
            goods.removeChecked = false;
            return goods;
          });
          shop.checked = true;
          return shop;
        })
      })
    },
    selectGoods(shop, goods) {
      let attr = this.editingShop ? 'removeChecked' : 'checked';
      goods[attr] = !goods[attr];
      shop[attr] = shop.goodsList.every(goods => {
        return goods[attr];
      })
    },
    selectShop(shop) {
      let attr = this.editingShop ? 'removeChecked' : 'checked';
      shop[attr] = !shop[attr];
      shop.goodsList.map(goods => 
        goods[attr] = shop[attr]
      );
    },
    selectAll() {
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected';
      this[attr] = !this[attr];
    },
    edit(shop, shopIndex) {
      shop.editing = !shop.editing;
      shop.editingMsg = shop.editing ? '完成' : '编辑';
      this.lists.map((curShop, index) => {
        if (shopIndex !== index) {
          curShop.editing = false;
          curShop.editingMsg = shop.editing ? '' : '编辑';
        }
      });
      this.editingShop = shop.editing ? shop : null;
      this.editingShopIndex = shop.editing ? shopIndex : -1;
    }, 
    reduce(goods) {
      if (goods.number == 1) return;
      axios.post(url.cartReduce, {
        id: goods.id,
        number: 1
      }).then(res => {
        goods.number--;
      })
    },
    add(goods) {
      // axios.post(url.cartReduce, {
      //   id: goods.id,
      //   number: 1,
      // }).then(res => {
      //   goods.number++;
      // })
      Cart.add(goods.id).then(res => {
        goods.number++;
      });
    },
    remove(shop, shopIndex, goods, goodsIndex) {
      this.removePopup = true;
      this.removeData = { shop, shopIndex, goods, goodsIndex };
      this.removeMsg = '确定要删除该商品吗?';
    },
    removeList() {
      this.removePopup= true;
      this.removeMsg = `确定将所选 ${this.removeLists.length } 个商品删除?`;
    },  
    removeConfirm() {
      if (this.removeMsg === '确定要删除该商品吗?') {
        let { shop, shopIndex, goods, goodsIndex } = this.removeData;
        axios.post(url.cartRemove, {
          id: goods.id,
        }).then(res => {
          shop.goodsList.splice(goodsIndex, 1);
          if (!shop.goodsList.length) {
            this.lists.splice(shopIndex, 1);
            this.removeShop();
          }
        this.removePopup = false;
        })
      } else {
        let ids = [];
        this.removeLists.forEach(goods => {
          ids.push(goods.id);
        });
        axios.post(url.cartMremove, {
          ids
        }).then(res => {
          let arr = [];
          this.editingShop.goodsList.forEach(goods => {
            let index = this.removeLists.findIndex(item => {
              return item.id === goods.id;
            })
            if (index === -1) {
              arr.push(goods);
            }
          });
          if (arr.length) {
            this.editingShop.goodsList = arr;
          } else {
            this.lists.splice(this.editingShopIndex, 1);
            this.removeShop();
          }
          this.removePopup = false;
        })

      }
      
    },
    removeShop() { //在商品点击删除后
      this.editingShop = null;
      this.editingShopIndex = -1;
      this.lists.forEach(shop => {
        shop.editing = false;
        shop.editingMsg = '编辑';
      })
    },
    start($event, goods) {
      goods.startX = $event.changedTouches[0].clientX;
    },
    end($event, shopIndex, goods, goodsIndex) {
      let endX = $event.changedTouches[0].clientX;
      let left = '0';
      if (goods.startX - endX > 100) {
        left = '-60px';
      }
      if (endX - goods.startX > 100) {
        left = '0px';
      };
      Velocity(this.$refs[`goods-${shopIndex}-${goodsIndex}`], {
        left,
      })
    }
  },
  mixins: [mixin]
})