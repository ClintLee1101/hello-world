import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
// import getters from './getters'

Vue.use(Vuex)

const state = {
  fsphometoken:'',
  hasCart: 'hide', //是否显示购物车红点
  cartNum: 0, //购物车数量
  isLogin: false, //是否登录
  cartListStore: {}, // 加入购物车的商品列表
  userFspInfo: {}, //用户信息
  userFundInfo: {}, //用户信息
  defaultAddress:{}, //默认收货地址
  defaultInvoice:{},//默认发票
  selectInvoice:{}, //用户选中的发票
    selectAddress:{},//用户选中的地址
  selectTransport:{},//用户选中的承运信息
    // kailinFundObj:{},//理财账户token、userid
    licaiInfo:[[],{}],//理财账户信息
  orgInfo:{},//机构绑卡信息
  orderInfo:{//订单运输方式
      selected:'',
    date:'',
    way:'',//到站，仓库
      province:'',
      city_selected_bySelf:'',//仓库代码
      shippingPrice:'',//运费
      city_selected_byTrain:'',//城市代码
      payment:'',
  },
    preAccountInfo:{
        clientName:'',//真实姓名
        idNo:'',//身份证号
        bankNo:'',//银行编号
        selectedBank:'请选择银行卡',
        bankAccount:'',//银行卡号
        password:'',//交易密码
        surePassword:'',
        mobile:'',//手机号
    },
    EncryptToken:'',//身份登录使用

}

export default new Vuex.Store({
	state,
	// getters,
	actions,
	mutations,
})
