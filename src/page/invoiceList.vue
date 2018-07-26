<!--/*************************************************************************/-->
<!--/***************************       发票管理       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="gray">

        <header>
            <a class="arrowBack icon-arrowL" @click="gotoBack"></a>
            <div class="title">发票管理</div>
            <i></i>
        </header>

        <ul class="invoice">
            <li v-for="el in invoiceLists">
                <div v-show="el.invoice_type_id == 0"  @click="selectInvoiceHander(el)">
                    <p>{{el.company_name}}</p>
                    <h5>税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：<span>{{el.tax_num}}</span></h5>
                    <h5>开户账号：<span>{{el.bank_num}}&nbsp;&nbsp;&nbsp;&nbsp;{{el.bank_name}}</span></h5>
                    <h5>收&nbsp;&nbsp;票&nbsp;人：<span>{{el.invoice_taker}}&nbsp;&nbsp;&nbsp;&nbsp;{{el.mobile}}</span></h5>
                    <h5>备案地址：<span>{{el.swrecord_address}}</span></h5>
                    <h5>备&nbsp;&nbsp;案&nbsp;号：<span>{{el.swrecord_number}}</span></h5>
                </div>

                <p @click="selectInvoiceHander(el)" v-show="el.invoice_type_id != 0">{{el.invoice_taker}}&nbsp;&nbsp;&nbsp;&nbsp;{{el.mobile}}</p>

                <h5 @click="selectInvoiceHander(el)">{{el.invoice_receive_address}}</h5>
                <div class="btn">
                    <label class="check" :class="el.def_invoice_company==1?'icon-on':''"><input @click="setInvoiceDefault(el)" type="checkbox"/></label><span @click="setInvoiceDefault(el)">默认地址</span>
                    <a class="del" @click="delClick(el)"><i class="icon-del"></i>删除</a>
                    <a class="edit" @click="editInvoice(el)"><i class="icon-edit"></i>编辑</a>
                </div>
            </li>
        </ul>
        <footer class="col" @click="gotoInvoice()">
            <a><i class="icon-add"></i>添加发票信息</a>
        </footer>

        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box boxTxt">
                <div class="txt">
                        确认要删除所选发票么吗？
                </div>
                <ul class="btn">
                    <li @click="hideAlert">取消</li>
                    <li @click="trueDeleteAdd">确认</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions,mapMutations} from 'vuex'
    import { b2bService } from '../service'
    export default{
        data(){
           return {
               deleteId:'',
               ifAlert:false,
               invoiceLists:[],
               from:''
           }
        },

        filters: {
            addConvert: function(value){
                return value;
            }
        },

        computed: {
            ...mapState([
                'defaultInvoice',
                'selectInvoice'
            ]),
        },

        methods : {
            ...mapActions([
                'setDefaultInvoice'
            ]),
            ...mapMutations([
                'SELECT_INVOICE'
            ]),
            hideAlert:function () {
                this.ifAlert = false;
            },
            trueDeleteAdd() {
                this.ifAlert = false;
                this.delInvoice();
            },
            gotoBack : function (){
                this.$router.goBack();
            },
            gotoInvoice: function() {
                this.$router.push({path: '/NewInvoiceList'})
            },
            async initData(){
                let res = await b2bService.getInvoiceList();
                if(res.result == 1){
                    let hasTrue = false;
                    this.invoiceLists = res.data;
                    this.invoiceLists.forEach(item => {
                        if(item.id == this.selectInvoice.id){
                            hasTrue = true;
                            return;
                        }
                    })
                    if(!hasTrue){
                        this.SELECT_INVOICE({});
                    }
                }
            },
            setInvoiceDefault : function (el) {
                if(el.def_invoice_company == 1){
                    return
                }
                this.setDefaultInvoice([el])
            },
            //编辑发票
            editInvoice: function (el){
                this.$router.push({ path: '/NewInvoiceList' , query:{ invoice: el }})
            },
            //选择发票
            selectInvoiceHander:function(el){
                if(this.from){
                    return
                }
                this.SELECT_INVOICE(el);
                this.$router.goBack();
            },
            delClick (el) {
                this.ifAlert = true
                this.deleteId = el.id;
            },
            async delInvoice(){
                let _parmas = {
                    invoiceCompany_id:this.deleteId
                }
                let res= await b2bService.delInvoice(_parmas);
                if (res.result != 1) {
                    return;
                }else{
                    this.initData();
                }
            }
        },
        watch: {
            defaultInvoice: function (value) {
                if(value){
                    this.initData();
//                    this.$router.goBack();
                }
            }
        },
        created () {
            this.from = this.$route.query.from;
            this.initData();
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/layout/yy_footer';
    @import "../assets/components/yy_cover";
    @import "../assets/pages/yy_invoice";
</style>