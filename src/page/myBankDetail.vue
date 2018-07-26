<!--/*************************************************************************/-->
<!--/************************      设置 - 我的银行卡      *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">银行卡详情</div>
            <i> <a class="edit" @click="deleteCard()">删除</a></i>
        </header>

        <div class="spaceHT">
            <dl v-for="el in list" v-show="el.bankNo==bankNo">
                    <img :src="'https://klt.china-lin.com/static/assets/images/bank/logo_'+el.pic+'.jpg'">
                    <span>{{el.nameShot}}</span>
            </dl>
        </div>
        <div v-for="el in list" v-show="el.bankNo==bankNo">
            <dl>
                <dt>单笔限额：</dt>
                <dd>{{el.singleLimit|money}}</dd>
            </dl>
            <dl>
                <dt>每日限额：</dt>
                <dd>{{el.dailyCumulativeLimit|money}}</dd>
            </dl>
        </div>
        <div class="btn_submit_white">
            <a @click="popTitle">提升卡额度</a>
            <!--<a @click="deleteBank">删除银行卡</a>-->

        </div>

        <div class="pop" v-if="showPop">
            <div class="bg"></div>
            <div class="box" style="height:13rem;">
                <div class="txt">
                    <div>
                        <div style="border-bottom: 0;padding-bottom: 5px">
                <span class="text-f4 text-c2">1.请您在电脑上访问开磷网站https://fsp2.china-lin.com/
                </span>
                        </div>
                        <div style="border-bottom: 0;padding-top:0px; padding-bottom: 0px">
                <span class="text-f4 text-c2">2.登录我的账户
                </span>
                        </div>
                        <div style="border-bottom: 0;padding-top:5px; padding-bottom: 0px">
                <span class="text-f4 text-c2">3.选择银行卡进行相关操作
                </span>
                        </div>
                        <div>
                <span class="text-f4 text-c2">注：此操作需要配合U盾完成
                </span>
                        </div>
                        <div>
                <span class="tcButton"
                      style="border-bottom-right-radius: 0;border-top-right-radius:0;"
                      @click="closeTips">知道了
                </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>




        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import loading from '../components/loading';
    import alertTip from '../components/alertTip';
    import {banks} from '../service/bankList';
    import { mapState, mapActions, mapMutations } from 'vuex';
    import util from '../lib/util';

    export default{

        data () {
            return {
                ifAlert:false,
                list:[],
                showAdd:false,
                isUser:true,
                userType:0,
                noImage:require('../../static/images/noImg.png'),
                showLoading:false,
                image:'/images/bank/logo_{{el.pic}}.jpg',
                //显示弹框设置
                showNotice:false,
                options:'',
                //理财相关
                user:{},
                bankNo:'',
                bankAccount:'',
                encryptedBankAccount:'',
                showPop:false
            }
        },
        components: {
            loading,
            alertTip
        },
        filters: {
            money:function(value){
                return util.price1(value)
            },
            companyConvert: function (str) {
                return util.companyConvert(value)
            }
        },
        computed : {
            ...mapState([
                'userFspInfo',
                'userFundInfo',
                'licaiInfo'
            ]),
        },

        methods : {
            ...mapMutations([
                'GET_USER_FUNDINFO'
            ]),
            ...mapActions([
                'getUserFundInfo',
                'getLiCaiInfo',
            ]),
            goBack(){
                this.$router.goBack();
            },
            deleteBank(){

            },
            popTitle(){
                this.showPop=true;
            },
            closeTips(){
                this.showPop=false;
            },
            deleteCard(){
                this.$router.push({path:'/deleteBank',query:{bankNo:this.bankNo,bankAccount:this.bankAccount,encryptedBankAccount:this.encryptedBankAccount}});
            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },

            initData(){
            },


        },

        watch : {

        },

        created : function() {
            this.bankNo=this.$route.query.bankNo;
            this.bankAccount=this.$route.query.bankAccount;
            this.encryptedBankAccount=this.$route.query.encryptedBankAccount;
            this.list=this.licaiInfo[0];
            console.log(this.bankNo);
            console.log(this.list);
            this.initData();
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
    .tcButton{
        display: inline-block;
        color: #6facde;
        width: 96%;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        vertical-align: middle;
        text-align: center;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        text-decoration: none;
        position: relative;
        cursor: pointer;
        background-color: #fff;
    }
</style>
