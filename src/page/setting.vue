<!--/*************************************************************************/-->
<!--/***************************        设置         *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header class="bg_red">
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">账户设置</div>
            <i></i>
        </header>

        <div class="set">
            <img v-bind:src="img33">
            <p>{{userFspInfo.name}}</p>
            <h6>{{userFspInfo.mobile | mobile}}</h6>
            <label v-show="userFspInfo.type == '1'">{{userFspInfo.verifyStatus | verifyConvert}}</label>
            <label v-show="userFspInfo.type != '1'">{{userFspInfo.authStatus | authStatusConvert}}</label>
        </div>

        <ul>
            <li>
                <router-link :to="{path: '/accountUserInfo'}">
                    <i class="icon-set01"></i>
                    <h5>账户信息</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
            <li>
                <router-link :to="{path: '/MyBankList'}">
                    <i class="icon-set03"></i>
                    <h5>我的银行卡</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
            <li>
                <router-link :to="{path: '/address?from=manager'}">
                    <i class="icon-cart"></i>
                    <h5>我的收货地址</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
            <li>
                <router-link :to="{path: '/invoiceList?from=manager'}">
                    <i class="icon-set04"></i>
                    <h5>我的发票信息</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
            <li>
                <router-link :to="{path: '/Carriage?from=manager'}">
                    <i class="icon-set07"></i>
                    <h5>我的承运信息</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
        </ul>

        <ul>
            <!--<li>-->
                <!--<router-link :to="{path: '/changePhone'}">-->
                    <!--<i class="icon-phone"></i>-->
                    <!--<h5>修改登录手机号</h5>-->
                    <!--<b class="icon-arrowR"></b>-->
                <!--</router-link>-->
            <!--</li>-->
            <li>
                <router-link :to="{path: '/changePass'}">
                    <i class="icon-pwd"></i>
                    <h5>修改登录密码</h5>
                    <b class="icon-arrowR"></b>
                </router-link>
            </li>
            <!--<li>-->
                <!--<router-link :to="{path: '/transactionPass'}">-->
                    <!--<i class="icon-set05"></i>-->
                    <!--<h5>重置交易密码</h5>-->
                    <!--<b class="icon-arrowR"></b>-->
                <!--</router-link>-->
            <!--</li>-->
        </ul>

        <ul>
            <li>
                <a @click="goToRisk">
                    <i class="icon-set06"></i>
                    <h5>风险评测</h5>
                    <span>{{userFspInfo.risk|riskStatus}}</span>
                    <b class="icon-arrowR"></b>
                </a>
            </li>
        </ul>

        <div class="btn_submit">
            <a @click="logOut()">退出</a>
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'about',
        data () {
            return {
                img33: require('../../static/images/klImg-33.png'),
            }
        },
        computed: {
            ...mapState([
                'isLogin',
                'userFspInfo'
            ])
        },
        methods: {
            ...mapActions([
                'userLogout'
            ]),
            goback () {
//                this.$router.goBack()
                this.$router.push({path: 'home/myAccount'})

            },

            async initData(){
            },

            logOut(){
                localStorage.clear();
//                webview和ios清除cookie
                cookieMaster.clearCookies(
//                    function() {
//                        alert('Cookies have been cleared');
//                    },
//                    function() {
//                        alert('Cookies could not be cleared');
//                    }
                    );
//                crosswalk清除cookie
                window.cookies.clear(function() {
//                    alert('Cookies cleared!');
                });
                this.userLogout();
            },
            goToRisk(){
                if (this.userFspInfo.risk == 0) {
                    this.$router.push({path: '/myAccountRiskQuestion'})
                } else {
                    this.$router.push({path: '/myAccountRisk'})
                }
            },
        },
        created() {
        },
        filters: {
            mobile: function (value) {
                if (!value) return "";
                return value.substring(0, 3) + "****" + value.substring(8, 11);
            },
            riskStatus: function (value) {
                switch (value) {
                    case 0:
                        return '未评测'; //0：未评测 1:进取型 2：成长型 3：平衡型 4：稳健型 5：保证型
                        break;
                    case 1:
                        return '进取型';
                        break;
                    case 2:
                        return '成长型';
                        break;
                    case 3:
                        return '平衡型';
                        break;
                    case 4:
                        return '稳健型';
                        break;
                    case 5:
                        return '保证型';
                        break;
                }
            },
            verifyConvert:function (value) {
                if(value == 1){
                    return "已认证";
                }else{
                    return "未认证";
                }
            },
            authStatusConvert:function (value) {
                if(value == 1){
                    return "实名已认证";
                }else{
                    return "实名未认证";
                }
            }
        },
        watch: {
            isLogin: function (value) {
                if (!value) {
                    this.$router.push({path: '/home/index'})
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/components/yy_list';
    @import '../assets/components/yy_button';

    $imgW: 4.375rem;

    .set {
        @include _bg_red2;
        margin-top: $headH;
        text-align: center;
        padding: 1.25rem 0 1.875rem;

        img{
            width: $imgW;
            height: $imgW;
            margin: 0 auto;
        }
        p {
            color: $yellow;
            margin-top: 0.563rem;
        }
        label {
            background: $yellow;
            -moz-border-radius: 0.375rem;
            -webkit-border-radius: 0.375rem;
            border-radius: 0.375rem;
            color: $red2;
            display: inline-block;
            font-size: 0.75rem;
            line-height: 0.938rem;
            height: 0.938rem;
            margin-top: 0.5rem;
            padding: 0 0.75rem;
        }
    }

    ul{
        @include _ul;
        a{
            @include _li;
        }
    }
</style>
