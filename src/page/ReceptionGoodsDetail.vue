<!--/*************************************************************************/-->
<!--/***************************       收货详情       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div v-show="!this.$router.showLoading">

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">收货详情</div>
            <i></i>
        </header>

        <div class="receptionGD">
            <ul v-load-more="loaderMore" v-if="productLists.length" type="1">
                <li v-for="good in productLists">
                    <div v-for="address in good.data">
                        <h3>{{address.goods_name}}</h3>
                        <dl>
                            <dd>
                                <p>出库单价</p>
                                <h4><span>￥</span>{{address.goods_price}}</h4>
                            </dd>
                            <dd>
                                <p>出库数量</p>
                                <h4>{{address.delivery_num}}<span>吨</span></h4>
                            </dd>
                            <dd>
                                <p>出库金额</p>
                                <h4><span>￥</span>{{address.goods_amt}}</h4>
                            </dd>
                        </dl>
                    </div>
                    <div class="btn_small">
                        <a class="btn_blue" v-if="good.status == 10" @click="receiveGoods(good)">确认收货</a>
                        <p else>{{good.status_desc}}&nbsp;&nbsp;{{good.time}}</p>
                    </div>
                </li>
            </ul>
            <a id="pullUp" class="a_ddLoad" v-show="preventRepeatReuqest"><span class="pullUpLabel">加载更多...</span></a>
        </div>
        <loading v-show="showLoading"></loading>

    </div>
</template>

<script>
    import util from '../lib/util'
    import loading from '../components/loading'
    import { b2bService } from '../service'
    import {loadMore} from '../components/mixin'

    export default {
        name: 'index',
        data () {
            return {
                titleWidth: 300,
                preventRepeatReuqest: false,
                currentPage: 0,
                productLists: [],
                showLoading: false,
                pageSize: 10
            }
        },
        mounted(){
            this.windowHeight = window.innerHeight;
            this.titleWidth = window.innerWidth - 80;
        },
        components: {
            loading
        },
        computed: {},

        methods: {
            receiveGoods: function () {

            },
            goback () {
                this.$router.goBack()
            },

            //返回顶部
            backTop(){
                animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
            },

            async loaderMore(){
                //防止重复请求
                if (this.preventRepeatReuqest) {
                    return
                }
                this.preventRepeatReuqest = true;
                this.currentPage++;
                this.getList();
            },

            async getList () {
                this.showLoading = true;
                let _parmas = {
                    page:this.currentPage + 1,
                    pageSize:this.pageSize
                };
                let res = await b2bService.getReceptionGoodsList(_parmas);

                this.showLoading = false;
                this.preventRepeatReuqest = false;
                if (res.result == 0) {
                    return;
                }
                let list = res['data'];
                if (list[0] && list[0]['currentPageNo'] > this.currentPage) {
                    this.productLists = this.productLists.concat(list)
                } else {
                    this.productLists = list
                }

            },

            async initData(){
                this.getList()
            }
        },

        mixins: [loadMore],

        created: function () {
            this.initData();
        },

        filters: {
            money: function (value) {
                return util.price(value)
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_button";
    @import '../assets/components/yy_load';

    .receptionGD {
        margin-top: $headH;
        li {
            background: $white;
            margin-bottom: $spaceV;

            h3 {
                font-size: 0.875em;
                line-height: 1.286em;
                padding: 1em 0.714em 0.857em;
            }
            dl {
                background: $gray_white2;
                display: -moz-flex;
                display: -webkit-flex;
                display: flex;
                padding: 0.5em 0 0.813em $spaceV;

                dd {
                    width: 33.33%;

                    /*&:last-child{*/
                    /*-moz-flex-grow:1.5;*/
                    /*-webkit-flex-grow:1.5;*/
                    /*flex-grow:1.5;*/
                    /*}*/
                    p {
                        color: $gray;
                        font-size: 0.875em;
                        line-height: 1.643em;
                    }
                    h4 {
                        line-height: 1.438em;
                        span {
                            font-size: 0.75em;
                        }
                    }
                    &:nth-child(2) h4 span {
                        margin-left: 0.125em;
                    }
                    &:nth-child(3) h4 {
                        color: $red;
                    }
                }
            }
            .btn_small {
                padding: 0.429em $spaceV;
                text-align: right;

                p {
                    font-size: 0.875em;
                    line-height: 2.286em;
                }
            }
        }
    }


</style>
