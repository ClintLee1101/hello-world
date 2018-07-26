<!--/*************************************************************************/-->
<!--/***************************      提示页-失败     *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <i></i>
            <div class="title">交易结果</div>
            <i></i>
        </header>

        <div class="tips spaceHT">
            <i class="icon-fail"></i>
            <div class="txt">
                <p>交易失败！</p>
                <h5>{{msg}}<br>如有疑问，请咨询客服：400-677-9000</h5>
            </div>
        </div>

        <div class="btn_submit">
            <a @click="goBack">返回重试</a>
            <router-link :to="{path: '/cartStore'}">我的商品</router-link>
        </div>

    </div>
</template>

<script>
    export default{
        data () {
            return {
                msg: ''
            }
        },
        components: {},
        filters: {},
        computed: {},
        methods: {
            goBack()
            {
                this.$router.goBack();
            }
        },
        created: function () {
            this.msg = this.$route.query.msg;
        },
    }
</script>

<style lang="scss" scoped>
    @import '../assets/pages/yy_tips';

    .btn_submit{
        a:first-child{
            @include _btn_f14h50_blue;
        }
    }
</style>
