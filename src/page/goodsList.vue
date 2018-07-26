<!--/*************************************************************************/-->
<!--/***************************       电商-列表      *************************/-->
<!--/*************************************************************************/-->

<template>
    <div v-show="!this.$router.showLoading">

        <header>
            <a class="arrowBack icon-arrowL" @click="goback"></a>
            <div class="box_input">
                <a class="find icon-find" @click="search()"></a>
                <form id="searchForm1" action="" @submit="search1()" enctype='applicaion/json'>
                    <input type="search" class="input" placeholder="磷肥" v-model="keywords" required>
                </form>
                <iframe style="display: none" id="rfFrame"  name="rfFrame" src="about:blank"></iframe>
                <a class="clear icon-emptied" onClick="clearText()"></a>
            </div>
            <a class="cart" :class="cartNum>0?'icon-cart2':'icon-cart'" @click="gotoCart"><b
                    :class="cartNum>0?'':'hide'"></b></a>
            <div class="link_half"></div>
        </header>

        <nav class="scroll">
            <div class="slider_wrap">
                <div class="container">
                    <div v-for="menu in menuList" @click="menuClick(menu.cat_id)" class="item_cell"
                         :class="menu.isActive"><span>{{menu.name}}</span></div>
                </div>
            </div>
        </nav>

        <div class="md_list">
            <ul class="listbox" v-if="productLists.length" type="1">
                <li v-for="good in productLists" @click="goGoodsDetail(good.goods_id)">
                    <img v-bind:src="good.small!=''?good.small:noImg">
                    <h5>{{good.name}}</h5>
                    <!--价格登录后可见的三种样式-->
                    <p v-if="isLogin" class="t_price"><span v-if="good.price === 0">价格获取中</span><span
                            v-if="good.price !== 0">￥</span><em
                            v-if="good.price !== 0">{{good.price | money}}</em><span></span></p>
                    <h6 v-if="!isLogin" class="t_price"><span>价格登录后可见</span></h6>
                </li>
            </ul>
            <!--<a id="pullUp" class="a_ddLoad" v-show="preventRepeatReuqest"><span class="pullUpLabel">加载更多...</span></a>-->
        </div>
        <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more">
                没有更多数据了
            </span>
        </infinite-loading>
        <!--<loading v-show="showLoading"></loading>-->
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import util from '../lib/util'
//    import loading from '../components/loading'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import { b2bService } from '../service'
//    import {loadMore} from '../components/mixin'

    export default {
        name: 'index',
        data () {
            return {
                //titleWidth:300,
                preventRepeatReuqest: false,
                menuList: [],
                priceList: [],
                cat_id: '1',
                keywords: '',
                goods_sns: '',
                currentPage: 0,
                hasNextPage: true,
                noImg: require('../../static/images/noImg.png'),
                productLists: [],
                priceListOld: [],
                showLoading: false,
                pageSize: 10
            }
        },
        mounted(){
            this.windowHeight = window.innerHeight;
            this.titleWidth = window.innerWidth - 80;
        },
        components: {
            InfiniteLoading,
//            loading
        },
        computed: {
            ...mapState([
                'isLogin', 'cartNum'
            ]),
        },

        methods: {
            ...mapActions([
                'getUserCartList'
            ]),
            ...mapMutations([
                'GET_CARTLIST'
            ]),
            onInfinite ($state) {
                setTimeout(() => {
                    this.loaderMore();
//                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
                    $state.loaded();
                }, 1000)
                if ( !this.hasNextPage) {
//                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    $state.complete()
                }
            },


            goGoodsDetail: function (id) {
                this.$router.push({path: '/goodsDetail/' + id})
            },
            goback () {
                this.$router.goBack()
            },
            menuClick: function (id) {
                this.keywords = "";
                this.cat_id = id;
                this.currentPage = 0;
                this.productLists = []
                this.getList();
            },
            gotoCart: function () {
                if (this.isLogin) {
                    this.$router.push({path: '/cartStore'})
                } else {
                    this.$router.push({path: '/login'})
                }
            },

            search: function () {
                if (this.keywords) {
                    this.keywords = this.keywords.trim();
                }
                this.getList();
            },
            search1: function () {
                if (this.keywords) {
                    this.keywords = this.keywords.trim();
                }
                this.getList();
                document.forms[0].target="rfFrame";
                document.getElementById("searchForm1").blur()
                return false;
            },
            //返回顶部
            backTop(){
                animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
            },

            async loaderMore(){
                //防止重复请求

                if (this.preventRepeatReuqest || !this.hasNextPage) {
                    return
                }
//                this.showLoading = true;
                this.preventRepeatReuqest = true;
                this.currentPage++;
                this.getList();
            },

            async getPrice() {
                if (this.goods_sns == "") return
                let res = await b2bService.getPrice({goods_sns:this.goods_sns});
                this.priceList = res

                let goods = this.productLists;
                if(this.priceList.length){
                    this.priceList.forEach(priceItem => {
                        this.productLists.forEach(item => {
                            if (item.sn === priceItem.goods_code) {
                                item.price = priceItem.goods_price
                            }
                        })
                    })
                }
            },

            async getList () {
//                this.showLoading = true;
                if (this.keywords != '') {
                    let data={
                        keywords:this.keywords,
                        page:this.currentPage + 1,
                        pageSize:this.pageSize
                    }
                    let resp = await b2bService.searchList(data);
                    if (resp.result == 1) {
                        this.cat_id = resp.data.cat_id;
                    }
                }
                let _data={
                    cat_id:this.cat_id,
                    page:this.currentPage + 1,
                    pageSize:this.pageSize
                }
                let res = await b2bService.getList(_data);
//                this.showLoading = false;
                this.preventRepeatReuqest = false;
                if (res.result != 1) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return;
                }
                let data = res.data;
                console.log(data);
                if(!data){
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                }
                this.hasNextPage = data['data'].hasNextPage;
                this.menuList = data['menu']


                let first = {};
                let back = {};

                let target = this;
                this.menuList.forEach(item => {
                    let arr = item.cat_path.split("|");
                    if (arr.length >= 3) {
                        first.cat_id = arr[arr.length - 3];
                        first.name = "全部"
                        if (first.cat_id == target.cat_id) {
                            first.isActive = "on";
                        } else {
                            first.isActive = "";
                        }
                    }
                    if (arr.length > 4) {
                        back.cat_id = arr[arr.length - 4];
                        back.name = "返回"
                    }
                    item.isActive = ''
                    if (item['cat_id'] === target.cat_id || item['name'] === target.keywords) {
                        item.isActive = 'on'
                    }
                })

                this.menuList.unshift(first);
                if (back.cat_id) {
                    this.menuList.push(back);
                }
                let list = data['data']['result']
                if (data['data']['currentPageNo'] > this.currentPage) {
                    this.productLists = this.productLists.concat(list)
                } else {
                    this.productLists = list
                    this.priceListOld = []
                }

                let sns = ''
                this.priceDict = {}


                for (let i = 0; i < list.length; i++) {
                    sns += ',' + list[i].sn
                }
                this.goods_sns = sns.substr(1, sns.length - 1)
                console.log("登录状态:" + this.isLogin)
                if (this.isLogin) {
                    this.getPrice();
                }
            },

            async initData(){
                this.getList()
            }
        },

//        mixins: [loadMore],

        created: function () {
            if (this.$route.query.cat_id) {
                this.cat_id = this.$route.query.cat_id;
            }
            if (this.$route.query.keywords) {
                this.keywords = this.$route.query.keywords;
            }
            this.initData();
        },

        filters: {
            money: function (value) {
                return util.price(value)
            }
        },

        watch: {
            isLogin: function (value) {
                if (value) {
                    this.getUserCartList();
                    this.getPrice();
                }
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import '../assets/components/yy_imglist';
    @import "../assets/components/yy_navscroll";
    @import "../assets/components/yy_load";

    //滚动导航条
    nav.scroll {
        margin-top: $headH;
    }

    .md_list {
        @include _business_list;
        ul {
            background: $gray_white;

            li {
                background: $white;
                width: calc((100% - 0.313em) / 2);
                padding: 0.875em 0;
                margin-left: 0.313em;
                margin-top: 0.313em;

                &:nth-child(2n+1) {
                    margin-left: 0;
                }
                &:nth-child(1), &:nth-child(2) {
                    margin-top: 0;
                }
            }
        }
    }
</style>
