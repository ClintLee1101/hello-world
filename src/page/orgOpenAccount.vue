<!--/*************************************************************************/-->
<!--/***************************    设置 - 机构注册    ************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">机构绑卡</div>
            <i></i>
        </header>

        <ul class="list60 spaceHT">
            <li>
                <span>公司名称</span>
                <input type="text" v-model="input.input1" ref="name" name="name" placeholder="请填写公司名称">
                <i class="icon-emptied" v-show="input.input1" v-on:click="clearText(1)"></i>
            </li>
            <li>
                <span>证件类型</span>
                <select style="font-size: 1.0em;" v-model="code">
                    <option value="licenseCode">组织机构代码+营业执照号 ></option>
                    <option value="creditCode">统一社会信用码</option>
                </select>
            </li>
            <li v-if="showLicenseCode">
                <span>组织机构代码</span>
                <input type="text" v-model="input.input2" ref="orgCode" name="orgCode" placeholder="请输入组织代码">
                <i class="icon-emptied" v-show="input.input2" v-on:click="clearText(2)"></i>
            </li>
            <li v-if="showLicenseCode">
                <span>营业执照号</span>
                <input type="text" v-model="input.input3" ref="licenceCode" name="licenceCode" placeholder="请输入营业执照号">
                <i class="icon-emptied" v-show="input.input3" v-on:click="clearText(3)"></i>
            </li>
            <li v-if="!showLicenseCode">
                <span>统一社会信用码</span>
                <input type="text" v-model="input.input4" ref="creditCode" name="creditCode" placeholder="请输入统一社会信用码">
                <i class="icon-emptied" v-show="input.input4" v-on:click="clearText(4)"></i>
            </li>
            <li>
                <span>开户银行卡</span>
                <input type="text" placeholder="请输入银行卡号" v-model="input.input5" ref="cardNo" name="cardNo">
                <i class="icon-emptied" v-show="input.input5" v-on:click="clearText(5)"></i>
            </li>
            <li>
                <span>开户银行</span>
                <select style="font-size: 1.0em;" type="text" v-model="bank">
                    <option value='choose'>请选择</option>
                    <option v-for="el in banks" :value="el.str">{{el.name}}</option>
                </select>
            </li>
            <li v-show="!fromActivate">
                <span>设置登陆密码</span>
                <input type="password" v-model="input.input6" ref="password" name="password" placeholder="设置6位数字或字母">
                <i class="icon-emptied" v-show="input.input6" v-on:click="clearText(6)"></i>
            </li>
            <li v-show="!fromActivate">
                <span>确认登陆密码</span>
                <input type="password" v-model="input.input61" ref="passwordAgain" name="passwordAgain"
                       placeholder="设置6位数字或字母">
                <i class="icon-emptied" v-show="input.input61" v-on:click="clearText(61)"></i>
            </li>
            <li>
                <span>设置交易密码</span>
                <input type="password" v-model="input.input7" ref="payPwd" name="payPwd" placeholder="设置6位数字密码">
                <i class="icon-emptied" v-show="input.input7" v-on:click="clearText(7)"></i>
            </li>
            <li>
                <span>确认交易密码</span>
                <input type="password" v-model="input.input71" ref="payPwdAgain" name="payPwdAgain"
                       placeholder="设置6位数字密码">
                <i class="icon-emptied" v-show="input.input71" v-on:click="clearText(71)"></i>
            </li>
            <li class="upload">
                <form id="uploadForm">
                    <span>上传经营许可信息</span>
                    <b><input class="icon-add" type="file" accept="image/*" name="file" id="inputFile0" @change="doUpLoad(0)"/></b>
                    <img :src="licenceImg1">
                </form>
            </li>
            <li class="upload">
                <form id="uploadForm1">
                    <span>上传营业执照信息</span>
                    <b><input class="icon-add" type="file" accept="image/*" @change="doUpLoad(1)" id="inputFile1" name="file"/></b>
                    <img :src="permitImg1">
                </form>
            </li>
            <li class="upload">
                <form id="uploadForm2">
                    <span>上传税务登记信息</span>
                    <b><input class="icon-add" type="file" accept="image/*" @change="doUpLoad(2)" id="inputFile2" name="file"/></b>
                    <img :src="taxImg1">
                </form>
            </li>
            <!--<li class="pact">-->
            <!--<label :class="agree">-->
            <!--<input @click="confirmRead()" type="checkbox"/>-->
            <!--</label>-->
            <!--<a>我已阅读并同意《开磷金融服务平台用户协议》</a>-->
            <!--</li>-->
        </ul>

        <div class="btn_submit" @click="goNext">
            <a>下一步</a>
        </div>

        <h6>提示：申请信用额度除了补充资料外还需线下寄送某些资料，详情咨询客服：400-677-9000</h6>

        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
        <loading v-show="showLoading"></loading>

        <!--弹窗-->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box boxTxt">
                <div class="txt">
                    <p>{{tips}}</p>
                </div>
                <a class="a_btn" @click="gotoHome">
                    确认
                </a>
            </div>
        </div>

    </div>
</template>

<script>
    import alertTip from '../components/alertTip'
    import loading from '../components/loading'
    import {proxy} from '../service'
    import {mapState} from 'vuex'
    import {
        fspService
    } from '../service'
    import {banks} from '../service/bankList'
    import{
        GlobelObj
    } from '../components/Global.vue'
    export default{
        components: {
            alertTip,
            loading
        },
        data() {
            return {
                code: 'licenseCode',
                showLicenseCode: true,
                fromActivate: false,

//                licenceImg:require('../assets/images/klImg-44.png'),//营业执照图片
//                permitImg:require('../assets/images/klImg-44.png'),//营业许可证图
//                taxImg:require('../assets/images/klImg-44.png'),//税务登记信息
                licenceImg1: '',//营业执照图片
                permitImg1: '',//营业许可证图
                taxImg1: '',//税务登记信息

//                fromRegister:true,
//                fromActivate:false,
                orgValid: false,         //校验组织机构代码
                licenseValid: false,
                creditValid: false,
                type: '',//个人，机构
                orgType: 1,//1：未三证合一 2：三证合一
                bank: 'choose',//银行代码
//                name:'',
                orgCode: '',
                licenceCode: '',
                creditCode: '',
                bankCode: '',
                payPwd: '',
                cardNo: '',
                password: '',
                mobile: '',
                //显示弹框设置
                showNotice: false,
                options: '',
                banks: banks,
                //显示弹框设置结束
                ifAlert: false,
                showLoading: false,
                tips: '开户完成可登陆',
                //样式
                agree: 'icon-on',
                input: {
                    input1: '',
                    input2: '',
                    input3: '',
                    input4: '',
                    input5: '',
                    input6: '',
                    input7: '',
                    input61: '',
                    input71: '',
                },
            }

        },
        computed: {
            ...mapState([
                'userFspInfo',
                'orgInfo'
            ]),
        },
        watch: {

            bank: function (v) {
                this.bankCode = banks[v].name;
            },
            code: function (v) {
                if (v == "licenseCode") {
                    this.showLicenseCode = true;
                    this.$refs.creditCode.value = '';
                    this.orgType = 1;
                } else if (v == "creditCode") {
                    this.$refs.licenceCode.value = '';
                    this.$refs.orgCode.value = '';
                    this.showLicenseCode = false;
                    this.orgType = 2;
                }
            }
        },
        methods: {
            clearText: function (tag) {
                this.input['input' + tag] = ''
            },
            //关闭弹框
            close(){
                this.options = '';
                this.showNotice = false;
            },
            confirmRead(){
                this.agree == 'icon-on' ? this.agree = 'check_blue icon-on' : this.agree = 'icon-on'
            },
            goBack(){
                this.$router.goBack();
            },
            gotoHome(){
                this.$router.push({path: '/home/index'})
            },
            doUpLoad: function (index) {
                console.log(document.getElementById("inputFile" + index).files[0].size)
                if (document.getElementById("inputFile" + index).files[0].size > 4194304) {
                    this.options = '图片过大,需5M以内';
                    this.showNotice = true;
                    return;
                }
                var self = this;
                if (index == 0) {
                    var formData = new FormData($("#uploadForm")[0]);
                }
                if (index == 1) {
                    var formData = new FormData($("#uploadForm1")[0]);
                }
                if (index == 2) {
                    var formData = new FormData($("#uploadForm2")[0]);
                }
                $.ajax({
                    url: proxy.fsp + '/a/img/app',
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    beforeSend: function () {
//                        self.showLoading = true;
                    },
                    success: function (result) {
                        var result = JSON.parse(result);
                        if (result.code == 0) {
//                            self.showLoading = false;
                            if (index == 0) {
//                                self.licenceImg=proxy.img+result.data.url;
                                self.licenceImg1 = proxy.img + result.data.url;
                                console.log(self.licenceImg);
//                                self.input.File0=true;
//                                self.licenceImg='https://ifile.staging.china-lin.com/'+result.data.url;
//                                this.licenceImg='/domain/'+result.data.url;
                            }
                            if (index == 1) {
//                                self.permitImg=proxy.img+result.data.url;
                                self.permitImg1 = proxy.img + result.data.url;
//                                self.input.File1=true;
//                                self.permitImg='https://ifile.staging.china-lin.com/'+result.data.url;
//                                this.permitImg='/domain/'+result.data.url;
                            }
                            if (index == 2) {
//                                self.taxImg=proxy.img+result.data.url;
                                self.taxImg1 = proxy.img + result.data.url;
//                                self.input.File2=true;
//                                self.taxImg='https://ifile.staging.china-lin.com/'+result.data.url;
//                             this.taxImg='/domain/'+result.data.url;
                            }

                        } else {
                            self.showLoading = false;
                            self.options = '图片上传失败，请更换图片或稍后再试';
                            self.showNotice = true;
                        }
                    },
                    error: function (result) {
//                        loading.hide();
                        self.options = result.statusText;
                        self.showNotice = true;
                    }
                });

//
//                var win = function (r) {
//                    this.options="Code = " + r.responseCode;
//                    this.showNotice=true;
//                    if(index==1){
//                        self.licenceImg='http://ifile.staging.china-lin.com/'+r.response.data.url;
//                    }
//                    console.log("Response = " + r.response);
//                    console.log("Sent = " + r.bytesSent);
//                }
//
//                var fail = function (error) {
//                    alert("An error has occurred: Code = " + error.code);
//                    console.log("upload error source " + error.source);
//                    console.log("upload error target " + error.target);
//                }
//                var options = new FileUploadOptions();
//                options.fileKey = "file";
//                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1+'hehe');
//                options.mimeType = "text/plain";
//
//                var params = {};
//                params.value1 = "test";
//                params.value2 = "param";
//
//                options.params = params;
//
//                var ft = new FileTransfer();
//                ft.upload(fileURL, encodeURI("/fsp//a/img/app"), win, fail, options);
            },

            goNext(){
                if (!this.$refs.name.value) {
                    this.options = '请填写公司名称';
                    this.showNotice = true;
                    return;
                }
                if (this.$refs.name.value.length > 30) {
                    this.options = '公司名称长度超过限制';
                    this.showNotice = true;
                    return;
                }
                if (this.orgType == 1) {
                    if (!this.$refs.orgCode.value) {
                        this.showNotice = true;
                        this.options = '请填写组织机构代码';
                        return;
                    }
                    if (!this.$refs.licenceCode.value) {
                        this.showNotice = true;
                        this.options = '请填写营业执照号';
                        return;
                    }
                } else if (this.orgType == 0) {
                    if (!this.$refs.creditCode.value) {
                        this.showNotice = true;
                        this.options = '请填写统一社会信用码';
                        return;
                    }
                }
                if (!this.$refs.cardNo.value) {
                    this.options = '请填写银行卡号';
                    this.showNotice = true;
                    return;
                }
                if (this.bank == 'choose') {
                    this.options = '请选择银行';
                    this.showNotice = true;
                    return;
                }
                if (!this.fromActivate && !this.validatePwd(this.$refs.password.value)) {
                    this.options = '请填写正确登陆密码';
                    this.showNotice = true;
                    return;
                }
                if (!this.fromActivate && (this.$refs.password.value != this.$refs.passwordAgain.value)) {
                    this.options = '两次登录密码不一致';
                    this.showNotice = true;
                    return;
                }

                if (!this.validatePayPwd(this.$refs.payPwd.value)) {
                    this.options = '请填写6位数字交易密码';
                    this.showNotice = true;
                    return;
                }
                if (this.$refs.payPwd.value != this.$refs.payPwdAgain.value) {
                    this.options = '两次交易密码不一致';
                    this.showNotice = true;
                    return;
                }
//                    if( this.agree=='icon-on'){
//                        this.options='请阅读并同意协议';
//                        this.showNotice=true;
//                        return;
//                    }

                if (this.fromActivate) {
                    this.orgOpenActive();
                    return;
                }
                if (this.orgType == 1) {
                    this.o();
                } else {
                    this.c();
                }
            },
            async orgOpenActive(){
                let _parmas = {
                    id:this.orgInfo.id,
                    mobile:this.mobile,
                    uid:this.orgInfo.uid,
                    name:this.$refs.name.value,
                    licenceImg:this.licenceImg1, //营业执照图片
                    permitImg:this.permitImg1, ///营业许可证图
                    taxImg:this.taxImg1, ///税务登记信息
                    orgCode:this.input.input2, /// 组织机构码
                    licenceCode:this.input.input3, /// 营业执照码
                    creditCode:this.input.input4, /// 社会信用码
                    bank:this.bank, /// 银行代码
                    cardNo:this.$refs.cardNo.value, // 银行卡号
                    status:this.orgInfo.status,
                    orgType:this.orgType,/// 是否三证合一//     1：未三证合一 2：三证合一
                    payPwd:this.$refs.payPwd.value,
                    bankCode:this.bankCode, /// 银行中文名
                };
                let res = await fspService.organzationActive(_parmas);
                if (res.code == 0) {
                    this.tips = '提交成功，工作人员会尽快审核您的资料，审核通过将会以短信的形式通知您'
                    this.ifAlert = true;

                } else {
                    this.showNotice = true;
                    this.options = res.message;
                }
            },
            validatePwd: value => {
                return value.length == 6 && /^[A-Za-z0-9]+$/.test(value)
            },
            validatePayPwd: value => {
                return value.length == 6 && /^[0-9]+$/.test(value)
            },
            async orgOpen(){
                console.log(this.orgType)
                var ress
                if (this.orgType == 2) {
//                    ress = await orgOpenAccount(this.bank, this.bankCode, this.$refs.cardNo.value, this.input.input4, this.mobile, this.$refs.name.value, this.orgType, this.$refs.password.value, this.$refs.payPwd.value, this.licenceImg1, this.permitImg1, this.taxImg1);
                    let params={
                        bank:this.bank,/// 银行中文名
                        bankCode:this.bankCode,/// 银行代码
                        cardNo:this.$refs.cardNo.value,// 银行卡号
                        creditCode:this.input.input4,/// 组织机构码
                        mobile:this.mobile, //手机号
                        name:this.$refs.name.value, ///姓名
                        orgType:this.orgType, /// 是否三证合一 1：未三证合一 2：三证合一
                        password:this.$refs.password.value, /// 登录密码
                        payPwd:this.$refs.payPwd.value,  ///支付密码
                        licenceImg:this.licenceImg1,
                        permitImg:this.permitImg1,
                        taxImg:this.taxImg1
                    }
                    ress = await fspService.orgOpenAccount(params);
                }else {
//                    ress = await orgOpenAccount2(this.bank, this.bankCode, this.$refs.cardNo.value, this.input.input3, this.mobile, this.$refs.name.value, this.input.input2, this.orgType, this.$refs.password.value, this.$refs.payPwd.value, this.licenceImg1, this.permitImg1, this.taxImg1);
                    let params={
                        bank:this.bank,/// 银行中文名
                        bankCode:this.bankCode,/// 银行代码
                        cardNo:this.$refs.cardNo.value,// 银行卡号
                        licenceCode:this.input.input3,/// 组织机构码
                        mobile:this.mobile, //手机号
                        name:this.$refs.name.value, ///姓名
                        orgCode:this.input.input2,
                        orgType:this.orgType, /// 是否三证合一 1：未三证合一 2：三证合一
                        password:this.$refs.password.value, /// 登录密码
                        payPwd:this.$refs.payPwd.value,  ///支付密码
                        licenceImg:this.licenceImg1,
                        permitImg:this.permitImg1,
                        taxImg:this.taxImg1
                    }
                    ress = await fspService.orgOpenAccount(params);
                }
                if (ress.code == 0) {
                    this.$router.push({path: '/successRegist?type=org'})
//                        this.tips='等审核通过后可以登录'
//                        this.ifAlert=true;
//                        this.loginFSP();
                } else {
                    this.showNotice = true;
                    this.options = ress.message;
                }

            },
            async o(){
                let _parmas = {
                    mobile:this.mobile,
                    orgCode:this.$refs.orgCode.value
                }
                let res = await fspService.o(_parmas);
                if (res.code != 0) {
                    this.options = res.message;
                    this.showNotice = true;
                } else {
                    this.l();
                }
            },
            async l(){
                let _parmas = {
                    mobile:this.mobile,
                    licensecode:this.$refs.licenceCode.value
                }
                let res = await fspService.l(_parmas);
                if (res.code != 0) {
                    this.options = res.message;
                    this.showNotice = true;
                } else {
                    this.orgOpen();
                }
            },
            async c(){
                let _parmas = {
                    mobile:this.mobile,
                    creditcode:this.$refs.creditCode.value
                }
                let res = await fspService.c(_parmas);
                if (res.code != 0) {
                    this.options = res.message;
                    this.showNotice = true;
                } else {
                    this.orgOpen();
                }
            },

        },
        created () {
            this.mobile = GlobelObj.mobile || this.userFspInfo.mobile;

            if (this.$route.query.from) {
                this.fromActivate = true;
                this.input.input1 = this.orgInfo.name;
                this.code = (this.orgInfo.orgType == 2) ? "creditCode" : "licenseCode";
                this.input.input2 = this.orgInfo.orgCode;
                this.input.input3 = this.orgInfo.licenceCode;
                this.input.input4 = this.orgInfo.creditCode;
                this.input.input5 = this.orgInfo.cardNo;
                if (this.orgInfo.bank) {
                    this.bank = this.orgInfo.bank;
                }

                if (this.orgInfo.licenceImg) {
//                    this.input.File0 = true;
                    this.licenceImg1 = this.orgInfo.licenceImg;
                }
                if (this.orgInfo.permitImg) {
//                    this.input.File1 = true;
                    this.permitImg1 = this.orgInfo.permitImg;
                }
                if (this.orgInfo.taxImg) {
//                    this.input.File2 = true;
                    this.taxImg1 = this.orgInfo.taxImg;
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
    @import "../assets/components/yy_cover";

    $upload_liH: 5.5rem;
    $upload_iB: 0.125rem;
    $upload_iP: 1.375rem;
    $upload_iF: 5.5rem - 0.125rem*2 - 1.375rem*2;

    ul.list60 {
        li {
            span {
                width: 8em;
            }

            &.upload, &.upload > form {
                height: $upload_liH;
            }
            &.upload {
                padding: 1.25rem 0;
            }
            &.upload > form {
                position: relative;
                display: -moz-flex;
                display: -webkit-flex;
                display: flex;
                padding: 0;

                a, span, input {
                    padding: 0;
                }
                span {
                    position: absolute;
                    width: 9em;
                    float: left;
                    z-index: 3;
                }
                b {
                    position: absolute;
                    border: dotted $upload_iB $gray;
                    padding: $upload_iP;
                    float: left;
                    z-index: 4;
                    margin-left: 9em;
                }
                img {
                    position: absolute;
                    margin: 0;
                    /*<!--width: $upload_liH * 1.5;-->*/
                    width: 88px;
                    height: $upload_liH;
                    float: left;
                    margin-left: 9em;
                    z-index: 3;
                }
                input {
                    font-size: $upload_iF;
                    line-height: $upload_iF;
                    height: $upload_iF;
                    width: $upload_iF;
                    overflow: hidden;
                }
                a {
                    i {

                        z-index: 1;
                    }
                }
            }

            &.pact {
                label {
                    padding: 1.375rem $spaceLR 1.375rem 0;
                }
                a {
                    width: auto;
                    padding-left: 0;
                }
            }
        }
    }

    h6 {
        padding: 0 $spaceLR 0.625rem;
    }
</style>