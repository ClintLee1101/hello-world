import {
    LOGIN,
    LOGIN_FSP,
    LOGOUT,
    LOGOUT_FSP,
    CHECK_USER_LOGIN,
    GET_CARTLIST,
    SET_DEFAULT_ADDRESS,
    SET_DEFAULT_INVOICE,
    GET_USER_FUNDINFO,
    GET_USER_FSPINFO,
    ORDER_INFO,
    PER_ACCOUNT,
    SELECT_INVOICE,
    SELECT_ADDRESS,
    ENCRYPTOKEN,
    SELECT_TRANPORTS,
    GET_USER_ORGINFO,
    LICAI_INFO,
} from './mutation-types.js'
import util from '../lib/util';
import{
    GlobelObj
} from '../components/Global.vue'
import {
	setStore,
	getStore,
} from '../config/mUtils'

export default {
    //用户登录
    [LOGIN](state, res) {
        if(res.result == 1){
          state.isLogin = true;
        }else{
          state.isLogin = false;
        }
    },
    [LOGIN_FSP](state, res) {
        state.selectTransport = {};
        state.cartListStore = {};
        state.cartNum = 0;
        state.userFundInfo = {};
        state.defaultAddress = {};
        state.userFspInfo = {};
        state.defaultInvoice = {};
        state.selectInvoice = {};
        // state.kailinFundObj={};

        if(res.code == 0){
            state.isLogin = true;
            state.userFspInfo = res.data;
            // state.kailinFundObj.token='y9ximQZFXO4%3D%3D';
            // state.kailinFundObj.userId='544163';
        }else{
            state.isLogin = false;
        }
    },
    //用户退出
    [LOGOUT](state, res) {
        state.isLogin = false;
    },
    [LOGOUT_FSP](state, res) {
        state.isLogin = false;
        state.cartListStore = {};
        state.cartNum = 0;
        state.userFundInfo = {};
        state.userFspInfo = {};
        state.defaultAddress = {};
        state.defaultInvoice = {};
        state.selectAddress = {};
    },
    //购物车
    [GET_CARTLIST](state, cartListStore) {
        state.cartListStore = cartListStore;
    if(cartListStore.result == 1){
      var rs = cartListStore["data"];
      let num = 0;
      for(var i = 0;i<rs.length;i++) {
        var gl = rs[i].goodslist;
        num = num + gl.length;
      }
      state.cartNum = num;
    }
    },
    [CHECK_USER_LOGIN](state, res) {
        state.isLogin = res;
    },
    [SET_DEFAULT_ADDRESS](state, res) {
        state.defaultAddress = res;
    },
    [SET_DEFAULT_INVOICE](state, res) {
      state.defaultInvoice = res;
    },
    [GET_USER_FUNDINFO](state, res) {
        state.userFundInfo = res;
    },
    [GET_USER_FSPINFO](state, res) {
        state.userFspInfo = res;
    },
    //选择信息保存下来
    [ORDER_INFO](state, res) {
        console.log(res);
        state.orderInfo.province = res[0];
        state.orderInfo.city_selected_byTrain=res[1];
        state.orderInfo.way = res[2];
        state.orderInfo.date = res[3];
        state.orderInfo.city_selected_bySelf = res[4];
        state.orderInfo.shippingPrice = res[5];
        state.orderInfo.payment = res[6];
        state.orderInfo.selected = res[7];
    },
    //个人注册信息保存
    [PER_ACCOUNT](state, res) {
        console.log(res);
        state.preAccountInfo.clientName = res[0];
        state.preAccountInfo.idNo=res[1];
        state.preAccountInfo.bankNo = res[2];
        state.preAccountInfo.selectedBank = res[3];
        state.preAccountInfo.bankAccount = res[4];
        state.preAccountInfo.password = res[5];
        state.preAccountInfo.surePassword = res[6];
        state.preAccountInfo.mobile = res[7];
    },
    [SELECT_INVOICE](state, res) {
        state.selectInvoice = res;
    },
    [SELECT_ADDRESS](state, res) {
        state.selectAddress = res;
    },
    [SELECT_TRANPORTS](state, res) {
        state.selectTransport = res;
    },
    [ENCRYPTOKEN](state, res) {
        state.EncryptToken = res;
    },
    [LICAI_INFO](state, res) {
        console.log(res);
        state.licaiInfo = res;
    },
    [GET_USER_ORGINFO](state, res) {

        // state.fsphometoken = util.getCookie("fsphometoken");
        // GlobelObj.fsphometoken = state.fsphometoken
        state.orgInfo.bankList = res[0];
        state.orgInfo.bankList = res[1];
    }

}
