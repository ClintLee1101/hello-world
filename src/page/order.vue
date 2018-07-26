<!--/*************************************************************************/-->
<!--/***************************       确认下单       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="order">

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">确认下单</div>
            <i></i>
        </header>

        <!--有地址-->
        <dl class="address spaceHT" @click="pickAddr" v-if="!noAddr">
            <dd>
                <p v-show="showCompany">收货单位：{{company_name}}</p>
                <p v-show="!showCompany">收货人：{{name}}&nbsp;&nbsp;&nbsp;&nbsp;{{mobile}}</p>
                <p v-show="showCompany">联系人：{{name}}&nbsp;&nbsp;&nbsp;&nbsp;{{mobile}}</p>
                <h5><i class="icon-address"></i><span>收货地址：{{addr}}</span></h5>
            </dd>
            <dt>
                <i class="icon-arrowR"></i>
            </dt>
        </dl>

        <!--无地址-->
        <dl class="noData spaceHT" v-else-if="noAddr" @click="pickAddr">
            <p><i class="icon-add"></i>添加新地址</p>
        </dl>

        <div class="address_link"></div>

        <div class="conBox">
            <div v-for="el in orders">
                <div class="hd">
                    <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                    <p>{{el.preOrderName}}</p>
                </div>

                <div class="cart">
                    <ul v-for="el in el.cartItems" @click="openDetail(el)">
                        <li><img v-bind:src="el.image_default!=''?el.image_default:noImg"></li>
                        <li>
                            <h4>{{el.name}}</h4>
                            <h5 class="t_price"><span>￥</span><em>{{el.price | money}}</em><span>/吨</span></h5>
                            <p>x{{el.num}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <ul class="list50 order">
            <li>
                <span>运输方式</span>
                <select name="way" v-model="selected">
                    <option value='choose'>请选择</option>
                    <option v-for="(value,key) in trans" v-bind:value='key'>{{value}}</option>
                </select>
                <i class="icon-arrowR"></i>
            </li>
            <li v-show="showWay">
                <span>{{way}}</span>
                <select name="" class="select_city select_city_byTrain" v-if="showStation"
                        v-model="city_selected_byTrain">
                    <option value="choose">选择城市</option>
                    <option v-for="el in station" :value="el.dest_station_code">{{el.station_name}}</option>
                </select>
                <b></b>
                <i class="icon-arrowR"></i>
            </li>
            <li class="li_date">
                <span>期望发货日期</span>
                <date-picker :date="date" :option="option" :limit="limit"></date-picker>
                <i class="icon-arrowR"></i>
            </li>
            <li>
                <span>支付方式</span>
                <select name="" v-model="payMent">
                    <option v-for="(value,key) in paymentStyle" v-bind:value="key">{{value}}</option>
                </select>
                <i class="icon-arrowR"></i>
            </li>
        </ul>

        <div class="hd_inv" @click="pickCarriage" v-if="!noCarriage">
            <b></b>
            <span>选择承运信息</span>
            <i class="icon-arrowR"></i>
        </div>
        <!--有承运信息-->
        <div class="order_inv" @click="pickCarriage" v-if="!noCarriage">
            <dl>
                <dt><span>车牌号</span><em>：</em></dt>
                <dd>{{this.selectTransport.plate_number}}</dd>
            </dl>
            <dl>
                <dt><span>司机姓名</span><em>：</em></dt>
                <dd>{{this.selectTransport.driver_name}}</dd>
            </dl>
            <dl>
                <dt><span>身份证号</span><em>：</em></dt>
                <dd>{{this.selectTransport.person_number}}</dd>
            </dl>
            <dl>
                <dt><span>手机号码</span><em>：</em></dt>
                <dd>{{this.selectTransport.cellphone}}</dd>
            </dl>
        </div>

        <div class="hd_inv" @click="pickInvoice" v-if="!noInvoice">
            <b></b>
            <span>发票信息</span>
            <i class="icon-arrowR"></i>
        </div>
        <!--有发票-->
        <div class="order_inv" @click="pickInvoice" v-if="!noInvoice">
            <template v-show="this">
                <dl>
                    <dt><span>收票公司</span><em>：</em></dt>
                    <dd>{{invoice_company}}</dd>
                </dl>
                <dl v-if="!isPerInvoice">
                    <dt><span>税号</span><em>：</em></dt>
                    <dd>{{tax_num}}</dd>
                </dl>
                <dl v-if="!isPerInvoice">
                    <dt><span>开户账号</span><em>：</em></dt>
                    <dd>{{bank_num}}&nbsp;&nbsp;{{bank_name}}</dd>
                </dl>
            </template>
            <dl>
                <dt><span>收票人</span><em>：</em></dt>
                <dd>{{invoice_taker}}&nbsp;&nbsp;{{invoice_mobile}}</dd>
            </dl>
            <dl>
                <dt><span>收票地址</span><em>：</em></dt>
                <dd>{{invoice_receive_address}}</dd>
            </dl>
        </div>

        <!--无发票-->
        <dl class="noData" @click="pickInvoice" v-else-if="noInvoice">
            <p><i class="icon-add"></i>添加新发票</p>
        </dl>


        <div class="order_total">
            <h6><em>共{{total_num}}件商品 合计：</em><strong class="t_price"><span>¥</span><em>{{totleprice|money}}</em></strong></h6>
            <h6><em>预估运费：</em><strong class="t_price"><span>¥</span><em>{{shippingPrice|money}}</em></strong></h6>
        </div>

        <footer class="footOrder">
            <li>
                <div class="txt">
                    <h5>合计</h5>
                    <h6>(不含运费)</h6>
                </div>
                <p class="t_price"><span>￥</span><em>{{totleprice | money}}</em></p>
            </li>
            <li>
                <a @click="submitOrder">提交订单</a>
            </li>
        </footer>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
        <loading v-show="showLoading"></loading>
    </div>


</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import util from '../lib/util'
    import loading from '../components/loading'
    import alertTip from '../components/alertTip'
    import { b2bService } from '../service'
    import myDatepicker from 'vue-datepicker'
    export default{
        name: 'order',
        components: {
            alertTip,
            'date-picker': myDatepicker,
            loading
        },
        data () {
            return {
                ddr: '',
                addr_id: '',
                name: '',
                mobile: '',
                self: '',
                train: '',
                selected: "choose",//选择收货方式 双向绑定
                showWay: false,
                showSelfWay: false,
                noCarriage:true,
                way: '',
                orders: [],
                cartItems: [],
                province: '选择省份',
                province_id: '',
                provices: {},
                invoice_company: '',
                invoice_receive_address: '',
                tax_num: '',
                bank_num: '',
                bank_name:'',
                invoice_mobile: '',
                invoice_taker: '',
                paymentStyle: {},
                station: [],
                showStation: true,
                code: '',//运费参数
                shippingPrice: '',
                trans: {},//运输方式
//                proviceCode: '',
                pro_selected: '',
                city_selected_byTrain: 'choose',//双向绑定 到站火车
                total_num: '',//商品总数
                totleprice: '',//商品总价
                noAddr: false,
                noInvoice: false,
                payMent: 5,//支付方式,
                wealthUserId:'',//理财账户
                trans_type_id: '',//运输方式
                receiver_type_id: '',
                showCompany: '',
                company_name: '',
                contactPerson: '',
                invoice_type_id: 0,
                id: 0,
                this: '',
                noImg: require('../../static/images/noImg.png'),
                day: '',
                addr: '',
                //显示弹框设置
                showNotice: false,
                currentDate: '2017-6-20',
//                alertConfig:{
//                    show:false,//默认不显示提示框
//                    autoClose: true,//自动关闭
//                    backgroundColor: '#fc5050',//弹框背景色
////                    textColor: '#92253f',//字体颜色
//                    content: '', //弹框内容、
//                    showTime: 2000,//显示时间
//                    countdownBar: true,//剩余时间进度条
//                    barColor: '#46A3F3'//进度条颜色
//                },
                options: '',
                //显示弹框设置结束
                showLoading: false,
                isPerInvoice: false,//是否是个人发票

                //日历
                // for Vue 2.0
                startTime: {
                    time: ''
                },
                endtime: {
                    time: ''
                },

                option: {
                    type: 'day',
                    week: [],
                    month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    format: 'YYYY-MM-DD',
                    placeholder: '请输入日期',
                    inputStyle: {
                        'display': 'inline-block',
                        'line-height': '3.125rem',
                        'height': '3rem',
                        'font-size': '0.875rem',
                        'border': 'none',
                        'color': '#333',
                        'float': 'right',
                        'text-align': 'right'
                    },
                    color: {
                        header: '#ccc',
                        headerText: '#f00'
                    },
                    buttons: {
                        ok: '确定',
                        cancel: '取消'
                    },
                    overlayOpacity: 0.5, // 0.5 as default
                    dismissible: true // as true as default
                },
                date: {
                    time: '' // string
                },
                timeoption: {
                    type: 'min',
//                    week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    format: 'YYYY-MM-DD HH:mm'
                },
                multiOption: {
                    type: 'multi-day',
//                    week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    format: "YYYY-MM-DD HH:mm"
                },
                limit: [{
//                    type: 'weekday',
//                    available: [1, 2, 3, 4, 5]
                },
                    {
                        type: 'fromto',
                        from: this.currentDate,
                        to: '2199-12-31'
                    }
                ]

            }
        },
        //运输方式选择
        watch: {
            selected: function (v, oldVal) {
                this.shippingPrice = '';
                if (v == "TRAIN" || v == 'TRAIN_BOX') {
                    console.log('it is'+v);
                    this.selected=v;
                    this.trans_type_id=v;
                    this.showWay = true;
                    this.noCarriage=true;
                    this.way = '到站';
                    this.showStation = true;
                    this.code = 'destStation_code';
                    this.getTransportByTrain();
                } else if (v == 'CAR' || v == 'SELF') {
                    this.selected=v;
                    this.trans_type_id=v;
                    console.log('it is'+v);
                    this.showWay = false;
                    if(v == 'CAR'){
                        this.way = '';
                        this.noCarriage=true;
                    }else{
                        this.noCarriage=false;
                    }
                    this.showStation = false;
                    this.code = 'wh_code';
                    this.city_selected_byTrain = 'choose';
                }
                else {
                    this.showWay = false;
                    this.code = '';
                }
                this.getFreightByProvince();
            },
            //付款方式
            payMent: function (v, oldVal) {
                this.payMent = v;
                if(this.payMent==13&&!this.wealthUserId){
                    this.showNotice = true;
                    this.options = '没有理财账户，不可用证联支付';
                }
                if(this.payMent==13&&this.wealthUserId&&this.licaiInfo[0].length==0){
                    this.$router.push({path:'/MyAccountCardAdd'})
                }
            },
            //到站城市选择
            city_selected_byTrain: function (v) {
                this.city_selected_byTrain = v;
            }
        },
        computed: {
            ...mapState([
                'orderInfo',
                'selectInvoice',
                'selectAddress',
                'selectTransport',
                'licaiInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'getOrderInfo'
            ]),
            //关闭弹框
            close(){
                this.options = '';
                this.showNotice = false;
            },

            openDetail: function (item) {
                this.$router.push({path: '/goodsDetail/' + item.goods_id})
            },
            //关闭弹框结束
            goBack: function () {
                this.$router.goBack();
            },
            //选择地址
            pickAddr: function () {
                this.getOrderInfo([this.pro_selected, this.city_selected_byTrain, this.way, this.date.time, this.city_selected_bySelf, this.shippingPrice, this.payMent, this.selected])
                this.$router.push({path: '/address'})
            },
            //选择发票
            pickInvoice: function () {
                this.getOrderInfo([this.pro_selected, this.city_selected_byTrain, this.way, this.date.time, this.city_selected_bySelf, this.shippingPrice, this.payMent, this.selected])
                this.$router.push({path: '/invoiceList'})
            },
            //去承运信息
            pickCarriage:function(){
                this.getOrderInfo([this.pro_selected, this.city_selected_byTrain, this.way, this.date.time, this.city_selected_bySelf, this.shippingPrice, this.payMent, this.selected])
                this.$router.push({path: '/Carriage'})
            },
            goToAddr: function () {

            },
            submitOrder: function () {
                console.log(this.noInvoice);
                console.log(this.date.time);
                if (this.payMent==13&&!this.wealthUserId) {
                    this.showNotice = true;
                    this.options = '没有理财账户，不可用证联支付';
                    return;
                }else if (!this.addr_id) {
                    this.showNotice = true;
                    this.options = '请填写地址';
                    return;
                } else if (this.selected == 'choose'||this.selected =='') {
                    this.showNotice = true;
                    this.options = '请选择运输方式';
                    return
                }else if (this.selected == 'SELF'&&!this.selectTransport.person_number) {
                    this.showNotice = true;
                    this.options = '请选择添加承运人信息';
                    return;
                }else if (this.date.time == '') {
                    this.showNotice = true;
                    this.options = '请填写日期';
                    return
                }else if (this.city_selected_byTrain == 'choose' && this.way == '到站') {
                    this.showNotice = true;
                    this.options = '请选择城市';
                    return;
                } else if (this.noInvoice||!this.id) {
                    this.showNotice = true;
                    this.options = '请填写发票信息';
                    return;
                }
                this.createOrder()

            },
            async getConfirmOrder(){
                this.showLoading = true;
                let data = await b2bService.getConfirmOrder();
                if (data.result != 1) return;
                this.showLoading = false;
                this.setData(data);
            },
            async getImmediateOrder(){
                this.showLoading = true;
                let parmas={
                    goodsid:this.$route.query.goodsid,
                    num:this.$route.query.num,
                    store_id:this.$route.query.store_id,
                };
                let data = await b2bService.getImmediateOrder(parmas);
                this.showLoading = false;
                if (data.result != 1) {
                    this.showNotice = true;
                    this.options = data.message;
                    return;
                }

                this.setData(data);
            },
            setData: function (data) {

                if (data.result == 0) {
                    return;
                }
                if (data.data.defaultAddress == null || data.data.defaultAddress == '') {
                    this.noAddr = true;
                }
                if (data.data.defaultInvoiceCompany == null || data.data.defaultInvoiceCompany == '') {
                    this.noInvoice = true;
                }
                if (data.data.defaultAddress) {
                    this.receiver_type_id = this.selectAddress.receiver_type_id||data.data.defaultAddress.receiver_type_id;
                    this.addr = this.selectAddress.addr||data.data.defaultAddress.addr;
                    this.company_name = this.selectAddress.company_name||data.data.defaultAddress.company_name;
                    this.addr_id = this.selectAddress.addr_id||data.data.defaultAddress.addr_id;
                    this.name = this.selectAddress.name||data.data.defaultAddress.name;
                    this.mobile = this.selectAddress.mobile||data.data.defaultAddress.mobile;
                    this.province_id = this.selectAddress.province_id||data.data.defaultAddress.province_id;
                    this.getFreightByProvince();
                    this.getTransportByTrain();
                }
                if (data.data.defaultInvoiceCompany) {
                    this.invoice_type_id = this.selectInvoice.invoice_type_id || data.data.defaultInvoiceCompany.invoice_type_id;
                    this.id = this.selectInvoice.id || data.data.defaultInvoiceCompany.id;
                    this.invoice_company = this.selectInvoice.company_name || data.data.defaultInvoiceCompany.company_name;
                    this.invoice_receive_address = this.selectInvoice.invoice_receive_address || data.data.defaultInvoiceCompany.invoice_receive_address;
                    this.tax_num = this.selectInvoice.tax_num || data.data.defaultInvoiceCompany.tax_num;
                    this.bank_num = this.selectInvoice.bank_num || data.data.defaultInvoiceCompany.bank_num;
                    this.bank_name = this.selectInvoice.bank_name || data.data.defaultInvoiceCompany.bank_name;
                    if (!this.bank_num) {
                        this.isPerInvoice = true;
                    }
                    this.invoice_mobile = this.selectInvoice.mobile || data.data.defaultInvoiceCompany.mobile;
                    this.invoice_taker = this.selectInvoice.invoice_taker || data.data.defaultInvoiceCompany.invoice_taker;
                }
                console.log(this.receiver_type_id);
                if (this.receiver_type_id == '0') {
                    this.showCompany = false
                } else {
                    this.showCompany = true
                }
                if (this.invoice_type_id == 2) {
                    this.showCompanyByInvoice = false
                } else {
                    this.showCompanyByInvoice = true
                }
                this.self = data.data.trans.SELF;
                this.train = data.data.trans.TRAIN;
                this.trans = data.data.trans;
                delete this.trans.SEA;
                this.orders = data.data.orders;
                this.provices = data.data.provices;
                this.paymentStyle = data.data.paymentStyle;
                console.log(this.paymentStyle);
                this.totleprice = data.data.totleprice;
                this.total_num = data.data.total_num;
            },
            async getAddr(){
                let _parmas={
                    addressid:this.$router.query.addressid
                }
                let result = await b2bService.getAddr(_parmas)
                if (result.result == 0) return;
                if (result.data.address) {
                    this.receiver_type_id = result.data.address.receiver_type_id;
                    if (this.receiver_type_id == '0') {
                        this.showCompany = false
                    } else {
                        this.showCompany = true
                    }
                    this.addr = result.data.address.addr;
                    this.company_name = result.data.address.company_name;
                    this.contact_name = result.data.address.contact_name;
                    this.addr_id = result.data.address.addr_id;
                    this.name = result.data.address.name;
                    this.mobile = result.data.address.mobile;
                    this.province = result.data.address.province;
                    this.pro_selected =result.data.address.province_id;

                    this.province_id = result.data.address.province_id;
                }
            },
            async getInvoice(){
                let result = await b2bService.getInvoice({invoiceCompany_id:this.invoiceCompany_id})
                if (result.result == 0) return;
                this.invoice_type_id = result.data.invoice_type_id;
                if (this.invoice_type_id == 2) {
                    this.showCompanyByInvoice = false
                } else {
                    this.showCompanyByInvoice = true
                }
                this.id = result.data.id;
                this.invoice_company = result.data.company_name;
                this.invoice_receive_address = result.data.invoice_receive_address;
                this.tax_num = result.data.tax_num;
                this.bank_num = result.data.bank_num;
                this.bank_name = result.data.bank_name;
                this.invoice_mobile = result.data.mobile;
                this.invoice_taker = result.data.invoice_taker;
            },
            async getTransportByTrain(){
                let _parmas = {
                    proviceCode:this.province_id,
                    transType:this.selected
                }
                let result = await b2bService.getTransportByTrain(_parmas)
                if (result.result == 0) {
                    return;
                }
                this.station = result.data;
            },
            async getFreightByProvince(){
                let _parmas = {
                    ship_area_code:this.province_id,
                    transType:this.trans_type_id
                };
                let result = await b2bService.getFreightByProvince(_parmas);
                if (result.result == 0) return;
                this.shippingPrice = result.data.shippingPrice;
                console.log('shippingPrice='+this.shippingPrice)
            },
            async createOrder(){
                if(this.trans_type_id=='TRAIN'||this.trans_type_id=='TRAIN_BOX'){
                    let _parmas = {
                        paymentId:this.payMent,
                        saveAddress:this.addr_id,
                        expectDeliveryTime:this.date.time,
                        invoice_company_id:this.id,
                        trans_type_id:this.trans_type_id,
                        destStationId:this.city_selected_byTrain,
                        ship_area_code:this.province_id,
                        tvids:'',
                    }
                    var result = await b2bService.createOrder(_parmas);
                }else if(this.trans_type_id=='CAR'){
                    let _parmas = {
                        paymentId:this.payMent,
                        saveAddress:this.addr_id,
                        expectDeliveryTime:this.date.time,
                        invoice_company_id:this.id,
                        trans_type_id:this.trans_type_id,
                        destStationId:'',
                        ship_area_code:this.province_id,
                        tvids:'',
                    }
                    var result = await b2bService.createOrder(_parmas);
                }else if(this.trans_type_id=='SELF'){
                    let _parmas = {
                        paymentId:this.payMent,
                        saveAddress:this.addr_id,
                        expectDeliveryTime:this.date.time,
                        invoice_company_id:this.id,
                        trans_type_id:this.trans_type_id,
                        destStationId:'',
                        ship_area_code:this.province_id,
                        tvids:this.selectTransport.id,
                    }
                    var result = await b2bService.createOrder(_parmas);
                }

                if (result.result !== 1) {
                    this.showNotice = true;
                    this.options = result.message;
                } else {
                    this.$router.push({path: '/success'})
                }
            }
        },
        filters: {
            money: function (value) {
                return util.price1(value)
            }
        },
        created () {
            this.wealthUserId=localStorage.getItem("userId");
            console.log(this.selectTransport);
            this.currentDate = util.getTimeStr(new Date().getTime());
            this.limit[1].from = this.currentDate;
            this.orderInfo.date ? this.date.time = this.orderInfo.date : '';
            this.orderInfo.payment ? this.payMent = this.orderInfo.payment : '5';
            this.orderInfo.selected?this.selected = this.orderInfo.selected:this.selected ='choose';
            if (this.orderInfo.selected == 'TRAIN' || this.orderInfo.selected == 'TRAIN_BOX') {
                this.showWay = true;
                this.showStation = true;
            } else {
                this.showWay = false;
                this.showStation = false;
            }
            this.orderInfo.city_selected_byTrain ? this.city_selected_byTrain = this.orderInfo.city_selected_byTrain : '';
            console.log(this.city_selected_byTrain);
            if (this.$route.query.goodsid) {
                this.getImmediateOrder()
            } else {
                this.getConfirmOrder()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/layout/yy_footer';
    @import "../assets/components/yy_orderlist";
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_add_inv";
    @import "../assets/components/yy_orderSelect";
    @import "../assets/components/yy_cover";
    @import "../assets/components/yy_load";
</style>
