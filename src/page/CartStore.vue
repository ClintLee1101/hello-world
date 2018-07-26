<!--/*************************************************************************/-->
<!--/***************************      电商-购物车     *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>
        <div :class="nodate">

            <header>
                <a class="arrowBack icon-arrowL" @click="goback()" href="javascript:void(0)"></a>
                <div class="title">购物车({{cartNum}})</div>
                <a class="edit" v-show="cartNum!=0" @click="allEdit()">{{isEdit ? '完成' : '编辑'}}</a>
            </header>

            <div class="cart">
                <div class="box_cart" v-for="el in cartList">

                    <div class="hd" @click="shopClick(el)">
                        <label class="check" :class="(el.shopSelect || allSelect)?'icon-on':''">
                            <!--<input type="checkbox"/>-->
                        </label>
                        <span>{{el.cat_name}}</span>
                    </div>

                    <ul v-for="arr in el.goodslist">
                        <li @click="itemClick(arr,el,$event)">
                            <label class="check" :class="(el.shopSelect || allSelect || arr.itemSelect)?'icon-on':''">
                                <!--<input type="checkbox"/>-->
                            </label>
                        </li>
                        <li>
                            <router-link :to="'/goodsDetail/'+arr.goods_id" class="">
                                <img v-bind:src="arr.image_default!=''?imgUrl+arr.image_default:noImg">
                            </router-link>
                        </li>
                        <li>
                            <h5><router-link :to="'/goodsDetail/'+arr.goods_id">{{arr.name}}</router-link></h5>
                            <div class="btn_num"><span>
                                <a class="a_down icon-minus" @click="downEdit(arr)"><i></i></a>
                                <input name="" type="number" v-model="arr.num" @change="inputChange(arr)" number/>
                                <a class="a_up icon-add" @click="addEdit(arr)"><i></i></a></span>
                            </div>
                            <p class="t_price"><span>￥</span><em>{{arr.price | money}}</em></p>
                        </li>
                    </ul>
                </div>
                <!-- 删除弹出层 -->
                <!-- 删除弹出层 -->
                <div class="pop" v-if="ifAlert">
                    <div class="bg"></div>
                    <div class="box boxTxt">
                        <div class="txt">
                            确认要删除所选商品吗？
                        </div>
                        <ul class="btn">
                            <li @click="hideAlert">取消</li>
                            <li @click="trueDeleteOrder">确认</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!--异常页面-->
            <div v-if="cartNum == 0" class="md_cartNull">
                <img v-bind:src="emptyImg">
                <p>购物车是空的，您可以</p>
                <a class="btn_redBord" @click="goIndex">随便逛逛</a>
            </div>

            <footer class="footCart" v-show="cartNum!=0">
                <li @click.prevent="allClick()">
                    <label class="check check_all" :class="allSelect?'icon-on':''">
                        <input type="checkbox"/>
                    </label>
                    <span>全选</span>
                </li>
                <li>
                    <div class="txt">
                        <h5>合计</h5>
                        <h6>(不含运费)</h6>
                    </div>
                    <p class="t_price"><span>￥</span><em>{{total | money}}</em></p>
                </li>
                <li>
                    <a v-if="!isEdit" @click="goXD()">去下单</a>
                    <a v-if="isEdit" @click="allDelClick()">删除</a>
                </li>

            </footer>

        </div>
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
        <loading v-show="showLoading"></loading>
    </div>
</template>

<script>
    import Vue from 'vue';
    import alertTip from '../components/alertTip';
    import loading from '../components/loading'
    import {proxy} from '../service'
    import util from '../lib/util';
    import {mapState, mapMutations, mapActions} from 'vuex';
    import { b2bService } from '../service'

    export default {
        components: {
            alertTip,
            loading
        },
        name: 'cartListView',
        data () {
            return {
                cartList: [],
                allSelect: false,
                isShow: '',  //空购物车时使用
                nodate: 'md_bgWhite',
                total: 0,//总金额
                ifAlert: false,
                noImg: require('../../static/images/noImg.png'),
                emptyImg: require('../../static/images/icon_cartBig-min.png'),
                currentDelete: [],
                invoiceId: '',
                addressId: '',
                isEdit: false,  //是否编辑状态
                //显示弹框设置
                showNotice: false,
                showLoading: false,
                options: '',
                imgUrl: '',
                from:'',
                //显示弹框设置结束
            }
        },
        computed: {
            ...mapState([
                'cartListStore', 'cartNum'
            ]),
            filteredProdList () {
                return this.prodList.filter(function (prod) {
                    if (prod.id > 100) return true
                })
            }
        },
        methods: {
            ...mapActions([
                'getUserCartList'
            ]),
            ...mapMutations([
                'GET_CARTLIST'
            ]),

            //关闭弹框
            close(){
                this.options = '';
                this.showNotice = false;
            },
            goIndex(){
                this.$router.push({path: '/home/index'});
            },
            goback () {
                if(this.from){
                    this.$router.push({path: '/home/index'});
                }else{
                    this.$router.goBack()
                }
            },

            allClick: function () {
                this.allSelect = !this.allSelect;
                var l = this.cartList;
                var temp = [];
                var temp1 = [];

                for (var i = 0; i < l.length; i++) {
                    l[i].shopSelect = this.allSelect;
                    var gl = l[i].goodslist;
                    for (let j = 0; j < gl.length; j++) {
                        gl[j].itemSelect = this.allSelect;
                        temp.push(gl[j].id);
                        temp1.push(gl[j].itemSelect);
                    }
                }
                this.selectGoods(temp.join(","), temp1.join(","));
                console.log(this.allSelect);
            },
            //店铺全选
            shopClick: function (shop) {
                shop.shopSelect = !shop.shopSelect;
                let list = this.cartList;
                let index = list.indexOf(shop);
                let temp = [];
                let temp1 = [];
//        let id = shop.cat_id;
                let gl = shop.goodslist;

                this.allSelect = true;
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].shopSelect) {
                        this.allSelect = false;
                    }
                }

                for (let i = 0; i < gl.length; i++) {
                    gl[i].itemSelect = shop.shopSelect;
                    temp.push(gl[i].id);
                    temp1.push(shop.shopSelect);
                }
                Vue.set(list, index, shop);
                this.selectGoods(temp.join(","), temp1.join(","));
            },

            //商品
            itemClick: function (item, shop,e) {
                if (e.target.nodeName === 'INPUT') {
                  return;
                }
                let list = this.cartList;
                item.itemSelect = !item.itemSelect;

                shop.shopSelect = true;
                for (let i = 0; i < shop.goodslist.length; i++) {
                    if (!shop.goodslist[i].itemSelect) {
                        shop.shopSelect = false;
                    }
                }

                this.allSelect = true;
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].shopSelect) {
                        this.allSelect = false
                    }
                }

                var index = list.indexOf(shop);
                Vue.set(list, index, shop);
                let temp = [item.id];
                let temp1 = [item.itemSelect];
                this.selectGoods(temp.join(","), temp1.join(","));
            },

            inputChange: function (item) {
                item.num=amount(item.num)

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
                var temp = [];
                var temp1 = [];
                temp.push(item.id)
                temp1.push(item.num)
                this.updateList(temp.join(","), temp1.join(","));
            },

            //数量加号
            addEdit: function (item) {
                item.num++;
                item.num=Number(item.num).toFixed(2);
                var temp = [];
                var temp1 = [];
                temp.push(item.id)
                temp1.push(item.num)
                this.updateList(temp.join(","), temp1.join(","));
            },

            //数量减号
            downEdit: function (item) {
                if (item.num> 1) {
                    item.num--;
                    item.num=Number(item.num).toFixed(2);
                }else{
                    return;
                }
                var temp = [];
                var temp1 = [];
                temp.push(item.id)
                temp1.push(item.num)
                this.updateList(temp.join(","), temp1.join(","));
            },

            //全部编辑
            allEdit: function () {
                this.isEdit = !this.isEdit;
            },

            trueDeleteOrder: function () {
                let l = this.cartList;
                let temp = [];
                for (var i = 0; i < l.length; i++) {
                    let gl = l[i].goodslist;
                    for (var j = 0; j < gl.length; j++) {
                        if (gl[j].itemSelect) {
                            temp.push(gl[j].id)
                        }
                    }
                }
                this.deleteList(temp.join(","));
                this.ifAlert = false;

            },
            hideAlert: function () {
                this.ifAlert = false;
            },
            allDelClick: function () {
                this.ifAlert = true;
            },

            goXD: function (url) {
                console.log(this.total);
                if (this.total == 0) {
                    this.showNotice = true;
                    this.options = '请选择商品';
                    return;
                }
                this.getUserCartList();
                this.$router.push({path: '/order'});
            },

            goGoodsDetail: function (goodsId) {
//        httpREF.ref("/goodsDetail/:goodId="+goodsId);
            },

            async selectGoods(id, stus){
                let _parmas = {
                    item_id:id,
                    checked:stus
                }
                let res = await b2bService.selectCartList(_parmas);
                if (res.result != 1) {
                    this.getUserCartList();
                    return;
                }
                this.getPrice();
            },

            //删除购物车商品
            async deleteList(id) {
                this.showLoading = true;
                let res = await b2bService.deleteCartList({deleteItem_ids:id});
                if (res["result"] != 1) return;
                this.getUserCartList();
                this.currentDelete = [];
                this.showLoading = false;
            },

            //更新购物车数据
            async updateList(str, str1) {
                this.showLoading = true;
                let _parmas = {
                    cartid:str,
                    num:str1
                }
                let res = await b2bService.updateCartList(_parmas);
                if (res["result"] != 1) {
                    this.getUserCartList();
                    return;
                }
                this.getPrice();
            },

            async getPrice() {
                let res = await b2bService.getCartListPrice();
                if (res["result"] != 1) return;
                this.total = res.data.goodsPrice;
                this.showLoading = false;
            },

            async getList() {
                if (this.cartListStore.result != 1) return
                var rs = this.cartListStore.data;

                var rs1 = this.cartListStore
                for (var i = 0; i < rs.length; i++) {
                    rs[i].shopSelect = true;
                    var gl = rs[i].goodslist;
                    var isSelect = true;
                    for (var j = 0; j < gl.length; j++) {
                        gl[j].itemSelect = false;

                        if (gl[j].checked == "1") {
                            gl[j].itemSelect = true;
                        } else {
                            isSelect = false;
                        }
                    }
                    if (!isSelect) {
                        rs[i].shopSelect = false;
                    }
                }
                if (rs.length == 0) {
                    this.isShow = "";
                    this.nodate = "md_bgWhite";
                } else {
                    this.isShow = "hide";
                    this.nodate = "";
                }
                this.cartList = rs;
            },

            async initData(){
                this.getList();
                this.getPrice();
            }
        },
        created () {
            console.log(proxy)
            console.log(proxy.img)
            this.imgUrl = proxy.img;
            this.from = this.$route.query.from;
            this.getUserCartList();
        },
        filters: {
            money: function (value) {
                return util.price1(value)
            }
        },

        watch: {
            cartListStore: function (value) {
                this.initData();
            }
        }
    }

    //  function setButtonHigh() {
    //
    //    var winW = $(window).width(),
    //      tdH = $(".md_cart .td_edit").height(),
    //      td01W = $(".md_cart td:nth-child(1)").width(),
    //      td02W = $(".md_cart td:nth-child(2)").width(),
    //      td03W = winW - td01W - td02W;
    //    $(".md_cart .td_edit").css({"height":tdH});
    //    $(".md_cart .td_edit .col_2 a").css({"height":tdH, "line-height":tdH+"px"});
    //    $(".md_cart td:nth-child(3)").css({"width":td03W});
    //  }
</script>

<style lang="scss" scoped>
@import '../assets/layout/yy_header';
@import '../assets/layout/yy_footer';
@import '../assets/components/yy_cover';

$cartLi_h: 6.75rem;

.cart {
    margin-top: $headH + $spaceV;
    padding-bottom: $foot_h + $spaceV;

    .box_cart {
        background: $white;
        margin-top: $spaceV;

        .hd {
            @include _linkBottom_half;
            height: 2.75rem;
            line-height: 2.75rem;
            padding: 0 $spaceLR;

            label, span {
                float: left;
            }
            label {
                margin: 0.625rem 0.625rem 0 0;
            }
        }
        ul{
            @include _linkBottom_half;
            display:-moz-flex;
            display:-webkit-flex;
            display:flex;
            padding-top: $spaceV;
            padding-bottom: $spaceV * 0.75;

            li{
                padding-right: $spaceLR;

                h5{
                    height: $lineH*2 - 0.125em;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                &:nth-child(1), &:nth-child(2) {
                    flex-shrink: 0;
                }
                &:nth-child(1){
                    width: 2.5rem;
                    padding: 2.5rem 0 2.5rem $spaceLR;

                }
                &:nth-child(2){
                    width: 5.625rem;
                    margin-right: 0.875rem;
                }
                &:nth-child(3){
                    -moz-flex-grow:1;
                    -webkit-flex-grow:1;
                    flex-grow:1;

                    height: $cartLi_h;
                    position: relative;

                    p, .btn_num{
                        position: absolute;
                    }
                    .btn_num{
                        top: 3rem;
                    }
                    p{
                        bottom: 0;
                    }
                }
            }
        }
    }
}

//空购物车
.md_cartNull {
    height: calc((100vh - 3.125em * 2) * 0.8 - 0.625em);
    text-align: center;
    padding-top: calc((100vh - 3.125em * 2) * 0.2);

    img {
        width: 19.5%;
        margin: 0 auto;
    }
    p {
        color: $gray2;
        font-size: 1.125em;
        line-height: 1.333em;
        padding: 1em 0 1.5rem;
    }
}
</style>
