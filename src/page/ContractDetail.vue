<!--/*************************************************************************/-->
<!--/***************************       合同详情       *************************/-->
<!--/*************************************************************************/-->


<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">合同详情</div>
            <i></i>
        </header>

        <!--地址-->
        <dl class="address spaceHT">
            <dd>
                <p>收货人：{{ship_linker}}&nbsp;&nbsp;&nbsp;&nbsp;{{ship_tel}}</p>
                <h5><i class="icon-address"></i><span>收货地址：{{ship_addr}}</span></h5>
            </dd>
        </dl>

        <!--商品详情-->
        <div class="conBox">
            <div>
                <div class="hd">
                    <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                    <p>贵州开磷化肥有限责任公司_{{goods_dept_name}}</p>
                </div>

                <div class="cart">
                    <ul v-for="el in details">
                        <li><img v-bind:src="el.tiny?el.tiny:noImage"></li>
                        <li>
                            <h4>{{el.goods_name}}</h4>
                            <h5 class="t_price"><span>￥</span><em>{{el.goods_price|money}}</em><span>/吨</span></h5>
                            <p><span>合计{{el.goods_num}}吨</span><em>已出库{{el.trade_num}}吨</em></p>
                            <!--<p> {{el.goods_num}}吨</p>-->
                            <!--<p>下单量{{el.trade_num}}吨</p>-->
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!--合同详情-->
        <div class="oDetail">
            <dl>
                <dt>合同编号：</dt>
                <dd>{{contract_code}}<strong>{{docket_status_desc}}</strong></dd>
            </dl>
            <dl>
                <dt>合同名称：</dt>
                <dd>{{contract_name}}</dd>
            </dl>
            <dl>
                <dt>价格类型：</dt>
                <dd>{{price_type|typeFilter}}</dd>
            </dl>
            <dl>
                <dt>合同总额：</dt>
                <dd><h5 class="t_price"><span>￥</span><em>{{total_amt|money}}</em></h5></dd>
            </dl>
        </div>

        <!--发票-->
        <div class="hd_inv">
            <b></b>
            <span>发票信息</span>
        </div>
        <div class="order_inv">
            <dl>
                <dt><span>收票公司</span><em>：</em></dt>
                <dd>{{invoice_company}}</dd>
            </dl>
            <dl>
                <dt><span>税号</span><em>：</em></dt>
                <dd>{{invoice_taxno}}</dd>
            </dl>
            <dl>
                <dt><span>开户账号</span><em>：</em></dt>
                <dd>{{bank_account}}&nbsp;&nbsp;{{bank_name}}</dd>
            </dl>
            <dl>
                <dt><span>收票人</span><em>：</em></dt>
                <dd>{{invoice_taker}}&nbsp;&nbsp;{{invoice_mobile}}</dd>
            </dl>
            <dl class="dl_addr">
                <dt><span>收票地址</span><em>：</em></dt>
                <dd>{{invoice_addr}}</dd>
            </dl>
        </div>

        <footer class="btn_small" v-if="canPay">
            <a class="btn_red" @click="gotoBuy()">去下单</a>
        </footer>
        <div v-else class="spaceV"></div>

    </div>
</template>

<script>
    import { b2bService } from '../service'
    import util from '../lib/util'
    export default{
        data () {
            return {
                    noImage:require('../../static/images/noImg.png'),
                contract_code:'',
                contract_name:'',
                price_type:'',
                total_amt:'',
                docket_status_desc:'',
                docket_status:'',
                ship_linker:'',
                ship_tel:'',
                ship_addr:'',
                invoice_company:'',
                invoice_taxno:'',
                bank_account:'',
                invoice_addr:'',
                invoice_taker:'',
                invoice_mobile:'',
                goods_dept_name:'',
                bank_name:'',
                contract_id:'',
                canPay:false,
                details:[],
            }
        },
        components: {

        },
        methods: {
            initData(){
                this.getContracDetail();
            },
            goBack(){
                this.$router.goBack();

            },
            gotoBuy(){
              if(!this.canPay){
                return;
              }
              this.$router.push({path:'/ContractOrder',query:{contract_id:this.contract_id}});
            },
            async getContracDetail(){
                let _parmas = {
                    contract_code:this.$route.query.contract_code
                }
                let result = await b2bService.getContracDetail(_parmas);
                if(result.result==0){
                    return;
                }

                console.log(result);
                this.contract_code=result.data.contract_code;
                this.contract_name=result.data.contract_name;
                this.price_type=result.data.price_type;
                this.total_amt=result.data.total_amt;
                this.docket_status_desc=result.data.docket_status_desc;
                this.docket_status=result.data.docket_status;
                this.ship_linker=result.data.ship_linker;
                this.ship_tel=result.data.ship_tel;
                this.ship_addr=result.data.ship_addr;
                this.invoice_company=result.data.invoice_company;
                this.invoice_taxno=result.data.invoice_taxno;
                this.bank_account=result.data.bank_account;
                this.bank_name=result.data.bank_name;
                this.invoice_addr=result.data.invoice_addr;
                this.invoice_taker=result.data.invoice_taker;
                this.invoice_mobile=result.data.invoice_mobile;
                this.goods_dept_name=result.data.goods_dept_name;
                this.details=result.data.details;
                this.contract_id=result.data.id;
                this.details.forEach(good =>{
                  if(good.trade_num != good.goods_num){
                      this.docket_status=='30'?this.canPay = true:this.canPay = false;
                  }
                })

            }
        },
        computed: {

        },
        filters: {
            money:function(value){
                return util.price(value)
            },
            typeFilter(value){
                if(value == 1){
                    return '暂估价格';
                }
                return '发票价格';
            }
        },
        watch: {

        },
        created(){
            this.initData();
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_ocDetail";
    @import "../assets/components/yy_add_inv";
    @import "../assets/components/yy_orderlist";
    @import "../assets/components/yy_button";
    @import "../assets/components/yy_cover";
    @import "../assets/components/yy_load";

    .conBox{
        @include _conBox_detail;
    }

    footer{
        display:-moz-flex;
        display:-webkit-flex;
        display:flex;
        justify-content: flex-end;
        height: 2rem;
        padding: 0.375rem $spaceV;
    }
</style>
