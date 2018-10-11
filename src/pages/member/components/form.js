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
      if (this.type === 'edit') {
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
      if (this.type === 'edit') {
        this.districtValue = parseInt(this.instance.districtValue);
      }
    }

  },
  methods: {
    add() {
      //去空和合法性校验未做
      let { name, tel, provinceValue, cityValue, districtValue, address } = this;
      let data = { name, tel, provinceValue, cityValue, districtValue, address };
      if (this.type === 'add') {
        Address.add(data).then(res => {
          this.$router.go(-1);
        })
      }
      if (this.type === 'edit') {
        data.id = this.id; //??
        Address.update(data).then(res => {
          this.$router.go(-1);
        })
      }
    },
    remove() {
      if (window.confirm('确认删除')) {
        Address.remove(this.id).then(res => {
          this.$router.go(-1);
        })
      }
    },
    setDefault() {
      Address.setDefault(this.id).then(res => {
        this.$router.go(-1);
      })
    }
  }
}