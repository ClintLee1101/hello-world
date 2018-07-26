<!--/*************************************************************************/-->
<!--/***************************       电商-首页      *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <i class="logo icon-logo">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span>
            </i>
            <!--<div class="box_input magnifierSearch">-->
            <div class="box_input">
                <a class="find icon-find" @click="search()"></a>
                <!--<input class="input" id="inpTxt" placeholder="磷肥" required><a class="clear" onClick="clearText()"></a>-->
                <form id="searchForm" @submit="search1()" action="" enctype='applicaion/json'>
                    <input type="search" class="input" placeholder="磷肥" required v-model="keyword">
                </form>
                <iframe style="display: none" id="rfFrame"  name="rfFrame" src="about:blank"></iframe>
                <i @click="clear()" class="icon-emptied"></i>
            </div>
            <a class="cart" :class="cartNum>0?'icon-cart2':'icon-cart'" @click="gotoCart"><b
                    :class="cartNum>0?'':'hide'"></b></a>
        </header>

        <div style="margin-top: 2.35em">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><img src="../../static/images/index01-min.jpg"></div>
                    <div class="swiper-slide"><img src="../../static/images/index02-min.jpg"></div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <div class="index_01" v-if="isLogin">
            <li><i class="icon-index1"></i><h5>厂家直销</h5></li>
            <li><i class="icon-index2"></i><h5>专业农化</h5></li>
            <!--<li><p>{{userType===0?'灵活理财':'融资便捷'}}</p></li>-->
        </div>

        <div class="col_wrap">
            <div class="index_list" v-for="type in goods">
                <div class="hd">
                    <div class="mh_title">{{type.cat.name}}</div>
                    <router-link :to="{path: '/goodsList', query:{cat_id: type.cat.cat_id}}" class="mh_option">更多<i
                            class="icon-arrowR"></i></router-link>
                </div>
                <ul>
                    <li v-for="good in type.goods" @click="goGoodsDetail(good.goods_id)" class="">
                        <img v-bind:src="good.small!=''?good.small:noImg">
                        <h5>{{good.name}}</h5>
                        <!--价格登录后可见的三种样式-->
                        <p v-if="isLogin" class="t_price"><span v-if="good.price === 0">价格获取中</span><span
                                v-if="good.price !== 0">￥</span><em
                                v-if="good.price !== 0">{{good.price | money}}</em><span></span></p>
                        <h6 v-if="!isLogin" class="t_price"><span>价格登录后可见</span></h6>
                    </li>
                </ul>
            </div>
        </div>
        <loading v-show="showLoading"></loading>

        <!--<transition name="router-fade" mode="out-in">-->
        <!--&lt;!&ndash;<keep-alive>&ndash;&gt;-->
        <!--<router-view></router-view>-->
        <!--&lt;!&ndash;</keep-alive>&ndash;&gt;-->
        <!--</transition>-->

    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import{
        GlobelObj
    } from '../components/Global.vue'
    import Swiper from '../components/swiper-3.4.2.min'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import loading from '../components/loading'
    import { b2bService } from '../service'
    import util from '../lib/util'

    export default {
        name: 'index',
        data () {
            return {
                keyword: '',
                hasGoods: 'hide',
                showMore: false,
                priceList: [],
                showLoading: false,
                goods_sns: '',
                noImg: require('../../static/images/noImg.png'),
                goods: [],
                lbt: [
                    {
                        'imgs': require('../../static/images/index01-min.jpg')
                    }, {
                        'imgs': require('../../static/images/index02-min.jpg')
                    }
                ]
            }
        },
        components: {
            loading,
        },
        computed: {
            ...mapState([
                'isLogin', 'cartNum'
            ]),
        },
        methods: {
            //轮播图
            clear () {
                this.keywords = "";
            },
            initLunbo () {
                var mySwiper = new Swiper('.swiper-container', {
                    autoplay: 3000,//可选选项，自动滑动
                    pagination: '.swiper-pagination',
                    paginationType: 'bullets',
                    paginationClickable: true,
                })
            },
            ...mapMutations([
                'GET_CARTLIST'
            ]),
            ...mapActions([
                'getUserFSPInfo',
                'getUserFundInfo'
            ]),
            goGoodsDetail: function (id) {
                this.$router.push({path: '/goodsDetail/' + id})
            },
            gotoCart: function () {
                if (this.isLogin) {
                    this.$router.push({path: '/cartStore'})
                } else {
                    this.$router.push({path: '/login'})
                }
            },

            search: function () {
                if (this.keyword == "") {
                    this.keyword = "磷肥";
                }
                this.keyword = this.keyword.trim();
                this.$router.push({path: '/goodsList?keywords=' + this.keyword})
            },
            search1: function () {
                if (this.keyword == "") {
                    this.keyword = "磷肥";
                }
                document.forms[0].target="rfFrame";
                this.keyword = this.keyword.trim();
                document.getElementById("searchForm").blur()
                this.$router.push({path: '/goodsList?keywords=' + this.keyword})
                return false;
            },
            async getPrice() {
                if (this.goods_sns == "") return
                let data={
                    goods_sns:this.goods_sns
                }
                let res = await b2bService.getPrice(data);
                this.priceList = res
                if(this.priceList.length > 0){
                    this.priceList.forEach(priceItem => {
                        this.goods.forEach(item => {
                            item.goods.forEach(goodItem => {
                                if (goodItem.sn === priceItem.goods_code) {
                                    goodItem.price = priceItem.goods_price
                                }
                            })
                        })
                    })
                }

            },

            async getList() {
                this.showLoading = true;

                let res = await b2bService.getIndexList();
                if (res.result != 1) return;

                this.showLoading = false;
                let data = res.data;
                let sns = ''


                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j <= data[i].goods.length - 1; j++) {
                        sns += ',' + data[i].goods[j].sn
                        data[i].goods[j].goods_price = 0
                        if (data[i].goods[j].small !== '') {
                            //            data.data[i].goods[j].small = img + data.data[i].goods[j].small
                        }
                    }
                }
                this.goods_sns = sns.substr(1, sns.length - 1);
                console.log(this.goods_sns)
                this.goods = data
                if (this.isLogin) {
                    this.getPrice();
                }
            }

        },

//    这里mounted和created生命周期函数区别
        created: function () {

//      this.showLoading = true
            this.getList();

        },

        filters: {
            money: function (value) {
                return util.price(value)
            }
        },
        mounted () {
            this.initLunbo()
        },
        watch: {
            isLogin: function (value) {
                if (value) {
                    this.getPrice();
                } else {
                    this.$router.push({path: '/home/index'})
                }
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import url("../components/swiper-3.4.2.min.css");
    @import '../assets/components/yy_imglist';
    @import '../assets/pages/yy_index';

    /*.swiper-pagination-bullet-active {*/
    /*opacity: 1;*/
    /*background: #fefffd;*/
    /*}*/
</style>
