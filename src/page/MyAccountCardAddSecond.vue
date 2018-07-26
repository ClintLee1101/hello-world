<!--/*************************************************************************/-->
<!--/********************    设置 - 我的银行卡 - 添加银行卡    *****************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">添加银行卡</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>卡号</span>
                <input type="text" v-model="bankCode" placeholder="请输入借记卡号">
            </li>
            <li>
                <span>开户银行</span>
                <select style="font-size: 1.0em;" type="text"  v-model="bank" class="left">
                    <option value='choose'>请选择</option>
                    <option v-for="el in banks" :value="el.bankNo" v-show="el.bankNo!='HCZF'">{{el.bankFullName}}</option>
                </select>
                <i class="icon-arrowR"></i>
            </li>
            <li>
                <span>手机号</span>
                <span>{{mobile}}</span>
            </li>
            <li>
                <span>真实姓名</span>
                <input type="text" v-model="clientName">
            </li>
            <li>
                <span>身份证</span>
                <input type="text" v-model="idNo" placeholder="请输入身份证">
            </li>
            <li>
                <span class="left">手机验证码</span>
                <input v-model="testNum" type="number" placeholder="验证码">
                <a v-bind:class="unClick"  @click="getCode">{{verifyText}}</a>
            </li>
            <li>
                <span>交易密码</span>
                <input v-model="password" type="password" placeholder="输入6位数字交易密码">
            </li>
        </ul>

        <div class="btn_submit" @click="submit">
            <a>提交</a>
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
//    import {banks} from '../service/bankList';
    import {
        licaiService
    } from '../service'
    import { mapState, mapActions, mapMutations } from 'vuex';
    import util from '../lib/util';
    export default{

        data () {
            return {
                ifAlert:false,
                list:[],
                userType:0,
                mobile:'',
                bankCode:'',
                show:true,
                time:60,
                currentBank:"请选择银行",
                banks:[],
                testNum:'',
                ifVerify:'1',
                unClick:'right',
                verifyText:'获取验证码',
                password:'',
                bank:'choose',
                noImage:require('../../static/images/noImg.png'),
                showLoading:false,
                image:'/images/bank/logo_{{el.pic}}.jpg',
                //显示弹框设置
                showNotice:false,
                options: '' ,
                clientName:'',
                idNo:'',
                codeParams:''
            }
        },
        components: {
            alertTip
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
                'userFundInfo',
                'licaiInfo'
            ]),
        },

        methods : {
            ...mapMutations([
                'GET_USER_FUNDINFO'
            ]),
            ...mapActions([
                'getUserFundInfo'
            ]),
            goBack(){
                this.$router.goBack();
            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            getCode(){
                if(this.bank=='choose'){
                    this.options='请选择银行';
                    this.showNotice=true;
                    return;
                }
                if(this.bankCode==''){
                    this.options='请填写银行卡号';
                    this.showNotice=true;
                    return;
                }
                if(this.idNo==''){
                    this.options='请填写身份证号';
                    this.showNotice=true;
                    return;
                }
               if (this.ifVerify == '1') {
                        this.ifVerify = '0'
                        this.unClick = 'right verifyGray'
                        var self = this;
                        self.verifyText = '(获取60s)';
                        self.ts = 60 ;
                        var timer = setInterval(function () {
                            self.ts -= 1;
                            self.verifyText = '(获取' + String(self.ts) + 's)';
                            if (self.ts == 0) {
                                clearInterval(timer);
                                self.verifyText = '获取验证码';
                                self.unClick = 'right';
                                self.ifVerify = "1";
                            }
                        }, 1000);
                        this.postCode();
                    }
            },
            submit(){
                if(this.bankCode==''){
                    this.options='请填写卡号';
                    this.showNotice=true;
                    return;
                }else if(this.bank=='choose'){
                    this.options='请选择银行';
                    this.showNotice=true;
                    return;
                }else if(this.clientName==''){
                    this.options='请输入真实姓名';
                    this.showNotice=true;
                    return;
                }else if(this.idNo==''){
                    this.options='请输入身份证号';
                    this.showNotice=true;
                    return;
                }
                else if(this.testNum==''){
                    this.options='请输入验证码';
                    this.showNotice=true;
                    return;
                }else if(this.password==''){
                    this.options='请输入密码';
                    this.showNotice=true;
                    return;
                }
                this.addBankCard();
            },
            initData(){
                this.getCardList();
            },
            async getCardList(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: 'jh4a045c200bb38c90',
                    timestamp:this.timestamp
                }
//                var params = util.getSignParams(data_arr,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',this.timestamp);
                let res = await licaiService.getCardList(data_arr);
                //去掉已经绑定的银行卡
                var arrayBank=[];
                var hasBankNo=[];
                //已绑定的银行卡
                this.licaiInfo[0].forEach(function(item, index, array){
                        console.log(item.bankNo);
                    hasBankNo.push(item.bankNo);
                    })
                //所有可以绑定的银行卡列表 去除已经绑定的
                res.data.forEach(function(item, index, array){
                    var flag;
                    for(var i=0,l=hasBankNo.length;i<l;i++){
                        if(hasBankNo[i]==item.bankNo){
                            flag=true;
                            break;
                        }else{
                            flag=false;
                        }
                    }
                    if(!flag){
                        arrayBank.push(res.data[index]);
                    }
                });
                this.banks=arrayBank;
            },
            async addBankCard(){
                let data_arr={
                    uid: this.wealthUserId,
                    token: this.token,
                    client: 'website',
                    idNo: this.idNo,
                    idKind: 0,
                    clientName: this.clientName,
                    mobiletelephone:this.mobile,
                    bankNo: this.bank,
                    bankAccount: this.bankCode,
                    tiedCardType: 0,
                    phoneNo: this.mobile,
                    useType: 2,
                    identifyingCode: this.testNum,
                    branchNo: this.user.branchNo,
                    fundAccount: this.user.fundAccount,
                    version: "5.18.0",
                    appkey: "jh4a045c200bb38c90",
                    timestamp: new Date().getTime(),
                    password:this.password
                }

//                var params = util.getSignParams(data_arr,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',new Date().getTime());
                let res=await licaiService.addNewCard(data_arr);
                if(res.code==0){
                    this.$router.push({path:'/MyBankList'})
                }else{
                    this.options= res.message;
                    this.showNotice=true;
                }
            },
            async postCode(){
                var timestemp=new Date().getTime();
//                var params={
//                    bankNo:this.bankCode,
//                    idNo:this.idNo,
//                    bankAccount:this.bank,
//                    nothing:'0',
//                }
                let data_arr = {
                    "registerMobile": this.mobile,
                    "reserveMobile": this.mobile,
                    "userType": 0,
                    "certId": this.idNo,
                    "bankNo": this.bank,
                    "bankAccount": this.bankCode,
                    "client": "website",
                    "uid": this.wealthUserId,
                    "token": this.token,
                    "branchNo": this.user.branchNo,
                    "fundAccount": this.user.fundAccount,
                    "version": "5.18.0",
                    "appkey": "jh4a045c200bb38c90",
                    timestamp:new Date().getTime(),
                }
//                this.codeParams=util.getSignParams(data_arr,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',timestemp);
//                let newParams=Object.assign(params, obj);
                console.log(this.codeParams);
                let res= await licaiService.getBankVerifyCode(data_arr);
                if(res.message.code != 0){
                    this.options=res.message;
                }
                if(res.message.code == 0){
                    this.options="验证码已发送";
                }

                this.showNotice=true;
            },

        },

        watch : {

        },

        created : function() {
            this.wealthUserId=localStorage.getItem("userId");
            this.token= localStorage.getItem("token")
            this.initData();
            this.mobile=this.userFspInfo.mobile;
//            this.idNo=this.userFspInfo.idNo;
//            this.clientName=this.userFspInfo.name||this.userFspInfo.orgName;
            this.user=this.licaiInfo[1];
            console.log(this.userFspInfo);
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
</style>
