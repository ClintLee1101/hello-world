<template>
  <div class="home">
    <div class="main">
      <!-- 路由匹配到的组件将渲染在这里 -->
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  // mounted 钩子函数  这里去请求豆瓣数据
  import loading from '../components/loading'
  export default {
    name: 'home',
    data () {
      return {
        showLoading: false
      }
    },
    components: {
      loading
    },
    methods: {
//      beforeEnter: function (el) {
//        this.showLoading = true
//      },
//      afterEnter: function (el) {
//        this.showLoading = false
//      }
    }

//    这里mounted和created生命周期函数区别
//    created: function () {
//      this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=10', {}, {
//        headers: {
//        },
//        emulateJSON: true
//      }).then(function (response) {
//        // 这里是处理正确的回调
//        console.log(response)
//        this.articles = response.data.subjects
//        // this.articles = response.data["subjects"] 也可以
//      }, function (response) {
//        // 这里是处理错误的回调
//        console.log(response)
//      })
//    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md_topFixed_link:after{ background:#d2d2d2; -webkit-transform:scaleY(.5); -ms-transform:scaleY(.5); transform:scaleY(.5); content:""; position:absolute; left:0; top:0; width:100%; height:1px; z-index:2;}


  .fold-enter-active {
    animation-name: fold-in;
    animation-duration: .5s;
  }
  .fold-leave-active {
    animation-name: fold-out;
    animation-duration: .5s;
  }
  @keyframes fold-in {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    50% {
      transform: translate3d(50%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-out {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(50%, 0, 0);
    }
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }

  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }

  .inout-enter-active {
    animation: bounce-in .5s;
  }
  .inout-leave-active {
    animation: bounce-out .5s;
  }
</style>
