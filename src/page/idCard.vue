<!--/*************************************************************************/-->
<!--/********************      设置 - 修改登录手机号 step2      ****************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">身份验证</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>身份证</span>
                <input type="text" v-model="idCard" placeholder="请输入身份证号">
                <i class="icon-emptied"></i>
            </li>
            <li @click="openBankList">
                <span>银行</span>
                <img v-bind:src="bankPic"><strong>{{currentBank}}</strong>
                <i class="icon-arrowR"></i>
            </li>
            <li>
                <span>银行卡号</span>
                <input type="text" v-model="bankCode" placeholder="请输入银行卡号">
                <i class="icon-emptied"></i>
            </li>
        </ul>

        <div class="btn_submit" @click="goChange">
            <a>下一步</a>
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import {mapState, mapActions} from 'vuex'
    import { fspService } from '../service'
    import {banks} from '../service/bankList'
    export default{
        data(){
            return {
                mobile:'',
                type:0,
                bankStr:"",
                isOrg:'',
                currentBank:'',
                //显示弹框设置
                showNotice:false,
                options: '',
                verification:false,
                flag:false,
                idCard:"",
                bankCode:'',
//                bankPic:require('../assets/images/bank/logo_{{bankStr}}.jpg'),
                bankPic:'',
                bankList:[],
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
           getBankList(){
                this.myBankList();
            },
            async myBankList(){
               let res=await fspService.myBankList();
               this.bankList=res.data;
               console.log(res.data);
               if(res.data.length!=0){
                   this.bankStr=res.data[0].bankNo;
                   this.currentBank=banks[res.data[0].bankNo].name;
                   this.bankPic='/static/assets/images/bank/logo_'+res.data[0].bankNo+'.jpg';
               }

            },
            openBankList(){

            },
            goChange(){
                if(!this.isOrg){
                    if(!this.isIdCard(this.idCard)){
                        this.showNotice = true;
                        this.options = '请输入正确身份证号';
                        return;
                    }
                }
                if(this.bankCode==''){
                    this.showNotice = true;
                    this.options = '请输入银行卡号';
                    return;
                }
                this.authVerify();
            },
            async authVerify(){
                if(this.isOrg){
                    let _parmas = {
                        idNo:this.idCard,
                        bank:this.bankStr,
                        bankNo:this.bankCode
                    }
                    let res=await fspService.authVerify(_parmas);
                    if(res.code==0){
                        this.$router.push({path:'/resetTradePass'})
                    }else{
                        this.showNotice = true;
                        this.options = res.message;
                    }

                }else{
                    let _parmas = {
                        idNo:this.idCard,
                        bank:this.bankStr,
                        bankNo:this.bankCode
                    }
                    let res=await fspService.authVerify(_parmas);
                    if(res.code==0){
                        this.$router.push({path:'/resetTradePass'})
                    }else{
                        this.showNotice = true;
                        this.options = res.message;
                    }

                }



            },
            testIdcard(){
                console.log(String(this.newPass).length);
                if(String(this.newPass).length!=6) {
                    this.showNotice = true;
                    this.options = '请输入6位密码';

                }else{
                    this.verification=false;
                }
            },
            isIdCard:function (card)
            {
                card = card.toUpperCase();
                var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                if(reg.test(card) == false)
                {
                    return  false;
                }else{
                    return true;
                }
            }
//            async changePassWord(){
//                let res=await changePassWord(this.userFspInfo.mobile,this.pass,this.newPass_verify);
//                if(res.code==0){
//                    this.$router.push({path:'/setting'})
//                }
//
//            },
//            comfirm(){
//                if(this.verification){
//                    this.changePassWord();
//
//                }else{
//                    this.showNotice = true;
//                    this.options = '请设置正确密码';
//                }
//
//            }
        },
        computed:{
            ...mapState([
                'userFspInfo',
            ])
        },
        watch:{


        },
        created(){
            console.log(this.userFspInfo);
            this.userFspInfo.type==0?this.isOrg=false:this.isOrg=true;
            console.log(banks);
            this.getBankList();
        }

    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
</style>
