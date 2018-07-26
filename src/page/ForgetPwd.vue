<!--/*************************************************************************/-->
<!--/***************************       忘记密码       ************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <!--<header>-->
            <!--<a class="arrowBack icon-arrowL" @click="goBack"></a>-->
            <!--<div class="title">忘记密码</div>-->
            <!--<i></i>-->
        <!--</header>-->

        <nav>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div :class="{'on':0==accountTypeNum}" @click="changeTab(0)"><span>个人账户</span></div>
            <div :class="{'on':1==accountTypeNum}" @click="changeTab(1)"><span>机构账户</span></div>
            <i></i>
        </nav>

        <ul class="list60">
            <li>
                <span>手机号</span>
                <input name="mobile" v-model="mobile" v-validate.initial="'required|mobile'" :class="{'input': true, 'is-danger': errors.has('mobile') }" type="number" placeholder="请输入绑定的手机号">
                <i class="icon-emptied" v-show="mobile" v-on:click="clearText('mobile')"></i>
            </li>
            <li>
                <span>手机验证码</span>
                <input type="number" name="verify" v-model="verify" v-validate.initial="'required|verify'" :class="{'input': true, 'is-danger': errors.has('verify') }" placeholder="请输入验证码">
                <i class="icon-emptied" v-show="verify" v-on:click="clearText('verify')"></i>
                <input type="button" v-model="verifyText" @click="getCode" :disabled="errors.has('mobile')">
            </li>
            <li>
                <span>设置新密码</span>
                <input type="password" name="password" v-model="password" v-validate.initial="'required|password'" :class="{'input': true, 'is-danger': errors.has('password') }" placeholder="请输入6位数字或字母">
                <i class="icon-emptied" v-show="password" v-on:click="clearText('password')"></i>
            </li>
        </ul>

        <!--错误提示-->
        <div class="eTip">
            <h6 v-if="errors.has('mobile')">{{ errors.first('mobile') }}</h6>
            <h6 v-else-if="errors.has('verify')">{{ errors.first('verify') }}</h6>
            <h6 v-else-if="errors.has('password')">{{ errors.first('password') }}</h6>
        </div>

        <div class="btn_submit">
            <input type="button" @click="resetPwd()" value="确定" :disabled="errors.any()">
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>


</template>

<script>
    import alertTip from '../components/alertTip'
    import { fspService } from '../service'
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';
    export default{
        data(){
            return {
                mobile:'',
                verify:'',
                password:'',
                ifVerify:'1',
                unClick:'right',
                verifyText:'获取验证码',
                line03:'line03',
                accountType:'org',//用户类型user,org,
                accountTypeNum:1,//机构获取验证码1 个人0
                //显示弹框设置
                showNotice:false,
                options: '' ,
                ts:'',
                timer:0,
            }
        },
        components: {
            alertTip,

        },
        methods:{
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            clearText: function (tag) {
                this[tag] = ''
            },

            goBack(){
                this.$router.goBack();
            },
            changeTab(index){
                index==0?this.accountTypeNum=0:this.accountTypeNum=1;
                index==0?this.accountType='user':this.accountType='org';
            },
            getCode(){
                if(!this.mobile){
                    this.showNotice=true;
                    this.options='请输入原手机号';
                }else{
                    if(this.ifVerify=='1'){
                        this.ifVerify='0'
                        this.unClick='right verifyGray'
                        var self=this;
                        self.verifyText = '(获取60s)';
                        self.ts=60;
                        self.timer = setInterval(function(){
                            self.ts-=1;
                            self.verifyText = '(获取'+String(self.ts)+'s)';
                            if(self.ts==0){
                                clearInterval(self.timer);
                                self.verifyText = '获取验证码';
                                self.unClick = 'right';
                                self.ifVerify="1";
                            }
                        },1000);
                        this.postCode();
                    }
                }
            },
            async postCode(){
                let _parmas = {
                    mobile:this.mobile,
                    type:'password',
                    accountType:this.accountTypeNum
                };
                let res= await fspService.postCode(_parmas);
                if(res.code == 0){
                    this.options="验证码已发送";
                }else{
                    this.verifyText = '获取验证码';
                    this.unClick = 'right';
                    this.ifVerify = "1";
                    clearInterval(this.timer);
                    this.options=res.message;
                }
                this.showNotice=true;
            },
            async resetPwd(){
                if(!this.mobile){
                    this.showNotice = true;
                    this.options = '请输入绑定手机号';
                    return;
                }
                let _parmas = {
                    accountType:this.accountType,
                    mobile:this.mobile,
                    type:'login',
                    verify:this.verify,
                    newpwd:this.password
                }
                    let res=await fspService.resetPwd(_parmas);
                    if(res.code==0){
                        this.$router.push({path:'/home/index'})
                    }else{
                        this.showNotice = true;
                        this.options = res.message;
                    }

            },
            comfirm(){
                if(this.verification){
                    this.changePassWord();

                }else{
                    this.showNotice = true;
                    this.options = '请设置正确密码';
                }

            }
        },
        computed:{
        },
        watch:{

        },
        created(){
        }

    }

</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
    @import "../assets/components/yy_cover";
</style>