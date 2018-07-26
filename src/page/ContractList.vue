<!--/*************************************************************************/-->
<!--/***************************       我的合同       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <span class="tab">
                <a @click="goOrderList">我的订单</a>
                <a class="on">我的合同</a>
            </span>
            <i></i>
        </header>
        <div data-v-5897da3e="" class="head_mt"></div>
        <div class="contract spaceHT" v-if="contractLists.length" type="1">
            <div class="conBox" v-for="el in contractLists" @click="openDetail(el.contract_code)" v-bind:data='el.contract_code' v-bind:id="el.id">
                <b></b>
                <div>
                    <div class="hd">
                        <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                        <p>{{el.contract_code}}</p>
                        <em>{{el.docket_status|statusConvert}}</em>
                    </div>
                    <div class="contract" v-for="good in el.details">
                        <h5>{{good.goods_name}}</h5>
                        <ul>
                            <li>
                                <h5>暂估价格</h5>
                                <p class="t_price"><span>￥</span><em>{{good.goods_price|price}}</em></p>
                            </li>
                            <li>
                                <h5>已下单量</h5>
                                <p>{{good.trade_num}}<span>吨</span></p>
                            </li>
                            <li>
                                <h5>合同量</h5>
                                <p>{{good.goods_num}}<span>吨</span></p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="total">
                    <p>（不含运费)</p>
                    <h5 class="t_price"><span>¥</span><em>{{el.total_amt|price}}</em></h5>
                    <p>共{{el.count}}件商品 合计：</p>
                </div>

                <div class="btn_small" v-if="el.canPay">
                    <a class="btn_red" @click.stop="getOrder(el)">去下单</a>
                </div>
            </div>

            <!--<a id="pullUp" class="a_ddLoad" v-show="preventRepeatReuqest"><span class="pullUpLabel">加载更多...</span></a>-->
        </div>

        <!--异常页面-->
        <div class="noData" v-if="noContract">
            <img :src="noDataImg">
            <p>暂无合同</p>
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
    import { b2bService } from '../service'
//    import {loadMore} from '../components/mixin'
    export default{
        data() {
            return{
                member_id:'114',
                page:1,
                PageSize:8,
                hasNextPage:true,
                currentCat_id:'',
                currentPage:'',
                contractLists:[],
                noContract:false,
                preventRepeatReuqest:false,
                showLoading:false,
                noDataImg:require('../../static/images/icon_nodata-min.png')

            }
        },
        components: {
            InfiniteLoading,
//            loading
        },
        mounted() {

        },
        computed:{

        },
//        mixins: [loadMore],
        methods:{
            goBack(){
                this.$router.push({path:'/home/myAccount'})
            },
            initData(){
                this.getList();
            },
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
            goOrderList(){
              this.$router.push({path:'/orderList'})
            },
            async getList(){
                this.showLoading = true;
                let _parmas = {
                    member_id:this.member_id,
                    page:this.page,
                    rows:this.PageSize,
                }
                let result= await b2bService.getContractList(_parmas);
                if (result.result != 1) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return;
                }else{
                    this.showLoading = false;
                }
                this.preventRepeatReuqest = false;
                var list = result.data["result"];
                if(list.length !=0){
                    list.forEach(item =>{
                        item.canPay = false;
                        var goods = item.details;
                          goods.forEach(good =>{
                              if(good.trade_num != good.goods_num){
                                  item.docket_status=='30'?item.canPay = true:item.canPay = false;
                              }
                        })
                    })
                }
                if(result.data["totalPageCount"] > this.currentPage){
                    this.contractLists = this.contractLists.concat(list);
                }else{
                    this.contractLists = list;
                }
                this.contractLists.length==0?this.noContract=true:this.noContract=false;
                console.log(this.contractLists);
                this.hasNextPage = result.data["hasNextPage"];
                this.currentPage = result.data["currentPageNo"];
            },
            //到达底部加载更多数据
            async loaderMore(){
                if (this.preventRepeatReuqest || !this.hasNextPage) {
                    return
                }
                this.preventRepeatReuqest = true;
                this.page ++;
//                let res = await getOrderList(this.status,this.page,this.rows);
                this.getList();
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
            openDetail(contract_code){
                this.$router.push({path:'/ContractDetail',query:{contract_code:contract_code}});
            },
            getOrder(item){
                if(!item.canPay){
                    return;
                }
                this.$router.push({path:'/ContractOrder',query:{contract_id:item.id}});
            },
            downLoad(el){

                var fileTransfer = new FileTransfer();
//                var uri = encodeURI("http://some.server.com/download.php");
                var uri=encodeURI('/b2b//app/api/appContact!download_contract.do?contract_id='+el.id)
                console.log(uri);

                fileTransfer.download(
                    uri,
                    fileURL,
                    function(entry) {
                        console.log("download complete: " + entry.toURL());
                    },
                    function(error) {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("download error code" + error.code);
                    },
                    false,
                    {
                        headers: {
                            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        }
                    }
                );
            },

            //下载文件



        },
        filters:{
            statusConvert:function(st){
                if(st == "10"){
                    return "草稿"
                }
                if(st == "20"){
                    return "审批"
                }
                if(st == "30"){
                    return "执行中"
                }
                if(st == "40"){
                    return "挂起"
                }
                if(st == "50"){
                    return "已完成"
                }
                if(st == "60"){
                    return "已取消"
                }
                return "";
            },
            price:function(value){
              return util.price(value)
            }
        },
        watch:{

        },
        created() {
            this.initData();
        }
    }


</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_navscroll";
    @import "../assets/components/yy_orderlist";
    @import "../assets/components/yy_cover";
    @import "../assets/components/yy_load";

    .contract{
        .total:after{
            height: 0;
        }
    }
    .noData{
        @include _e_noData;
        height: $noData_h;
        padding-top: $noData_t;
    }
</style>
