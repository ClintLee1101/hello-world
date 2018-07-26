<!--/*************************************************************************/-->
<!--/***********************      设置 - 风险评估      ************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <header class="bg_red">
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">风险评测</div>
            <i></i>
        </header>

        <div class="risk_hd spaceHT">
            <p>您属于</p>
            <h3>{{riskType}}</h3>
        </div>

        <div class="risk">

            <h6>低风险</h6>
            <h6>较低风险</h6>
            <h6>中风险</h6>
            <h6>较高风险</h6>
            <h6>高风险</h6>
            <h3>{{riskName}}</h3>

            <img v-bind:src="risk_img">
            <!--
            1. 低风险  arrow_low
            2. 较低风险 arrow_lower
            3. 中风险 arrow_in
            4. 较高风险 arrow_higher
            5. 高风险 arrow_high
            -->
            <!--<div :class="risk">-->
            <div :class="risk">
                <b></b>
                <i></i>
                <span></span>
            </div>
        </div>
        <h5>您适合投资<b>{{riskProduct}}</b>产品</h5>

        <div class="btn_submit">
            <a @click="goReappraisal">重新评估</a>
        </div>

    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    export default{
        data(){
            return{
                risk:'',
                riskType:'',
                riskProduct:'',
                riskName:'',
                risk_img: require('../../static/images/risk_speedTable-min.png'),
            }
        },
        computed:{
            ...mapState(['userFspInfo'])
        },
        mounted(){
        },
        methods:{
            goBack(){
                this.$router.goBack();
//                this.$router.push({path:'/setting'})
            },
            goReappraisal(){
                this.$router.push({path:'/myAccountRiskQuestion'})
            },
            initData(){
                console.log(this.userFspInfo.risk) ;

                switch (this.userFspInfo.risk)
                {

                    case 1:
                        this.risk='arrow arrow_high';
                        this.riskType='进取型投资人';
                        this.riskProduct='高风险及以下';
                        this.riskName='高风险';
                        break;
                    case 2:
                        this.risk='arrow arrow_higher';
                        this.riskType='成长型投资人';
                        this.riskProduct='较高风险及以下';
                        this.riskName='较高风险';
                        break;
                    case 3:
                        this.risk='arrow arrow_in';
                        this.riskType='平衡型投资人';
                        this.riskProduct='中风险及以下';
                        this.riskName='中风险';
                        break;
                    case 4:
                        this.risk='arrow arrow_lower';
                        this.riskType='稳健型投资人';
                        this.riskProduct='低风险及以下';
                        this.riskName='较低风险';
                        break;
                    case 5:
                        this.risk='arrow arrow_low';
                        this.riskType='保证型投资人';
                        this.riskProduct='低风险';
                        this.riskName='低风险';
                }
            }
        },
        created(){
            this.initData();

        },
        watch:{

        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/layout/yy_header';
    @import '../assets/components/yy_button';

    $arrow_big: 1.625rem;
    $arrow_big_L: 1.625rem /2;
    $arrow_small: 1.25rem;
    $arrow_small_L: 1.25rem /2;
    $c_arrow_link: #f0f0f0;
    $c_arrow: #b1b1b1;
    $risk_img_w: 14rem;
    $risk_img_h: 11.5rem;
    $risk_img_L: -(14rem /2);

    .risk_hd{
        @include _bg_red2;
        padding: 2.25rem 0 2.063rem;
        text-align: center;

        h3{
            font-size: 1.875rem;
            line-height: 2.688rem;
        }
    }

    .risk{
        width: 100%;
        height: 13em;
        margin: 3.313rem 0 0.5rem;
        position: relative;

        h3, h6{
            height: 1.5em;
            position: absolute;
            z-index: 101;
        }

        h6{
            color: $gray;
            left: 50%;

            &:nth-child(1){
                bottom: 0;
                margin-left: calc(-6rem - 3em);
                text-align: right;
            }
            &:nth-child(2){
                top: 4.5rem;
                margin-left: calc(-6.75rem - 4em);
            }
            &:nth-child(3){
                top: 0;
                margin-left: -1.5em;
            }

            &:nth-child(4){
                top: 4.5rem;
                margin-left: 6.75rem;
            }
            &:nth-child(5){
                bottom: 0;
                margin-left: 6rem;
            }
        }

        h3{
            width: 4em;
            text-align: center;
            bottom: 0;
            left: 50%;
            margin-left: -2em;
        }

        img{
            width: $risk_img_w;
            height: $risk_img_h;
            position: absolute;
            left: 50%;
            top: 1.25rem;
            margin-left: $risk_img_L;
            z-index: 100;
        }

        .arrow{
            b, i, span{
                display: inline-block;
                position: absolute;
                left: 50%;
            }

            b, i{
                background: $white;
                -moz-border-radius:50%;
                -webkit-border-radius:50%;
                border-radius:50%;
                -moz-box-shadow:0 0 4px $c_arrow;
                -webkit-box-shadow:0 0 4px $c_arrow;
                box-shadow:0 0 4px $c_arrow;
                z-index: 101;
            }

            b{
                width: $arrow_big;
                height: $arrow_big;
            }

            i{
                width: $arrow_small;
                height: $arrow_small;
                top: 7.125em;
                margin-left: -($arrow_small_L);
            }

            span{
                background: $c_arrow_link;
                -moz-transition:0.3s;
                -webkit-transition:0.3s;
                -o-transition:0.3s;
                -ms-transition:0.3s;
                transition:0.3s;
                width: 5.5rem;
                height:0.063em;
                z-index: 100;
            }

            //低风险
            &.arrow_low {
                b {
                    bottom: 0.125rem;
                    margin-left: -5.5em;
                }
                span{
                    top: 9.75rem;
                    margin-left: -5rem;

                    -moz-transform: rotate(-222deg);
                    -webkit-transform: rotate(-222deg);
                    -o-transform: rotate(-222deg);
                    -ms-transform: rotate(-222deg);
                    transform: rotate(-222deg);
                }
            }

            //较低风险
            &.arrow_lower {
                b {
                    top: 4.75rem;
                    margin-left: -6.325em;
                }
                span{
                    top: 6.75rem;
                    margin-left: -5rem;

                    -moz-transform: rotate(-158deg);
                    -webkit-transform: rotate(-158deg);
                    -o-transform: rotate(-158deg);
                    -ms-transform: rotate(-158deg);
                    transform: rotate(-158deg);
                }
            }

            //中风险
            &.arrow_in {
                b {
                    top: 1.325rem;
                    margin-left: - $arrow_big_L;
                }
                span{
                    top: 5rem;
                    margin-left: -(5.5rem /2);

                    -moz-transform: rotate(90deg);
                    -webkit-transform: rotate(90deg);
                    -o-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    transform: rotate(90deg);
                }
            }

            //较高风险
            &.arrow_higher {
                b {
                    top: 4.75rem;
                    margin-left: 4.75em;
                }
                span{
                    top: 6.75rem;

                    -moz-transform: rotate(158deg);
                    -webkit-transform: rotate(158deg);
                    -o-transform: rotate(158deg);
                    -ms-transform: rotate(158deg);
                    transform: rotate(158deg);
                }
            }

            //高风险
            &.arrow_high {
                b {
                    bottom: 0.125rem;
                    margin-left: 3.925em;
                }
                span{
                    top: 10rem;
                    margin-left: -0.25rem;

                    -moz-transform: rotate(222deg);
                    -webkit-transform: rotate(222deg);
                    -o-transform: rotate(222deg);
                    -ms-transform: rotate(222deg);
                    transform: rotate(222deg);
                }
            }
        }
    }

    h5{
        text-align: center;

        b{
            color: $red;
        }
    }

    .btn_submit{
        width: calc(100% - 2rem);
        position: fixed;
        bottom: 0.5rem;
    }
</style>