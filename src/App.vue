<template>
  <div id="app">
      <!--<div style="width: 100%;height: 100px;margin-top: 2.5em">-->
          <!--{{fsphometoken}}-->
          <!--{{debugMsg}}-->

      <!--</div>-->
    <div class="main">
      <!-- 路由匹配到的组件将渲染在这里 -->
      <!--<transition name="router-fade" mode="out-in">-->
        <transition name="router-fade" mode="out-in" v-on:before-enter="beforeEnter" v-on:after-enter="afterEnter">
        <!--<transition :name="transitionName" v-on:before-enter="beforeEnter" v-on:after-enter="afterEnter">-->
          <router-view class="child-view"></router-view>
        </transition>
      <!--</transition>-->
    </div>

    <!--悬浮底部-->
    <transition name="slideDown">
      <footer class="app" v-if="showBar">
        <li v-for="(el,index) in typeList" @click="changesType(index)":class="active===index?'on':''"><i :class="active===index?'icon-foot'+(index+1)+'_on':'icon-foot'+(index+1)"></i><h6>{{el.name}}</h6></li>
        <!--<li @click="changesType"><router-link to="/home/finance"><p>开磷金融</p></router-link></li>-->
        <!--<li @click="changesType"><router-link to="/home/finance"><p>农化服务</p></router-link></li>-->
        <!--<li @click="changesType"><router-link to="/home/myAccount"><p>我的账户</p></router-link></li>-->
      </footer>
    </transition>
    <!-- 更新弹出层 -->
    <div class="pop" v-if="ifAlert">
      <div class="bg"></div>
      <div class="box boxTxt">
        <div class="txt">
          有更新，需要更新吗？
        </div>
        <ul class="btn">
          <li @click="hideAlert">不更新</li>
          <li @click="updateApp">更新</li>
        </ul>
      </div>
    </div>
    <!--<transition name="loading">-->
      <!--<loading v-show="showLoading"></loading>-->
    <!--</transition>-->
    <!--<img src="./assets/logo.png">-->
    <!--<router-view></router-view>-->

  </div>
</template>

