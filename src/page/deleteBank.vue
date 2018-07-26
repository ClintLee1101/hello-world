
<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">删除银行卡</div>
            <a class="edit"></a>
        </header>

        <div class="spaceHT">
            <dl v-for="el in list" v-show="el.bankNo==bankNo">
                <img :src="'https://klt.china-lin.com/static/assets/images/bank/logo_'+el.pic+'.jpg'">
                <span>{{el.nameShot}}</span>
            </dl>
        </div>
        <div class="newAdd" style="margin-top:0">
            <ul>
                <li>
                    <span>交易密码</span>
                    <input type="password" v-model="payPwd" placeholder="输入交易密码">
                    <i class="icon-emptied" v-show="payPwd" v-on:click="clearText('payPwd')"></i>
                </li>

            </ul>
        </div>

        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box boxTxt">
                <div class="txt">
                    确认要删除所选银行卡吗？
                </div>
                <ul class="btn">
                    <li @click="hideAlert">取消</li>
                    <li @click="trueDeleteAdd">确认</li>
                </ul>
            </div>
        </div>

        <footer class="col" @click="deleteIt()">
            <a>删除</a>
        </footer>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip';
    import {banks} from '../service/bankList';
    import {
        licaiService
    } from '../service'
    import { mapState, mapActions, mapMutations } from 'vuex';
    import util from '../lib/util';

    export default {
        name: 'about',
        components: {
            alertTip
        },
        data () {
            return {
                ifAlert: false,
                isEdit: false,
                showNotice: false,
                payPwd: '',
                mobile: '',
                options: '',
                bankNo:'',
                bankAccount:'',
                list:[],
                wealthUserId:'',
                token:'',
                params:{},
            }
        },
        computed : {
            ...mapState([
                'licaiInfo'
            ]),
        },
        ...mapActions([
            'getLiCaiInfo',
        ]),
        methods: {

            //关闭弹框
            close(){
                this.showNotice = false;
            },
            async deleteAdd(){

                let data = {
                    client: 'website',
                    uid: this.wealthUserId,
                    token: this.token,
                    version: '5.18.0',
                    appkey: 'jh4a045c200bb38c90',
                    timestamp:new Date().getTime(),
                    bankNo: this.bankNo,
                    bankAccount: this.encryptedBankAccount,
                    password:this.payPwd
                }
//                this.params = util.getSignParams(data,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481',new Date().getTime());
                console.log(this.params);

                let res=await licaiService.deleteBankCard(data);
                if(res.code==0){
                    this.$router.push({path:'/MyBankList'})
                }else{
                    this.showNotice = true;
                    this.options = res.message.message;
                }
            },

            clearText (tag){
                this[tag] = '';
            },

            async deleteIt(){

                if (this.payPwd == '') {
                    this.showNotice = true;
                    this.options = '请填写交易密码';
                    return;
                }else{
                    this.deleteAdd();
                }



            },
            goback () {
                this.$router.goBack()
            },

            hideAlert: function () {
                this.ifAlert = false;
            },
            trueDeleteAdd() {
                this.deleteAdd();
            },

        },
        created() {
            this.wealthUserId=localStorage.getItem("userId");
            this.token= localStorage.getItem("token");
            this.bankNo=this.$route.query.bankNo;
            this.bankAccount=this.$route.query.bankAccount;
            this.encryptedBankAccount=this.$route.query.encryptedBankAccount;
            this.list=this.licaiInfo[0];
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/layout/yy_footer";
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_cover";
    @import '../assets/pages/yy_new_edit';

    .newAdd {
    @include _edit_list;
        margin-top: $headH;
    }
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

