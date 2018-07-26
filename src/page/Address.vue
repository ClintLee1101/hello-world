<!--/*************************************************************************/-->
<!--/***************************       地址管理       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>
        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">{{from?'管理':'选择'}}收货地址</div>
            <i></i>
        </header>

        <!--new begin-->
        <ul class="address">
            <!--选中状态时，li标签加样式名：cur-->
            <li v-for="address in addressList">
                <div class="col_1"><i class="icon-on2"></i></div>
                <div class="col_2" @click="selectAddHander(address)">
                    <p><span>{{address.name}}</span><span>{{address.mobile}}</span><b v-show="false" class="def">默认</b><b>{{address.receiver_type_id|typeConvert}}</b></p>
                    <dl>
                        <dd>
                            <p v-if="address.receiver_type_name=='单位'">{{address.company_name}}</p>
                            <h5>{{address.addr}}</h5>
                        </dd>
                    </dl>
                </div>
                <!--默认选中时，样式名为def的b标签，显示 -->
                <div class="col_3">
                    <label class="check" :class="address.def_addr==1?'icon-on':''"><input @click="selectAdd(address)" type="checkbox"/></label><span @click="selectAdd(address)">默认地址</span>
                    <a class="del" @click="delClick(address)"><i class="icon-del"></i>删除</a>
                    <a class="edit" @click="editAddress(address)"><i class="icon-edit"></i>编辑</a>

                </div>

            </li>
        </ul>
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

        <footer class="col" @click="newAddress()">
            <a><i class="icon-add"></i>新建地址</a>
        </footer>
        <!--new end-->
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex'
    import { b2bService } from '../service'

    export default {
        name: 'about',
        data () {
            return {
                ifAlert: false,
                addr_id:'',
                addressList: [],
                from:''
            }
        },
        computed: {
            ...mapState([
                'defaultAddress',
                'selectAddress'
            ]),
            filteredProdList () {
                return this.prodList.filter(function (prod) {
                    if (prod.id > 100) return true;
                });
            }
        },
        methods: {
            ...mapActions([
                'setDefaultAddress'
            ]),
            ...mapMutations([
//                'SET_DEFAULT_ADDRESS'
                'SELECT_ADDRESS'
            ]),
            hideAlert:function () {
                this.ifAlert = false;
            },
            delClick (el) {
                this.ifAlert = true
                this.addr_id = el.addr_id;
            },
            trueDeleteAdd() {
                this.ifAlert = false;
                this.delInvoice();
            },
            async delInvoice(){
                let res= await b2bService.deleteAddress({addr_id:this.addr_id});
                if (res.result != 1) {
                    return;
                }else{
                    this.initData();
                }
            },
            goback () {
                this.$router.goBack()
            },
            async selectAdd (add) {
                if(add.def_addr == 1){
                    return
                }
                this.setDefaultAddress([add])
            },
            //选择地址
            selectAddHander:function(el){
                if(this.from){
                    return
                }
                this.SELECT_ADDRESS(el);
                this.$router.goBack();
            },
            newAddress: function (add) {
                this.$router.push({path: '/newAddress'})
            },

            editAddress: function (add) {
                this.$router.push({path: '/newAddress', query: {address: add}})
            },

            async initData(){
                let res = await b2bService.getAddress();
                if (res.result == 1) {
                    var hasTrue = false;
                    this.addressList = res.data;
                    this.addressList.forEach(item => {
                        if(item.addr_id == this.defaultAddress.addr_id){
                            hasTrue = true;
                            return;
                        }
                    });
                    if(!hasTrue){
                        this.SELECT_ADDRESS({});
                    }
                }
//          this.showLoading = false;
            },
        },
        created() {
            this.from = this.$route.query.from;
            this.initData();
        },

        filters: {
            typeConvert: function (value) {
                if(value == 0){
                    return '个人'
                }
                return '公司'
            }
        },


        watch: {
            defaultAddress: function (value) {
                if (value) {
                    this.initData();
                    //                    this.$router.goBack();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/layout/yy_footer";
    @import "../assets/components/yy_cover";

    .address {
        background: $gray_white;
        margin-top: $headH;
        margin-bottom: $foot_h;

        li {
            @include _linkTop_half;
            display: -moz-flex;
            display: -webkit-flex;
            display: flex;
            padding: 0.75rem 0 0.875rem;
            margin-top: 0.625rem;
            flex-direction: column;

            &:first-child:after {
                height: 0;
            }
            .col_1 {
                display: none;
                flex-shrink: 0;
                width: 2.688em;
                padding-top: 1rem;

                i{
                    color: $red;
                    font-size: 1.5rem;
                }
            }
            .col_2 {
                width: 100%;
                padding-left:$spaceLR;
                dl {
                    display: -moz-flex;
                    display: -webkit-flex;
                    display: flex;
                    width: 100%;
                }
                dt {
                    flex-shrink: 0;
                    width: 3.313em;
                    padding: 0.875em 0 0.5em;
                    margin-left: 0.5em;
                    float: right;

                    i {
                        @include _linkLeft_half;
                        color: $gray;
                        font-size: 1.25em;
                        padding-left: 1em;
                    }
                }
                dd {
                    width: 100%;
                }

                h5, p {

                    clear: both;
                    display: block;
                    width: 100%;
                }
                p {

                    span, b {
                        float: left;
                    }

                    span {
                        margin-left: 1.25rem;

                        &:first-child {
                            margin-left: 0;
                        }
                    }

                    b {
                        @include _textLabel($blue2, 0.75em, 1.5em);
                        margin-top: 0.167em;

                        &.def {
                            @include _textLabel($red, 0.75em, 1.5em);
                        }
                    }
                }
                h5 {
                    color: $gray;
                    margin-top: 0.214em;
                }
            }
            .col_3{
                @include _linkTop_half;
                padding-left:$spaceLR !important;
                margin-top: 0.625rem;
                font-size: 0.875rem;
                line-height: 2.5rem;
                height: 2.5rem;

                label, span{
                    float: left;
                }
                label{
                    margin: 0.5rem 0.643rem 0 0;
                }
                a{
                    background: no-repeat 0 50%;
                    background-size: auto 50%;
                    float: right;
                    padding-right: 1.143em;

                    i{
                        color: $gray;
                        font-size: 1.125rem;
                        margin: 0.625rem 0.5rem 0 0;
                        float: left;
                    }
                }
            }

            &.cur{
                .col_1{
                    display: block;
                }
                .col_2{
                    p{
                        color: $red;
                    }
                }
            }
        }

    }
</style>
