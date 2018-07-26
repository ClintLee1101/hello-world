<!--/************************      上传身份证     *********************/-->

<template>
    <div>

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack()"></a>
            <div class="title">身份证示例</div>
            <i></i>
        </header>

        <div class="list60 spaceHT">
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm">
                        <img :src="licenceImg1">
                        <!--<input style="width: 100%;"  type="hidden"  id="picType" name="picType" value="1" >-->
                    </form>
                </div>
            </div>
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm1">
                        <img :src="permitImg1">
                    </form>
                </div>

            </div>
            <div class="upload">
                <div style="width:70%;margin:0 auto">
                    <form id="uploadForm2">
                        <img :src="taxImg1">
                    </form>
                </div>
            </div>
            <div class="btn_submit" style="padding:0 1rem">
                <a @click="goBack()">返回</a>
            </div>
        </div>


    </div>
</template>

<script>
    import loading from '../components/loading';
    export default{

        data () {
            return {

                licenceImg1: require('../../static/images/identityImg4.jpg'),//身份证正面照片
                permitImg1: require('../../static/images/identityImg5.jpg'),//身份证反面照片
                taxImg1: require('../../static/images/identityImg6.jpg'),//手持身份证照片

            }
        },

        methods : {
            goBack(){
                this.$router.goBack();
            },







        },

        watch : {

        },

        created : function() {
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
