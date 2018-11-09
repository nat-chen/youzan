import Address from 'js/addressService.js'

export default {
  data() {
    return {
      name: '',
      tel: '',
      provinceValue: -1,
      cityValue: -1,
      districtValue: -1,
      address: '',
      id: '',
      type: '',
      instance: '',
      addressData: require('js/address.json'),
      cityList: null,
      districtList: null,
      isEditingAddress: false,
    }
  },
  computed: {
    lists() {
      return this.$store.state.lists;
    }
  },
  created() {
    let query = this.$route.query;
    this.type = query.type;
    this.instance = query.instance;

    if (this.type === 'edit') {
      let address = this.instance;
      this.provinceValue = parseInt(address.provinceValue);
      this.tel = address.tel;
      this.name = address.name;
      this.address = address.address;
      this.id = address.id;
    }
  },
  watch: {
    lists: {
      handler() {
        this.$router.go(-1);
      },
      deep: true, //深度监听
    },
    provinceValue(val) {
      if (val === -1) return;
      let list = this.addressData.list;
      let index = list.findIndex(item => {
        return item.value === val;
      });
      this.cityList = list[index].children;
      this.cityValue = -1;
      this.districtValue = -1;

      //处于编辑状态时 (不可在 created 赋值, 否则不断切换新值和 -1 的状态)
      if (this.type === 'edit' && !this.isEditingAddress) {
        this.cityValue = parseInt(this.instance.cityValue);
      }
    },
    cityValue(val) {
      if (val === -1) return;
      let list = this.cityList;
      let index = list.findIndex(item => {
        return item.value === val;
      });
      this.districtList = list[index].children;
      this.districtValue = -1;

      //处于编辑状态时
      if (this.type === 'edit' && !this.isEditingAddress) {
        this.districtValue = parseInt(this.instance.districtValue);
        this.isEditingAddress = true; //表明处于自由编辑状态
      }
    }

  },
  methods: {
    add() {
      //去空和合法性校验未做
      let { name, tel, provinceValue, cityValue, districtValue, address } = this;
      let data = { name, tel, provinceValue, cityValue, districtValue, address };
      console.log(data);
      // if (this.type === 'add') {
        // Address.add(data).then(res => {
        //   this.$router.go(-1);
        // })
        // this.$store.dispatch('addAction', data);
      // }
      if (this.type === 'edit') {
        data.id = this.id; //??
        this.$store.dispatch('updateAction', data);
      } else {
        this.$store.dispatch('addAction', data);
      }
    },
    remove() {
      if (window.confirm('确认删除')) {
        // Address.remove(this.id).then(res => {
        //   this.$router.go(-1);
        // })
        this.$store.dispatch('removeActions', this.id);
      }
    },
    setDefault() {
      // Address.setDefault(this.id).then(res => {
      //   this.$router.go(-1);
      // })
      this.$store.dispatch('setDefaultAction', this.id);
    }
  }
}