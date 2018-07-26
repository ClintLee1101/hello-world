/**
 * Created by fanyi on 16/9/27.
 */
import md5 from 'blueimp-md5';
var util = {
  reLogin: function () {
    location.href = '#/login'
  },
  ref: function (url) {
    location.href = '#/' + url
  },
  price: function (price) {
    if (price === 0) {
      return '价格获取中'
    }
    if (price === '登录后可见') {
      return '登录后可见'
    }

    let p
    let p1
    p = String(Math.round(price*100))
    p1 = p.substr(p.length - 2, p.length)
    p = p.substr(0, p.length - 2)

    let pattern = /(?=((?!\b)\d{3})+$)/g;
    p = p.replace(pattern, ',');
    p = p + '.' + p1
    return p
  },

  price1: function (price) {
    if(!price || price === 0){
      return '0.00'
    }

    let dw = '';

    if(price > 100000000){
      price = price/10000;
      dw = '万';
    }

    let p
    let p1
    p = String(Math.round(price*100))
    p1 = p.substr(p.length - 2, p.length)
    p = p.substr(0, p.length - 2)

    let pattern = /(?=((?!\b)\d{3})+$)/g;
    p = p.replace(pattern, ',');
    if(dw == ''){
      p = p + '.' + p1;
    }else{
      p = p + dw;
    }

    return p
  },

  /**
   * @param time 1970.1.1日起的毫秒数
   * @return {string} YYYY-MM-DD格式的字符串
   */
  getTimeStr:function(time)
  {
    var spl = "-";
    var date = new Date();
    if(time != undefined && time != "") {
      date.setTime(time);
      var month = date.getMonth() + 1;
      var monthStr = util.getTwoNumber( month );
      var day = date.getDate();
      var dayStr = util.getTwoNumber( day );
      return date.getFullYear() + spl + monthStr + spl + dayStr;
    }
  },
  /**
   * @param number 数字
   * @return 小于10则返回前面加0的字符串，大于10则直接返回对应的字符串
   */
  getTwoNumber:function(number)
  {
    return String((number >= 10) ? number : ("0" + number));
  },

  /**
   * @param company string
   */
  companyConvert:function(company)
  {
    if(company == "huafeigongsi"){
      return "磷肥部";
    }
    if(company == "kailinhechengan"){
      return "复合肥部";
    }
    if(company == "huagongchanpinbu"){
        return "化工产品部";
    }
    if(company == "fazhanbu"){
        return "发展部";
    }
    if(company == "otherzhanghu"){
        return "其他账户";
    }
    return company;

  },
  getCookie(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
          return unescape(arr[2]);
      else
          return null;
  },
  delteAllCookie()
  {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; "); // 将多cookie切割为多个名/值对
      for (var i = 0; i < arrCookie.length; i++) { // 遍历cookie数组，处理每个cookie对
          var arr = arrCookie[i].split("=");
          if (arr.length > 0)
              this.delCookie(arr[0]);
      }
  },
  delCookie(name){
        var exp = new Date();
        exp.setTime (exp.getTime() - 1);
        var cval = this.getCookie (name);
        document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
  },
    //理财加密传参
    getSignParams:function(body, appKey, appSecret, timestamp){
        body["appkey"] = appKey;
        body["timestamp"] = timestamp || new Date().getTime();
        var signatureString = '';
        var keyArr = [];

        for (var key in body) {
            keyArr.push(key);
        }

        keyArr.sort();

        for (var j = 0; j < keyArr.length; j++) {
            for (var key in body) {
                if (keyArr[j] == key) {
                    signatureString += keyArr[j] + body[key];
                }
            }
        }
        signatureString = appSecret + signatureString + appSecret;

        signatureString = signatureString.toLocaleUpperCase();
        console.log(signatureString);
        signatureString = md5(signatureString);
        body['signcode'] = signatureString;
        // body['signcode'] = 'c75dfbed9b028d6b83e24639fdfe8b14';
        this.signcode=signatureString;
        console.log(this.signcode);
        return body;
    }
}
export default util

