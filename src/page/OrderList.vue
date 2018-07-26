<!--/*************************************************************************/-->
<!--/***************************       我的订单       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header v-if="ty == 2">
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title" v-if="!showHeader">我的订单</div>
            <span class="tab" v-if="showHeader">
                <a class="on">我的订单</a>
                <a @click="goToContract">我的合同</a>
            </span>
            <i></i>
        </header>

        <div class="head_mt"></div>

        <nav class="scroll" v-if="!showHeader">
            <div class="slider_wrap">
                <div class="container">
                    <div v-for="el in menuList" class="item_cell" @click="menuClick(el)" :class="{on:el.isActive}"><span>{{el.name}}<em>({{el.num}})</em></span></div>
                    <!--<div v-for="el in menuList" class="item_cell" @click="menuClick(el)" :class="{on:el.isActive}"><span>{{el.name}}</span></div>-->
                </div>
            </div>
        </nav>

        <div class="order" v-if="orderLists.length" type="1">
            <div class="conBox" v-for="el in orderLists" >
                <b :class="el.orderStatus == '已完成'?'show':''"></b>
                <div @click="goToDetails(el.order_id)">
                    <div class="hd">
                        <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                        <p>{{el.sn}}</p>
                        <em>{{el.orderStatus == '已完成'?'':el.orderStatus}}</em>
                    </div>

                    <div class="cart" v-for="ee in el.orderItemListGroup">
                        <ul v-for="elem in ee" >
                            <li><img v-bind:src="elem.image!=''?elem.image:noImage"></li>
                            <li>
                                <h4>{{elem.name}}</h4>
                                <h5 class="t_price"><span>￥</span><em>{{elem.confirm_price|price}}</em></h5>
                                <p>x{{elem.confirm_num}}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="total" @click="goToDetails(el.order_id)">
                    <p>（不含运费)</p><h5 class="t_price"><span>¥</span><em>{{el.order_amount|price}}</em></h5><p>共{{el.goods_num}}件商品&nbsp;&nbsp;合计：</p>
                </div>

                <div class="btn_small" v-if="el.show">
                    <a class="btn_white" @click="cancel(el.sn)" v-if="el.show">取消订单</a>
                    <a class="btn_red" @click="payOrder(el)" v-if="el.show">去支付</a>
                    <!--<a class="btn_blue" @click="goReceptionDetail(el)" v-if="el.show2">收货详情</a>-->
                </div>
            </div>
            <!--<a id="pullUp" class="a_ddLoad" v-show="preventRepeatReuqest"><span class="pullUpLabel">加载更多...</span></a>-->
        </div>
        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box">
                <div class="txt">
                    <p>请输入取消原因：</p>
                    <textarea type="text" placeholder="取消订单原因" v-model="reason"></textarea>
                </div>
                <ul class="btn">
                    <li @click="hideAlert">取消</li>
                    <li @click="trueDeleteOrder">确认</li>
                </ul>
            </div>
        </div>

        <!--异常页面-->
        <div class="noData" v-if="!hasOrder">
            <img :src="noDataImg">
            <p>暂无订单</p>
        </div>

        <loading v-show="showLoading"></loading>
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
        <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more">
                没有更多数据了
            </span>
        </infinite-loading>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import util from '../lib/util'
    import loading from '../components/loading'
    import alertTip from '../components/alertTip'
    import { b2bService } from '../service'
    import {loadMore} from '../components/mixin'
    export default{

        data () {
            return {
              showHeader:true,
                sn:'',
                menuList:[{
                    "name":"全部","status":"other","isActive":true,"num":0
                },{
                    "name":"审批中","status":"audit","isActive":false,"num":0
                },{
                    "name":"待支付","status":"waitPay","isActive":false,"num":0
                },{
                    "name":"执行中","status":"implementation","isActive":false,"num":0
                },{
                    "name":"已完成","status":"completed","isActive":false,"num":0
                },{
                    "name":"已取消","status":"canceled","isActive":false,"num":0
                }],
                orderLists:[],
                orderItemListGroup:[1,2,3],
                hasOrder:true,
                hasNextPage:true,
                currentPage:1,
                ty:2,
                ifAlert:false,
                status:'',//
                page:1,//页数
                rows:8,//条数
                noImage:require('../../static/images/noImg.png'),
                preventRepeatReuqest:false,
                showLoading:false,
                reason:'',
                info:{
                  type:'',
                    name:'',
                    amount:''
                },//产品信息
                paymentType:5,//只能余额支付,
                type:0,//1：贵州开磷息峰合成氨有限责任公司 2：贵州开磷化肥有限责任公司 3：贵州开磷有限责任公司 4：贵州开磷集团国际贸易有限公司
                //显示弹框设置
                showNotice:false,
                options: '',
                noDataImg:require('../../static/images/icon_nodata-min.png'),
                canLoad:true,
            }
        },
        components: {
            InfiniteLoading,
            alertTip,
            loading
        },
        filters: {
          price: function (value) {
            return util.price(value)
          }
        },
//        mixins: [loadMore],
        computed : {

        },

        methods : {
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
                if(this.reason==''){
                    this.ifAlert=true;
                }
            },
            onInfinite ($state) {

                setTimeout(() => {
                    this.loaderMore();
//                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
                    $state.loaded();
                }, 1000)
                if ( !this.hasNextPage) {
//                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    $state.complete();
                }


            },
            goBack(){
                this.$router.push({path:'/home/myAccount'})
//                this.$router.goBack();
            },
            goToContract(){
                this.$router.push({path:'ContractList'})
            },
            goReceptionDetail(el){
                this.$router.push({path:'receptionGoodsDetail'})
            },
            menuClick : function(el){
                this.showLoading = true;
//              this.orderLists = [];
              this.status = el.status;
              this.page= 1;
              this.row = 8;
              this.initData();
              this.menuList.forEach( item => {
                item.isActive = '';
              })
              el.isActive = 'on';
                this.hasNextPage=true;
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            },
            goToDetails : function(order_id){
                console.log(order_id);
                this.$router.push({path:'orderDetail',query:{order_id:order_id}})
            },
            cancel : function(sn){
                this.ifAlert=true;
                this.sn=sn;
            },
            hideAlert : function(){
                this.ifAlert=false;
            },
            trueDeleteOrder : function(){
                this.cancelOrder(this.sn);
            },
            async cancelOrder(sn){
                if(this.reason==''){
                    this.ifAlert=false;
                    this.showNotice=true;
                    this.options='请填写理由';
                    return;
                }
                let _parmas = {
                    sn:sn,
                    reason:this.reason
                }
                let res=await b2bService.cancelOrder(_parmas);
                if(res.result==1){
                    this.ifAlert=false;
                    this.showNotice=true;
                    this.options='取消成功';
                    this.getStatus();
                    this.getOrderList();
                }else{
                    this.ifAlert=false;
                    this.options=res.message;
                    this.showNotice=true;
                }

            },
            async getStatus(){
                let res = await b2bService.getOrderStatus();
                this.menuList.forEach( item => {
                    if(item.status == "canceled"){
                        item.num = res["data"]["canceled"];
                    }
                    if(item.status == "implementation"){
                        item.num = res["data"]["implementation"];
                    }
                    if(item.status == "waitPay"){
                        item.num = res["data"]["waitPay"];
                    }
                    if(item.status == "audit"){
                        item.num = res["data"]["audit"];
                    }
                    if(item.status == "other"){
                        item.num = res["data"]["all"];
                    }
                    if(item.status == "completed"){
                        item.num = res["data"]["completed"];
                    }
                })
            },
            payOrder(el){
              this.$router.push({path:'payment',query:{orderId:el.order_id}})
//              let res = await b2bPay(el.order_id);
////              let res = await b2bPay('1000');
//              if(res.result != 1){
//                  return;
//              }
//              var params = res.data;
//              let resFsp = await fspPay(params.notifyUrl,params.orderNo,params.paymentType,params.token,params.totalFee,params.info,params.type,params.body,params.orderType,params.company);
//              if(resFsp.code == 100){
//                  this.$router.push({path:'payment',query:{orderId:resFsp.data.orderId}})
//              }else{
//                  this.$router.push({path:'tipsFailed'})
//                  alert(resFsp.message);
//              }
            },
            async initData(){
               this.getOrderList();
               this.getStatus();
            },
            async getOrderList(){
                let _parmas = {
                    status: this.status,
                    page:this.page,
                    rows:this.rows,
                }
                let res = await b2bService.getOrderList(_parmas);
                this.showLoading = false;
                if (res.result != 1) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return;
                }
                this.preventRepeatReuqest = false;
                var list = res.data[0];
                //每个状态下的商品列表
                var l=list.length;
                list.forEach( item => {
                   if( item.orderStatus=="审批中"){
                       item.show=false;
                       item.show2=false;
                   }else if(item.orderStatus=="已完成"){
                       item.show=false;
                       item.show2=true;
                   }else if(item.orderStatus=="待支付"){
                       item.show=true;
                       item.show2=false;
                   }else if(item.orderStatus=="取消审核中"){
                       item.orderStatus = "已取消";
                   }else if(item.orderStatus=="支付中"){
                       item.show=true;
                       item.show2=false;
                   }
                })
                if(res.data[1]["currentPageNo"] > this.currentPage){
                    this.orderLists = this.orderLists.concat(list);
                }else{
                    this.orderLists = list;
                }
                this.orderLists==0?this.hasOrder=false:this.hasOrder=true;
                this.hasNextPage = res.data[1]["hasNextPage"];
                this.currentPage = res.data[1]["currentPageNo"];
            },
            //到达底部加载更多数据
            loaderMore(){
                if(!this.canLoad){
                    return;
                }
                this.canLoad = false;
                setTimeout(() => {
                    this.canLoad = true;
                }, 3000)
                //防止重复请求
                if (this.preventRepeatReuqest || !this.hasNextPage) {
                    return
                }
//                this.showLoading = true;
                this.preventRepeatReuqest = true;
                this.page ++;
//                let res = await getOrderList(this.status,this.page,this.rows);
                this.getOrderList();
//                this.hideLoading();
            },
            hideLoading(){
                if (process.env.NODE_ENV !== 'development') {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        clearTimeout(this.timer);
                        this.showLoading = false;
                    }, 500)
                }else{
                    this.showLoading = false;
                }
            },
        },

        watch : {

        },

        created : function() {
          this.status = '';
          if(this.$route.query.status){
            this.showHeader = false;
            this.status = this.$route.query.status;
            for(var i=0;i<this.menuList.length;i++){
              if(this.menuList[i].status == this.status){
                this.menuList[i].isActive = "on"
              }else{
                this.menuList[i].isActive = ""
              }
            }
          }
          this.initData();
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_navscroll";
    @import "../assets/components/yy_orderlist";
    @import "../assets/components/yy_cover";
    @import "../assets/components/yy_load";

    .order{
        b {
            background-image: url(../../static/images/icon_completed-min.png);
        }
    }

    .noData{
        @include _e_noData;
        height: $noData_h;
        padding-top: $noData_t;
    }
</style>
