/**
 * Created by yfan on 18/2/5.
 */
import _ from 'underscore';
import URI from 'urijs';
import qs from 'qs'
import axios from 'axios';
//axios post请求设置为form data
// axios.defaults.transformRequest = [function(data) {
//     return qs.stringify(data)
// }];
/**
 * 实现标准接口的nodejs httpClient类，将request库请求封装为Promise对象，并提供入参过滤、统一前缀、json解析等统一设置
 * @param {String}  urlPrefix     url统一前缀
 * @param {Object}  paramsFilters  实现filterParams方法的对象
 * @constructor
 */
class ClientAxios{
    constructor(urlPrefix, commonParams){
        this.urlPrefix = urlPrefix;
        this.commonParams = commonParams;
        this.instance = null;
    }

    /**
     * 获取defaultClient单例
     * @param {String}  urlPrefix     url统一前缀
     * @param {Object}  paramsFilters  实现filterParams方法的对象
     * @returns {HttpClient}
     */
    static getDefaultClient(urlPrefix, commonParams){
        if (!this.instance) {
            this.instance = new ClientAxios(urlPrefix, commonParams);
        }
        return this.instance;
    }

    // addBizParamsFilter(){
    //
    // }

    /**
     * 添加参数过滤器
     * @param {object}  value 实现了filterParams方法的对象
     */
    addCommonParams(value){
        this.commonParams = this.commonParams || [];
        var replaceFlag = false;
        // 判断是否存在同类型过滤器，如果存在则替换，不存在则增加
        for(let i= 0; i < this.commonParams.length; i++) {
            let params = this.commonParams[i];
            if (value.constructor == params.constructor) {
                this.commonParams.splice(i, 1, value);
                replaceFlag = true;
                break;
            };
        };

        if (!replaceFlag) {
            this.commonParams.push(value);
        }
    }

    /**
     * 清除参数过滤器
     */
    clearCommonParams(){
        this.commonParams = [];
    }

    /**
     * @description 设置接口前缀
     * @param {String} value 接口前缀
     */
    setUrlPrefix(value){
        this.urlPrefix = value;
    }

    /**
     * @description 根据入参生成请求信息，并根据配置增加统一前缀、过滤参数及其他统一处理
     * @param {String|Object} options url或初始请求信息
     * @param {String} method <GET|POST>
     * @param {String} params 请求参数
     * @returns {Object} 处理后最终的http请求信息
     */
    getOptions = function (options, method, params,jsonForm) {
        params = params || {};
        var result = options || {};
        // 如果是get请求,为了简化参数,options可以只是个url字符串,这里统一为对象格式
        if (_.isString(options)) {
            result = {
                uri: options,
            };
        }

        // 增加统一前缀
        if (result.uri && result.uri.indexOf('http') != 0){
            result.uri = this.urlPrefix + result.uri;
        }

        // 默认GET
        result.method = method || 'GET';

        // 设置post参数
        if (result.method == 'POST') {
            result.form = params;

            if (this.commonParams) {
                this.commonParams.forEach(function(commonParams){
                    result.form = commonParams.configParams(result.form);
                });
            }
            if(!jsonForm){
                result.form=qs.stringify(result.form);
            }

        } else {
            var uri = new URI(result.uri);
            var paramStr = uri.search();
            var currentParams = URI.parseQuery(paramStr);
            var resultParams = _.extend(params, currentParams);
            resultParams= _.extend(resultParams, {t:new Date().getTime()});
            // resultParams = dealElement(resultParams);//过滤掉接口请求参数对象中的无效字段:undefined null ''
            if (this.commonParams) {
                this.commonParams.forEach(function(commonParams){
                    resultParams = commonParams.configParams(resultParams);
                });
            }

            uri.setSearch(resultParams);
            //result.uri = URI.decode(uri.toString());
            result.uri = uri.toString()

        }

        // encode非url字符
        //result.uri = encodeURI(result.uri);

        // 默认60秒超时
        result.timeout = result.timeout || 60000;
        result.url = result.uri;
        result.data = result.form;
        return result;
    }

