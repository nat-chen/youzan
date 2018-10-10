import Foot from 'components/Foot.vue';
import Swipe from 'components/Swipe.vue';

export default {
  filters: {
    currency(price) {
      let priceStr = '' + price;
      if (priceStr.indexOf('.') > -1) {
        let arr = priceStr.split('.');
        return arr[0] + '.' + (arr[1] + '0').substr(0, 2);
      } else {
        return priceStr + '.00';
      }
    },
    numberValidation(numberStr) {
      let removedHeadZeroes = String(numberStr).replace(/^0+/, '') 
      let isNumber = /^\d+$/.test(removedHeadZeroes);
      return isNumber ? Number(removedHeadZeroes) : number;
    }
  },
  components: { // vue 组件页面
    Foot,
    Swipe
  }
}