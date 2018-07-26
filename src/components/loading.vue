<template>
    <div>
        <div class="loadingBg" :style="{height:windowH+'px'}"></div>
        <div class="loading_container">
            <div class="load_img" :style="{backgroundPositionY: -(positionY%7)*2.5 + 'rem'}">
            </div>
            <!--<svg class="load_ellipse" xmlns="http://www.w3.org/2000/svg" version="1.1">-->
            <!--<ellipse cx="26" cy="10" rx="26" ry="10" style="fill:#ddd;stroke:none;"></ellipse>-->
            <!--</svg>-->
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                positionY: 0,
                windowH: 0,
                timer: null
            }
        },
        mounted () {
//        this.timer = setInterval(() => {
//          this.positionY ++
//        }, 600)
        },
        beforeDestroy () {
            clearInterval(this.timer)
        },
        created: function () {
            this.windowH = window.innerHeight
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/mixin';

    @keyframes load {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    @keyframes ellipse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.3);
        }
        100% {
            transform: scale(1);
        }
    }

    .loadingBg {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #ffffff;
        filter: alpha(opacity=50);
        -moz-opacity: 0.5;
        -khtml-opacity: 0.5;
        opacity: 0.5;
        z-index: 998;
    }

    .loading_container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        @include wh(8.5rem, 8.5rem);
        z-index: 999;
    }

    .load_img {
        @include wh(100%, 100%);
        background: url('../../static/assets/images/loading.gif') no-repeat 0 0;
        background-size: 8.5rem auto;
        /*transform: translateY(0px);*/
        /*animation: load .6s infinite ease-in-out;*/
        position: relative;
        /*z-index: 9999;*/
    }

    .load_ellipse {
        position: absolute;
        @include wh(4.4rem, 4rem);
        top: 2.2rem;
        left: 0.11rem;
        z-index: 10;
        animation: ellipse .6s infinite ease-in-out;
    }
</style>
