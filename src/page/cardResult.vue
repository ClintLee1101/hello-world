<!--/************************      绑卡结果页   *********************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">操作结果</div>
            <i></i>
        </header>

        <div class="list60 spaceHT">
            <div class="com-margin main-box-has-margin-top">
                <div style="text-align: center;padding: 30px 0;">
                    <img  class="icon_succ" src="../../static/images/ic_jgcg.png" />
                </div>
                <div style="text-align: center;padding-bottom: 50px; font-size: 18px;">
                    <span>已成功提交</span>
                </div>
                <div style="text-align: center;padding-bottom: 50px;padding-left: 30px;padding-right:30px; font-size: 18px;">
                    <span style="font-size:0.675em;color: #a7aabe;">我们会在一个工作日进行审核，审核结束后，会及时通知您审核结果，谢谢！</span>
                </div>
            </div>

            <div class="btn_submit" style="padding:1rem">
                <a @click="goToBankList()">完成</a>
            </div>
        </div>


    </div>
</template>

<script>
    import {banks} from '../service/bankList';
    import { mapState, mapActions, mapMutations } from 'vuex';

    export default{

        data () {
            return {

            }
        },
        components: {
        },
        computed : {
        },

        methods : {
            goBack(){
                this.$router.goBack();
            },
            goToBankList(){

                this.$router.push({path:'MyBankList'})
            },



        },

        watch : {

        },

        created : function() {
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
    @import "../assets/components/yy_cover";

    dl{
        @include _dl(8em);
    }
    $upload_liH: 5.5rem;
    $upload_iB: 0.125rem;
    $upload_iP: 1.375rem;
    $upload_iF: 5.5rem - 0.125rem*2 - 1.375rem*2;

    .main-box-has-margin-top {
        margin-top: 54px;
        background-color: #fff;
    }
    .button-margin-in-form, .com-margin {
        padding-left: 18px;
        padding-right: 18px;
    }
    .icon_succ {
        width: 50px;
        height: 50px;
        display: inline-block;
        background-size: 100% 100%;
    }




</style>
