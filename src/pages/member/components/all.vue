<template>
  <div class="container " style="min-height: 597px;">
    <div class="block-list address-list section section-first js-no-webview-block" v-if="lists&&lists.length">
      <a class="block-item js-address-item address-item " 
        @click="toEdit(list)"
        v-for="list in lists"
        :key="list.id"
        :class="{'address-item-default': list.isDefault}"
      >
        <div class="address-title">Nat Chen {{list.tel}}</div>
        <p>深圳市南山区科技园</p>
      </a>
    </div>
    <div class="block stick-bottom-row center">
      <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" to="/address/form">
            新增地址
        </router-link>
    </div>
  </div>
</template>

<script>
import Address from 'js/addressService.js';

export default {
  data() {
    return {
      lists: null,
    }
  },
  created() {
    Address.list().then(res => {
      this.lists = res.data.lists;
    });
  },
  methods: {
    toEdit(list) {
      this.$router.push({
        name: 'form', 
        query: {
          type: 'edit',
          instance: list,
        }
      })
    }
  }
}

</script>
