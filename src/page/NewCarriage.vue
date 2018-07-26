<!--/*************************************************************************/-->
<!--/************************      设置 - 新、编辑承运     *********************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goback()"></a>
            <div class="title">{{isEdit ? '编辑' : '添加新'}}承运信息</div>
            <a class="edit" @click="editClick">{{isEdit?'删除':''}}</a>
        </header>

        <div class="newAdd">
            <ul>
                <li>
                    <span>车牌号</span>
                    <input type="text" v-model="plate_number" placeholder="请输入车牌号">
                    <i class="icon-emptied" v-show="plate_number" v-on:click="clearText('plate_number')"></i>
                </li>
                <li>
                    <span>司机姓名</span>
                    <input type="text" v-model="driver_name" placeholder="请输入司机姓名">
                    <i class="icon-emptied" v-show="driver_name" v-on:click="clearText('driver_name')"></i>
                </li>
                <li>
                    <span>身份证号</span>
                    <input type="text" v-model="person_number" placeholder="请输入身份证号">
                    <i class="icon-emptied" v-show="person_number" v-on:click="clearText('person_number')"></i>
                </li>
                <li>
                    <span>手机号</span>
                    <input type="tel" v-model="cellphone" placeholder="请输入手机号">
                    <i class="icon-emptied" v-show="cellphone" v-on:click="clearText('cellphone')"></i>
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
                isEdit: false,
                showNotice: false,
                options: '',
                plate_number:'', //车牌号
                driver_name:'',  //司机姓名
                person_number:'',//身份证号
                cellphone:'',//手机号码
                id:''//id
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
                let data = {
                    id:this.id
                }
                let res = await b2bService.deleteTransport(data);
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
                if (this.plate_number == '') {
                    this.showNotice = true;
                    this.options = '请填写车牌号';
                    return;
                }
                if (this.driver_name == '') {
                    this.showNotice = true;
                    this.options = '请填写司机姓名';
                    return;
                }
                if (this.person_number == '') {
                    this.showNotice = true;
                    this.options = '请填写司机身份证';
                    return;
                }
                if (this.cellphone == '') {
                    this.showNotice = true;
                    this.options = '请填写司机电话';
                    return;
                }


                if (this.isEdit) {
                    let data= {
                        id:this.id,//id
                        plate_number:this.plate_number, //车牌号
                        driver_name:this.driver_name,  //司机姓名
                        person_number:this.person_number,//身份证号
                        cellphone:this.cellphone,//手机号码
                    }
                    let res = await b2bService.updateTransport(data);
                    if (res.result != 1) {
                        this.showNotice=true;
                        this.options=res.message;
                        return;
                    }else{
                        this.$router.goBack();
                    }
                } else {
                    let data={
                        plate_number:this.plate_number, //车牌号
                        driver_name:this.driver_name,  //司机姓名
                        person_number:this.person_number,//身份证号
                        cellphone:this.cellphone,//手机号码
                    }
                    let res = await b2bService.addTransport(data);
                    if (res.result != 1) {
                        this.showNotice=true;
                        this.options=res.message;
                        return;
                    }else{
                        this.$router.goBack();
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
                if(this.$route.query.carriage){
                    this.isEdit = true;
                    let carriage = this.$route.query.carriage;
                    this.id=carriage.id;
                    this.plate_number=carriage.plate_number;
                    this.driver_name=carriage.driver_name;
                    this.person_number=carriage.person_number;
                    this.cellphone=carriage.cellphone;
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

