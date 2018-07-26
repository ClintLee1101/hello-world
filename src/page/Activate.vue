<!--/*************************************************************************/-->
<!--/*****************************       激活       **************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <!--<header>-->
        <!--<a class="arrowBack icon-arrowL" @click="goBack"></a>-->
        <!--<div class="title">激活</div>-->
        <!--<i></i>-->
        <!--</header>-->

        <nav>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div :class="{on:type==0}" @click="changeType(0)"><span>个人激活</span></div>
            <div :class="{on:type==1}" @click="changeType(1)"><span>机构激活</span></div>
            <i></i>
        </nav>

        <ul class="list60">
            <li>
                <span>手机号码</span>
                <input type="number" name="mobile" v-model="mobile" v-validate.initial="'required|mobile'" :class="{'input': true, 'is-danger': errors.has('mobile') }" class='phone-number' placeholder="请输入手机号">
                <i class="icon-emptied"  v-show="mobile" v-on:click="clearText('mobile')"></i>
            </li>
            <li>
                <span>验证码</span>
                <input type="number" v-validate.initial="'required|verify'" :class="{'input': true, 'is-danger': errors.has('verify') }" value=""  v-model="verify" name="verify"  placeholder="验证码">
                <i class="icon-emptied" v-show="verify" v-on:click="clearText('verify')"></i>

                <!--可点-->
                <input type="button" v-model="verifyText" @click="getVerify" :disabled="errors.has('mobile')">
            </li>
            <li>
                <span>登录密码</span>
                <input name="password" type="password" v-validate.initial="'required|password'" value="" :class="{'input': true, 'is-danger': errors.has('password') }" v-model="password" placeholder="请输入登录密码">
                <i class="icon-emptied" v-show="password" v-on:click="clearText('password')"></i>
            </li>
            <li>
                <span>确认密码</span>
                <input name="confirmPassword" type="password" v-validate.initial="'required|confirmed:password'" :class="{'input': true, 'is-danger': errors.has('confirmPassword') }" value=""  v-model="confirmPassword" placeholder="确认登录密码">
                <i class="icon-emptied" v-show="confirmPassword" v-on:click="clearText('confirmPassword')"></i>
            </li>
        </ul>

        <!--错误提示-->
        <div class="eTip">
            <h6 v-if="errors.has('mobile')">{{ errors.first('mobile') }}</h6>
            <h6 v-else-if="errors.has('verify')">{{ errors.first('verify') }}</h6>
            <h6 v-else-if="errors.has('password')">{{ errors.first('password') }}</h6>
            <h6 v-else-if="errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</h6>
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
    import { fspService } from '../service'
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';
    //    import bus from './bus';
    //    import ChildComponent from './EventBusChild.vue';

    export default{
        components: {
            alertTip
        },
        data() {
            return{
                email:'',
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
                //显示弹框设置结束

            }

        },
        computed: {
            ...mapFields({
                mobileFlags: 'mobile',
                verifyFlags: 'verify',
                passwordFlags: 'password',
                confirmPasswordFlags: 'confirmPassword'
            }),
            formEmpty() {
                // are some fields dirty?

                return Object.keys(this.fields).some(key => {
                    this.fields[key].dirty;
                });
            },
            validateBeforeSubmit() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        // eslint-disable-next-line
                        return true;
                    }
                    return false;
//                    alert('Correct them errors!');
                });
            }
        },
        methods: {
            ...mapActions([
                'userLogin'
            ]),

            //关闭弹框
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
                    this.registrateType='per'
                    this.type=0;
                    localStorage.setItem("logType",'per');
                }else{
                    this.showP=false;
                    this.showO=true;
                    this.registrateType='org';
                    localStorage.setItem("logType",'org');
                    this.type=1;
                }

            },

//            validators: {
//                numeric: { // `numeric` custom validator local registration
//                    message: 'invalid numeric value',
//                    check: function (val) {
//                        return /^[-+]?[0-9]+$/.test(val)
//                    }
//                },
//                url: { // `url` custom validator local registration
//                    message: function (field) {
//                        return 'invalid "' + field + '" url format field'
//                    },
//                    check: function (val) {
//                        return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
//                    }
//                },
//            },

            async getVerify(){
                if(this.mobile && !this.errors.has('mobile')){
                    let isActive = await this.mobileIsActive();
                    if(isActive){
                        if(this.ifVerify=='1') {
                            this.ifVerify = '0'
                            this.unClick = 'right verifyGray'
                            var self = this;
                            self.verifyText = '(获取60s)';
                            self.ts = 60;
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
                    }
                }else{
                    this.$validator.validate("mobile").then(result => {
                        if(!result){
                        }else{
                        }
                    });
                }
            },
            async goNext(){
                this.mobileIsActive();
            },
            async mobileIsActive(){
                let _parmas = {
                    mobile:this.mobile,
                    accountType:this.type
                };
                let res=await fspService.mobileIsActive(_parmas);
                if(res.code==0){
                    this.ifVerify=='1';
                    this.acctive();
                    return true;
                }else{
                    this.ifVerify=='0',
                        this.options=res.message;
                    this.showNotice=true;
                    return false
                }
            },

            callBack: function (str) {
                let target = this;
                setTimeout(function () {
                    if(target.registrateType=='per'){
                        target.$router.push({path:'/home/index'})
                    }else{
                        target.$router.push({path:'/orgOpenAccount?from=active'})
                    }

                },1000)
            },

            // 个人注册后登录
            loginFSP(type){
                this.userLogin([this.mobile, this.password, type, this.callBack]);
            },

            async acctive(){
                if(this.registrateType=='per'){
                    let _parmas = {
                        type:'user',
                        mobile:this.mobile,
                        verify:this.verify,
                        newpwd:this.password,
                        confirmpwd:this.confirmPassword
                    }
                    let res=await fspService.acctive(_parmas);
                    let target = this;
                    if(res.code==0){
                        this.options="激活成功，请登录购物";
                        this.showNotice=true;
                        this.loginFSP(0);
                    }else{
                        this.options=res.message;
                        this.showNotice=true;
                    }
                }else{
                    let _parmas = {
                        type:'org',
                        mobile:this.mobile,
                        verify:this.verify,
                        newpwd:this.password,
                        confirmpwd:this.confirmPassword
                    }
                    let res=await fspService.acctive(_parmas);
                    let target = this;
                    if(res.code==0){
                        this.options="激活成功，请完善您的个人信息";
                        this.showNotice=true;
                        this.loginFSP(1);
                    }else{
                        this.options=res.message;
                        this.showNotice=true;
                    }
                }


            },
            login(){
                this.$router.push({path:'/Login'})
            },
            async postCode(){
                let _parmas = {
                    mobile:this.mobile,
                    type:'password',
                    accountType:this.type
                };
                let res= await fspService.postCode(_parmas);
                if(res.code == 0){
                    this.options="验证码已发送";
                }else{
                    this.options=res.message;
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
        }
    }

</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
    @import "../assets/components/yy_cover";
</style>