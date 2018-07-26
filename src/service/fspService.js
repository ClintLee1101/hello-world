/**
 * Created by lijian on 2018/5/28.
 */

class FspService{
    constructor(clientAxios){
        this.http = clientAxios;
    }
    addCommonParams(value){
        console.log(value)
        this.http.addCommonParams(value)
    }
    loginFSP(parmas){
        let url = '/a/user/login?t='+new Date().getTime();
        return this.http.postJson(url,parmas)
    }
    logoutFSP(parmas){
        let url = '/a/logout?t='+new Date().getTime();
        return this.http.postJson(url,parmas)
    }
    //个人注册
    perRegister(parmas){
        let url = '/a/user/register';
        return this.http.postJson(url,parmas)
    }
    //机构注册
    //第三个参数是否请求为applaction/json   请求体request payload
    orgOpenAccount(parmas){
        let url = '/a/organzation/apply';
        return this.http.postJson(url,parmas,true)
    }

    /**
     * 下单详情
     * orderId
     */
    paymentInfo(parmas){
        let url = '/a/order/detail';
        return this.http.getJson(url,parmas)
    }
    /**
     * 修改手机号获取验证码
     * mobile/type/accountType
     */
    postCode(parmas){
        let url = '/a/user/send';
        return this.http.postJson(url,parmas)
    }
    /**
     * 修改手机号下一步
     * mobile verify
     */
    getverifyPhone(parmas){
        let url = '/a/user/check/verify/password';
        return this.http.getJson(url,parmas)
    }
    /**
     * 修改新手机号 判断手机号是否激活
     * mobile accountType
     */
    mobileIsActive(parmas){
        let url = '/a/mobile/active';
        return this.http.getJson(url,parmas)
    }
    /**
     * 校验手机号是否注册
     * mobile accountType
     */
    mobileIsRegister(parmas){
        let url = '/a/mobile';
        return this.http.getJson(url,parmas)
    }
    /**
     * 我的银行列表
     */
    myBankList(){
        let url = '/a/u/card/list';
        return this.http.getJson(url)
    }

    /**
     * 最终修改手机号
     * newMobile verify type paypwd
     */
    changePhoneFinal(parmas){
        let url = '/a/u/app/user/mobile/'+parmas.phoneType;
        let _parmas = {
            newMobile:parmas.newMobile,
            verify:parmas.verify,
            type:parmas.type,
            paypwd:parmas.paypwd
        };
        return this.http.putJson(url,_parmas)
    }

    /**
     * 修改登陆密码
     * type mobile oldPasword newPasword
     */
    changePassWordLogin(parmas){
        let url = '/a/u/user/password/login';
        return this.http.putJson(url,parmas)
    }
    /**
     * 修改交易密码
     * type mobile oldPasword newPasword
     */
    changePassWordTrade(parmas){
        let url = '/a/u/user/password/trade';
        return this.http.putJson(url,parmas)
    }

    /**
     * 修改交易密码
     * newMobile verify type paypwd
     */
    authTradeVerify(parmas){
        let url = '/a/'+parmas.accountType+'/forget/password/trade';
        return this.http.putJson(url,parmas)
    }

    /**
     * 答题测风险
     * riskLevel
     */
    getRiskLevel(parmas){
        let url = '/a/userrisk/modify';
        return this.http.putJson(url,parmas)
    }
    /**
     * 登陆页忘记密码重设
     */
    resetPwd(parmas){
        let url = '/a/'+parmas.accountType+'/forget/password/login';
        return this.http.putJson(url,parmas)
    }
    /**
     * 激活 第一步
     */
    acctive(parmas){
        let url = '/a/'+parmas.type+'/forget/password/login';
        let _parmas = {
            mobile:parmas.mobile,
            verify:parmas.verify,
            newpwd:parmas.newpwd,
            confirmpwd:parmas.confirmpwd
        }
        return this.http.putJson(url,_parmas)
    }
    /**
     * 身份认证
     */
    authVerify(parmas){
        let url = '/a/u/app/auth/verify';
        return this.http.getJson(url,parmas)
    }
    // orderId
    getFSPOrderInfo(parmas){
        let url = '/a/order/detail';
        return this.http.getJson(url,parmas)
    }
    getUserFundInfo(parmas){
        let url = '/a/u/user/fund';
        return this.http.getJson(url,parmas)
    }
    getUserFSPInfo(){
        let url = '/a/u/user/self';
        return this.http.getJson(url)
    }
    /**
     * 获取借款
     */
    getMyLoanList(parmas){
        let url = '/a/u/'+parmas.type+'/debt/list';
        return this.http.getJson(url)
    }
    /**
     * 机构注册
     * mobile/verify/password
     */
    orgRegister(parmas){
        let url = '/a/user/check/verify/register';
        return this.http.getJson(url,parmas)
    }
    /**
     * 判断是否注册
     * mobile/accountType
     */
    isRegister(parmas){
        let url = '/a/mobile';
        return this.http.getJson(url,parmas)
    }
    /**
     * 判断是否注册
     */
    getOrgInfo(parmas){
        let url = '/a/org/apply/'+parmas.mobile;
        return this.http.getJson(url)
    }
    /**
     * 组织机构代码校验
     * mobile orgCode
     */
    o(parmas){
        let url = '/a/orgcode';
        return this.http.getJson(url,parmas)
    }
    /**
     * 校验营业许可证
     * mobile licensecode
     */
    l(parmas){
        let url = '/a/licensecode';
        return this.http.getJson(url,parmas)
    }
    /**
     * 校验社会信用码
     * mobile creditcode
     */
    c(parmas){
        let url = '/a/creditcode';
        return this.http.getJson(url,parmas)
    }
    /**
     * 阿里支付结果查询
     * orderId appId
     */
    alipayPayResult(parmas){
        let url = '/a/u/pay/alipay/result.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 微信支付结果查询
     * orderId appId
     */
    weChatPayResult(parmas){
        let url = '/a/u/pay/weixinpay/result.do';
        return this.http.getJson(url,parmas)
    }

    /**
     * 支付
     */
    fspPay(parmas){
        let url = '/bpay/order/'+parmas.orderNo;
        return this.http.postJson(url,parmas)
    }
    /**
     * 输入密码去支付
     */
    payService(parmas){
        let url = '/a/u/pay/'+parmas.orderId;
        let _parmas = {
            paymentType:parmas.paymentType,
            paypwd:parmas.paypwd
        }
        return this.http.postJson(url,_parmas)
    }
    /**
     * 微信支付
     *  appId,
     *orderId,
     *spbillCreateIp,
     *tradeType,
     *subject
     */
    wechatCreateOrder(parmas){
        let url = '/a/u/pay/weixinpay/createOrder.do';
        return this.http.postJson(url,parmas)
    }

    /**
     * 证联支付
     */
    zlPayOrder(parmas){
        let url = '/a/u/pay/zlzf/submit';
        return this.http.postJson(url,parmas)
    }
    /**
     * 支付宝支付
     */
    alipayCreateOrder(parmas){
        let url = '/a/u/pay/alipay/createOrder.do';
        return this.http.postJson(url,parmas)
    }


    //机构绑卡
    //第三个参数是否请求为applaction/json   请求体request payload
    organzationActive(parmas){
        let url = '/a/organzation/active';
        return this.http.postJson(url,parmas,true)
    }




}

export default {
    FspService
}