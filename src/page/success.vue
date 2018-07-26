<!--/*************************************************************************/-->
<!--/***************************       下单成功     ***************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <i></i>
            <div class="title">确认下单</div>
            <i></i>
        </header>

        <div class="tips spaceHT">
            <i class="icon-suc"></i>
            <p>订单提交成功！</p>
        </div>

        <div class="btn_submit">
            <a @click="gotoIndex">继续购物</a>
            <a @click="gotoOrderList">查看订单状态</a>
        </div>

    </div>
</template>

<script>
    export default{
        data(){
            return {}
        },
        methods: {
            gotoIndex(){
                this.$router.push({path: '/home/index'})
            },
            gotoOrderList(){
                this.$router.push({path: '/orderList'})
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../assets/pages/yy_tips';
</style>