<!--/*************************************************************************/-->
<!--/************************      设置 - 新、编辑发票     *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="gotoBack()"></a>
            <div class="title">{{isEdit ? '编辑' : '添加新'}}发票信息</div>
            <a class="edit" @click="editClick">{{isEdit?'删除':''}}</a>
        </header>

        <nav>
            <div :class="isPerson?'on':''" @click="changType(true)"><span>个人</span></div>
            <div :class="!isPerson?'on':''" @click="changType(false)"><span>公司</span></div>
        </nav>

        <div class="newInv">
            <ul v-show="showType">
                <li>
                    <span>发票抬头</span>
                    <input v-model="person_company_name" type="text" placeholder="请填写发票抬头">
                    <i class="icon-emptied" v-show="person_company_name" v-on:click="clearText('person_company_name')"></i>
                </li>
                <li>
                    <span>收票人</span>
                    <input v-model="person_invoice_taker" type="text" placeholder="请填写收票人">
                    <i class="icon-emptied" v-show="person_invoice_taker" v-on:click="clearText('person_invoice_taker')"></i>
                </li>
                <li>
                    <span>联系电话</span>
                    <input v-model="person_mobile" type="text" placeholder="请填写联系电话">
                    <i class="icon-emptied" v-show="person_mobile" v-on:click="clearText('person_mobile')"></i>
                </li>
                <li>
                    <span>详细地址</span>
                    <!--
                        不显示的加样式名hide，显示不用加样式名
                        1. 单行显示：input
                        2. 多行显示：textarea
                    -->
                    <input type="text" v-model="person_invoice_receive_address" placeholder="请填写详细收票地址">
                    <textarea v-model="person_invoice_receive_address" placeholder="请填写详细收票地址" class="hide"></textarea>
                    <i class="icon-emptied" v-show="person_invoice_receive_address" v-on:click="clearText('person_invoice_receive_address')"></i>
                </li>
            </ul>
            <ul v-show="!showType">
                <li>
                    <span>发票类型</span>
                    <select v-model="companyType" onchange="onTypeChange()">
                        <option value="0">一般纳税人</option>
                        <option value="1">小规模纳税人</option>
                    </select>
                </li>
                <li>
                    <span>发票抬头</span>
                    <input v-model="person_company_name" placeholder="请填写发票抬头">
                    <i class="icon-emptied" v-show="person_company_name" v-on:click="clearText('person_company_name')"></i>
                </li>
                <li>
                    <span>纳税人识别号</span>
                    <input v-model="tax_num" type="text" placeholder="请填写纳税人识别号">
                    <i class="icon-emptied" v-show="tax_num" v-on:click="clearText('tax_num')"></i>
                </li>
                <li>
                    <span>开户账号</span>
                    <input v-model="bank_num" type="text" placeholder="请填写开户账号">
                    <i class="icon-emptied" v-show="bank_num" v-on:click="clearText('bank_num')"></i>
                </li>
                <li>
                    <span>开户行</span>
                    <input v-model="bank_name" type="text" placeholder="请填写开户行">
                    <i class="icon-emptied" v-show="bank_name" v-on:click="clearText('bank_name')"></i>
                </li>
                <li>
                    <span>收票人</span>
                    <input v-model="person_invoice_taker" placeholder="请填写收票人">
                    <i class="icon-emptied" v-show="person_invoice_taker" v-on:click="clearText('person_invoice_taker')"></i>
                </li>
                <li>
                    <span>税务局备案地址</span>
                    <input v-model="swrecord_address" placeholder="请填写备案地址">
                    <i class="icon-emptied" v-show="swrecord_address" v-on:click="clearText('swrecord_address')"></i>
                </li>
                <li>
                    <span>税务局备案号</span>
                    <input v-model="swrecord_number" placeholder="请填写备案号">
                    <i class="icon-emptied" v-show="swrecord_number" v-on:click="clearText('swrecord_number')"></i>
                </li>
                <li>
                    <span>联系电话</span>
                    <input v-model="person_mobile" type="text" placeholder="请填写联系电话">
                    <i class="icon-emptied" v-show="person_mobile" v-on:click="clearText('person_mobile')"></i>
                </li>
                <li>
                    <span>详细地址</span>
                    <!--
                        不显示的加样式名hide，显示不用加样式名
                        1. 单行显示：input
                        2. 多行显示：textarea
                    -->
                    <input type="text" v-model="person_invoice_receive_address" placeholder="请输入详细地址">
                    <textarea v-model="person_invoice_receive_address" class="hide"></textarea>
                    <i class="icon-emptied" v-show="person_invoice_receive_address" v-on:click="clearText('person_invoice_receive_address')"></i>
                </li>
            </ul>
        </div>

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

        <footer class="col" @click="save()">
            <a>{{isEdit?'保存并使用':'保存'}}</a>
        </footer>

        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import { b2bService } from '../service'

    export default{
        components:{
            alertTip
        },
        data(){
            return {
                ifAlert:false,
                isPerson:true,
                showType:true,
                //显示弹框设置
                showNotice:false,
                options: '',

                isEdit:false,
                companyType:0,
                invoice_type_id:2,
                invoiceCompany_id:'',
                defaultInvoice:'yes',//是否设为默认发票
                person_company_name:'',
                person_invoice_taker:'',
                person_mobile:'',
                person_invoice_receive_address:'',
                tax_num:'',
                bank_num:'',
                bank_name:'',
                swrecord_address:'',
                swrecord_number:''
            }
        },
        computed: {

        },

        methods: {
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            gotoBack: function(){
                this.$router.goBack();
            },
            clearText (tag){
                this[tag] = '';
            },
            changType: function(type){
                if(type){
                    this.showType=true;
                    this.isPerson=true;
                }else{
                    this.showType=false;
                    this.isPerson=false;
                }
            },
            hideAlert:function () {
              this.ifAlert = false;
            },
            trueDeleteAdd() {
              this.delInvoice();
            },
            editClick () {
              if(this.isEdit){
                this.ifAlert = true
              }else{
                this.save();
              }
            },
            save: function(){
//                if(this.isEdit){
//                    //删除
//                    this.delInvoice();
//                }else{
                    if(this.showType){
                        //个人
                        this.invoice_type_id = '2';
                        if(!this.person_invoice_taker||!this.person_company_name||!this.person_mobile||!this.person_invoice_receive_address){
                            this.showNotice=true;
                            this.options='请填写完整信息'
                            return;
                        }
                        this.saveOrUpdateInvoiceByPer();
                    }else{
                        //公司
                        this.invoice_type_id = '0';
                        if(this.person_company_name==''||this.tax_num==''||this.bank_num==''||this.bank_name==''||this.person_invoice_taker==''||this.person_mobile==''||this.person_invoice_receive_address=='' ||this.swrecord_number ==''||this.swrecord_address==''){
                            this.showNotice=true;
                            this.options='请填写完整信息'
                            return;
                        }
                        this.saveOrUpdateInvoiceByOrg();

                    }
//                }

            },
            async initData(){
                if(this.$route.query.invoice){
                    this.isEdit = true;
                    let invoice = this.$route.query.invoice;
                    console.log(invoice);
                    if(invoice.invoice_type_id==2){
                        this.showType=true;
                        this.invoiceCompany_id=invoice.id;
                        this.person_invoice_taker=invoice.invoice_taker;
                        this.person_company_name=invoice.company_name;
                        this.person_mobile=invoice.mobile;
                        this.person_invoice_receive_address=invoice.invoice_receive_address;
                        this.invoice_type_id=invoice.invoice_type_id;
                    }else{
                        this.showType=false;
                        this.invoiceCompany_id=invoice.id;
                        this.person_company_name=invoice.company_name;
                        this.tax_num=invoice.tax_num;
                        this.bank_num=invoice.bank_num;
                        this.bank_name=invoice.bank_name;
                        this.person_invoice_taker=invoice.invoice_taker;
                        this.person_mobile=invoice.mobile;
                        this.person_invoice_receive_address=invoice.invoice_receive_address;
                        this.invoice_type_id=invoice.invoice_type_id;
                    }
                }
            },
            async saveOrUpdateInvoiceByPer(){
                let _parmas = {
                    'invoiceCompany.invoiceCompany_id':this.invoiceCompany_id,
                    "invoiceCompany.invoice_type_id":this.invoice_type_id,
                    "invoiceCompany.company_name":this.person_company_name,
                    "invoiceCompany.mobile":this.person_mobile,
                    "invoiceCompany.invoice_taker":this.person_invoice_taker,
                    "invoiceCompany.invoice_receive_address":this.person_invoice_receive_address,
                    "invoiceCompany.defaultInvoice":this.defaultInvoice,
                }
                let res= await b2bService.saveOrUpdateInvoice(_parmas);
                if (res.result != 1) {
                    if(res.message=='请先登录！'){
                        this.options='账户异常';
                    }else{
                        this.options=res.message;
                    }
                    this.showNotice=true;
                    return;
                }else{
                    this.$router.goBack();
                }
            },
            async saveOrUpdateInvoiceByOrg(){
                let _parmas = {
                    'invoiceCompany.invoiceCompany_id':this.invoiceCompany_id,
                    "invoiceCompany.invoice_type_id":this.invoice_type_id,
                    "invoiceCompany.company_name":this.person_company_name,
                    "invoiceCompany.mobile":this.person_mobile,
                    "invoiceCompany.invoice_taker":this.person_invoice_taker,
                    "invoiceCompany.tax_num":this.tax_num,
                    "invoiceCompany.bank_num":this.bank_num,
                    "invoiceCompany.bank_name":this.bank_name,
                    "invoiceCompany.invoice_receive_address":this.person_invoice_receive_address,
                    "invoiceCompany.defaultInvoice":this.defaultInvoice,
                    "invoiceCompany.swrecord_number":this.swrecord_number,
                    "invoiceCompany.swrecord_address":this.swrecord_address,
                }
                let res= await b2bService.saveOrUpdateInvoice(_parmas);
                if (res.result != 1) {
                    this.showNotice=true;
                    this.options=res.message;
                    return;
                }else{
                    this.$router.goBack();
                }
            },
            async delInvoice(){
                let _parmas = {
                    invoiceCompany_id:this.invoiceCompany_id
                };
                let res= await b2bService.delInvoice(_parmas);
                if (res.result != 1) {
                    return;
                }else{
                    this.$router.goBack();
                }
            }
        },

        created(){
            this.initData();
        }

    }

</script>

<style lang="scss" scoped>
    @import "../assets/layout/yy_footer";
    @import '../assets/components/yy_nav';
    @import "../assets/components/yy_cover";
    @import '../assets/pages/yy_new_edit';

    nav{
        margin-top: $headH;
    }

    .newInv {
        @include _edit_list;
        margin-bottom: $foot_h;

        ul:nth-child(2){
            li{
                span{
                    width: 8rem;
                }
            }
        }
    }
</style>
