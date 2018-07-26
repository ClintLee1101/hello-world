<!--/*************************************************************************/-->
<!--/*****************************       注册       **************************/-->
<!--/*************************************************************************/-->

<template>
    <div class="bg_white">

        <header>
            <a class="arrowBack icon-arrowL" @click="goBack"></a>
            <div class="title">支付</div>
            <i></i>
        </header>





        <div class="btn" @click="pay">
            <a>微信支付</a>
        </div>
        <div class="btn" @click="aliPay">
            <a>支付宝支付</a>
        </div>


        <!--弹框子组件-->
        <alert-tip v-show="showNotice" @closeTip="close" :options="options">
        </alert-tip>

    </div>
</template>

<script>
    //import "../assets/common.css";
    import alertTip from '../components/alertTip'
    import{
        GlobelObj
    } from '../components/Global.vue'
    export default{
        components: {
            alertTip
        },
        data() {
            return{
                //显示弹框设置
                showNotice:false,
                options: '',
                ipAddress:'',
                //显示弹框设置结束

            }

        },
        computed: {

        },
        methods: {
            pay(){
                this.createWechatOrder();
//                var params = {
//                    partnerid: '10000100', // 商户号
//                    prepayid: 'wx201411101639507cbf6ffd8b0779950874', // 预支付交易会话ID
//                    noncestr: '1add1a30ac87aa2db72f57a2375d8fec', // 随机字符串
//                    timestamp: '1439531364', // timestamp
//                    sign: '0CB01533B8C1EF103065174F50BCA001', // 签名
//                };
//                console.log(Wechat);


            },
            async createWechatOrder(){
                var params = {
                    appid:'',
                    partnerid: '', // 商户号
                    prepayid: '', // 预支付交易会话ID
                    package:'',
                    noncestr: '', // 随机字符串
                    timestamp: '', // timestamp
                    sign: '', // 签名
                };
                this.ipAddress=returnCitySN["cip"]||'192.168.1.1';
                let res=await wechatCreateOrder('wx32302db264dda020','3491',this.ipAddress,'APP','开磷通');
                if(res.message.code==0){
                    params.appid=res.data.appId;
                    params.partnerid=res.data.partnerId;
                    params.prepayid=res.data.prepayId;
                    params.package=res.data.packageValue;
                    params.noncestr=res.data.nonceStr;
                    params.timestamp=res.data.timeStamp;
                    params.sign=res.data.sign;
                    //// 第二步：调用支付插件
                    Wechat.sendPaymentRequest(params, function (e) {
                        alert('Success:'+e);
                    }, function (reason) {
                        alert("失败:"+reason);
                    });
                }else{
                    alert(res.message.message);
                }

            },
            async createAliOrder(){
                let outTradeNo=new Date().getTime();
//                let res=await alipayCreateOrder('11111','2017090108492647','棉裤',outTradeNo,'0.01','狗儿子闯');
//                var payInfo=res.data;
                var payInfo='app_id=2017090108492647&biz_content=%7B%22timeout_express%22%3A%2215d%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A%220.01%22%2C%22subject%22%3A%22%E8%B4%B5%E5%B7%9E%E5%BC%80%E7%A3%B7%E5%8C%96%E8%82%A5%E6%9C%89%E9%99%90%E8%B4%A3%E4%BB%BB%E5%85%AC%E5%8F%B8%22%2C%22body%22%3A%22%5B%7B%22price%22%3A2670%2C%22name%22%3A%22%E7%A3%B7%E9%85%B8%E4%B8%80%E9%93%B5%E2%80%94%E5%BC%80%E7%A3%B7%E2%80%9455%25%E2%80%94%E7%B2%89%E7%8A%B6%E2%80%94%E7%99%BD%E8%89%B2%E2%80%9450kg%22%2C%22amount%22%3A1%7D%5D%22%2C%22out_trade_no%22%3A%22B2B20171201000013%22%7D&charset=utf-8&method=alipay.trade.app.pay&notify_url=https%3A%2F%2Fifsp.staging.china-lin.com%2Fpay%2Falipay%2Fnotify&sign_type=RSA2&timestamp=2017-12-01%2014%3A30%3A51&version=1.0&sign=fC%2BA10aWxkYq%2B%2FdUZC6bJQNMU6iqPmkzQKogqH5NYklTn5Fa6dtAVctyZDFlohq1Hj28m%2FB3mTWR86peBIvUmh0P9t%2BkBEqxwUwVxf6DmRNlidr8Qn2Gpb1bTADQFYnemgTbZRRKPpIcsrUk1b39vxhcGRVQJQzRJ7G46817XATKoeZ0Dez1zsnfEZQFSg%2F3DDGRIfaamuU7unZHMdDCCzmVSoUyqDiTlCTtsfmXEiCPq7fAUJTNIC%2FvpOYvs4s69mqygVszfhKg%2FKrOP3x49%2FQoLO3CWppuxUbjm7KZvGicGNtOp7Vs7OqIRTkZbJ42vpt0IG7rGSCIY74Vo6Nagg%3D%3D';
                //// 第二步：调用支付插件
                cordova.plugins.alipay.payment(payInfo,function success(e){
                    alert(e.resultStatus)
                },function error(e){

                });
            },
            aliPay(){
                    this.createAliOrder();
                // 第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理
//                var payInfo  = encodeURI('app_id=2016081500253356&biz_content={"timeout_express":"30m","product_code":"QUICK_MSECURITY_PAY","total_amount":"0.01","subject":"1","body":"我是测试数据","out_trade_no":"IQJZSRC1YMQB5HU"}&charset=utf-8&format=json&method=alipay.trade.app.pay&notify_url=http://domain.merchant.com/payment_notify&sign_type=RSA2&timestamp=2017-12-06 17:15:31&version=1.0&sign=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt72BYC/Np3BDu9OWirEFGnTwJ+Tx+QnwqDJq9gdt+I/MKwfz1bfJoRu87fln6PR/Wju8XMt8HLVkd3D1kNaNBcI3gyDfge8Kp8Q6HeTQvjKKuIIgY06R4g/hJxnokEzMd9JDVqNQugZMgDFBG82gD7EArOy+Ze6bU04o3NsusmKuFg0v2giCthvKVYTTSohQ7zHVFKbpZqSPW8n92idQZeHPjHPI1HBMFFnJWDRgLW5LVOaGMK0MTfCTpjBeNIJz2jxOJ43LuZU6dgZJBlq/v2UlxBri0NYQtkJxrUxx9Iu+DsEP/7NjNyVjvdFXFvIKgdPSKcAePdMJDJVZMo3FyQIDAQAB');
//// 第二步：调用支付插件
//                cordova.plugins.alipay.payment(payInfo,function success(e){
//                    alert(e.resultStatus)
//                },function error(e){
//
//                });

                //e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
                //e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
                //e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
                //当e.resultStatus为9000时，请去服务端验证支付结果
                /**
                 * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
                 * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
                 * docType=1) 建议商户依赖异步通知
                 */

            },
            //关闭弹框
            close(){
                this.options='';
                this.showNotice=false;
            },
            goBack(){
                this.$router.goBack();
            }
        },
        created () {
        }
    }

</script>

<style lang="scss" scoped>
    @import "../assets/pages/yy_login";
    @import "../assets/components/yy_cover";
    .btn{
        margin-top:200px !important;
    }
</style>