    /**
     * @description 将请求封装为Promise对象
     * @param {Object} options
     * @returns {Promise} 请求对应的Promise对象
     * @see {@link https://github.com/request/request#requestoptions-callback}
     */
    request(options){
        var tag = new URI(options.uri).path() || 'url';
        var that = this;
        return new Promise(function(resolve, reject){
            // console.log(options);
            axios(options).then(function(response){

                if (response.status == 200 || response.status == 304) {
                    try {
                        // 1- 解析返回JSON串
                        // var data = JSON.parse(response.data);// 解析网络请求结果为JSON对象
                        // console.log(JSON.stringify(response.data))
                        // var data = response.data;// 解析网络请求结果为JSON对象
                        // var dataForInfo = deepCopy(data);


                        // 4- resovle返回值
                        //   console.log(response.status)
                        resolve(JSON.stringify(response.data));

                    } catch (err){
                        console.log(err)
                        // 处理接口返回值解析异常
                        reject(err);
                    }
                }else {
                    // 处理接口返回状态异常
                    // var wrongHttpStatusError = logger.createError('HttpStatusError', 'http请求返回值不是200或者304');
                    // logger.error(tag, {
                    //     method: options.method,
                    //     url: options.uri || '',
                    //     httpCode: response.statusCode || '',
                    //     responseHeaders: response.headers || {},
                    //     errName: wrongHttpStatusError.name,
                    //     errMsg: wrongHttpStatusError.message,
                    //     errStack: wrongHttpStatusError.stack
                    // });
                    // reject(wrongHttpStatusError);
                }
            }).catch(function(error){
                console.log(error);
                var divPanel=document.createElement("div");
                divPanel.className='popError';
                divPanel.innerHTML= '<div style="display:table;width: 80%;text-align: center;position: fixed;top: 40%;left: 10%;z-index: 100001;">' +
                    '<div style="background:#000;filter: alpha(opacity=0.8*100);-moz-opacity: 0.8;-khtml-opacity: 0.8;opacity: 0.8; -moz-border-radius: 0.5rem; -webkit-border-radius: 0.5rem;border-radius: 0.5rem;color: #fff;display: inline-block;padding: 0 1rem;outline-width: calc(90vw);">' +
                    '<p>服务器异常，请稍候</p>' +
                    '</div>' +
                    '</div>';
                document.getElementsByTagName("body")[0].appendChild(divPanel);
                setTimeout(function(){
                    var rmDiv= document.getElementsByClassName('popError')[0];
                    document.getElementsByTagName("body")[0].removeChild(rmDiv);
                },1000);

                reject(error);
            });
        });
    }


    /**
     * @description get请求快捷方法
     * @params {String} 请求url
     * @returns {Promise}
     */
    get(url, params) {
        var options = this.getOptions(url, 'GET', params);
        return this.request(options);
    }

    /**
     * @description 接口类get请求快捷方法，将json串转换为对象
     * @param {String} 请求url
     * @returns {Promise}
     */
    getJson(url, params) {
        return this.get(url, params).then(function (body) {
            return JSON.parse(body);
        });
    }
    /**
     * @description post请求快捷方法
     * @param {String|Object} options 请求url
     * @param {String|Object} form 表单参数
     * @returns {Promise}
     * @see {@link module:http.request}
     */
    post(url, form,jsonForm) {
        var options = this.getOptions(url, 'POST', form,jsonForm);
        if(jsonForm){
            options.headers={
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }else{
            options.headers={
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }
        return this.request(options);
    };

    /**
     * @description put请求快捷方法
     * @param {String|Object} options 请求url
     * @param {String|Object} form 表单参数
     * @returns {Promise}
     * @see {@link module:http.request}
     */
    put(url, params) {
        var options = this.getOptions(url, 'PUT', params);
        return this.request(options);
    };
    delete(url, params) {
        var options = this.getOptions(url, 'DELETE', params);
        return this.request(options);
    };
    deleteJson(url, params) {
        return this.delete(url, params).then(function (body) {
            return JSON.parse(body);
        });
    }
    /**
     * @description 接口类post请求快捷方法，将json串转换为对象
     * @param {String}  url   请求url
     * @param {Object}  form  表单键值对
     * @returns {Promise}
     */
    postJson(url, form,jsonForm) {
        return this.post(url, form,jsonForm).then(function (body) {
            return JSON.parse(body);
        });
    };

    /**
     * @description 接口类post请求快捷方法，将json串转换为对象
     * @param {String}  url   请求url
     * @param {Object}  form  表单键值对
     * @returns {Promise}
     */
    putJson(url, form) {
        return this.put(url, form).then(function (body) {
            return JSON.parse(body);
        });
    };
}

function dealElement(obj){
    var param = {};
    if ( obj === null || obj === undefined || obj === "" ) return param;
    for ( var key in obj ){
        if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
            param[key] = obj[key];
        }
    }
    return param;
}
function deepCopy (obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}

export default {
    ClientAxios
};
