<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="list in lists" class="swp-page swiper-slide" >
        <a class="js-no-follow" :href="list.clickUrl">
          <img class="goods-main-photo fadeIn" :src="list.img">
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>


<style>
.swiper-slide img {
  width: 100%;
  height: 100%;
}
</style>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css'

export default {
  props: {
    lists: {
      type: Array,
      required: true
    },
    name: '',
  },
  mounted() {
    var swiper = new Swiper('.swiper-container', { 
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      autoplay: {
        delay: 2000,
      }
    });
  }
}

</script>