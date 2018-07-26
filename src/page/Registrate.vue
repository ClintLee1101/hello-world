<!--/*************************************************************************/-->
<!--/*****************************       注册       **************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <!--<header>-->
            <!--<a class="arrowBack icon-arrowL" @click="goBack"></a>-->
            <!--<div class="title">注册</div>-->
            <!--<i></i>-->
        <!--</header>-->

        <nav>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div :class="{on:type==0}" @click="changeType(0)"><span>个人注册</span></div>
            <div :class="{on:type==1}" @click="changeType(1)"><span>机构注册</span></div>
            <i></i>
        </nav>

        <ul class="list60">
            <li>
                <span>手机号码</span>
                <input name="mobile" v-model="mobile" v-validate.initial="'required|mobile'" :class="{'input': true, 'is-danger': errors.has('mobile') }" type="number"    placeholder="请输入手机号">
                <i class="icon-emptied"  v-show="mobile" v-on:click="clearText('mobile')"></i>
            </li>
            <li>
                <span>验证码</span>
                <input name="verify" v-model="verify" v-validate.initial="'required|verify'" :class="{'input': true, 'is-danger': errors.has('verify') }"  type="password" placeholder="验证码">
                <i class="icon-emptied" v-show="verify" v-on:click="clearText('verify')"></i>
                <input type="button" v-model="verifyText" @click="getVerify" :disabled="errors.has('mobile')">
            </li>
            <li>
                <span>登录密码</span>
                <input name="password" v-model="password" v-validate.initial="'required|password'" value="" :class="{'input': true, 'is-danger': errors.has('password') }" type="password" placeholder="请输入登录密码">
                <i class="icon-emptied" v-show="password" v-on:click="clearText('password')"></i>
            </li>
            <li>
                <span>确认密码</span>
                <input name="confirmPassword" v-model="confirmPassword" v-validate.initial="'required|confirmed:password'" :class="{'input': true, 'is-danger': errors.has('confirmPassword') }" type="password" placeholder="确认登录密码">
                <i class="icon-emptied" v-show="confirmPassword" v-on:click="clearText('confirmPassword')"></i>
            </li>
        </ul>

        <!--错误提示-->
        <div class="eTip">
            <h6 v-if="errors.has('mobile')">{{ errors.first('mobile') }}</h6>
            <h6 v-else-if="errors.has('verify')">{{ errors.first('verify') }}</h6>
            <h6 v-else-if="errors.has('password')">{{ errors.first('password') }}</h6>
            <h6 v-else-if="errors.has('confirmPassword')">{{errors.first('confirmPassword')}}</h6>
        </div>

        <h5 @click="login">已有账户？立即登录</h5>
        <div class="btn_submit">
            <input type="button" @click="goNext()" value="下一步" :disabled="errors.any()">
        </div>

        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import {mapState, mapActions} from 'vuex'
    import {
        fspService
    } from '../service'
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';
    import{
        GlobelObj
    } from '../components/Global.vue'
    export default{
        components: {
            alertTip
        },
        data() {
            return{
                showO:true,
                showP:false,
                mobile:'',
                verify:'',
                ifVerify:'1',
                unClick:'right',
                verifyText:'获取验证码',
                password:'',
                confirmPassword:'',
                registrateType:'org',
                type:1,
                //显示弹框设置
                showNotice:false,
                options: '',
                active:true,
                timers:0,
                //显示弹框设置结束

            }

        },
        computed: {
            ...mapState([
                'isLogin'
            ]),
        },
        methods: {
            //关闭弹框
            ...mapActions([
                'userLogin'
            ]),
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
                this.$router.goBack();
            },
            clearText: function (tag) {
                this[tag] = ''
            },

            //关闭弹框结束
            changeType:function(type){
                if(type==0){
                    this.showP=true;
                    this.showO=false;
                    this.registrateType='per';
                    localStorage.setItem("logType",'per');
                        this.type=0;
                }else{
                    this.showP=false;
                    this.showO=true;
                    this.registrateType='org';
                    localStorage.setItem("logType",'org');
                    this.type=1;
                }

            },
            getVerify(){
                if(this.ifVerify=='1') {
                    this.ifVerify = '0';
                    this.unClick = 'right verifyGray';
                    var self = this;
                    self.verifyText = '(获取60s)';
                    self.ts = 60;
                    self.timers = setInterval(function () {
                        self.ts -= 1;
                        self.verifyText = '(获取' + String(self.ts) + 's)';
                        if (self.ts == 0) {
                            clearInterval(self.timers);
                            self.verifyText = '获取验证码';
                            self.unClick = 'right';
                            self.ifVerify = "1";
                        }
                    }, 1000);
                    this.postCode();
                }
            },
            async goNext(){
               this.isRegister()
            },
            async isRegister(){
                let _parmas = {
                    mobile:this.mobile,
                    accountType:this.type
                }
                let res= await fspService.isRegister(_parmas);
                if(res.code==0){
                    //未注册
                    if( this.registrateType=='per'){
                        this.perRegister();
                    }else{
                        this.orgRegister();
                    }
//                    return false;

                }else{
                    this.options=res.message;
                    this.showNotice=true;
//                    return true;
                }
            },
            async orgRegister(){
                let res=await fspService.orgRegister({
                    mobile:this.mobile,
                    verify:this.verify,
                    password:this.confirmPassword
                });
                if(res.code==0){
                    GlobelObj.mobile=this.mobile;
//                    this.$router.push({path:'/successRegist?type=org'})
                    this.$router.push({path:'/orgOpenAccount'})
                }else{
                    this.options=res.message;
                    this.showNotice=true;

                }
            },
            callBack: function (str) {
                this.options = str;
                this.showNotice = true;

            },

            // 个人注册后登录
            loginFSP(){
                this.userLogin([this.mobile, this.confirmPassword, this.type, this.callBack]);
            },

            async perRegister(){
                let _params=  {
                    mobile:this.mobile,
                    verify:this.verify,
                    password:this.confirmPassword
                }
//                let res=await perRegister(this.mobile,this.verify,this.confirmPassword);
                let res=await fspService.perRegister(_params);
                if(res.code==0){
                    this.loginFSP();
                }else{
                    this.options=res.message;
                    this.showNotice=true;
                }
            },
            login(){
                this.$router.push({path:'/Login'})
            },
            async postCode(){
                let _parmas = {
                    mobile:this.mobile,
                    type:'register',
                    accountType:this.type
                }
                let res= await fspService.postCode(_parmas);
                if(res.code != 0){
                    this.options=res.message;
                }
                if(res.code == '-2003'){
                    clearInterval(this.timers);
                    this.verifyText = '获取验证码';
                    this.unClick = 'right';
                    this.ifVerify = "1";
                }
                if(res.code == 0){
                    this.options="验证码已发送";
                }
                this.showNotice=true;
            },
        },
        created () {
            if(localStorage.getItem("logType")=='org'){
                this.type=1;
                this.registrateType='org';
            }else if(localStorage.getItem("logType")=='per'){
                this.type=0;
                this.registrateType='per';
            }
            console.log(localStorage.getItem("logType"));
        },
        watch: {
            isLogin: function (value) {
                if (value) {
                    this.$router.push({ path: '/home/index' })
                }
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
    @import "../assets/components/yy_cover";
</style>