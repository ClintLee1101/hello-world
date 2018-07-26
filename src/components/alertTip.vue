<!--<template>-->
  <!--<div v-if="options.show" class="notification fixed"-->
       <!--:style="setStyle"-->
       <!--transition="slide">-->
    <!--<div class="delete"-->
         <!--v-if="!options.autoClose"-->
         <!--@click="close()"></div>-->
    <!--<div class="content">-->
      <!--{{ options.content }}-->
    <!--</div>-->
    <!--<div class="countdown"-->
         <!--v-if="options.show&&options.autoClose && options.countdownBar"-->
         <!--:style="setTime"-->
         <!--:class="barControl">-->
    <!--</div>-->
  <!--</div>-->

<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!--data () {-->
            <!--return {-->
                <!--timers: [],-->
                <!--barControl: '',-->
            <!--}-->
        <!--},-->
        <!--props:['options','show'],-->

        <!--computed: {-->
            <!--setStyle () {-->
                <!--return {-->
                    <!--color: this.options.textColor || '#fff',-->
                    <!--background: this.options.backgroundColor-->
                <!--}-->
            <!--},-->
            <!--setTime () {-->
                <!--return {-->
                    <!--transition: `all ${(this.options.showTime / 1000) || 3}s linear`,-->
                    <!--background: this.options.barColor || '#03D6D2'-->
                <!--}-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--countdown () {-->
                <!--if (this.options.autoClose) {-->
                    <!--console.log(1111);-->
                    <!--if (this.options.countdownBar) {-->
                        <!--setTimeout(() => {-->
                            <!--this.barControl = 'count-leave'-->
                        <!--}, 10)-->
                    <!--}-->
                    <!--const t = setTimeout(() => {-->
                        <!--this.close()-->
                    <!--}, this.options.showTime || 2000)-->
                    <!--this.timers.push(t)-->
                <!--}-->
            <!--},-->
            <!--close () {-->
                <!--this.$emit('closeTip','')-->
            <!--}-->
        <!--},-->
        <!--watch: {-->
            <!--options (v,oldv) {-->
                <!--console.log(v,oldv);-->
                <!--this.barControl = ''-->
                <!--this.timers.forEach((timer) => {-->
                    <!--window.clearTimeout(timer)-->
                <!--})-->
                <!--this.timers = []-->
                <!--this.countdown()-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</script>-->




<template>
  <div class="popAuto">
      <div class="box">
        <p>{{options}}</p>
      </div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                positionY: 0,
                timer: null,
                timers:[]
            }
        },
        mounted(){

        },
        props: ['options'],
        methods: {
            countdown () {
                const t = setTimeout(() => {
                    this.closeTip()
                },  2000)
                this.timers.push(t)
            },
            closeTip(){
                this.$emit('closeTip')
            }
        },
        watch: {
            options (v,oldv) {
                this.timers.forEach((timer) => {
                    window.clearTimeout(timer)
                })
                this.timers = []
                this.countdown()
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import '../assets/components/yy_coverAuto';
</style>
