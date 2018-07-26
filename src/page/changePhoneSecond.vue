<!--/*************************************************************************/-->
<!--/********************      设置 - 修改登录手机号 step2      ****************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback"></a>
            <div class="title">修改登录手机号</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>新手机号</span>
                <input v-model="input.input1" ref="phoneNumber" name="phoneNumber" placeholder="请输入新绑定的手机号" type="text" class="left">
                <i class="icon-emptied" v-on:click="clearText(1)"></i>
            </li>
            <li>
                <span>手机验证码</span>
                <input v-model="input.input2" ref="testNum" name="testNum" type="number" placeholder="请输入验证码">
                <i class="icon-emptied" v-on:click="clearText(2)"></i>
                <a v-bind:class='unClick' @click="getCode">{{verifyText}}</a>
            </li>
            <li>
                <span>开磷交易密码</span>
                <input type="password" v-model="input.input3" ref="paypwd" name="paypwd" placeholder="请输入开磷交易密码">
                <i class="icon-emptied" v-on:click="clearText(3)"></i>
            </li>
        </ul>

        <div class="btn_submit" @click="summit">
            <a>确定</a>
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import { fspService } from '../service'
    import { mapState, mapActions } from 'vuex'
    export default{
        data(){
            return {
                phoneNumber:'',
                testNum:'',
                mobile:"",
                shortMobile:"" ,//尾号后四位
                type:1,//0个人，1机构
                phoneType:1,//1、mobile 2、org_mobile
                ifVerify:'1',
                unClick:'right',
                verifyText:'获取验证码',
                //显示弹框设置
                showNotice:false,
                options: '' ,
                ts:'',
                paypwd:'',
                input: {
                    input1: '',
                    input2: '',
                    input3: '',
                },

            }
        },
        components: {
            alertTip
        },
        computed:{
            ...mapState([
                'userFspInfo',
                'userFundInfo'
            ]),

        },
        methods:{
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            clearText: function (tag) {
                this.input['input' + tag] = ''
            },
            //关闭弹框结束
            goback: function () {
                this.$router.goBack();
            },
            getCode(){
                if(this.$refs.phoneNumber.value==''||!this.regular(this.$refs.phoneNumber.value)){
                    this.showNotice=true;
                    this.options='请正确输入手机号';
                }else{
                    if(this.ifVerify=='1'){
                        this.ifVerify='0'
                        this.unClick='right verifyGray'
                        var self=this;
                        self.verifyText = '(获取60s)';
                        self.ts=60;
                        var timer = setInterval(function(){
                            self.ts-=1;
                            self.verifyText = '(获取'+String(self.ts)+'s)';
                            if(self.ts==0){
                                clearInterval(timer);
                                self.verifyText = '获取验证码';
                                self.unClick = 'right';
                                self.ifVerify="1";
                            }
                        },1000);
                        this.postCode();
                    }

                }



            },
            regular:function(n){
                {
                    var  r = /^(1[34578]\d{9}|145\d{8}|170\d{8}|105\d{8})$/,b = r.test(n);
                    return b
                }
            },
            summit(){
                this.mobileIsRegister();
            },

            async mobileIsRegister(){
                if(this.$refs.phoneNumber.value==''||!this.regular(this.$refs.phoneNumber.value)){
                    this.showNotice=true;
                    this.options='请正确输入手机号';
                    return;
                }
                let _parmas = {
                    mobile:this.$refs.phoneNumber.value,
                    accountType:this.type
                }
                let res=await fspService.mobileIsRegister(_parmas);
                if(res.code==0){
                    this.changePhoneFinal();
                }else{
                    this.options=res.message;
                    this.showNotice=true;
                }
            },
            async changePhoneFinal(){
                if(!this.$refs.testNum.value){
                    this.options='请输入验证码';
                    this.showNotice=true;
                    return;
                }
                if(!this.$refs.paypwd.value){
                    this.options='请输入交易密码';
                    this.showNotice=true;
                    return;
                }
                let _parmas = {
                    phoneType:this.phoneType,
                    newMobile:this.$refs.phoneNumber.value,
                    verify:this.$refs.testNum.value,
                    type:this.phoneType,
                    paypwd:this.$refs.paypwd.value
                };
                let res=await fspService.changePhoneFinal(_parmas);
                console.log(res);
                this.options=res.message;
                this.showNotice=true;
            },
            async postCode(){
                let _parmas = {
                    mobile:this.$refs.phoneNumber.value,
                    type:'password',
                    accountType:this.type
                }
                let res= await fspService.postCode(_parmas);
                this.showNotice=true;
                this.options=res.message;
            },

            initData(){
                console.log(this.userFspInfo) ;
                if(this.userFspInfo.type==0){
                    this.phoneType=0;
                    this.type=0
                }else if(this.userFspInfo.type==1){
                    this.phoneType=1;
                    this.type=1
                }

            }
        },
        watch:{
//            phoneNumber:function(v){
//                this.phoneNumber=v
//                console.log(this.phoneNumber);
//            }
        },
        filters:{

        },
        created(){
            this.initData();
        }
    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";

    ul.list60{
        li{
            span{
                width: 7em;
            }
        }
    }
</style>