<script>
  import loading from './components/loading'
  import store from './store/index';
  import { mapState, mapMutations,mapActions } from 'vuex'
  import util from './lib/util';
  import{
      GlobelObj
  } from './components/Global.vue'
  import '../static/deviceInfo.js'

  export default {
    name: 'app',
    components: {
      loading
    },
    computed:{
      ...mapState([
        'isLogin'
      ]),
    },
    data () {
      return {
//        backgroundImage0: 'url(' + require('../static/images/icon_tBottom01-min.png') + ')',
//        backgroundImage1: 'url(' + require('../static/images/icon_tBottom04-min.png') + ')',
//        backgroundImage0on: 'url(' + require('../static/images/icon_tBottom01_cur-min.png') + ')',
//        backgroundImage1on: 'url(' + require('../static/images/icon_tBottom04_cur-min.png') + ')',
        showBar: true,
        transitionName: 'slide-left',
        showLoading: false,
          ifAlert:false,//显示是否更新
        typeList:[
            {name:'开磷商城',router:'/home/index'},
//            {name:'开磷金融',router:'/home/finance'},
//            {name:'农化服务',router:'/home/finance'},
            {name:'我的账户',router:'/home/myAccount'}],
        active:0,
        debugMsg:''
      }
    },
    store,
//
    computed:{
        ...mapState([
            'fsphometoken',
            'isLogin'
        ]),
    },
    methods: {
      ...mapActions([
        'checkUserLogin',
        'getUserCartList',
        'getUserFSPInfo',
        'getUserFundInfo'
      ]),
      toPath:function (path) {
        if(path == '/home/myAccount' && this.isLogin){
          this.$router.push({ path: path })
          return;
        }
        this.$router.push({ path: path })
      },
      beforeEnter: function (el) {
        this.showLoading = true;
//        if (this.$router.isBack) {
//          this.transitionName = 'slide-left';
//        } else {
//          this.transitionName = 'slide-right';
//        }
        this.$router.isBack = false
      },
      afterEnter: function (el) {
        this.showLoading = false
      },
      fetchDate: function (el) {
        let path = el.fullPath
        if (path.indexOf('home/index') === 1){
          this.active = 0;
        }
//        if (path.indexOf('home/myAccount') === 1){
//          this.$router.push({ path: '/login' })
//        }
        if (path.indexOf('home') === 1) {
          this.showBar = true
        } else {
          this.showBar = false
        }
      },
      changesType:function(i){
          if(i==0){
              this.active=i;
              this.$router.push({path:'/home/index'})
          } else if(i==1&&this.isLogin){
              this.active=i;
              this.$router.push({path:'/home/myAccount'})
          }else if(i==1&&!this.isLogin){
              this.$router.push({path:'/login'})
          }
      },
        hideAlert:function () {
            this.ifAlert = false;
        },
        //更新APP
        updateApp:function(){
            this.ifAlert = false;
            this.showLoading = true;
            var _self=this;
            chcp.installUpdate(installationCallback);

            function installationCallback(error) {
                _self.showLoading = false;
            }
        },
        //APP外壳版本过低，提示到应用商店下载新APP
        onUpdateLoadError:function(eventData){
            var error = eventData.detail.error;
//外壳app的build版本号太低. 新的web内容需要新的外壳app. 用户需要更新外壳app.值为 -2
            if (error && error.code == -2){
                alert('应用商店有新版本，请更新');
            }
            if (error && error.code == -5){
                alert('存储空间不足');
            }
            if (error && error.code == -7){
                alert('存储空间不足');
            }
        },
      errorHandleErr(msg,url,l){
        var txt=""
        txt="There was an error on this page."
        txt+="Error: " + msg + " "
        txt+="URL: " + url + " "
        txt+="Line: " + l + " "
          var networkState=device.networkState,n;
        switch (networkState){
            case 'WiFi':
                n=3;
                break;
            case 'Cell2G':
                n=0;
                break;
            case 'Cell3G':
                n=1;
                break;
            case 'Cell4G':
                n=2;
                break;
            default:
                n=4;
        }


        var data={
            appName:'kailintong',//程序名称
            message:txt,//事件描述
            n:n,//网络类型,
            t:Date.parse(new Date()),//事件发生时间
            v:device.appVersion,//客服端版本号
            d:device.manufacturer,//硬件型号
            s:device.version,//系统版本号
            c:device.model,//客户端类别
            p:'cn.gzkl.klhf',//客户端包名
            i:device.serial,//设备唯一标识
            uid:device.uuid,//用户标识
            arg:''//可扩展参数集合
        }
//        postError(data.appName,data.message,data.n,data.t,data.v,data.d,data.s,data.c,data.p,data.i,data.uid,data.arg)
        return true
      }
    },

    mounted(){
//      this.checkUserLogin();
    },

    created: function () {
//        onerror=this.errorHandleErr
//        setTimeout(function(){throw new Error}, 7000);
//      this.debugMsg = window.location.href

        var _self = this;
        //下载更新文件后安装
//        document.addEventListener('chcp_updateIsReadyToInstall', chcp_updateIsReadyToInstall, false);
//        function chcp_updateIsReadyToInstall(eventData) {
//            _self.ifAlert = true;
//        }
        //外壳版本过低
        document.addEventListener('chcp_updateLoadFailed', _self.onUpdateLoadError, false);

      this.checkUserLogin();
      this.$router.push({ path: '/home/index' })
    },

//    filters: {
//        styleConvert: function (index) {
//            return 'backgroundDiv0'+index;
//        }
//    },

    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchDate',
      isLogin: function (value) {
          var _self = this;
        if(value == true){
          this.getUserFSPInfo();
          this.getUserFundInfo();
//          setTimeout(() => {
//              _self.getUserFundInfo();
//          }, 5000);
          this.getUserCartList();

        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/layout/yy_footer';
  @import "assets/components/yy_cover";
  /* 淡入淡出 begin */
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
  /*.router-fade-enter, .router-fade-leave-active {*/
    /*!*opacity: 0;*!*/
    /*transition: opacity .3s ease;*/
  /*}*/
  .child-view {
    position: absolute;
    width:100%;
    transition: all .2s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .slide-right-leave-active {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .slide-left-leave-active {
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }
  .slide-right-enter {
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }

  .md_bgWhite{
    background-color:#fff !important;
  }
  .slideDown-enter {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .tool_bottom{
    clear:both; display:block; position:relative; z-index:1;
    transition: all .6s cubic-bezier(.55,0,.1,1);
  }
  .slideDown-enter {
    /*opacity: 0;*/
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
  }

  .slideDown-leave-active {
    /*opacity: 0;*/
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
  }
  /* 淡入淡出 end */
</style>

