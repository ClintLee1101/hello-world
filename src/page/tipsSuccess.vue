<!--/*************************************************************************/-->
<!--/***************************      提示页-成功     *************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <i></i>
            <div class="title">交易结果</div>
            <i></i>
        </header>

        <div class="tips spaceHT">
            <i class="icon-suc"></i>
            <p>交易成功！</p>
        </div>

        <div class="btn_submit">
            <router-link :to="{path: '/home/myAccount?from=success'}">我的资产</router-link>
            <router-link :to="{path: '/cartStore?from=success'}">我的商品</router-link>
        </div>

    </div>
</template>

<script>
    export default{
        data () {
            return {}
        },
        components: {},
        filters: {},
        computed: {},
        methods: {
            goBack()
            {
                this.$router.goBack();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/pages/yy_tips';
</style>
