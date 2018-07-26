<!--/*************************************************************************/-->
<!--/***************************       订单详情       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">订单详情</div>
            <i></i>
        </header>


        <dl class="address spaceHT">
            <dd>
            <p>收货人：{{ship_linker}}&nbsp;&nbsp;&nbsp;&nbsp;{{ship_mobile}}</p>
            <h5><i class="icon-address"></i><span>收货地址：{{ship_addr}}</span></h5>
            </dd>
        </dl>

        <div class="conBox">
            <div>
                <div class="hd">
                    <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                    <p>{{company_name}}_{{org_name}}</p>
                </div>

                <div class="cart">
                    <ul v-for="el in orderItemListGroup">
                        <li><img v-bind:src="el.image!=''?el.image:noImage"></li>
                        <li>
                            <h4>{{el.name}}</h4>
                            <h5 class="t_price"><span>￥</span><em>{{el.confirm_price|price}}</em><span>/吨</span></h5>
                            <p><span>合计{{el.confirm_num}}吨</span><em>已出库{{el.delivery_num}}吨</em></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="oDetail">
            <dl>
                <dt>订单编号：</dt>
                <dd>{{sn}}<strong>{{orderStatus}}</strong></dd>
            </dl>
            <dl>
                <dt>支付方式：</dt>
                <dd>{{payment_name}}</dd>
            </dl>
            <dl>
                <dt>运输方式：</dt>
                <dd>{{transTypeName}}</dd>
                <dt v-if="!this.transportVehicles">到站：</dt>
                <dd v-if="!this.transportVehicles">{{to_station}}</dd>
            </dl>
            <dl>
                <dt>预估运费：</dt>
                <dd><h5 class="t_price"><span>￥</span><em>{{shipping_amount|price}}</em></h5></dd>
            </dl>
            <dl>
                <dt>支付总额：</dt>
                <dd><h5 class="t_price"><span>￥</span><em>{{order_amount|price}}</em></h5></dd>
            </dl>
        </div>


        <div class="hd_inv" v-if="this.transportVehicles">
            <b></b>
            <span>承运信息</span>
        </div>
        <div class="order_inv" v-if="this.transportVehicles">
            <dl>
                <dt><span>车牌号</span><em>：</em></dt>
                <dd>{{this.transportVehicles.plate_number}}</dd>
            </dl>
            <dl>
                <dt><span>司机姓名</span><em>：</em></dt>
                <dd>{{this.transportVehicles.driver_name}}</dd>
            </dl>
            <dl>
                <dt><span>身份证号</span><em>：</em></dt>
                <dd>{{this.transportVehicles.person_number}}</dd>
            </dl>
            <dl>
                <dt><span>手机号码</span><em>：</em></dt>
                <dd>{{this.transportVehicles.cellphone}}</dd>
            </dl>
        </div>

        <div class="hd_inv">
            <b></b>
            <span>发票信息</span>
        </div>
        <div class="order_inv">
            <dl v-if="showCompany">
                <dt><span>收票公司</span><em>：</em></dt>
                <dd>{{invoice_company}}</dd>
            </dl>
            <dl v-if="showCompany">
                <dt><span>税号</span><em>：</em></dt>
                <dd>{{invoice_taxno}}</dd>
            </dl>
            <dl v-if="showCompany">
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

        <footer class="btn_small" v-if="showCancelPay">
            <a class="btn_white" v-show="showCancelPay" @click="cancel">取消订单</a>
            <a class="btn_red" v-show="showCancelPay" @click="goPay">去支付</a>
            <!--<a class="btn_blue" v-show="showReceive" @click="goReceptionDetail">收货详情</a>-->
        </footer>
        <div class="spaceV" v-else="showCancelPay"></div>

        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box">
                <div class="txt">
                    请输入取消原因：
                    <textarea type="text" placeholder="取消订单原因" v-model="reason"></textarea>
                </div>

                <ul class="btn">
                    <li @click="hideAlert">取消</li>
                    <li @click="trueDeleteOrder">确认</li>
                </ul>
            </div>
        </div>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    import util from '../lib/util'
    import alertTip from '../components/alertTip'
    import { b2bService } from '../service'
    export default {
        data(){
            return{
                order_id:'',
                sn:'',//订单编号
                orderStatus:'',//订单状态
                payment_name:'',//支付方式
                transTypeName:'',//运输方式
                to_station:'',//到站
                shipping_amount:'',//预估运费
                currency:'',//币种
                order_amount:'',//总支付金额
                ship_linker:'',//收货人
                ship_mobile:'',//电话
                ship_addr:'',//收货地址
                invoice_company:'',//公司名称
                invoice_taxno:'',//纳税人识别号
                bank_name:'',//开户行
                bank_account:'',//开户帐号
                invoice_taker:'',//收票人
                invoice_mobile:'',//收票人联系电话
                invoice_addr:'',//收票地址
                company_name:'',//产品公司名称
                org_name:'',//产品部门名称
                orderItemListGroup:[],//购物清单
                ifAlert:false,
                reason:'',//取消订单的原因
                showCancelPay:false,//显示取消和支付按钮
                showReceive:false, //显示收货详情
                showCompany:true,//是否显示公司
                noImage:require('../../static/images/noImg.png'),
                //显示弹框设置
                showNotice:false,
                options: '',
                transportVehicles:'',//承运信息
            }
        },
        filters:{
            price(value){
              return util.price1(value)
            }
        },
        components: {
            alertTip,
        },
        methods: {
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
                this.$router.goBack();
            },
            goPay(){
                this.$router.push({path:'payment',query:{orderId:this.order_id}})
            },
            goReceptionDetail(el){
              this.$router.push({path:'receptionGoodsDetail'})
            },
            cancel : function(){
                this.ifAlert=true;
            },
            hideAlert : function(){
                this.ifAlert=false;
            },
            trueDeleteOrder : function(){
                this.cancelOrder(this.sn);
            },
            async cancelOrder(sn){
                if(this.reason==''){
                    this.showNotice=true;
                    this.options='请填写理由';
                    return;
                }

                let _parmas = {
                    sn:sn,
                    reason:this.reason
                }
                let res=await b2bService.cancelOrder(_parmas);
                if(res.code==1){
                    this.showNotice=true;
                    this.options='取消成功';
                    this.goBack();

                }else{
                    this.showNotice=true;
                    this.options=res.message;
                }
            },
            initData(){
                this.getOrderDetailInfo();
            },
            async getOrderDetailInfo(){
                let res = await b2bService.getOrderDetailInfo({orderid:this.order_id});
                console.log(res.result)
                if (res.result == 1) {
                    console.log(res.data.order.sn);
                    this.sn = res.data.order.sn;
                    this.orderStatus = res.data.order.orderStatus;
                    (res.data.order.orderStatus == '待支付'|| res.data.order.orderStatus == '支付中') ? this.showCancelPay = true : this.showCancelPay = false;
                    res.data.order.orderStatus == '已完成' ? this.showReceive = true : this.showReceive = false;

                    this.payment_name = res.data.order.payment_name;
                    this.transTypeName = res.data.order.trans_type_name;
                    this.to_station = res.data.order.to_station;
                    this.shipping_amount = res.data.order.shipping_amount;
                    this.currency = res.data.order.currency;
                    this.order_amount = res.data.order.order_amount;
                    this.ship_linker = res.data.order.ship_linker;
                    this.ship_mobile = res.data.order.ship_mobile;
                    this.ship_addr = res.data.order.ship_addr;
                    this.invoice_company = res.data.order.invoice_company;
                    this.invoice_company == "" ? this.showCompany = false : this.showCompany = true;
                    this.invoice_taxno = res.data.order.invoice_taxno;
                    this.bank_name = res.data.order.bank_name;
                    this.bank_account = res.data.order.bank_account;
                    this.invoice_taker = res.data.order.invoice_taker;
                    this.invoice_mobile = res.data.order.invoice_mobile;
                    this.invoice_addr = res.data.order.invoice_addr;
                    this.company_name = res.data.order.company_name;
                    this.org_name = res.data.order.org_name;
                    this.orderItemListGroup = res.data.order.orderItemListGroup[0];
                    if(res.data.transportVehicles[0]){
                        this.transportVehicles=res.data.transportVehicles[0];
                    }

                }
                console.log(this.sn);


            },
        },
        computed:{

        },
        watch:{

        },
        created(){
            console.log(this.$route.query);
            this.order_id=this.$route.query.order_id;
            this.initData(this.order_id);
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

    dl.address{
        dd{
            width: 100%;
        }
    }

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

        a{
            margin-left: 0.5rem;
        }
    }
</style>
