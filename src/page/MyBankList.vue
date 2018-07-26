<!--/*************************************************************************/-->
<!--/************************      设置 - 我的银行卡      *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">我的银行卡</div>
            <i></i>
        </header>

        <div class="spaceHT">
            <dl @click="goToDetail(el.bankNo,el.bankAccount,el.encryptedBankAccount)" v-for="el in list">
                <img :src="'https://klt.china-lin.com/static/assets/images/bank/logo_'+el.pic+'.jpg'">
                <span>{{el.nameShot}}</span>
            </dl>
        </div>

        <div v-if="showAdd" class="btn_submit_white" v-show="!showLoading">
            <a v-if="isUser"  @click="addBank">添加银行卡</a>
            <a v-if="!isUser" @click="bindBank">机构绑卡</a>
        </div>

        <loading v-show="showLoading"></loading>
        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import loading from '../components/loading';
    import alertTip from '../components/alertTip'
    import {banks} from '../service/bankList';
    import {
        licaiService,proxy
    } from '../service';
    import { mapState, mapActions, mapMutations } from 'vuex';
    import util from '../lib/util';
    import md5 from 'blueimp-md5';
    import{
        GlobelObj
    } from '../components/Global.vue'
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
                wealthUserId:'',
                token:'',
                message:'',
                branchNo:'',
                fundAccount:'',
                authStatus:'',
                user:{}
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
//                this.$router.goBack();
                this.$router.push({path:'/setting'});
            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            addBank(){
                if(this.list && this.list.length == 1 && this.authStatus ==='1'){
                    this.options='正在初审';
                    this.showNotice=true;
                }else  if(this.list && this.list.length == 1 && this.authStatus === '0'){
                    this.options='还未审核，请等待';
                    this.showNotice=true;
                }else  if(this.list && this.list.length == 1 && this.authStatus == '-1'){
                    this.$router.push({path:'/addIdCard'});
                } else  if(this.list && this.list.length == 1 && this.authStatus =='-2'){
                    this.$router.push({path:'/addIdCard'});
                } else  if(this.list && this.list.length == 1 && this.authStatus ===''){
                    this.$router.push({path:'/addIdCard'});
                }
                else if(this.list.length==0){
                    this.$router.push({path:'/MyAccountCardAdd'});
                }else{
                    this.$router.push({path:'/MyAccountCardAddSecond'});
                }

            },
            bindBank(){
                GlobelObj.mobile=this.userFspInfo.mobile;
                this.$router.push({path:'/orgOpenAccount?from=active'})
            },
            initData(){
                if(!localStorage.getItem("token")){
                    this.showNotice=true;
                    this.options='没有开通理财账户，或者账户未进行同步';
                    return;
                }
                console.log(this.userFspInfo)
                if(this.userFspInfo.type == "1"){
                    this.isUser = false;
                }else{
                    this.showAdd=true;
                    this.isUser = true;
                }
                this.getCardList();
            },

            async getWealthUserAccount(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appKey,
                    timestamp:new Date().getTime()
                }
//                this.params2 = util.getSignParams(data_arr,proxy.appKey,proxy.appSecret,new Date().getTime());
                let res = await licaiService.getWealthUserAccount(data_arr);
                console.log(res);
                this.user=res.user;
                this.branchNo=res.user.branchNo;
                this.authStatus = res.user.operateCode;
                console.log(this.branchNo);
                this.fundAccount=res.user.fundAccount;
                this.getWealthUserInfo();
            },
            async getWealthUserInfo(){
                let data_arr = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: proxy.appKey,
                    timestamp:new Date().getTime(),
                    branchNo: this.branchNo,
                    fundAccount: this.fundAccount,
                }
//                this.params = util.getSignParams(data_arr,proxy.appKey,proxy.appSecret,new Date().getTime());
//                console.log(this.params);
                let res = await licaiService.getWealthUserInfo(data_arr);
                var list = res.data;
                this.showLoading=false;
                var temp = [];
                for(var i=0;i<list.length;i++){
                    var obj = {};
                    obj = list[i];
                    if(list[i].tiedCardType=='0'){
                        obj.name = banks[list[i]["bankNo"]].name;
                        var no = list[i]["bankAccount"];
                        var no4 = no.substring(no.length-4,no.length);
                        obj.nameShot = obj.name + "(尾号" + no4 + ")";
                        obj.pic = banks[list[i]["bankNo"]].str;
                        temp.push(obj);
                    }

                }
                this.list = temp;
                //理财信息存入store
                this.getLiCaiInfo([this.list,this.user]);
                this.message=res.message.message;
            },
            async getCardList(){
                this.showLoading=true;
                    this.getWealthUserAccount();
            },
            goToDetail(bankNo,bankAccount,encryptedBankAccount){
                this.$router.push({path:'/myBankDetail',query:{bankNo:bankNo,bankAccount:bankAccount,encryptedBankAccount:encryptedBankAccount}});
            }

        },

        watch : {

        },

        created : function() {
            this.wealthUserId=localStorage.getItem("userId");
            this.token= localStorage.getItem("token");
            this.initData();
            console.log(this.userFspInfo.useType);
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";

    dl{
        @include _dl(8em);
    }
</style>
