<!--/*************************************************************************/-->
<!--/***************************      我的账户-借款   *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header class="bg_blue">
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">我的借款</div>
            <i></i>
        </header>

        <div class="accLoan01">
            <p>借款总额（元）</p>
            <h3>{{userFundInfo.loanNowTot | money}}</h3>
            <ul>
                <li>
                    <h6>应还总额(元)</h6>
                    <h4>{{userFundInfo.repayTot | money}}</h4>
                </li>
                <li>
                    <h6>逾期总额(元)</h6>
                    <h4>{{userFundInfo.overdueTot | money}}</h4>
                </li>
            </ul>
        </div>

        <nav>
            <div v-for="(item,index) in typeList" @click="selectType(index)" :class="{on:active===index}">
                <span>{{item.name}}</span></div>
        </nav>

        <div class="link_half"></div>
        <div class="accLoan03">
            <div v-if="active === 0" class="content" style="display:block;">
                <ul v-for="el in applyList">
                    <li><span>订单编号：</span><span>{{el.orderNo}}</span></li>
                    <li><span>申请总额：</span><span class="t_red">{{el.total | money}}</span></li>
                    <li>
                        <div class="col_1"><span>年利率：</span><span>{{el.rate}}%</span></div>
                        <div class="col_2"><span>还款方式：</span><span>{{el.repayWay | wayConvert}}</span></div>
                    </li>
                    <li>
                        <div class="col_1"><span>申请时间：</span><span>{{el.createAt | timeConvert}}</span></div>
                        <div class="col_2"><span>状态：</span><span class="t_red">{{el.status | statusConvert}}</span>
                        </div>
                    </li>
                    <li class="li_btn" ms-visible="el.status==2"><a><span>审核通过时间：</span><span>{{el.updateAt | timeConvert}}</span><!--<b>缴纳保证金</b>--></a>
                    </li>
                </ul>
            </div>
            <div v-if="active === 1" class="content" style="display:block;">
                <ul v-for="el in repayList">
                    <li><span>订单编号：</span><span>{{el.orderNo}}</span></li>
                    <li><span>借款总额：</span><span class="t_red">{{el.debtCount | money}}</span></li>
                    <li>
                        <div class="col_1"><span>借款利息：</span><span>{{(el.supposeRepay - el.debtCount) | money}}</span>
                        </div>
                        <div class="col_2"><span>计息日：</span><span>{{el.debtAt | timeConvert}}</span></div>
                    </li>
                    <li>
                        <div class="col_1"><span>借款期限：</span><span>{{el.repayLine}}天</span></div>
                        <div class="col_2"><span>预期还款：</span><span class="t_red">{{el.supposeRepay | money}}</span>
                        </div>
                    </li>
                    <li class="li_btn"><a><span>到期时间：</span><span>{{el.overAt | timeConvert}}</span><!--<b>还款</b>--></a>
                    </li>
                </ul>
            </div>
            <div v-if="active === 2" class="content" style="display:block;">
                <ul v-for="el in timeList">
                    <li><span>订单编号：</span><span>{{el.orderNo}}</span></li>
                    <li><span>罚息利率：</span><span>{{el.overRate}}%</span></li>
                    <li>
                        <div class="col_1"><span>借款本息：</span><span class="t_red">{{el.totalRepay | money}}</span></div>
                        <div class="col_2"><span>罚息：</span><span>{{el.overRepay | money}}</span></div>
                    </li>
                    <li>
                        <div class="col_1"><span>逾期天数：</span><span>{{el.dayCount}}天</span></div>
                        <div class="col_2"><span>待还总额：</span><span
                                class="t_red">{{(el.totalRepay + el.overRepay) | money}}</span></div>
                    </li>
                    <li class="li_btn"><a><span>到期时间：</span><span>{{el.overAt | timeConvert}}</span><!--<b>还款</b>--></a>
                    </li>
                </ul>
            </div>
            <div v-if="active === 3" class="content" style="display:block;">
                <ul v-for="el in clearList">
                    <li><span>订单编号：</span><span>{{el.orderNo}}</span></li>
                    <li>
                        <div class="col_1"><span>利息：</span><span>{{el.clearInte | money}}</span></div>
                        <div class="col_2"><span>罚息：</span><span>{{el.clearOverInte | money}}</span></div>
                    </li>
                    <li><span>借款总额：</span><span class="t_red">{{el.debtCount | money}}</span></li>
                    <li><span>还款金额：</span><span class="t_red">{{(el.debtCount + el.clearInte + el.clearOverInte) | money}}</span>
                    </li>
                    <li><span>还款时间：</span><span>{{el.clearAt | timeConvert}}</span></li>
                </ul>
            </div>
            <div class="clear_float"></div>
        </div>

    </div>
</template>

<script>
    import { fspService } from '../service'
    import {mapState, mapActions} from 'vuex'
    import util from '../lib/util';
    export default {
        name: 'myAccount',
        filters: {
            money: function (value) {
                return value
            }
        },
        data () {
            return {
                active: 0,
                timeList: [],
                clearList: [],
                repayList: [],
                applyList: [],
                typeList: [
                    {name: '申请中', type: 'timeList'},
                    {name: '还款中', type: 'clearList'},
                    {name: '逾期', type: 'repayList'},
                    {name: '已还清', type: 'applyList'}],
            }
        },
        computed: {
            ...mapState([
                'userFspInfo',
                'userFundInfo'
            ]),
        },

        methods: {
            ...mapActions([]),
            goback () {
                this.$router.goBack()
            },
            selectType(ind){
                this.active = ind;
            },
            allOrder: function () {
                this.$router.push({path: '/orderList'})
            },
            gotoOrderByStatus: function (status) {
                this.$router.push({path: '/orderList', query: {status: status}})
            },
            async initData(){
                let res = await fspService.getMyLoanList({type:'apply'});
                this.applyList = res.data;
                let res1 = await fspService.getMyLoanList({type:'repay'});
                this.repayList = res1.data;
                let res2 = await fspService.getMyLoanList({type:'over/time'});
                this.timeList = res2.data;
                let res3 = await fspService.getMyLoanList({type:'clear'});
                this.clearList = res3.data;
            }
        },
        created: function () {
            this.initData();
        },
        filters: {
            money: function (value) {
                return util.price1(value)
            },
            wayConvert: function (num) {
                if (1) {
                    return "一次性还本付息";
                } else {
                    return "账户余额";
                }
            },
            statusConvert: function (value) {
                switch (value) {
                    case 0:
                        return "审核中";
                        break;
                    case 1:
                        return "初审通过";
                        break;
                    case 2:
                        return "终审通过";
                        break;
                    case 3:
                        return "";
                        break;
                    case 4:
                        return "还款中";
                        break;
                    case 5:
                        return "逾期";
                        break;
                    case 6:
                        return "已还清";
                        break;
                    case 7:
                        return "终审拒绝";
                        break;
                    case 8:
                        return "初审拒绝";
                        break;
                    case 9:
                        return "取消借款";
                        break;
                }
            },

            timeConvert: function (value) {
                if (value === "" || value == null) {
                    return ""
                } else {
                    return util.getTimeStr(value);
                }
            },

            dayConvert: function (value) {
                if (value === "" || value == null) {
                    return ""
                } else {
                    return Math.ceil(value / 1000 / 3600 / 24);
                }
            }
        },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/components/yy_nav';
    @import "../assets/components/yy_button";

    nav{
        &:after{
            height: 0;
        }
    }

    .accLoan01 {
        @include _bg_blue2;
        text-align: center;
        padding: $headH + 0.813rem 0 1.563rem;

        h3 {
            font-size: 1.875rem;
            line-height: 2.688rem;
            margin-bottom: 2.438rem;
        }
        ul {
            display: -moz-flex;
            display: -webkit-flex;
            display: flex;

            li {
                -moz-flex-grow: 1;
                -webkit-flex-grow: 1;
                flex-grow: 1;

                h4{
                    font-size: 1.25rem;
                    line-height: 2.188rem;
                }
            }
        }
    }

    .accLoan03 {
        padding-bottom: $spaceV;//1.563em;

        .content {
            display: none;
        }
        ul {
            background-color: #fff;
            margin-top: 0.625em;
        }
        li {
            clear: both;
            font-size: 0.875em;
            line-height: 1.929em;
            height: 1.929em;
            padding: 0 0.625em;

            &:nth-child(1) {
                padding-top: 0.714em;
            }
            &:last-child {
                padding-bottom: 0.643em !important;
            }
            span, .col_1, .col_2 {
                float: left;
            }
            .col_1, .col_2 {
                width: 50%;
            }

            &.li_btn, .li_btn b {
                line-height: 2.286em;
                height: 2.286em;
            }
            &.li_btn {
                @include _linkTop_half;
                padding: 0.643em 0.625em 0;
                margin-top: 0.857em;
                a {
                    color: $gray;
                }
                b{
                    float: right;
                    width: 6em;
                }
            }
        }
    }
</style>
