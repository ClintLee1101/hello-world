<!--/*************************************************************************/-->
<!--/*****************************       登录       **************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <!--<header>-->
            <!--<a class="arrowBack icon-arrowL" href="#/home/index/"></a>-->
            <!--<div class="title">用户登录</div>-->
            <!--<i></i>-->
        <!--</header>-->

        <nav>
            <a class="arrowBack icon-arrowL" href="#/home/index/"></a>
            <div v-on:click="change(1)" :class="tagc1"><span>个人登录</span></div>
            <div v-on:click="change(2)" :class="tagc2"><span>机构登录</span></div>
            <i></i>
        </nav>

        <ul class="list60">
            <li>
                <i class="icon-phone"></i>
                <input type="text" v-validate.initial="'required'" v-on:focus="hidefoot"  v-on:blur="changeHide" v-model="username" name="username" :placeholder="placeholder">
                <i class="icon-emptied" v-show="username" v-on:click="clearText('username')"></i>
            </li>
            <li>
                <i class="icon-pwd"></i>
                <input type="password" v-validate.initial="'required'" v-on:focus="hidefoot" v-on:blur="changeHide" v-model="password" name="password" placeholder="请输入登录密码">
                <i class="icon-emptied" v-show="password" v-on:click="clearText('password')"></i>
            </li>
        </ul>

        <h5 @click="goToForget">忘记密码？</h5>
        <div class="btn_submit">
            <input type="button" @click="submit()" value="登录" :disabled="errors.any()">
        </div>

        <footer class="login">
            <a @click="gotoActive">激活账户</a>
            <router-link to="Registrate">立即注册</router-link>
            <!--<router-link to="testPay">测试支付</router-link>-->
            <!--<router-link to="testDevice">取设备信息</router-link>-->
        </footer>
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip';
    import {mapState, mapActions} from 'vuex'
    import {
        licaiService
    } from '../service'
    import util from '../lib/util';
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';

    import{
        GlobelObj
    } from '../components/Global.vue'
    export default {
        components: {
            alertTip
        },
        name: 'login',
        data () {
            return {

                placeholder:'输入组织代码/统一信用代码/手机号',
                index: 2,
                tagc1: '',
                tagc2: 'on',
                result1: null,
                msg: 'login',

                username:'',
                password:'',

                showNotice: false,
                options: '',

                //理财相关
                wealthUserId:'',
                token:'',
                user:'',
                branchNo:'',
                fundAccount:'',
//                footer:true,
            }
        },
        computed: {
            ...mapState([
                'isLogin'
            ]),
        },
        methods: {
            ...mapActions([
                'userLogin',
                'getLiCaiInfo',
            ]),

            //关闭弹框
            close(){
                this.options='';
                this.showNotice = false;
            },
            hidefoot(){
//                this.footer=false;
                $('.login').css("cssText", "position:static !important");
            },
            changeHide(){
//                $('.login').css("cssText", "position:fixed !important");
//                this.footer=true;
            },
//            gotoTest(){
//                var _this=this;
////              var ref =cordova.InAppBrowser.open('http://fspm2.staging.china-lin.com', '_blank', 'location=no,toolbar=no,toolbarposition=top,closebuttoncaption=返回');
//                var ref =cordova.InAppBrowser.open('http://fspm2.staging.china-lin.com', '_blank', 'location=no,toolbar=no');
//                var myCallback = function(event) {
//                    alert(event.url);
//                    if(event.url=='http://fspm2.staging.china-lin.com/spirit'){
//                        ref.close();
//                        _this.$router.push({path: '/Activate'});
//
//                    }
//                }
//                ref.addEventListener('loadstart', myCallback);
//            },

            gotoActive(){
                this.$router.push({path: '/Activate'})
            },
            submit: function () {
                let is_store = this.index === 1?0:1
                this.userLogin([this.username, this.password, is_store, this.callBack]);
            },
            callBack: function (str) {
                this.options = str;
                this.showNotice = true;
            },

            change: function (tag) {
                this.index = tag;
                if (tag === 1) {
                    localStorage.setItem("logType",'per');
                    this.placeholder = '请输入用户名/手机号'
                    this.tagc1 = 'on'
                    this.tagc2 = ''
                } else {
                    localStorage.setItem("logType",'org');
                    this.placeholder = '输入组织代码/统一信用代码/手机号';
                    this.tagc1 = ''
                    this.tagc2 = 'on'
                }
                console.log( localStorage.getItem("logType"));
            },
            clearText: function (tag) {
                this[tag] = ''
            },
            goToForget(){
                this.$router.push({path: 'ForgetPwd'});
            },
            async getWealthUser(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token:this.token,
                    version: '5.18.0',
                    appkey: 'jh4a045c200bb38c90',
                    timestamp:new Date().getTime(),
                }
//                var paramsAccount = util.getSignParams(data_arr,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',new Date().getTime());
                console.log(licaiService);
                let resWealthAccout = await licaiService.getWealthUserAccount(data_arr);
//                let resWealthAccout = await getWealthUserAccount(this.wealthUserId,paramsAccount);
                console.log(resWealthAccout);
                this.user=resWealthAccout.user;
                this.branchNo=resWealthAccout.user.branchNo;
                this.fundAccount=resWealthAccout.user.fundAccount;
                this.getWealthUserInfo();
            },
            async getWealthUserInfo(){
                let data_arr_bank = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: 'jh4a045c200bb38c90',
                    timestamp:new Date().getTime(),
                    branchNo: this.branchNo,
                    fundAccount: this.fundAccount,
                }
//                var paramsBank = util.getSignParams(data_arr_bank,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',new Date().getTime());
                let resBank = await licaiService.getWealthUserInfo(data_arr_bank);
                var list = resBank.data;
                var temp = [];
                for(var i=0;i<list.length;i++){
                    var obj = {};
                    obj = list[i];
                    obj.name = list[i]["bankName"];
                    var no = list[i]["bankAccount"];
                    var no4 = no.substring(no.length-4,no.length);
                    obj.nameShot = obj.name + "(尾号" + no4 + ")";
                    temp.push(obj);
                }
                //理财信息存入store
                this.getLiCaiInfo([temp,this.user]);
            }

        },

        watch: {
            isLogin: function (value) {
                if (value) {

                    console.log("fsp token"+util.getCookie("fsphometoken"))
                    if(util.getCookie("fsphometoken")==undefined){
//                  document.cookie='fsphometoken="10937|a9c18318ec8e5756691d1e1ee983b311*woWwZ9eZid-hxQRTqFQhWONMWxD4WhWBuUBGLwM3SrlV7-fHxszRUJtsjp5EmcBsTzpGNFbgeZM="'
//                  document.cookie='www.china-lin.com="548491|9ea3e5af459255c73f2dff1ed3bfc04f*aa4q-k7CCo8-nCaNu1t5xKgsn0R7V6WQhT4PmazPQOHLd0Vi8zlFUA=="'
//                        document.cookie='fsphometoken="9309|926af633e8601e67be91ab032acb5b2d*WmuRfcRhDH9s4OfGogZz8ZHbySXkbnO-u36hZr5vUNaatIelfjBZjq7211YZlMPhbgRuP025AOM="'

                    }


                    this.$router.goBack();
                    this.wealthUserId=localStorage.getItem("userId");
                    this.token= localStorage.getItem("token");
                    this.getWealthUser();
                }
            }
        },
        created(){
            localStorage.setItem("logType",'org');
           //默认是机构
        }

    }



</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
</style>
