// import {
//   login,
//   logout,
//   logoutFSP,
//   loginFSP,
//   checkLogin,
//   getCartList,
//   setDefaultInvoice,
//   getUserFundInfo,
//   getUserFSPInfo,
//   getOrgInfo
// } from '../service/getData'


import {
    fspService
} from '../service'
import {
    b2bService
} from '../service'

import {
  LOGIN,
  LOGIN_FSP,
  LOGOUT,
  LOGOUT_FSP,
  CHECK_USER_LOGIN,
  GET_CARTLIST,
  GET_USER_FUNDINFO,
  SET_DEFAULT_ADDRESS,
  SET_DEFAULT_INVOICE,
  GET_USER_FSPINFO,
  ORDER_INFO,
  PER_ACCOUNT,
  ENCRYPTOKEN,
  GET_USER_ORGINFO,
    LICAI_INFO
} from './mutation-types'
import util from '../lib/util';
import{
    GlobelObj
} from '../components/Global.vue'

export default {
  async userLogin({
                      commit,
                      state
                    },params) {
      util.delteAllCookie();
      // let resfsp = await loginFSP(params[0],params[1],params[2]);
      let _params={
          inputValue:params[0],
          password:params[1],
          type:params[2]=='0'?'mobile':'org'
      }
      let resfsp = await fspService.loginFSP(_params);
      if(typeof params[3] === 'function') {
          if(resfsp.code != 0){
              params[3](resfsp.message);
          }else{
              params[3]("登录成功");
          }
      }
      if(resfsp.code != 0){
          return;
      }else{
          var word=resfsp.data.mobile+'|'+resfsp.data.type;
          var userid=resfsp.data.wealthUserId;
          var token=resfsp.data.token;
          localStorage.setItem("userId",userid);
          localStorage.setItem("token",token);

          // localStorage.setItem("userId","548377");
          // localStorage.setItem("token","eisiPQC3DM8%3D");//测试环境
          // localStorage.setItem("userId","548355");
          // localStorage.setItem("token","I_9jlnMRyXk=");//测试环境 范老师账号
          // localStorage.setItem("userId","61");
          // localStorage.setItem("token","I2xF62UVmxU%3D");//本地开发
          localStorage.setItem("type",resfsp.data.type);
          //加密
          function Encrypt(word){
              var key = CryptoJS.enc.Utf8.parse("abcDEfg12cde89wk");
              var srcs = CryptoJS.enc.Utf8.parse(word);
              var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
              return encrypted.toString();
          }
          var EncryptToken=(Encrypt(word).replace(/\+/g,"-")).replace(/\//g,"_");
          console.log(EncryptToken);
          GlobelObj.fsphometoken = util.getCookie("fsphometoken");
          GlobelObj.AssessToken=EncryptToken;
          localStorage.setItem("AssessToken",EncryptToken);
          commit(ENCRYPTOKEN, EncryptToken);

      }
    // let res = await login(params[0],params[1],params[2]);
    // if(res.result != 1){
    //   if(typeof params[3] === 'function') {
    //     params[3](res.message);
    //   }
    //   commit(LOGIN, res)
    //   return;
    // }

    commit(LOGIN_FSP, resfsp)
  },
    //订单信息
    getOrderInfo({
                     commit,
                     state
                 },params){

        commit(ORDER_INFO,params)
    },
    //填写的个人注册信息
    storePerAccount({
                      commit,
                      state
                  },params){
        commit(PER_ACCOUNT,params)
    },
    //理财信息
    getLiCaiInfo({
                      commit,
                      state
                  },params){
        commit(LICAI_INFO,params)
    },
  async userLogout({
                    commit,
                    state
                  }) {
    let res = await b2bService.logout();
    if(res.result != 1){
      commit(LOGOUT, res)
      return;
    }
    // let resfsp = await logoutFSP();
    let resfsp = await fspService.logoutFSP();

      GlobelObj.AssessToken = "";
    GlobelObj.fsphometoken = "";
    // GlobelObj.B2B_JSESSIONID = "";
    commit(LOGOUT_FSP, resfsp)
  },
	async checkUserLogin({
		commit,
		state
	}) {
        // let res = await checkLogin();
        // if(res.result == 1){
        //   let res1 = await getUserFSPInfo();
        //   commit(CHECK_USER_LOGIN, (res1.result == 0)?true:false);
        // }else{
        //   commit(CHECK_USER_LOGIN, (res.result == 1)?true:false)
        // }

        let res1 = await fspService.getUserFSPInfo();
        if(res1.code == 0){
            var word=res1.data.mobile+'|'+res1.data.type;
            GlobelObj.fsphometoken = util.getCookie("fsphometoken");
            // console.log(request.getCookies())
            //加密
            function Encrypt(word){
                var key = CryptoJS.enc.Utf8.parse("abcDEfg12cde89wk");

                var srcs = CryptoJS.enc.Utf8.parse(word);
                var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
                return encrypted.toString();
            }
            var EncryptToken=(Encrypt(word).replace(/\+/g,"-")).replace(/\//g,"_");
            GlobelObj.AssessToken=EncryptToken;
            console.log("验证码" + GlobelObj.AssessToken)
        }else{
            GlobelObj.AssessToken = "";
        }
        commit(CHECK_USER_LOGIN, (res1.code == 0)?true:false);
	},
	async getUserCartList({
		commit,
		state
	}) {
		let carts = await b2bService.getCartList();
		commit(GET_CARTLIST, carts);
	},
  async setDefaultAddress({
                          commit,
                          state
                        },params) {
      let _parmas={
          addr_id:params[0].addr_id,
      }
    let address = await b2bService.setDefaultAddress(_parmas);
    commit(SET_DEFAULT_ADDRESS, params[0]);
  },
  async setDefaultInvoice({
                              commit,
                              state
                          },params) {
      let _parmas={
          invoiceCompany_id:params[0].id
      }
      let invoice = await b2bService.setDefaultInvoice(_parmas);
      commit(SET_DEFAULT_INVOICE, params[0]);
  },
  async getUserFundInfo({
                            commit,
                            state
                          }) {
    let info = await fspService.getUserFundInfo();
    if(info.code == 0){
      commit(GET_USER_FUNDINFO, info.data);
    }

  },
  async getUserFSPInfo({
                          commit,
                          state
                        }) {
    let info = await fspService.getUserFSPInfo();
    if(info.code == 0){
      commit(GET_USER_FSPINFO, info.data);
      if(info.data.type == 1){
          let _parmas = {
              mobile:info.data.mobile
          }
          let info1 = await fspService.getOrgInfo(_parmas);
          if(info1.code == 0){
              commit(GET_USER_ORGINFO, info1.data);
          }
      }
    }
  },



}
