<!--/*************************************************************************/-->
<!--/***************************       商品详情       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <!--<h1>{{$route.params.id}}</h1>-->
        <header>
            <a class="arrowBack icon-arrowL" @click="goback"></a>
            <div class="title">商品详情</div>
            <a class="cart" :class="cartNum>0?'icon-cart2':'icon-cart'" @click="gotoCart"><b
                    :class="cartNum>0?'':'hide'"></b></a>
        </header>

        <div class="detail_img">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(i,index) in imgList" :key="i.small"><img :src="i.small">
                    </div>
                    <!--<div class="swiper-slide"><img src="../assets/images/index02-min.jpg"></div>-->
                    <!--<div class="swiper-slide"><img src="../assets/images/01-min.jpg"></div>-->
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <div class="detail detail01">
            <h4>{{name}}</h4>
            <div class="price_box">
                <h3 class="t_price"><span>￥</span><em :style="{fontSize:isNaN(goods_price)?'1.1em':'1.5em'}">{{goods_price | money}}</em></h3>
                <h6>市场价：{{mktprice | money}}</h6>
            </div>
        </div>

        <div class="detail">
            <h5>
                <dd>产品品牌<span>{{brand_name}}</span></dd>
                <dd>计量单位<span>{{unit}}</span></dd>
                <dd>起购量<span>{{start_quantity}}&nbsp;{{unit}}</span></dd>
            </h5>
            <dl v-show="spec_value_list.length > 0">
                <h5>产品规格</h5>
                <div class="select_box">
                    <a v-for="(elem,index) in spec_value_list" v-bind:class="{ on: index===currentggIndex||elem.selected===1 }" @click="exchangegg(elem.spec_code,index)">{{elem.spec_value}}<b class="icon-corner"></b></a>
                </div>
            </dl>
            <dl v-show="spec_alias_list.length > 0">
                <h5>包装规格</h5>
                <div class="select_box">
                    <a v-for="(elem,index) in spec_alias_list" v-bind:class="{ on: index===currentbzIndex||elem.selected===1 }" @click="exchangebz(elem.spec_code,index)">{{elem.spec_value}}<b class="icon-corner"></b></a>
                </div>
            </dl>
            <dl v-show="formtype_spec_value.length > 0">
                <h5>产品形态</h5>
                <div class="select_box">
                    <a v-for="(elem,index) in formtype_spec_value" v-bind:class="{ on: index===currentxtIndex||elem.selected===1}" @click="exchangext(elem.spec_code,index)">{{elem.spec_value}}<b class="icon-corner"></b></a>
                </div>
            </dl>
            <dl v-show="color_spec_value.length > 0">
                <h5>产品颜色</h5>
                <div class="select_box">
                    <a v-for="(elem,index) in color_spec_value" v-bind:class="{ on: index===currentysIndex||elem.selected===1 }" @click="exchangeys(elem.spec_code,index)">{{elem.spec_value}}<b class="icon-corner"></b></a>
                </div>
            </dl>
            <dl>
                <h5>产品数量</h5>
                <div class="btn_num"><span>
                    <a class="a_down icon-minus" @click="minusNumber"><i></i></a>
                    <input name="" type="number" v-model="pro_number" v-on:input="orderNumFunc()"/>
                    <a class="a_up icon-add"v-on:click="plusNumber"><i></i></a></span>
                </div>
            </dl>
        </div>

        <footer class="col">
            <a @click="addCart">加入购物车</a>
            <a @click="OrderImmediately">立即下单</a>
        </footer>

        <!--加载购物车动效，这里图片需要改成当前商品图-->
        <!--<img class="ani_addCare" src="../assets/images/finance01-min.png">-->

        <loading v-show="showLoading"></loading>
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import util from '../lib/util'
    import Swiper from '../components/swiper-3.4.2.min'
    import loading from '../components/loading'
    import alertTip from '../components/alertTip'
    import {Slider, SliderItem} from 'vue-easy-slider'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import {b2bService} from '../service'

    export default {
        name: 'goodsDetail',
        components: {
            Slider,
            SliderItem,
            loading,
            alertTip,
        },
        data () {
            return {
                goods_id: '',
                store_id: '',
                name: "",//产品名称
                imgList: [],//商品图片列表
                imgList1: [],
                ifImages: false,
                goodsImg: require('../../static/images/01-min.jpg'),//产品图片
                noImage: require('../../static/images/noImg.png'),
                brand_name: "",//产品品牌
                unit: "",//计量单位
                start_quantity: '',//起购量
                spec_value_list: [],//产品规格列表
                spec_alias_list: [],//包装规格列表
                formtype_spec_value: [],//产品形态列表
                color_spec_value: [],//产品颜色列表

                pro_number: 1.00,//商品数量
                product_spec_code: '',//产品规格编码
                package_spec_code: '',//包装规格编码
                product_shape_code: '',//形态编码
                product_color_code: '',//颜色编码
                cat_id: '',//商品分类id
                brand_id: '',//商品品牌id
                goods_sn: '',//获取价格用到的key
                goods_price: '',//商品价格
                mktprice: '',//市场价
                goods_intro: '',//产品介绍部分
                cartCount: true,
                cartState: "加入购物车",
                ifInCart: false,
                onClass: 'on',
                currentggIndex: undefined,
                currentbzIndex: undefined,
                currentxtIndex: undefined,
                currentysIndex: undefined,
                imgLength: 0,//图片总数
                showLoading: false,
                //显示弹框设置
                showNotice: false,
                options: '',

                balls: [
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false}
                ],
                dropBalls: []
            }
        },
        computed: {
            ...mapState([
                'isLogin', 'cartNum',
            ]),
        },
        methods: {
            ...mapActions([
                'getUserCartList'
            ]),
            //关闭弹框
            close(){
                this.options = '';
                this.showNotice = false;
            },
            plusNumber: function () {
                this.pro_number++;
                this.pro_number=Number(this.pro_number).toFixed(2);
            },
            minusNumber: function () {
                if (this.pro_number > 1) {
                    this.pro_number--;
                    this.pro_number=Number(this.pro_number).toFixed(2);
                }
            },
            orderNumFunc:function(){

//                this.pro_number=Number(this.pro_number).toFixed(2);
                this.pro_number=amount(this.pro_number)

                function amount(v) {
                    var regStrs = [
                        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
                    ],i;
                    for (i = 0; i < regStrs.length; i++) {
                        var reg = new RegExp(regStrs[i][0]);
                        v = v.replace(reg, regStrs[i][1]);
                    }
                    return v;
                }
                console.log(this.pro_number);
            },
            initLunbo () {
                var mySwiper = new Swiper('.swiper-container', {
                    //autoplay: 3000,//可选选项，自动滑动
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    paginationClickable: true,
                })
            },
            exchangegg: function (spec_code, index) {
                this.product_spec_code = spec_code;
                if (this.exchangeGoods()) {
                    this.currentggIndex = index;
                }
            },
            exchangebz: function (spec_code, index) {
                this.package_spec_code = spec_code;
                if (this.exchangeGoods()) {
                    this.currentbzIndex = index;
                }
            },
            exchangext: function (spec_code, index) {
                this.product_shape_code = spec_code;
                if (this.exchangeGoods()) {
                    this.currentxtIndex = index;

                }
            },
            exchangeys: function (spec_code, index) {
                this.product_color_code = spec_code;
                if (this.exchangeGoods()) {
                    this.currentysIndex = index;

                }
            },
            goback () {
                this.$router.goBack()
            },
            gotoCart: function () {
                if (this.isLogin) {
                    this.$router.push({path: '/CartStore'})
                } else {
                    this.$router.push({path: '/login'})
                }
            },
            //立即下单
            OrderImmediately: function () {
                if(this.goods_price == 0){
                    this.showNotice = true;
                    this.options = '没有价格，无法下单';
                    return;
                }
                if(this.pro_number<=0){
                    this.options = '下单数量不合法';
                    this.showNotice = true;
                    return;
                }
                if(!this.pro_number){
                    this.options = '数字不合法';
                    this.showNotice = true;
                    return;
                }
                if (this.isLogin) {
                    this.$router.push({
                        path: '/order',
                        query: {store_id: this.store_id, num: this.pro_number, goodsid: this.goods_id}
                    })
                } else {
                    this.$router.push({path: '/login'})
                }

            },

            //添加到购物车
            async addCart(){
                if (this.isLogin) {
//                if(this.ifInCart){
//                    return;
//                }
//                else{
                    let data = {
                        sn:this.goods_sn,
                        num:this.pro_number,
                        store_id:this.store_id,
                    }
                    let res = await b2bService.addGoods(data);
                    if (res.result == 1) {
                        this.cartState = "已加入购物车";
                        this.ifInCart = true;
                        this.cartCount = 1;
                        this.getUserCartList();
                        this.showNotice = true;
                        this.options = '添加成功'
                    }
                    else {
                        this.showNotice = true;
                        this.options = '添加失败'
                    }
//                }
                }
                else {
                    //做登录的操作
                    this.$router.push({path: '/login'})
                }
            },
            async initData(){
                this.showLoading = true;
                let data={
                    goods_id:this.goods_id
                }
                let detailList = await b2bService.getGoodsDetail(data);
                if (detailList.result != 1) return;
                this.showLoading = false;
                var result = detailList.data;
                this.name = result.goods.name;
                if (result.galleries.length > 0) {
                    this.imgList = result.galleries;
                    console.log(this.imgList);
                }
                else {
                    this.imgList = [{small: this.noImage}];
                }
                this.imgLength = this.imgList.length;
                var winW = $(window).width(),
                    arrowBackboxW = $(".arrowBackbox").width(),
                    cartboxW = $(".cartbox").width(),
                    titlebox = winW - arrowBackboxW - cartboxW;
                $(".titlebox").css({"width": titlebox - 5});
                //图片展示
                $(".imgbox").css({"width": winW, "height": winW * 0.9});
                $(".imgbox ul").css({'padding-top': winW * 0.1});
                $(".imgbox li").css({"width": winW, "height": winW * 0.67});
                this.cat_id = result.goods.cat_id;
                this.brand_id = result.goods.brand_id;
                this.brand_name = result.goods.brand_name;
                this.unit = result.goods.unit;
                this.start_quantity = result.goods.start_quantity;
                this.store_id = result.goods.store_id;
                if (result.specification) {
                    result.specification.specList.forEach(item => {
                        if (item.selected == 1) {
                            this.product_spec_code = item.spec_code;
                        }
                    });
                    if (this.product_spec_code == "" && result.specification.specList.length > 0) {
                        result.specification.specList[0].selected = 1;
                        this.product_spec_code = result.specification.specList[0].spec_code;
                    }
                    this.spec_value_list = result.specification.specList;
                }

                if (result.packing) {
                    result.packing.specList.forEach(item => {
                        if (item.selected == 1) {
                            this.package_spec_code = item.spec_code;
                        }
                    })
                    if (this.package_spec_code == "" && result.packing.specList.length > 0) {
                        result.packing.specList[0].selected = 1;
                        this.package_spec_code = result.packing.specList[0].spec_code;
                    }
                    this.spec_alias_list = result.packing.specList;
                    console.log(result.packing.specList);
                }

                if (result.formtype && result.formtype.specList) {
                    result.formtype.specList.forEach(item => {
                        if (item.selected == 1) {
                            this.product_shape_code = item.spec_code;
                        }
                    })
                    if (this.product_shape_code == "" && result.formtype.specList.length > 0) {
                        result.formtype.specList[0].selected = 1;
                        this.product_shape_code = result.formtype.specList[0].spec_code;
                    }
                    this.formtype_spec_value = result.formtype.specList;
                }

                if (result.color && result.color.specList) {
                    result.color.specList.forEach(item => {
                        if (item.selected == 1) {
                            this.product_color_code = item.spec_code;
                        }
                    })
                    if (this.product_color_code == "" && result.color.specList.length > 0) {
                        result.color.specList[0].selected = 1;
                        this.product_color_code = result.color.specList[0].spec_code;
                    }
                    this.color_spec_value = result.color.specList;
                }

                this.goods_sn = result.goods.sn;
                this.mktprice = result.goods.mktprice;
                let _data={
                    goods_sns:this.goods_sn
                }
                let priceDetail = await b2bService.getPrice(_data);
                console.log("价格" + priceDetail);

                if (!this.isLogin) {
                    this.goods_price = "登录后可见";
                } else {
                    if (priceDetail[0]) {
                        this.goods_price = priceDetail[0].goods_price;
                    } else {
                        this.goods_price = 0;
                    }
                }
                this.initLunbo();


            },
            async getCart(){
                let carNumber = await b2bService.getCartCount();
                if (carNumber.result != -1) {
                    console.log(carNumber.data.count);
                    if (carNumber.data.count > 0) {
                        this.cartCount = false;
                    }
                }
            },
            async exchangeGoods(){
                let data = {
                    'good.package_spec_code':this.package_spec_code,
                    'good.product_shape_code':this.product_shape_code,
                    'good.product_color_code':this.product_color_code,
                    'good.product_spec_code':this.product_spec_code,
                    'good.cat_id':this.cat_id,
                    'good.brand_id':this.brand_id,
                };
                let changeGoods = await b2bService.getChangeGoods(data);
                console.log(changeGoods);
                if (changeGoods.result == 1 && changeGoods.data != null) {
                    this.goods_id = changeGoods.data.goods.goods_id;
                    this.initData();
                    return true;
                } else {
                    console.log("暂无该规格产品");
                    return false;
                }
                return false;
            }

        },
        created () {
            console.log(this.$route.params.id);
            this.goods_id = this.$route.params.id;
            this.initData();
            this.getCart();
            this.pro_number=Number(this.pro_number).toFixed(2);

        },
        filters: {
            money: function (value) {
                return util.price(value)
            }
        },
        watch: {
            isLogin: function (value) {
                if (value) {
                    this.GET_CARTLIST
//                this.getPrice();
                }
            }
        }
    }


    //加载购物车动效 begin
    //  $(function(){
    //      $(".md_detail_bottom a:first-child").click(function(){
    //          var flyElm = $(".ani_addCare");
    //          flyElm.css({"display": "block"});
    //          flyElm.animate({
    //              top:5,
    //              left:"95%",
    //              width:10,
    //              height:10,
    //              opacity:0,
    //          },"linear,slow");
    //          setTimeout(function(){
    //              flyElm.removeAttr("style");
    //          },500);
    //      });
    //  });

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/layout/yy_footer';
    @import '../assets/components/yy_button';
    @import '../assets/components/yy_cover';

    $imgH: 17.625rem;
    $imgPT: 1.813rem;
    $imgPB: 2rem;
    $img_conH: 17.625rem - 3.813rem;
    $imgW: calc(100vw - 3.438rem);
    $img_pageNumC: #d3d3d3;
    $img_pageNumW: 2.75rem;
    $img_pageNumT: -(2.75rem + 1.25rem);
    $img_pageNumL: calc(100vw - 2.75rem - 0.688rem);

    .detail_img, .detail{
        background: $white;
    }

    //商品图片
    .detail_img {
        margin-top: $headH;
        height: $imgH;

        img {
            width: auto;
            max-height: 100%;
            max-width: 100%;
            margin: 0 auto;
            justify-content:center;
            align-items:center;
        }
        .swiper-container{
            width: 100%;
            height: 100%;
        }
        .swiper-wrapper{
            padding: 1.813rem 0 2rem;
            width: 100%;
            height: $img_conH;

        }
        .swiper-slide{
            display:flex;
        }
        .swiper-pagination {
            background: $img_pageNumC;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            color: $white;
            font-size: 0.75rem;
            display: inline-block;
            width: $img_pageNumW;
            height: $img_pageNumW;
            line-height: $img_pageNumW;
            text-align: center;
            position: relative;
            top: $img_pageNumT;
            left: $img_pageNumL;
            z-index: 9999;
        }
    }

    //商品选项
    .detail{
        @include _linkTop_half;
        padding: 1rem $spaceLR;
        margin-bottom: $foot_h;

        & > h5{
            display:-moz-flex;
            display:-webkit-flex;
            display:flex;

            dd{
                display: inline-block;
                -moz-flex-grow:1;
                -webkit-flex-grow:1;
                flex-grow:1;

            }
        }
        h5, h6{
            color: $gray;
        }
        .price_box{
            margin-top: 0.188rem;

            h3, h6{
                display: inline-block;
            }
            h3{

            }
            h6{
                margin-left: 1.5rem;
                text-decoration: line-through;
            }
        }
        h5{
            span{
                color: $font;
                margin: 0 0.875rem 0 0.5rem;
            }
        }
        dl{
            &:nth-child(2){
                @include _linkTop_half;
                margin-top: 1.5rem;
                h5{
                    padding-top: 0.625rem;
                }
            }
            &:last-child{
                display:-moz-flex;
                display:-webkit-flex;
                display:flex;
                padding-top: 0.375rem;

                h5, .btn_num{
                    display: inline-block;
                    align-items: center;
                }
                h5{
                    margin-right: 5.75rem;
                }
            }
            h5{
                padding-bottom: 0.375rem;
            }
            .select_box{
                display:-moz-flex;
                display:-webkit-flex;
                display:flex;
                align-items: center;
                flex-flow: row wrap;

                a{
                    border: solid 1px $bord_c;
                    -moz-border-radius: 0.188rem;
                    -webkit-border-radius: 0.188rem;
                    border-radius: 0.188rem;
                    display: inline-block;
                    font-size: 0.875rem;
                    line-height: 1.875rem;
                    height: 1.875rem;
                    padding: 0 1.25rem;
                    margin-right: 0.875rem;
                    margin-bottom: 0.625rem;
                    position: relative;

                    .icon-corner{
                        display: none;
                        font-size: 1.25rem;
                        line-height: 1.25rem;
                        height: 1.25rem;
                        position: absolute;
                        right: -1px;
                        bottom: -1px;
                    }
                    &.on{
                        border-color: $red;

                        &, .icon-corner{
                            color: $red;

                        }
                        .icon-corner{
                            display: block;
                        }
                    }
                }
            }
        }
    }

    .detail01{
        margin-bottom: $spaceV;
    }

    footer.col{
        display:-moz-flex;
        display:-webkit-flex;
        display:flex;

        a{
            display: inline-block;
            -moz-flex-grow:1;
            -webkit-flex-grow:1;
            flex-grow:1;
            line-height: $foot_h;
            height: $foot_h;

            &:first-child{
                background: $blue2;
            }
        }
    }

    //加入购物车效果
    .ani_addCare {
        opacity: 0.8;
        display: none;
        width: 50px;
        height: 50px;
        position: absolute;
        top: 90%;
        left: 30%;
        z-index: 10;
    }
</style>
