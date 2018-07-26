<!--/*************************************************************************/-->
<!--/************************      设置 - 账户信息       **********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">账户信息</div>
            <i></i>
        </header>

        <div class="spaceHT">
            <dl>
                <dt>账户类型：</dt>
                <dd>{{userFspInfo.type == '1' ? '机构账户' : '个人账户'}}</dd>
            </dl>
            <dl>
                <dt>联系人手机：</dt>
                <dd>{{userFspInfo.mobile}}</dd>
            </dl>
            <dl>
                <dt>客户名称：</dt>
                <dd>{{userFspInfo.name}}</dd>
            </dl>
            <dl v-show="userFspInfo.type == 1 && orgInfo.type == 1">
                <dt>组织机构代码：</dt>
                <dd>{{orgInfo.orgCode}}</dd>
            </dl>
            <dl v-show="userFspInfo.type == 1 && orgInfo.type == 1">
                <dt>营业执照号：</dt>
                <dd>{{orgInfo.licenceCode}}</dd>
            </dl>
            <dl v-show="userFspInfo.type == 1 && orgInfo.orgType == 2">
                <dt>统一社会信用代码：</dt>
                <dd>{{orgInfo.creditCode}}</dd>
            </dl>
            <dl class="btn" v-show="userFspInfo.type == 1">
                <dt>机构状态：</dt>
                <dd>{{orgInfo.status|statusConvert}}</dd>
                <a v-show="orgInfo.status != 2 && orgInfo.status != 1" class="btn_red" @click="bindBank()">重新上传</a>
            </dl>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import util from '../lib/util';
    import{
        GlobelObj
    } from '../components/Global.vue'
    export default {
        name: 'about',
        data () {
            return {
                showUnderLineDetail: false,
                wayFund: '',
                balance: '',
                relations: '',
                ifAlert: false,
                addressList: [],
            }
        },
        computed: {
            ...mapState([
                'userFspInfo',
                'orgInfo'
            ])
        },
        methods: {
            goback () {
                this.$router.goBack()
            },

            async initData(){
            },

            bindBank(){
                GlobelObj.mobile=this.userFspInfo.mobile;
                this.$router.push({path:'/orgOpenAccount?from=active'})
            },
        },
        created() {
        },
        filters: {
            statusConvert: function (value) {
                if(value == 1){
                    return "待审核"
                }
                if(value == 2){
                    return "审核通过"
                }
                if(value == 3){
                    return "审核驳回"
                }
                if(value == 4){
                    return "未认证"
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
    dl{
        @include _dl(8rem);
    }

</style>
