<!--/*************************************************************************/-->
<!--/***************************      我的账户-余额   *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">我的账户</div>
            <i></i>
        </header>


        <div class="myAMD">
            <div class="box">
                <strong>
                    <i class="icon-my12"></i>
                    <span>在途资金</span>
                    <em>{{userFundInfo.wayFund | money}}元</em>
                </strong>
            </div>
            <div class="box">
                <strong>
                    <i class="icon-my13"></i>
                    <span>开磷线上账户</span>
                    <em>{{userFundInfo.balance | money}}元</em>
                </strong>
            </div>
            <div class="box" @click="showUnderLineDetail = !showUnderLineDetail">
                <strong>
                    <i class="icon-my14"></i>
                    <span>开磷线下账户</span>
                    <em>{{userFundInfo.relations | totalMoney | money}}元</em>
                </strong>
                <b :class="showUnderLineDetail?' icon-arrowT':'icon-arrowB'"></b>
            </div>
            <ul v-if="showUnderLineDetail">
                <li v-for="item in userFundInfo.relations">
                    <em>{{item.accountCode | companyConvert}}</em>
                    <span>{{item.money | money}}元</span>
                </li>
            </ul>
        </div>


<!--
            <ul>
                <li @click="showUnderLineDetail = !showUnderLineDetail">

                    <em><i class="icon-my14"></i>开磷线下账户</em>
                    <em>{{userFundInfo.relations | totalMoney | money}}元
                        <i :class="showUnderLineDetail?'i_down icon-arrowT':'icon-arrowB'"></i></em>

                </li>
                <ul v-if="showUnderLineDetail">
                    <li v-for="item in userFundInfo.relations">
                        <span>{{item.accountCode | companyConvert}}</span>
                        <span>{{item.money | money}}元</span>
                    </li>
                </ul>
            </ul>
-->

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import util from '../lib/util';

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
                'userFundInfo'
            ])
        },
        methods: {
            goback () {
                this.$router.goBack()
            },

            async initData(){
            },
        },
        created() {
        },
        filters: {
            money: function (value) {
                return util.price1(value)
            },
            totalMoney: function (value) {
                let money = 0;
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    value.forEach(item => {
                        money += Number(item.money)
                    })
                }
                return money;
            },
            companyConvert: function (str) {
                return util.companyConvert(str)
            }
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";

    .myAMD{
        margin-top: $headH + $spaceV;

        .box{
            background: $white;
            display:-moz-flex;
            display:-webkit-flex;
            display:flex;
            justify-content: space-between;
            font-size: 0.875rem;
            line-height: 3.125rem;
            padding: 0 $spaceLR;
            margin-top: $spaceV;

            b, i{
                font-size: 1.188rem;
            }
            span{
                margin: 0 1rem 0 0.5rem;
            }
            em{
                color: $red;
            }
            strong, b{
                display:-moz-flex;
                display:-webkit-flex;
                display:flex;
                align-items: center;
            }
        }

        ul{
            @include _ul;
            @include _linkTop_half;
            margin-top: 0;

            li {
                @include _li;
                padding: 0;
                margin: 0 $spaceLR;

                em, span{
                    font-size: 0.75rem;

                }
                em{
                    margin-right: 1.125rem;
                }
            }
        }
    }
</style>
