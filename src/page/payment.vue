<!--/*************************************************************************/-->
<!--/****************************      支付订单      **************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">支付订单</div>
            <i></i>
        </header>

        <div class="conBox spaceHT">
            <div>
                <div class="hd">
                    <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                    <p>{{company}}</p>
                </div>

                <div class="cart">
                    <ul v-for="item in itemList">
                        <li><img v-bind:src="item.image?item.image:noImage"></li>
                        <li>
                            <h4>{{item.name}}</h4>
                            <h5 class="t_price"><span>￥</span><em>{{item.price|money}}</em><span>/吨</span></h5>
                            <p>x{{item.amount}}</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="total">
                <h5 class="t_price"><span>¥</span><em>{{totalFee|money}}</em></h5><p>合计：</p>
            </div>


        </div>

        <ul class="list60" v-if="paymentType!=12&&paymentType!=11&&paymentType!=13">
            <li v-if='type==2'>
                <strong>磷肥部</strong>
            </li>
            <li v-if='type==2'>
                <span>账户余额：</span><span class="red">{{kailinFund|money}}</span>
            </li>
            <li v-if='type==5'>
                <strong>化工产品部</strong>
            </li>
            <li v-if='type==5'>
                <span>账户余额：</span><span class="red">{{huagongchanpinbuFund|money}}</span>
            </li>
            <li v-if='type==6'>
                <strong>新型肥料事业部</strong>
            </li>
            <li v-if='type==6'>
                <span>账户余额：</span><span class="red">{{fazhanbuFund|money}}</span>
            </li>
            <li v-if="type==1" if='type==0'>
                <strong>复合肥部</strong>
            </li>
            <li v-if="type==1" if='type==0'>
                <span>账户余额：</span>
                <span class="red">{{hecehnganFund|money}}</span>
            </li>
            <li v-if="type==3||type==4">
                <strong>其他账户</strong>
            </li>
            <li v-if="type==3||type==4">
                <span>账户余额：</span>
                <span class="red">{{otherFund|money}}</span>
            </li>
            <li>
                <span>登录密码：</span>
                <input type="password" :disabled="saveStatus?null:'disabled'" placeholder="请输入开磷登录密码" v-model="password">
            </li>
        </ul>
        <ul class="list60" v-if="paymentType==12">
            <li>
                <img src="../assets/alipay2.png" style="height: 2.875rem;width: 2.875rem;">
                <div style="height:2.875rem;width:90%">
                    <p style="font-size: 0.675rem;">支付宝支付</p>
                    <p style="font-size: 0.675rem;">数亿用户都在用，安全可托付</p>
                </div>
                <div>
                    <label class="check_blue icon-on" style="margin-left:3.6rem;"></label>
                </div>

            </li>
        </ul>
        <ul class="list60" v-if="paymentType==11">
            <li>
                <img src="../assets/wechatpay.png" style="height: 2.875rem;width: 2.875rem;">
                <div style="height:2.875rem;width:90%">
                    <p style="font-size: 0.675rem;">微信支付</p>
                    <p style="font-size: 0.675rem;">亿万用户的选择，更快更安全</p>
                </div>
                <div>
                    <label class="check_blue icon-on" style="margin-left:3.6rem;"></label>
                </div>

            </li>
        </ul>

        <ul class="list60" v-if="paymentType==13">
            <li>
                <strong>证联支付</strong>
            </li>
            <li v-for="(item,index) in list" @click="chooseAccount(index)">
                <span style="width:80%;">{{item.bankNo=='ZLRT'?"证联账户：余额"+zlBalance :item.nameShot}}</span><label style="vertical-align: middle;" class="check" :class="selectedIndex===index?'icon-on':''" ></label>
            </li>
            <li>
                <span>交易密码：</span>
                <input type="password" :disabled="zlPayStatus?null:'disabled'" placeholder="请输入证联交易密码" v-model="payPassWord">
            </li>

        </ul>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

        <div class="btn_submit">
            <a :class="saveStatus?'':'no_click'" @click="payIt">确认支付</a>
        </div>

        <loading v-show="showLoading"></loading>

    </div>
</template>

<script>
    import loading from '../components/loading'
    import alertTip from '../components/alertTip'
    import {banks} from '../service/bankList';
    import {
        licaiService,proxy,b2bService,fspService,hczqService
    } from '../service'
    import { mapState, mapActions, mapMutations } from 'vuex'
    import util from '../lib/util';
    export default{

        data () {
            return {
                ifAlert:false,
                orderId:'',
                orderNo:'',//订单编号
                company:'',
                itemList:[],
                showLoading:false,
                paymentType:5,//余额付款账户类型 1、贵州开磷化肥有限责任公司,
                hecehnganFund:0,
                kailinFund:0,
                huagongchanpinbuFund:0,
                fazhanbuFund:0,
                totalFee:0,
                type:0, //1：贵州开磷息峰合成氨有限责任公司 2：贵州开磷化肥有限责任公司 3：贵州开磷有限责任公司 4：贵州开磷集团国际贸易有限公司
                noImage:require('../../static/images/noImg.png'),
                password:'',
                showLoading:false,
                saveStatus:false,
                options:'',
                showNotice:false,
                payInfo:'',//alipay支付信息
                info:[],
                selectedIndex:false,
                //理财相关开始
                token:'',
                wealthUserId:'',
                timestamp:'',
                params2:'',//获取理财账户所需的签名参数
                user:'',
                branchNo:'',
                fundAccount:'',
                params:'',//获取理财账户银行卡所需签名参数，
                authStatus:'',//理财用户状态 是否审核身份
                list:[],//银行卡列表
                message:'',//
                zlPayStatus:false,
                payPassWord:'',
                userNameText:'',//用户支付用户名
                certType:'00',//证件类型
                certId:'',//身份证号码
                purchaseType:0,//账号支付类型
                bankId:'',//银行代码
                cardNo:'',//银行卡账号
                bankAccount:'',//证联平台客户号 cpxxx
                zlBalance:'',//证联余额
                //理财相关结束

            }
        },
        components: {
            loading,
            alertTip,
        },
        filters: {
          money:function(value){
            return util.price1(value)
          },
          companyConvert: function (str) {
            return util.companyConvert(value)
          }
        },
        computed : {
            ...mapState([
                'userFspInfo',
                'userFundInfo'
            ]),
        },

        methods : {
            ...mapMutations([
              'GET_USER_FUNDINFO'
            ]),
            ...mapActions([
                'getUserFundInfo',
                'getLiCaiInfo',
            ]),
            //选择证联账户或者银行卡进行支付
            chooseAccount(index){
                this.selectedIndex=index;
                this.userNameText=this.list[index].holderName;
                this.certId=this.list[index].idNo;
                this.bankAccount=this.list[0].bankAccount;
                if(index==0){
                    this.bankId='0001';
                    this.purchaseType=1;
                }else{
                    this.bankId=this.list[index].bankId;
                    this.purchaseType=0;
                }
                this.cardNo=this.list[index].bankAccount;
            },

            //关闭弹框
            close(){
                this.options = '';
                this.showNotice = false;
            },

            goBack(){
                this.$router.goBack();
            },
            async initData(){

              this.saveStatus = false;
              this.showLoading = true;
              let order_Id = this.$route.query.orderId;
              let resB2B = await b2bService.b2bPay({
                    order_id:order_Id
                });
              var params = resB2B.data;
//              let resB2B = await b2bPay('1000');
              if(resB2B.result != 1){
                  this.$router.push({path:'tipsFailed',query:{msg:resB2B.message}});
                  return;
              }else{
                  this.itemList = params.info;
                  this.info=(JSON.stringify(params.info)).replace(/%/g,'%25');
                  console.log(this.info);
                  this.company = params.company;
                  this.orderNo=params.orderNo;
                  console.log(this.orderNo);
              }
//              params.token=encodeURIComponent(params.token);
              let fspParmas={
                  notifyUrl:params.notifyUrl,
                  orderNo:params.orderNo,
                  paymentType:params.paymentType,
                  token:params.token,
                  totalFee:params.totalFee,
                  info:this.info,
                  type:params.type,
                  body:params.body,
                  orderType:params.orderType,
                  company:params.company,
                  returnUrl:'',
                  dataType:'json',
              };
              let resFsp = await fspService.fspPay(fspParmas);
              if(resFsp.code == 100){
//                  this.orderId = resFsp.data.orderId;
                  //余额支付
                  this.saveStatus = true;
              }
              else if(resFsp.code == 301){
                  //支付宝
              }else if(resFsp.code == 909){
                  //支付宝第一次点
              }else if(resFsp.code == 908){
                  //微信第一次点
              }else if(resFsp.code == 910){
                  //证联第一次点
              }
              else if(resFsp.code == 202){
                  //融资购肥假设当做证联支付
              }
              else{
                  this.options = resFsp.message;
                  this.showNotice = true;
                  this.showLoading = false;
              }

                this.orderId = resFsp.data.orderId;
              let resFund =  await fspService.getFSPOrderInfo({
                  orderId:this.orderId
              });
              this.type = resFund.data.type;
              this.paymentType=resFund.data.paymentType;
              if(this.paymentType==13){
                  this.getCardList();
              }

              this.totalFee = resFund.data.totalFee;

              let info = await fspService.getUserFundInfo();
              this.showLoading = false;
              if(info.code == 0){
                  this.GET_USER_FUNDINFO(info.data);
                  var list = info.data.relations;
                  for(let i=0;i<list.length;i++){
                      if(list[i].accountCode == '磷肥部'){
                          this.kailinFund = list[i].money;
                      }else if(list[i].accountCode == '复合肥部'){
                          this.hecehnganFund = list[i].money;
                      }else if(list[i].accountCode == '化工产品部'){
                          this.huagongchanpinbuFund = list[i].money;
                      }else if(list[i].accountCode == '发展部'){
                          this.fazhanbuFund = list[i].money;
                      }
                      else{
                        this.otherFund = list[i].money;
                      }
                  }
                  this.id=info.data.id;
              }
            },

            //证联校验密码是否正确
            async checkErrorTimes(){
                this.showLoading = true;
                if(this.bankId=='0001'){
                    this.zlPayOrder();
                }else{
                    let params={
                        wealthUserId:this.wealthUserId,
                        wealthAccount:this.fundAccount,
                        entrustWay:7,
                        passWd:this.payPassWord
                    }
                    let res = await hczqService.checkErrorTimes(params);
                    if(res.errorNo==0){
                        this.zlPayOrder();
                    }else{
                        this.showLoading = false;
                        this.options = res.errorInfo+"!  剩余次数："+res.loginTimes;
                        this.showNotice = true;
                    }
                }

            },

            async payService(){
                this.saveStatus = false;
                let _parmas = {
                     orderId:this.orderId,
                    paymentType:5,
                    paypwd:this.password
                }
                let res = await fspService.payService(_parmas);
                if(res.code === 0){
                    this.getUserFundInfo();
                    this.$router.push({path:'tipsSuccess'})
                }else{
                    this.$router.push({path:'tipsFailed',query:{msg:res.message}})
                }
            },
            async alipayCreateOrder(){
                let _parmas = {
                    orderId:this.orderId,
                    appId:'2017090108492647'
                }
                let res=await fspService.alipayCreateOrder(_parmas);
                if(res.message.code==0){
                    this.payInfo=res.data
                }else{
                    this.options = res.message.message;
                    this.showNotice = true;
                    return;
                }
                var _self=this;
                cordova.plugins.alipay.payment(_self.payInfo,function success(e){
                    if(e.resultStatus==9000){
                        _self.aliResult();
                    }else if(e.resultStatus==8000){
                        _self.$router.push({path:'tipsFailed',query:{msg:'正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态'}})
                    }else if(e.resultStatus==4000){
                        _self.$router.push({path:'tipsFailed',query:{msg:'订单支付失败'}})
                    }else if(e.resultStatus==6001){
                        _self.$router.push({path:'tipsFailed',query:{msg:'用户中途取消'}})
                    } else if(e.resultStatus==6002){
                        _self.$router.push({path:'tipsFailed',query:{msg:'网络连接出错'}})
                    } else if(e.resultStatus==6004){
                        _self.$router.push({path:'tipsFailed',query:{msg:'支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态'}})
                    }else{
                        _self.$router.push({path:'tipsFailed',query:{msg:'其它支付错误'}})
                    }
                },function error(e){
                    if(e.resultStatus==8000){
                        this.options = '正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态';
                        this.showNotice = true;
                    }else if(e.resultStatus==4000){
                        this.options = '订单支付失败';
                        this.showNotice = true;
                    }else if(e.resultStatus==6001){
                        this.options = '用户中途取消';
                        this.showNotice = true;

                    } else if(e.resultStatus==6002){
                        this.options = '网络连接出错';
                        this.showNotice = true;
                    } else if(e.resultStatus==6004){
                        this.options = '支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态';
                        this.showNotice = true;

                    }else{
                        this.options = '其它支付错误';
                        this.showNotice = true;
                    }
                });
            },
            async aliResult(){
                let _parmas = {
                    orderId:this.orderId,
                    appId:'2017090108492647'
                }
                let res=await fspService.alipayPayResult(_parmas);
                if(res.message.code==0){
                    if(res.data==0){
                        this.$router.push({path:'tipsSuccess'})
                    }else if(res.data==1){
                        this.$router.push({path:'tipsFailed',query:{msg:'支付失败'}})
                    }
                    else if(res.data==2){
                        this.$router.push({path:'tipsFailed',query:{msg:'支付进行中'}})
                    }
                }else{
                    this.options = res.message.message;
                    this.showNotice = true;
                }
            },
            async wechatCreateOrder(){
                var params = {
                    appid:'',
                    partnerid: '', // 商户号
                    prepayid: '', // 预支付交易会话ID
                    package:'',
                    noncestr: '', // 随机字符串
                    timestamp: '', // timestamp
                    sign: '', // 签名
                };
                this.ipAddress=returnCitySN["cip"]||'192.168.1.1';
                var _self=this;
                let res=await fspService.wechatCreateOrder({
                    appId:'wx32302db264dda020',
                    orderId:this.orderId,
                    spbillCreateIp:this.ipAddress,
                    tradeType:'APP',
                    subject:'开磷通'
                });
                if(res.message.code==0){
                    params.appid=res.data.appId;
                    params.partnerid=res.data.partnerId;
                    params.prepayid=res.data.prepayId;
                    params.package=res.data.packageValue;
                    params.noncestr=res.data.nonceStr;
                    params.timestamp=res.data.timeStamp;
                    params.sign=res.data.sign;
                    Wechat.isInstalled(function (installed) {
                        if(installed==0){
                            //0 未安装微信 1已安装
                            this.options = "抱歉，您尚未安装微信";
                            this.showNotice = true;
                        }else{
                            Wechat.sendPaymentRequest(params, function (e) {
                                _self.weChatResult();

                            }, function (reason) {
                                this.options = "失败: " + reason;
                                this.showNotice = true;
                            });
                        }
                    }, function (reason) {
                        this.options = "失败: " + reason;
                        this.showNotice = true;
                    });

                }else{
                    this.options = '系统错误';
                    this.showNotice = true;
                }
            },
            async weChatResult(){
                let _parmas = {
                    orderId:this.orderId,
                    appId:'wx32302db264dda020'
                }
                let res=await fspService.weChatPayResult(_parmas);
                if(res.message.code==0){
                    if(res.data==0){
                        this.$router.push({path:'tipsSuccess'})
                    }else if(res.data==1){
                        this.$router.push({path:'tipsFailed',query:{msg:'支付失败'}})
                    }
                    else if(res.data==2){
                        this.$router.push({path:'tipsFailed',query:{msg:'支付进行中'}})
                    }
                }else{
                    this.options = res.message.message;
                    this.showNotice = true;
                }
            },

            //获取证联银行卡
            async getCardList(){
                this.showLoading=true;
                this.getTime();
            },
            async getTime(){
                this.getWealthUserAccount();
            },
            async getWealthUserAccount(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appkey,
                    timestamp:new Date().getTime()
                }
//                this.params2 = util.getSignParams(data_arr,proxy.appKey,proxy.appSecret,new Date().getTime());
                let res = await licaiService.getWealthUserAccount(data_arr);
                this.user=res.user;
                this.branchNo=res.user.branchNo;
                this.fundAccount=res.user.fundAccount;
                this.getWealthUserInfo();
            },
            async getWealthUserInfo(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appkey,
                    timestamp:new Date().getTime(),
                    branchNo: this.branchNo,
                    fundAccount: this.fundAccount,
                }
//                this.params = util.getSignParams(data_arr,proxy.appKey,proxy.appSecret,new Date().getTime());
                let res = await licaiService.getWealthUserInfo(data_arr);
                var list = res.data;
                this.showLoading=false;
                this.authStatus = res.operateCode;
                var temp = [];
                for(var i=0;i<list.length;i++){
                    var obj = {};
                    obj = list[i];
//                    if(list[i].tiedCardType=='0'){
                        obj.name = list[i]["bankName"];
                        var no = list[i]["bankAccount"];
                        var no4 = no.substring(no.length-4,no.length);
                        obj.nameShot = obj.name + "(尾号" + no4 + ")";
                        if(list[i]['bankNo']=='ZLRT'){
                            obj.bankId = '0001';
                        }else{
                            obj.bankId = banks[list[i]["bankNo"]].id;
                        }
                        temp.push(obj);
//                    }

                }
                this.list = temp;
                if(this.list.length==0){
                    this.options = "请在账户设置中，绑定银行卡";
                    this.showNotice = true;
                }
                //理财信息存入store
                this.getLiCaiInfo([this.list,this.user]);
                this.zlBalance=util.price1(this.list[0].accountBalance);
                this.message=res.message.message;
            },
            async zlPayOrder(){
                let params={
                    orderId:this.orderId,
                    zlUserId:this.bankAccount,
                    userNameText:this.userNameText,
                    certType:this.certType,
                    certId:this.certId,
                    purchaseType:this.purchaseType,
                    bankCode:this.bankId,
                    cardNo:this.cardNo,
                    payPassWord:this.payPassWord,
                    fundType:'10',
                    fundCode:'TEST',
                    busiType: '0002',
                    fundUserId:this.wealthUserId,
                    transAmt:1,
                }
                let res = await fspService.zlPayOrder(params);
                this.showLoading = false;
                if(res.message.code==0&&res.respCode=='RC00'){
                    this.$router.push({path:'tipsSuccess'})
                }else if(res.message.code==0&&res.respCode!='RC00'){
                    this.$router.push({path:'tipsFailed',query:{msg:res.respDesc}})
                }
                else{
                    this.$router.push({path:'tipsFailed',query:{msg:'支付失败'}})
                }
            },
            payIt:function(){
                if(this.paymentType==1){
                    if(this.type==1){
                        if(this.totalFee>this.hecehnganFund){
                            this.options = "余额不足"
                            this.showNotice = true;
                            return;
                        }
                    }else if(this.type==2){
                        if(this.totalFee>this.kailinFund){
                            this.options = "余额不足"
                            this.showNotice = true;
                            return;
                        }
                    }else if(this.type==5){
                        if(this.totalFee>this.huagongchanpinbuFund){
                            this.options = "余额不足"
                            this.showNotice = true;
                            return;
                        }
                    }else if(this.type==6){
                        if(this.totalFee>this.fazhanbuFund){
                            this.options = "余额不足"
                            this.showNotice = true;
                            return;
                        }
                    }
                    else{
                        if(this.totalFee>this.otherFund){
                            this.options = "余额不足"
                            this.showNotice = true;
                            return;
                        }
                    }
                    if(this.saveStatus == false){
                        return;
                    }
                    if(this.password == ""){
                        this.options = "请输入密码";
                        this.showNotice = true;
                        return;
                    }
                    this.payService();
                }else if(this.paymentType==12){
                    this.alipayCreateOrder();
                }else if(this.paymentType==11){
                    this.wechatCreateOrder();
                }else if(this.paymentType==13){
                    //证联支付
                    if(this.payPassWord==''){
                        this.options='请输入交易密码'
                        this.showNotice = true;
                    }else{
                        this.checkErrorTimes();
                    }

                }
            },
        },

        watch : {
            selectedIndex(curVal,oldVal){
               if(curVal!==false){
                   this.zlPayStatus=true;
               }
            },
        },

        created : function() {
            this.wealthUserId=localStorage.getItem("userId");
            this.token= localStorage.getItem("token");
            this.initData();
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_orderlist";
    @import '../assets/components/yy_list';
    @import '../assets/components/yy_button';
    @import '../assets/components/yy_coverAuto';

    .payment{
        .total{
            h5{
                span, em{
                    color: $red;
                }
            }
        }
    }

    ul.list60{
        margin-top: $spaceV;
    }
</style>
