<!--/*************************************************************************/-->
<!--/************************       合同 - 确认下单      **********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">确认下单</div>
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
            <div class="hd">
                <i class="icon-logo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></i>
                <p>贵州开磷化肥有限责任公司_{{goods_dept_name}}</p>
            </div>
            <div v-for="el in groupContracts">
                <div class="contract" v-for="(elem,index) in el">
                    <h5>{{elem.goods_name}}</h5>
                    <ul>
                        <li>
                            <p class="t_price"><span>￥</span><em>{{elem.goods_price}}</em><span>.00/吨</span></p>
                            <input name="" type="number" placeholder="输入下单量"  :disabled="elem.kxdl==0" v-on:input="orderNumFunc(index)" v-model="dataModel[index].value">
                        </li>
                        <li>
                            <h5>可下单量</h5>
                            <p>{{elem.kxdl}}<span>吨</span></p>
                        </li>
                        <li>
                            <h5>合同量</h5>
                            <p>{{elem.goods_num}}<span>吨</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!--运输方式-->
        <ul class="list50 order">
            <li>
                <span>运输方式</span>
                <select name="way" v-model="selected">
                    <option :value="trans_type">{{trans_type_desc}}</option>
                </select>
                <i class="icon-arrowR"></i>
            </li>
            <li v-if="showStation">
                <span>{{way}}</span>
                <select name="" class="select_city" v-if="showStation" v-model="city_selected_byTrain">
                    <option value="">选择城市</option>
                    <option v-for="el in station" v-bind:value="el.dest_station_code">{{el.station_name}}</option>
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
                <select name="">
                    <option value="余额支付">余额支付</option>
                </select>
                <i class="icon-arrowR"></i>
            </li>
        </ul>

        <!--合同-->
        <div class="order_inv">
            <dl>
                <dt><span>合同编号</span><em>：</em></dt>
                <dd>{{contract_code}}<strong>{{docket_status_desc}}</strong></dd>
            </dl>
            <dl>
                <dt><span>合同名称</span><em>：</em></dt>
                <dd>{{contract_name}}</dd>
            </dl>
            <dl>
                <dt><span>分公司名称</span><em>：</em></dt>
                <dd>{{sale_dept_name}}</dd>
            </dl>
            <dl>
                <dt><span>价格类型</span><em>：</em></dt>
                <dd>{{price_type|typeFilter}}</dd>
            </dl>
        </div>

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
                <dd>{{partyb_taxno}}</dd>
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
                <dd>{{invoice_company_addr}}</dd>
            </dl>
        </div>

        <div class="order_total">
            <h6><em>共{{total_num}}件商品 合计：</em><strong class="t_price"><span>¥</span><em>{{total_price}}</em><span>.00</span></strong></h6>
            <h6><em>预估运费：</em><strong class="t_price"><span>¥</span><em>{{shippingPrice}}</em><span>.00</span></strong></h6>
        </div>

        <footer class="footOrder">
            <li>
                <div class="txt">
                    <h5>合计</h5>
                    <h6>(不含运费)</h6>
                </div>
                <p class="t_price"><span>￥</span><em>{{total_price}}</em></p>
            </li>
            <li>
                <a @click="submitOrder">提交订单</a>
            </li>
        </footer>

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import util from '../lib/util'
    import{
        GlobelObj
    } from '../components/Global.vue'
    import alertTip from '../components/alertTip'
    import { b2bService } from '../service'
    import myDatepicker from 'vue-datepicker'
    export default{
        components: {
            alertTip,
            'date-picker': myDatepicker
        },
        data() {
            return {
                contract_code:'',
                contract_name:'',              //合同名称
                docket_status_desc:'',              //合同状态
                sale_dept_name:'',              //分公司名称
                contract_type:'',           //合同类型

                ship_addr:'',              //收货地址
                ship_customer:'',              //收货单位
                ship_linker:'',              //收货联系人
                ship_tel:'',              //收获电话

                price_type:'',              //价格类型
                trans_type:'',              //运输方式
                trans_type_desc:'',
                payment_Type:'',

                ship_Province_code:'',              //省份代码
                //entity.groupContracts.id: '',              //合同详情id
                goods_dept_name:'',              //产品部门名称
                groupContracts:[],              //商品清单
                //groupContracts.goodsid:'',              //商品id
                //groupContracts.thumbnail:'',              //商品图片
                //groupContracts.goods_code:'',              //商品编码
                //details.id:'',              //合同明细id
                payment_Type_Name:'',              //支付方式名称
                invoice_company:'',              //支付单位名称
                partyb_taxno:'',              //购方税号
                bank_account:'',              //开户账号
                bank_name:'',              //开户行
                invoice_taker:'',              //发票接受人
                invoice_mobile:'',              //联系方式
                invoice_company_addr:'',            //收票地址
                noCarriage:true,// 没有承运信息
                selected: "",//选择收货方式 双向绑定
                showSelfWay:false,
                way:'',
                orders:[],
                cartItems:[],
                def_invoice_company:'',
                invoice_receive_address:'',
                tax_num:'',
                bank_num:'',
                paymentStyle:{},
                station:[],
                showStation:true,
                code:'',//运费参数
                proviceCode:'',
                freightCode:'',//到站运费城市代码
                city_selected_byTrain:'',//双向绑定 到站火车
                total_num:0,//商品总数
                orderNum:'',//输入下单数量
                total_price:0,//商品总价
                shippingPrice:0,
                submitMessage:'',
                num:[],//输入的下单量
                itemids:[],//合同id
                arr2:[],//可下单量数组
                // 创建一个空的数组存v-model
                dataModel: [],
                //显示弹框设置
                showNotice:false,
                options: '',//显示弹框内容
                expectDeliveryTime:'',
                currentDate: '2017-09-20',
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
                    format:"YYYY-MM-DD HH:mm"
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
        created(){
            this.currentDate = util.getTimeStr(new Date().getTime());
            this.limit[1].from = this.currentDate;
            console.log(this.selectTransport);
            this.initData()
        },
        methods: {
            close(){
                this.options='';
                this.showNotice=false;
            },
            async initData(){
                let _parmas = {
                    contract_id:this.$route.query.contract_id
                }
                let result = await b2bService.getContracOrder(_parmas);
                if(result.result==0){
                    return;
                }
                this.contract_code=result.data.entity.contract_code;
                this.contract_name=result.data.entity.contract_name;
                this.docket_status_desc=result.data.entity.docket_status_desc;
                this.sale_dept_name=result.data.entity.sale_dept_name;
                this.contract_type=result.data.entity.contract_type;
                this.price_type = result.data.entity.price_type;
                this.ship_linker=result.data.entity.ship_linker;
                this.ship_addr=result.data.entity.ship_addr;
                this.ship_customer=result.data.entity.ship_customer;
                this.ship_tel=result.data.entity.ship_tel;
                this.goods_dept_name=result.data.entity.goods_dept_name;
                this.ship_Province_code=result.data.entity.ship_Province_code;
                this.trans_type=result.data.entity.trans_type;
                this.selected=result.data.entity.trans_type;
                this.trans_type_desc=result.data.entity.trans_type_desc;
                if(result.data.entity.trans_type=="CAR"||result.data.entity.trans_type=="SELF"){
                    this.showStation=false;
                    result.data.entity.trans_type=="SELF"?this.noCarriage=false:this.noCarriage=true;

                }else{
                    this.way='到站';
                    this.showStation=true;
                }
                this.payment_Type=result.data.entity.payment_Type;
                this.provices=result.data.provices;

                this.groupContracts=result.data.entity.groupContracts;
                this.invoice_company=result.data.entity.invoice_company;
                this.partyb_taxno=result.data.entity.partyb_taxno;
                this.bank_account=result.data.entity.bank_account;
                this.bank_name=result.data.entity.bank_name;
                this.invoice_taker=result.data.entity.invoice_taker;
                this.invoice_mobile=result.data.entity.invoice_mobile;
                this.invoice_company_addr=result.data.entity.invoice_company_addr;
                //多个input循环 v-model动态生成
                console.log(this.groupContracts[0]);
                var len=this.groupContracts[0].length;
                for (var i = 0; i < len; i ++) {
                    var item = {value: ''};
                    this.dataModel.push(item);
                }
                if(GlobelObj.contractInfo.contract_id==this.$route.query.contract_id){
                    if(GlobelObj.contractInfo.dataModel){
                        this.dataModel=GlobelObj.contractInfo.dataModel;
                    }
                    this.date.time=GlobelObj.contractInfo.time;
                    this.itemids =GlobelObj.contractInfo.itemids;
                    this.num=GlobelObj.contractInfo.num;
                }else{
                    GlobelObj.contractInfo={};
                }
                if(this.itemids!=undefined&&this.num!=undefined){
                    this.getFreightByContract();
                }
                this.getTransportByTrain();
            },
            goBack(){
                this.$router.goBack()
            },
            pickCarriage(){
                GlobelObj.contractInfo.contract_id=this.$route.query.contract_id;
                GlobelObj.contractInfo.time=this.date.time;
                this.$router.push({path: '/Carriage'})
            },
            async getTransportByTrain(){
                let _parmas = {
                    proviceCode:this.ship_Province_code,
                    transType:this.selected
                }
                let result = await b2bService.getTransportByTrain(_parmas)
                if(result.result==0){
                    return;
                }
                this.station=result.data;
            },
            async getFreightByContract(){
                let _parmas = {
                    contract_id:this.$route.query.contract_id,
                    ship_area_code:this.ship_Province_code,
                    transType:this.trans_type,
                    itemids:this.itemids.join(","),
                    num:this.num.join(","),
                }
                let result = await b2bService.getFreightByContract(_parmas);
                if(result.result==0) return;
                this.total_num=result.data.total_num;
                this.shippingPrice=result.data.total_ship_fee;
                this.total_price=result.data.total_goods_price;
            },
            orderNumFunc(index){
                if(this.dataModel[index].value<0){
                    this.options='输入数字不合法';
                    this.showNotice=true;
                    return;
                }else{
                    this.dataModel[index].value=amount(this.dataModel[index].value);
                    console.log(this.dataModel[index].value);
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
                }
//                    var i=this.dataModel[index].value.indexOf('.');
//                    if(i>0){
//                        this.dataModel[index].value=Number(this.dataModel[index].value).toFixed(2);
//                    }
                this.num=[];
                this.itemids=[];
                var num=[];
                var id=[];
                this.dataModel.forEach( item=> {
                    if(item.value==''){
                        num.push(0);
                    }else{
                        num.push(item.value);
                    }
                });
                this.num=num;
                GlobelObj.contractInfo.dataModel=this.dataModel;
                var list=this.groupContracts[0];
                list.forEach( item=> {

                    id.push(item.id);
                });
                this.itemids=id;
                GlobelObj.contractInfo.itemids=this.itemids
                GlobelObj.contractInfo.num=this.num
                if(this.dataModel[index].value>this.groupContracts[0][index].kxdl){
                    this.showNotice=true;
                    this.options='下单量大于可下单量';
                    this.dataModel[index].value='';
                    return;
                }
                this.getFreightByContract();
            },
            submitOrder(){
                var emptyLength=0,emptyFlag=false,numFlag=false,submitFlag=false;
                for(var i=0,l=this.num.length;i<l;i++){
                    this.num[i]=="0"?emptyLength++:'';
                }
                emptyLength==l? emptyFlag=true: emptyFlag=false;
                for(var i=0;i<l;i++){
//                    if(this.num[i].toString().substr(0,1)=="0"&&this.num[i].toString().length>=2||this.num[i].toString().substr(0,1)=="."){
//                        numFlag=true;
//                        break;
//                    }
//                    if(this.num[i].toString().indexOf(".")>0){
//                        numFlag=true;
//                        break;
//                    }
                    if(this.num[i]>this.groupContracts[0][i].kxdl){
                        submitFlag=true;
                        break;
                    }
                }
                if(emptyFlag){
                    this.options='必须输入正确可下单量';
                    this.showNotice=true;
                    return;
                }
                if(numFlag){
                    this.options='输入数字格式不合法';
                    this.showNotice=true;
                    return;
                }
                if(submitFlag){
                    this.options='输入值大于可下单量';
                    this.showNotice=true;
                    return;
                }
                if(this.city_selected_byTrain==''&&this.way=='到站'){
                    this.options='请选择城市';
                    this.showNotice=true;
                    return;
                }
                if(this.date.time==''){
                    this.options='请填写日期';
                    this.showNotice=true;
                    return
                }
                if(this.num.length==0){
                    this.options='请输入数量';
                    this.showNotice=true;
                    return;
                }
                if(this.trans_type=='SELF'&&!this.selectTransport.person_number){
                    this.options='请选择承运信息';
                    this.showNotice=true;
                    return;
                }
                this.submitOrderByContract();
            },
            async submitOrderByContract(){
                if(this.trans_type=='TRAIN'||this.trans_type=='TRAIN_BOX'){
                    let _parmas = {
                        contract_id:this.$route.query.contract_id,
                        destStationId:this.city_selected_byTrain,
                        itemids:this.itemids.join(","),
                        num:this.num.join(","),
                        expectDeliveryTime:this.date.time,
                        province_id:this.ship_Province_code,
                        tvids:'',
                    }
                    var result = await b2bService.submitOrderByContract(_parmas);
                }else if(this.trans_type=='SELF'){
                    let _parmas = {
                        contract_id:this.$route.query.contract_id,
                        destStationId:'',
                        itemids:this.itemids.join(","),
                        num:this.num.join(","),
                        expectDeliveryTime:this.date.time,
                        province_id:this.ship_Province_code,
                        tvids:this.selectTransport.id,
                    }
                    var result = await b2bService.submitOrderByContract(_parmas);
                }else if(this.trans_type=='CAR'){
                    let _parmas = {
                        contract_id:this.$route.query.contract_id,
                        destStationId:'',
                        itemids:this.itemids.join(","),
                        num:this.num.join(","),
                        expectDeliveryTime:this.date.time,
                        province_id:this.ship_Province_code,
                        tvids:'',
                    }
                    var result = await b2bService.submitOrderByContract(_parmas);
                }
                    if(result.result==0){
                        this.showNotice=true;
                        this.options=result.message;
                        return;
                    }else{
                        this.showNotice=true;
                        this.options=result.message;
                        GlobelObj.contractInfo={};
                        this.$router.push({path:'/success'})
                    }
                }
        },
        watch: {
            //到站城市选择
            city_selected_byTrain: function (v) {
                this.city_selected_byTrain = v;
            }
        },
        filters: {
            typeFilter(value){
                if(value == 1){
                    return '暂估价格';
                }
                return '发票价格';
            }
        },
        computed: {
            ...mapState([
                'selectTransport'
            ]),
        },
    }

</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/layout/yy_footer';
    @import "../assets/components/yy_ocDetail";
    @import "../assets/components/yy_add_inv";
    @import "../assets/components/yy_orderlist";
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_orderSelect";
    @import "../assets/components/yy_cover";
    @import "../assets/components/yy_load";

    dl.address{
        margin-bottom: $spaceV;

        dd{
            width: 100%;
        }
    }


    .contract{
        padding-bottom: $spaceV;

        input{
            border: solid 1px $gray_link;
            font-size: 0.875rem;
            line-height: 1rem;
            height: 1rem;
            width: 6rem;
            padding: 0.5rem;
        }
    }

    .order_inv{
        dl {
            @include _dl(6rem);
            padding: 0;

            dt {
                display:-moz-flex;
                display:-webkit-flex;
                display:flex;
                align-items: center;

                span{
                    width: 5em;
                    height: 100%;
                }
            }
        }
    }


</style>