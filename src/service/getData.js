import fetch from '../config/fetch'
import crypto from 'crypto-js'
import config from '../lib/config'
import{
    GlobelObj
} from '../components/Global.vue'
// import * as home from './tempdata/home'
function IsPC(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}
if(IsPC()){
    console.log('it is pc');
    var b2b='/b2b/';
    var fsp='/fsp/';
    var zl='/zl/';
    var hczq='/hczq/';
}else{
    console.log('it is phone');
    // var b2b='https://bshop.staging.china-lin.com/';
    // var fsp='https://ifsp.staging.china-lin.com/';
    var b2b=config.b2b;
    var fsp=config.fsp;
    var zl=config.zl;
    var hczq=config.hczq;
}



//POST


//APOST



//


//error日志
var postError=(appName,message,n,t,v,d,s,c,p,i,uid,arg)=>fetch('POST','http://10.0.0.22:9790/log/logErrorEntry',{
    appName:appName,
    message:message,
    n:n,
    t:t,
    v:v,
    d:d,
    s:s,
    c:c,
    p:p,
    i:i,
    uid:uid,
    arg:arg,
})

export {
    // checkErrorTimes,
}
