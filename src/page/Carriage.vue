<!--/*************************************************************************/-->
<!--/***************************       承运管理       *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="gotoBack"></a>
            <div class="title">承运管理</div>
            <i></i>
        </header>

        <ul class="invoice">
            <li v-for="el in transportLists">
                <div @click="selectCarriage(el)">
                    <h5><em>车牌号</em><em>：</em><span>{{el.plate_number}}</span></h5>
                    <h5><em>司机姓名</em><em>：</em><span>{{el.driver_name}}</span></h5>
                    <h5><em>身份证号</em><em>：</em><span>{{el.person_number}}</span></h5>
                    <h5><em>手机号</em><em>：</em><span>{{el.cellphone}}</span></h5>
                </div>
                <div class="btn">
                    <!--<label class="check"><input type="checkbox"/></label>-->
                    <!--<span>默认承运</span>-->
                    <a class="del" @click="delClick(el)"><i class="icon-del"></i>删除</a>
                    <a class="edit" @click="editCarriage(el)"><i class="icon-edit"></i>编辑</a>
                </div>
            </li>
        </ul>

        <footer class="col" @click="gotoCarriage()">
            <a><i class="icon-add"></i>添加承运信息</a>
        </footer>
        <!-- 删除弹出层 -->
        <div class="pop" v-if="ifAlert">
            <div class="bg"></div>
            <div class="box boxTxt">
                <div class="txt">
                        确认要删除所选承运信息吗？
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
    import {b2bService} from '../service'
    export default{
        data(){
           return {
               deleteId:'',
               ifAlert:false,
               transportLists:[],
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
                'selectTransport'
            ]),
        },

        methods : {
            ...mapActions([
            ]),
            ...mapMutations([
                'SELECT_TRANPORTS'
            ]),
            hideAlert:function () {
                this.ifAlert = false;
            },
            trueDeleteAdd() {
                this.ifAlert = false;
                this.delTransport();
            },
            gotoBack : function (){
                this.$router.goBack();
            },
            gotoCarriage: function() {
                this.$router.push({path: '/NewCarriage'})
            },
            async initData(){
                let res = await b2bService.getTransport();
                if(res.result == 1){
                    let hasTrue = false;
                    this.transportLists = res.data.vehicles;
                    this.transportLists.forEach(item => {
                        if(item.id == this.selectTransport.id){
                            hasTrue = true;
                            return;
                        }
                    })
                    if(!hasTrue){
                        this.SELECT_TRANPORTS({});
                    }

                }
            },
            //编辑承运信息
            editCarriage: function (el){
                this.$router.push({ path: '/NewCarriage' , query:{ carriage: el }})
            },
            //选择承运信息
            selectCarriage:function(el){
                if(this.from){
                    return
                }
                this.SELECT_TRANPORTS(el);
                this.$router.goBack();
            },
            delClick (el) {
                this.ifAlert = true
                this.deleteId = el.id;
            },
            async delTransport(){
                let res= await b2bService.deleteTransport({id:this.deleteId});
                if (res.result != 1) {
                    return;
                }else{
                    this.initData();
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