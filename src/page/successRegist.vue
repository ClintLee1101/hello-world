<!--/*************************************************************************/-->
<!--/***************************       下单成功     ***************************/-->
<!--/*************************************************************************/-->

<template>
    <div>

        <header>
            <i></i>
            <div class="title">注册</div>
            <i></i>
        </header>

        <div class="tips spaceHT">
            <i class="icon-suc"></i>
            <p>注册成功！</p>
            <p v-if="type">请耐心等待审核！</p>
        </div>

        <div class="btn_submit">
            <a @click="gotoIndex" style="width:100%">进入首页</a>
        </div>

    </div>
</template>

<script>
    export default{
        data(){
            return {
                type:''
            }
        },
        methods: {
            gotoIndex(){
                this.$router.push({path: '/home/index'})
            },
            gotoOrderList(){
                this.$router.push({path: '/orderList'})
            }
        },
        created () {
            this.type = this.$route.query.type;
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/pages/yy_tips';
</style>