<!--/*************************************************************************/-->
<!--/*****************************              **************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">设备</div>
            <i></i>
        </header>





        <div class="btn">
         <ul>
             <li v-for="(value,key) in deviceInfo">
                 {{ key }} : {{ value }}
             </li>
         </ul>
        </div>


        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>
<script>
    //import "../assets/common.css";
    import alertTip from '../components/alertTip'
    import '../../static/deviceInfo.js'
    export default{
        components: {
            alertTip
        },
        data() {
            return{
                //显示弹框设置
                showNotice:false,
                options: '',
                deviceInfo:{}
                //显示弹框设置结束

            }

        },
        computed: {

        },
        methods: {
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
                this.$router.goBack();
            }
        },
        created () {
            this.deviceInfo=device
        }
    }

</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
    @import "../assets/components/yy_cover";
</style>