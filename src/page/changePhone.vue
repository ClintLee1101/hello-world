<!--/*************************************************************************/-->
<!--/********************      设置 - 修改登录手机号 step1      ****************/-->
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
                <span>原手机号</span>
                <input  v-model="phoneNumber_re" readonly type="text">
            </li>
            <li>
                <span>手机验证码</span>
                <input v-model="input.input1" ref="testNum" name="testNum" type="number" placeholder="请输入验证码">
                <i class="icon-emptied" v-on:click="clearText(1)"></i>
                <a v-bind:class="unClick"  @click="getCode">{{verifyText}}</a>
            </li>
        </ul>

        <h5>如原手机号不可用，请联系400-677-9000</h5>

        <div class="btn_submit" @click="getverifyPhone">
            <a>下一步</a>
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
                phoneNumber_re:'',//隐藏手机中间四位
                testNum:'',
                mobile:1,
                shortMobile:"" ,//尾号后四位
                type:0,//0个人，1机构
                phoneType:1,//1、mobile 2、org_mobile
                ifVerify:'1',
                unClick:'right',
                verifyText:'获取验证码',
                //显示弹框设置
                showNotice:false,
                options: '' ,
                ts:'',
                input: {
                    input1: '',
                },

            }
        },
        components: {
            alertTip,

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

                if(this.phoneNumber!=this.userFspInfo.mobile){
                    this.showNotice=true;
                    this.options='请输入原手机号';
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
            async getverifyPhone(){
                if(!this.phoneNumber){
                    this.showNotice=true;
                    this.options='请输入原手机号';
                }
                if(!this.$refs.testNum.value){
                    this.showNotice=true;
                    this.options='请输入验证码';
                }
                let _parmas = {
                    mobile:this.phoneNumber,
                    verify:this.$refs.testNum.value,
                };
                let res=await fspService.getverifyPhone(_parmas);

                this.showNotice=true;
                this.options=res.message;
                if(res.code==0){
                    this.$router.push({path:'/changePhoneSecond'})
                }
            },
            async postCode(){
                let _parmas = {
                    mobile:this.phoneNumber,
                    type:'password',
                    accountType:this.type
                };
                let res= await fspService.postCode(_parmas);
                this.showNotice=true;
                this.options=res.message;
            },
            initData(){
               console.log(this.userFspInfo) ;
               this.phoneType=this.userFspInfo.type;
            }
        },
        watch:{
            phoneNumber:function(v){
                this.phoneNumber=v
                console.log(this.phoneNumber);
            },
            verifyText:function(v){
                return v;
            }

        },
        filters:{

        },
        created(){
            this.initData();
            this.phoneNumber=this.userFspInfo.mobile;
            this.phoneNumber_re=this.userFspInfo.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";

    h5{
        color: $gray;
        text-align: right;
        margin: 1rem $spaceLR 0;
    }
</style>