<!--/*************************************************************************/-->
<!--/************************     设置 - 重置交易密码      *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">修改交易密码</div>
            <i></i>
        </header>

        <ul class="spaceHT">
            <li  @click="goToChangePass">
                <h5>记得原交易密码</h5>
                <b class="icon-arrowR"></b>
            </li>
            <li  @click="goToIdCard">
                <h5>忘记原交易密码</h5>
                <b class="icon-arrowR"></b>
            </li>
        </ul>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import {mapState, mapActions} from 'vuex'
    export default{
        data(){
            return {
                mobile:'',
                newPass:'',
                pass:'',
                newPass_verify:'',
                //显示弹框设置
                showNotice:false,
                options: '',
                verification:false,
                flag:false,
            }
        },
        components: {
            alertTip,

        },
        methods:{
            goToChangePass(){
                this.$router.push({path:'/changePass',query:{trade:'trade'}})
            },
            goToIdCard(){
//                this.$router.push({path:'/idCard'})
                  this.$router.push({path:'/resetTradePass'})
            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
                this.$router.goBack();
            },
            testLength(){
                console.log(String(this.newPass).length);
                if(String(this.newPass).length!=6) {
                    this.showNotice = true;
                    this.options = '请输入6位密码';

                }else{
                    this.verification=false;
                }
            },
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
//            newPass:function(v){
//                if(v.length!=6){
////                    this.showNotice=true;
////                    this.options='请输入6位密码'
//                }
//            },

//            newPass_verify:function(v){
//                if(v==this.newPass){
//                    this.verification=true;
//                    this.showNotice = true;
//                    this.options = '密码正确';
//                }
//            }


        },
        created(){
            console.log( this.userFspInfo.mobile);
        }

    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";

    ul{
        @include _ul;
        li{
            @include _li;
        }
    }
</style>