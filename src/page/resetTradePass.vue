<!--/*************************************************************************/-->
<!--/****************     设置 - 重置交易密码 - 忘记原交易密码      *************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">重置交易密码</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>新的交易密码</span>
                <input type="password" name="password" v-validate.initial="'required|password'" :class="{'input': true, 'is-danger': errors.has('password') }"  v-model="newPass"  placeholder="输入当前登录密码">
                <i class="icon-emptied" v-show="newPass" v-on:click="clearText('newPass')"></i>
            </li>
            <li>
                <span>确认交易密码</span>
                <input type="password" name="confirmPassword" v-validate.initial="'required|confirmed:password'" :class="{'input': true, 'is-danger': errors.has('confirmPassword') }" v-model="verifyPass" placeholder="设置6位登录密码">
                <i class="icon-emptied" v-show="verifyPass" v-on:click="clearText('verifyPass')"></i>
            </li>
            <li>
                <span>验证码</span>
                <input v-model="verify" name="verify" v-validate.initial="'required|verify'" :class="{'input': true, 'is-danger': errors.has('verify') }" type="number" placeholder="输入验证码">
                <i class="icon-emptied" v-show="verify" v-on:click="clearText('verify')"></i>
                <a @click="getCode">{{verifyText}}</a>
            </li>
        </ul>
        <!--错误提示-->
        <div class="eTip">
            <h6 v-if="errors.has('password')">{{ errors.first('password') }}</h6>
            <h6 v-else-if="errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</h6>
            <h6 v-else-if="errors.has('verify')">{{ errors.first('verify') }}</h6>
        </div>

        <!--<div class="btn" @click="comfirm">-->
            <!--<a>确定</a>-->
        <!--</div>-->
        <div class="btn_submit">
            <input type="button" @click="comfirm()" value="确定" :disabled="errors.any()">
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import VeeValidate from '../validator/validation'
    import { mapFields } from 'vee-validate';
    import {mapState, mapActions} from 'vuex'
    import { fspService } from '../service'
    export default{
        data(){
            return {
                mobile:'',
                newPass:'',
                verifyPass:'',
                type:'',
                verify:'',
                accountType:'',
                verification:false,
                verifyText:'获取验证码',
                //显示弹框设置
                showNotice:false,
                options: '',
                unClick:'',
                ifVerify:'1',
                timers:0
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
            goBack(){
                this.$router.goBack();
            },
            clearText (tag){
                this[tag] = '';
            },
            getCode(){
                if(this.ifVerify=='1') {
                    this.ifVerify = '0';
                    this.verifyText = '(获取60s)';
                    this.ts=60;
                    let target = this;
                    this.timers = setInterval(function(){
                        target.ts-=1;
                        target.verifyText = '(获取'+String(target.ts)+'s)';
                        if(target.ts==0){
                            clearInterval(target.timers);
                            target.verifyText = '获取验证码';
                            target.unClick = '';
                            target.ifVerify="1";
                        }
                    },1000);
                    this.postCode();
                }
            },
            async postCode(){
                let _parmas = {
                    mobile:this.userFspInfo.mobile,
                    type:'password',
                    accountType:this.type
                }
                let res= await fspService.postCode(_parmas);
                if(res.code == 0){
                    this.options="验证码已发送";
                }else{
                    this.verifyText = '获取验证码';
                    this.unClick = 'right';
                    this.ifVerify = "1";
                    clearInterval(this.timers);
                    this.options=res.message;
                }
                this.showNotice=true;

            },
            async authTradeVerify(){
                let _parmas = {
                    type:'trade',
                    accountType:this.accountType,
                    mobile:this.userFspInfo.mobile,
                    verify:this.verify,
                    newpwd:this.verifyPass
                }
                    let res=await fspService.authTradeVerify(_parmas);
                    if(res.code==0){
                        this.$router.push({path:'/setting'})
                    }else{
                        this.options = res.message;
                        this.showNotice = true;
                    }


            },
            comfirm(){
//                if(String(this.newPass).length!=6||this.verifyPass!=this.newPass) {
//                    this.showNotice = true;
//                    this.options = '请输入相同6位密码';
//                }else{
                    this.authTradeVerify();
//                }
            }
        },
        computed:{
            ...mapState([
                'userFspInfo',
            ])
        },
        watch:{


        },
        created(){
            console.log( this.userFspInfo);
            this.mobile=this.userFspInfo.mobile.mobile;
            this.type=this.userFspInfo.type;
            this.userFspInfo.type==0?this.accountType="user":this.accountType="org";
        }

    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";

    ul{
        li{
            span{
                width: 7em !important;
            }
        }
    }
</style>