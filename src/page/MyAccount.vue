<!--/*************************************************************************/-->
<!--/***************************      我的账户-首页   *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header class="bg_red">
            <router-link :to="{path: '/setting'}" class="arrowBack icon-set"></router-link>
            <div class="title">{{userFspInfo.name || userFspInfo.mobile}}</div>
            <a class="edit icon-info"></a>
        </header>

        <div class="account01">
            <h6>我的资产(元)</h6>
            <ul>
                <li v-for="item in userFundInfo.relations" v-if="item.accountCode!='其他账户'">
                    <h6>{{item.accountCode}}</h6>
                    <p>{{item.money | money}}</p>
                </li>
                <li>
                    <h6>证联余额</h6>
                    <p>{{zlBalance|money}}</p>
                </li>
            </ul>
            <!--<ul>-->
                <!--<li>-->
                    <!--<h6>{{company1 | companyConvert}}</h6>-->
                    <!--<p>{{money1 | money}}</p>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<h6>{{company2 | companyConvert}}</h6>-->
                    <!--<p>{{money2 | money}}</p>-->
                <!--</li>-->
            <!--</ul>-->
            <!--<ul>-->
                <!--<li>-->
                    <!--<h6>{{company3 | companyConvert}}</h6>-->
                    <!--<p>{{money3 | money}}</p>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<h6>{{company4 | companyConvert}}</h6>-->
                    <!--<p>{{money4 | money}}</p>-->
                <!--</li>-->
            <!--</ul>-->
            <!--<h6>{{company1 | companyConvert}}</h6>-->
            <!--<h5>{{money1 | money}}</h5>-->
            <!--<h6>{{company2 | companyConvert}}</h6>-->
            <!--<h5>{{money2 | money}}</h5>-->
            <h6>我的负债(元)</h6>
            <h4>{{userFundInfo.debtTot+userFundInfo.smallLoanTot| money}}</h4>
            <ul>
                <li>
                    <h6>信用额度(元)</h6>
                    <p>{{userFundInfo.creditLine | money}}</p>
                </li>
                <li>
                    <h6>可用额度(元)</h6>
                    <p>{{userFundInfo.availableLine | money}}</p>
                </li>
            </ul>
        </div>

        <div class="account account02">
            <div class="hd">
                <span>订单/合同</span>
                <em @click="allOrder"><b>查看全部</b><i class="icon-arrowR"></i></em>
            </div>
            <ul>
                <li @click="gotoOrderByStatus('audit')"><i class="icon-my01"></i><h6>审批中</h6></li>
                <li @click="gotoOrderByStatus('waitPay')"><i class="icon-my02"><b v-if="hasPay"></b></i><h6>待支付</h6></li>
                <li @click="gotoOrderByStatus('implementation')"><i class="icon-my03"></i><h6>执行中</h6></li>
                <li @click="gotoOrderByStatus('completed')"><i class="icon-my04"></i><h6>已完成</h6></li>
                <li @click="gotoOrderByStatus('canceled')"><i class="icon-my05"></i><h6>已取消</h6></li>
            </ul>
        </div>

        <!--<div class="account account03">-->
            <!--<div class="hd">-->
                <!--<span>金融</span>-->
            <!--</div>-->
            <!--<ul class="list">-->
                <!--<router-link :to="{path: '/myAccountMoneyDetail'}"><i class="icon-my06"></i><h5>余额</h5></router-link>-->
                <!--<a @click="gotoInvest()"><i class="icon-my07"></i><h5>理财</h5></a>-->
                <!--<a href="https://ifile.staging.china-lin.com/group1/M00/00/15/rBEBIlnm71GABFmDABD9KngSehE802.pdf"><i class="icon-my07"></i><h5>理财2pdf</h5></a>-->
                <!--<router-link :to="{path: '/myAccountLoan'}"><i class="icon-my08"></i><h5>借款</h5></router-link>-->
                <!--<router-link :to="{path: '/ZL'}"><i class="icon-my08"></i><h5>去证联</h5></router-link>-->
            <!--</ul>-->
        <!--</div>-->

        <div class="account account04 hide">
            <div class="hd">
                <span>农化</span>
            </div>
            <ul class="list">
                <li><i class="icon-my09"></i><h5>提问</h5></li>
                <li><i class="icon-my10"></i><h5>回答</h5></li>
                <li><i class="icon-my11"></i><h5>评论</h5></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {
        licaiService,proxy,b2bService
    } from '../service'
    import{
        GlobelObj
    } from '../components/Global.vue'


    import util from '../lib/util';
    export default {
        name: 'myAccount',
        filters: {
            moneyFormat: function (value) {
                return value
            }
        },
        data () {
            return {
                company1:'',
                company2:'',
                company3:'',
                company4:'',
                money1:'',
                money2:'',
                money3:'',
                money4:'',
                hasPay:false,
                zlBalance:0,//证联余额
                wealthUserId:'',
                token:'',
                params:'',//理财参数
                branchNo:'',
                fundAccount:''
            }
        },
        computed: {
            ...mapState([
                'userFspInfo',
                'userFundInfo',
                'kailinFundObj',
                'licaiInfo'
            ]),
        },

        methods: {
            ...mapActions([
                'getUserFSPInfo',
                'getUserFundInfo',
                'userLogout'
            ]),
            allOrder: function () {
                this.$router.push({path: '/orderList'})
            },
            gotoOrderByStatus: function (status) {
                this.$router.push({path: '/orderList', query: {status: status}})
            },
            async getStatus(){
                let res = await b2bService.getOrderStatus();
                if(res.data.waitPay>0){
                    this.hasPay = true;
                }else{
                    this.hasPay = false;
                }
            },
            gotoInvest(url){
                var _this=this;
                if(localStorage.getItem("type")==1){
                    alert('机构户尚未开通理财功能，理财请登录开磷金融服务平台');
                    return;
                }
                function getCookie(name)
                {
                    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                    if(arr=document.cookie.match(reg))
                        return unescape(arr[2]);
                    else
                        return null;
                }
                if(!localStorage.getItem("userId")||!localStorage.getItem("token")){
                    alert('您的申请异常，请致电400-677-9000');
                    return;
                }

                if(!url){
                    url=proxy.jinhui+'/?token='+localStorage.getItem("token")+'&userId='+ localStorage.getItem("userId");
                }
                if(window.device.platform=='iOS'){
                    var ref =cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no');
                    var myCallback = function(event) {
                        if(event.url==proxy.jinhui+'/backToKailin'||event.url==proxy.jinhui+'/?to=backToKailin'){
                            ref.close();
                            _this.$router.push({path: '/home/myAccount'});
                        }else if(event.url==proxy.jinhui+'/user/login'){
                            ref.close();
                            _this.userLogout();
                            _this.$router.push({path: '/login'});
                        }else if(event.url.substr(-3)=='pdf'){
                            var index=event.url.indexOf('?')+5;
                            var pdfUrl='http://'+event.url.substr(index);
                            var reloadUrl=event.url.substr(0,index)+'/?token='+localStorage.getItem("token")+'&userId='+ localStorage.getItem("userId");
                            cordova.InAppBrowser.open(pdfUrl, '_system', 'location=no,toolbar=no');
                            _this.gotoInvest(reloadUrl);
                        }
                    }
                    var myErrorCallback = function(params) {
                        ref.close();
                        _this.$router.push({path: '/home/index'});
                    }
                    ref.addEventListener('loadstop', myCallback);
                    ref.addEventListener('loaderror', myErrorCallback);
                }else{
                    var ref =cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no');
                    var myAndroidCallback = function(event) {
                        if(event.url==proxy.jinhui+'/backToKailin'||event.url==proxy.jinhui+'/?to=backToKailin'){
                            ref.close();
                            _this.$router.push({path: '/home/myAccount'});
                        }else if(event.url==proxy.jinhui+'/user/login'){
                            ref.close();
                            _this.userLogout();
                            _this.$router.push({path: '/login'});
                        }else if(event.url.substr(-3)=='pdf'){
                            var index=event.url.indexOf('?')+5;
                            var pdfUrl='http://'+event.url.substr(index);
                            window.location.href=pdfUrl;
                        }
                    }
                    var myAndroidErrorCallback = function(params) {
                        ref.close();
                        _this.$router.push({path: '/home/index'});
                    }
                    ref.addEventListener('loadstop', myAndroidCallback);
                    ref.addEventListener('loaderror', myAndroidErrorCallback);
                }
//              var ref =cordova.InAppBrowser.open('http://fspm2.staging.china-lin.com', '_blank', 'location=no,toolbar=no,toolbarposition=top,closebuttoncaption=返回');

            },

            async getWealthUserAccount(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appKey,
                    timestamp:new Date().getTime()
                }
//                this.params = util.getSignParams(data_arr,proxy.appKey,proxy.appSecret,new Date().getTime());
                let res = await licaiService.getWealthUserAccount(data_arr);
//                let res = await getWealthUserAccount(this.wealthUserId,this.params);
                this.branchNo=res.user.branchNo;
                this.fundAccount=res.user.fundAccount;
                this.getZlBanlance();
            },
            async getZlBanlance(){
                let data = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appKey,
                    timestamp:new Date().getTime(),
                    branchNo: this.branchNo,
                    fundAccount: this.fundAccount,
                }
//                this.params = util.getSignParams(data,proxy.appKey,proxy.appSecret,new Date().getTime());
                let res = await licaiService.getZlBanlance(data);
                this.zlBalance=res.accountBalance;
            }
        },

        mounted:function(){
        },

        created: function () {
            this.wealthUserId=localStorage.getItem("userId");
            this.token= localStorage.getItem("token");
            this.getUserFSPInfo();
            this.getUserFundInfo();
            this.getStatus();
            this.getWealthUserAccount();
            if(this.userFundInfo.relations && this.userFundInfo.relations.length >= 2){
                this.company1 = this.userFundInfo.relations[0].accountCode;
                this.money1 = this.userFundInfo.relations[0].money;
                this.company2 = this.userFundInfo.relations[1].accountCode;
                this.money2 = this.userFundInfo.relations[1].money;
                this.company3 = this.userFundInfo.relations[2].accountCode;
                this.money3 = this.userFundInfo.relations[2].money;
                this.company4 = this.userFundInfo.relations[3].accountCode;
                this.money4 = this.userFundInfo.relations[3].money;
            }
        },
        filters: {
            money: function (value) {
                return util.price1(value)
            },
            companyConvert: function (str) {
                return util.companyConvert(str)
            }
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';

    .account01 {
        @include _bg_red2;
        text-align: center;
        padding-top: $headH + 1.125rem;

        h3, h4{
            line-height: 3.313rem;
        }
        h3{
            font-size: 2.188rem;
        }
        p{
            margin-top: 0.688rem;
        }
        & > h6{
            margin-top: 1.5rem;

            &:first-child{
                margin-top: 0;
            }
        }

        h4, h5{
            font-size: 1.5rem;
        }
        h4{

            &:nth-child(7){
                margin-bottom: 1.5rem;
            }
        }
        h5{
            line-height: 2rem;
        }
        ul{
            background-color: $pink;
            display: -moz-flex;
            display: -webkit-flex;
            display: flex;
            width:100%;
            padding: 0.875rem 0 0.688rem;
            flex-wrap:wrap;
            li{
                -moz-flex-grow: 1;
                -webkit-flex-grow: 1;
                flex-grow: 1;
                flex-wrap: wrap;
                width:50%;
                margin-top: 0.625rem;
                p{
                    margin-top: 0.188rem;
                    padding:0.188rem;
                }
            }
        }
    }

    .account{
        background: $white;
        margin-top: $spaceV;

        .hd{
            @include _linkBottom_half;
            padding: 0 $spaceLR;

            &, span, em, i {
                line-height: 2.5rem;
                height: 2.5rem;
            }
            span, em, i {
                 display: inline-block;
                 float: left;
            }
            span{
                font-size: 0.875rem;
            }
            em{
                color: $gray;
                font-size: 0.75rem;
                float: right;

                b, i{
                    float: left;
                }
            }
        }
        ul{
            display:-moz-flex;
            display:-webkit-flex;
            display:flex;
            padding: 0.875rem 0 0.938rem;

            &>a, li{
                display: inline-block;
                -moz-flex-grow:1;
                -webkit-flex-grow:1;
                flex-grow:1;
                text-align: center;

                i{
                    font-size: 1.375rem;
                    line-height: 1.375rem;
                }
            }

            &.list{
                padding: 0;

                &>a, li{
                    @include _linkLeft_half;
                    display: inline-block;
                    padding: 0.813rem 0 0.688rem;

                    i{
                        color: $pink !important;
                        font-size: 1.875rem;
                        line-height: 1.875rem;
                    }

                }
            }
        }
    }

    .account02{
        li{
            i{
                position: relative;

                b{
                    background: $red;
                    -moz-border-radius:50%;
                    -webkit-border-radius:50%;
                    border-radius:50%;
                    width: 0.5rem;
                    height: 0.5rem;
                    position: absolute;
                    right: -0.125rem;
                    top: 0.125rem;

                }
            }
        }
    }

    //.account04
    .main > div{
        margin-bottom: $foot_h + $spaceV;
    }
</style>
