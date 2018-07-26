<!--/*************************************************************************/-->
<!--/************************      设置 - 新、编辑地址     *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">{{isEdit ? '编辑' : '添加新'}}收货地址</div>
            <a class="edit" @click="editClick">{{isEdit?'删除':''}}</a>
        </header>

        <div class="newAdd">
            <ul>
                <li>
                    <span>收货单位</span>
                    <input type="text" v-model="company_name" placeholder="请输入公司名">
                    <i class="icon-emptied" v-show="company_name" v-on:click="clearText('company_name')"></i>
                </li>
                <li>
                    <span>收货人</span>
                    <input type="text" v-model="contact_name" placeholder="请输入姓名">
                    <i class="icon-emptied" v-show="contact_name" v-on:click="clearText('contact_name')"></i>
                </li>
                <li>
                    <span>联系电话</span>
                    <input type="tel" v-model="mobile" placeholder="请输入电话号码">
                    <i class="icon-emptied" v-show="mobile" v-on:click="clearText('mobile')"></i>
                </li>
                <li>
                    <span>所在地区</span>
                    <select v-model="province_id">
                        <option>省份</option>
                        <option v-for="item in provinceList" v-bind:value="item.area_code">{{item.local_name}}</option>
                    </select>
                    <i class="icon-arrowR"></i>
                </li>
                <li>
                    <span>详细收货</span>
                    <!--
                        不显示的加样式名hide，显示不用加样式名
                        1. 单行显示：input
                        2. 多行显示：textarea
                    -->
                    <input type="text" v-model="addr" placeholder="请输入详细地址">
                    <textarea v-model="addr" class="hide"></textarea>
                    <i class="icon-emptied" v-show="addr" v-on:click="clearText('addr')"></i>
                </li>
                <li v-if="!isEdit">
                    <span>标&nbsp;&nbsp;&nbsp;&nbsp;签</span>
                    <div class="txtTab">
                        <b :class="isPerson?'on':''" @click="changType(true)">个人</b>
                        <b :class="!isPerson?'on':''" @click="changType(false)">公司</b>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box boxTxt">
                <div class="txt">
                    确认要删除所选地址么吗？
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

        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import alertTip from '../components/alertTip';
    import {b2bService} from '../service'

    export default {
        name: 'about',
        components: {
            alertTip
        },
        data () {
            return {
                ifAlert: false,
                addr_id: '',
                isEdit: false,
                provinceList: [],
                receiver_type_id: 0,
                showNotice: false,
                isPerson: true,
                company_name: '',
                contact_name: '',
                defaultAddress: '',
                mobile: '',
                addr: '',
                province_id: '省份',
                options: '',
            }
        },
        computed: {
            filteredProdList () {
                return this.prodList.filter(function (prod) {
                    if (prod.id > 100) return true;
                });
            }
        },
        methods: {
            changType(b){
                this.isPerson = b;
            },
            //关闭弹框
            close(){
                this.showNotice = false;
            },
            async deleteAdd(){
                let res = await b2bService.deleteAddress({addr_id:this.addr_id});
                if (res.result == 1) {
                    this.$router.goBack();
                }
            },
            clearText (tag){
                this[tag] = '';
            },
            editClick () {
                if (this.isEdit) {
                    this.ifAlert = true
                } else {
                    this.save();
                }
            },
            async save(){
                console.log(this.province_id)

                if (this.company_name == '' && !this.isPerson) {
                    this.showNotice = true;
                    this.options = '请填写公司名';
                    return;
                }
                if (this.contact_name == '') {
                    this.showNotice = true;
                    this.options = '请填写收货人';
                    return;
                }
                if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(this.mobile)) {
                    this.showNotice = true;
                    this.options = '请填写正确联系电话';
                    return;
                }
                if (this.province_id == '省份') {
                    this.showNotice = true;
                    this.options = '请选择收货省份';
                    return;
                }
                if (this.addr == '') {
                    this.showNotice = true;
                    this.options = '请填写收货地址';
                    return;
                }
                if (this.isPerson) {
                    this.receiver_type_id = 0;
                } else {
                    this.receiver_type_id = 1;
                }

                if (this.isEdit) {
                    let data={
                        "memberAddress.addr_id":this.addr_id,
                        "memberAddress.receiver_type_id":this.receiver_type_id,
                        "memberAddress.company_name":this.company_name,
                        "memberAddress.province_id":this.province_id,
                        "memberAddress.contact_name":this.contact_name,
                        "memberAddress.addr":this.addr,
                        "memberAddress.mobile":this.mobile,
                        "memberAddress.defaultAddress":this.defaultAddress,
                    }
                    let res = await b2bService.updateAddress(data);
                    if (res.result == 1) {
                        this.$router.goBack();
                    }else{
                        if(res.message=='请先登录！'){
                            this.options='账户异常';
                        }else{
                            this.options=res.message;
                        }
                        this.showNotice=true;
                    }
                } else {
                    let data={
                        'memberAddress.receiver_type_id':this.receiver_type_id,
                        "memberAddress.company_name":this.company_name,
                        "memberAddress.province_id":this.province_id,
                        "memberAddress.contact_name":this.contact_name,
                        "memberAddress.addr":this.addr,
                        "memberAddress.mobile":this.mobile,
                        "memberAddress.defaultAddress":this.defaultAddress,
                    }
                    let res = await b2bService.addAddress(data);
                    if (res.result == 1) {
                        this.$router.goBack();
                    }else{
                        if(res.message=='请先登录！'){
                            this.options='账户异常';
                        }else{
                            this.options=res.message;
                        }
                        this.showNotice=true;
                    }

                }

            },
            goback () {
                this.$router.goBack()
            },
            goAddList: function () {

            },
            hideAlert: function () {
                this.ifAlert = false;
            },
            trueDeleteAdd() {
                this.deleteAdd();
            },

            async initData(){
                let res = await b2bService.getProvince();
                this.provinceList = res["data"];
                if (this.$route.query.address) {
                    this.isEdit = true;
                    let add = this.$route.query.address;
                    this.receiver_type_id = add.receiver_type_id;
                    this.addr_id = add.addr_id;
                    if (this.receiver_type_id == '0') {
                        this.isPerson = true;
                    } else {
                        this.isPerson = false;
                    }
                    this.company_name = add.company_name;
                    this.province_id = add.province_id;
                    ;
                    this.contact_name = add.name;
                    this.addr = add.addr;
                    ;
                    this.mobile = add.mobile;
                    ;
                    this.defaultAddress = add.defaultAddress;
                }
            },
        },
        created() {
            this.initData();
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/layout/yy_footer";
    @import "../assets/components/yy_cover";
    @import '../assets/pages/yy_new_edit';

    .newAdd {
        @include _edit_list;
        margin-top: $headH;
    }
</style>

