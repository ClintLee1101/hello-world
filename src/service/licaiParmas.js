
/**
 * Created by yfan on 18/2/5..
 */
import md5 from "blueimp-md5";
/**
 * http请求统一参数处理类
 * @param userInfo
 * @constructor
 * inreach
 */
class LicaiParmas{
    constructor(appKey, appSecret){
        this.appKey = appKey;
        this.appSecret = appSecret;
    }
    /**
     *
     * @param params  {Object} 过滤前的入参
     * @param url     {String} 请求url
     * @returns       {Object} 过滤后的入参
     */
    configParams(params, url) {
        params = LicaiParmas.getSignParams(params, this.appKey, this.appSecret);
        return params;
    };
    static getSignParams(body, appKey, appSecret, timestamp) {
        body["appkey"] = appKey;
        body["timestamp"] = timestamp || new Date().getTime();
        let signatureString = '';
        let keyArr = [];
        for (let key in body) {
            keyArr.push(key);
        }
        keyArr.sort();
        for (let j = 0; j < keyArr.length; j++) {
            for (let key in body) {
                if (keyArr[j] == key) {
                    signatureString += keyArr[j] + body[key];
                }
            }
        }
        signatureString = appSecret + signatureString + appSecret;
        signatureString = signatureString.toLocaleUpperCase();
        signatureString = md5(signatureString);
        body['signcode'] = signatureString;
        return body;
    }
}
export default {
    LicaiParmas
}
// module.exports = exports = LicaiParams;