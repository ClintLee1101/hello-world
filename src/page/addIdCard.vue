<!--/************************      上传身份证     *********************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">上传身份证</div>
            <i></i>
        </header>

        <div class="list60 spaceHT">
            <div style="line-height:1.6rem; color:#a7aabe;   border-bottom: 1px solid #e3e3e3;margin:0 1.6rem;">
                <span style="font-size:0.875em;">请验证您的信息，通过后可添加多张银行卡。</span>
            </div>
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm">
                        <input class="icon-add" type="file" accept="image/*" name="uploadFile" id="inputFile0" @change="doUpLoad(0)"/>
                        <img :src="licenceImg1">
                        <!--<input style="width: 100%;"  type="hidden"  id="picType" name="picType" value="1" >-->
                        <input style="width: 100%;"  type="hidden" v-model="token" name="token" >
                        <input style="width: 100%;"  type="hidden" v-model="wealthUserId" name="uid">
                    </form>
                </div>
            </div>
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm1">
                        <input class="icon-add" type="file" accept="image/*" @change="doUpLoad(1)" id="inputFile1" name="uploadFile"/>
                        <img :src="permitImg1">
                        <input style="width: 100%;"  type="hidden" v-model="token" name="token" >
                        <input style="width: 100%;"  type="hidden" v-model="wealthUserId" name="uid">
                    </form>
                </div>

            </div>
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm2">
                        <input class="icon-add" type="file" accept="image/*" @change="doUpLoad(2)" id="inputFile2" name="uploadFile"/>
                        <img :src="taxImg1">
                        <input style="width: 100%;"  type="hidden" v-model="token" name="token" >
                        <input style="width: 100%;"  type="hidden" v-model="wealthUserId" name="uid">
                    </form>
                </div>
            </div>
            <div class="btn_submit" style="padding:0 1rem">
                <a @click="submit()">提交申请</a>
            </div>
            <p class="note">注意：身份证必须清晰</p>
            <p class="note" @click="goExample()" style="color: #ff9058">查看示例</p>
        </div>


        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>
    </div>
</template>

<script>
    import loading from '../components/loading';
    import alertTip from '../components/alertTip'
    import {proxy} from '../service'
    import {banks} from '../service/bankList';
    import {
        licaiService
    } from '../service'

    import { mapState, mapActions, mapMutations } from 'vuex';
    import util from '../lib/util';

    export default{

        data () {
            return {
                list:[],
                isUser:true,
                userType:0,
                showLoading:false,
                image:'/images/bank/logo_{{el.pic}}.jpg',
                licenceImg1: require('../../static/images/loginRegister09.png'),//身份证正面照片
                permitImg1: require('../../static/images/loginRegister10.png'),//身份证反面照片
                taxImg1: require('../../static/images/loginRegister11.png'),//手持身份证照片
                //显示弹框设置
                showNotice:false,
                //理财相关
                wealthUserId:'',
                token:'',
                options:'',
                user:{},
                bankNo:'',
                picFrontPath:'',
                picReversePath:'',
                picHandPath:'',
                params:{},
                signcode:'',

            }
        },
        components: {
            loading,
            alertTip
        },
        computed : {
            ...mapState([
                'licaiInfo'
            ]),
        },

        methods : {
            goBack(){
                this.$router.goBack();
            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },

            initData(){
            },
            //上传照片
            doUpLoad: function (index) {

                console.log(document.getElementById("inputFile" + index).files[0])
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
                    url: proxy.zl + '/user/identify',
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
                        console.log(result);
                        if (result.message.code == 0) {
//                            self.showLoading = false;
                            if (index == 0) {

                                self.licenceImg1 = proxy.jinhuiImg+result.message.filePath;
                                self.picFrontPath =result.message.filePath;
                            }
                            if (index == 1) {
                                self.permitImg1 = proxy.jinhuiImg+result.message.filePath;
                                self.picReversePath = result.message.filePath;
                            }
                            if (index == 2) {
                                self.taxImg1 = proxy.jinhuiImg+result.message.filePath;
                                self.picHandPath = result.message.filePath;
                            }

                        } else {
                            self.showLoading = false;
                            self.options = '图片上传失败，请更换图片或稍后再试';
                            self.showNotice = true;
                        }
                    },
                    error: function (result) {
                        self.options = result.statusText;
                        self.showNotice = true;
                    }
                });
            },
            async identifyId(){
                let data_params={
                    client:'website',
                    picFrontPath:this.picFrontPath,
                    picReversePath:this.picReversePath,
                    picHandPath:this.picHandPath,
                    token:this.token,
                    uid:this.wealthUserId
                }
//                this.params = util.getSignParams(data_params,'jh4a045c200bb38c90','f1cec8aaed7efcb3c2e113bbe7ad6481');
                let res = await licaiService.identifyId(data_params);
//                let res = await identifyId(this.params);
                console.log(res);
                if(res.message.code==0){
                    this.$router.push({path:'/cardResult'});
                }else{
                    this.options = res.message.message;
                    this.showNotice = true;
                }
            },
            submit:function(){
                if(!this.picFrontPath||!this.picReversePath||!this.picHandPath){
                    this.options = '有附件未上传，请上传';
                    this.showNotice = true;
                    return;
                }
                this.identifyId();
            },
            goExample:function(){
                this.$router.push({path:'/idCardExample'})
            }


        },

        watch : {

        },

        created : function() {
            console.log(this.licaiInfo);
            this.list=this.licaiInfo[1];
            console.log(this.list);
           this.token=this.licaiInfo[1].token;
           this.wealthUserId=localStorage.getItem("userId");
            this.initData();
        },

    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import "../assets/components/yy_list";
    @import "../assets/components/yy_button";
    @import "../assets/components/yy_cover";

    dl{
        @include _dl(8em);
    }
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
    .upload{
            position: relative;
            margin: 1.25em auto;
            height: 8em;
            text-align: center;
    }
    form{
        position:relative;
    }
    img{
        width:100%;
        height:8em;
    }
    input[name='uploadFile']{
        width:100%;
        height:100%;
        position:absolute;
        opacity:0;
        top:0;
        left:0;
    }
    p.note{
        margin-top: 0.25em;
        text-align: center;
        font-size: 0.875em;
        color: #a7aabe;
    }

</style>
