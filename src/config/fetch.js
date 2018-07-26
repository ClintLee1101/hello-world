import {
	baseUrl
} from './env'
import{
    GlobelObj
} from '../components/Global.vue'
// import util from '../lib/util';
export default async(type = 'GET', url = '', data = {}, method = 'fetch') => {
	type = type.toUpperCase();
    // util.delteAllCookie();

    if(type == 'GET' || type == 'PUT'){
        let t = new Date().getTime();
        data["t"] = t;
    }
    if(url.indexOf("zl") != -1){
        if(type == 'GET' || type == 'PUT'){
            if(data['t']){
                delete data.t;
            }
        }
    }

    if(url.indexOf("wealth") != -1){
        if(type == 'GET' || type == 'PUT'){
            if(data['t']){
                delete data.t;
            }
        }
    }

	// alert(GlobelObj.fsphometoken)

    // document.cookie="fsphometoken="+GlobelObj.fsphometoken;

    // console.log(url.indexOf("fsp"))
    // if(url.indexOf("fsp") == 1 && url.indexOf("login") != 1 && url.indexOf("logout") != 1){
    //     if(GlobelObj.fsphometoken){
    //         document.cookie="fsphometoken="+GlobelObj.fsphometoken;
    //     }
    //     if(GlobelObj.B2B_JSESSIONID){
    //         document.cookie="B2B_JSESSIONID="+GlobelObj.B2B_JSESSIONID;
    //     }
    //
    // }
    // document.cookie="fsphometoken=10007|3c5b96287ce20ed521d6a9140ab81e5c*woWwZ9eZid9RCTBUyJ17XaSd9OKMuOgTBtyT0FnfRRtV7-fHxszRUEI4Gbqfg8oEB1Un04Vu73Y=";
    // document.cookie = "";
    if (type == 'GET' || type == "PUT") {
    let dataStr = ''; //数据拼接字符串

    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }

  }

	if (window.fetch && method == 'fetch') {
        let requestConfig = {};
        if(type != 'APOST'){
          requestConfig = {
            credentials: 'include',
            method: type,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            mode: "cors",
            cache: "force-cache"
          }
        }else{
          requestConfig = {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: "cors",
            cache: "force-cache"
          }
        }



        let sendData = '';
        if (type == 'POST') {
          Object.keys(data).forEach(key => {
            sendData += key+"="+data[key]+"&"
          })
          if(sendData.length >0){
            sendData = sendData.substr(0, sendData.length - 1);
          }
          Object.defineProperty(requestConfig, 'body', {
            value: sendData
          })
        }
        if (type == 'APOST') {
          Object.defineProperty(requestConfig, 'body', {
            value: JSON.stringify(data)
          })
        }

        try {
            var response = await fetch(url, requestConfig);
            var responseJson = await response.json();
        } catch (error) {
            alert("服务器异常，请稍候");
            throw new Error(error)
        }
        return responseJson
	} else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';
            let tempType = type;
            if (type == 'POST') {
                Object.keys(data).forEach(key => {
                    sendData += key+"="+data[key]+"&"
                })
                if(sendData.length >0){
                    sendData = sendData.substr(0, sendData.length - 1);
                }
            }
            if (type == 'APOST') {
                sendData = JSON.stringify(data);
                type = 'POST';

            }
            requestObj.open(type, url, true);
            if(tempType != "APOST"){
                requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            }else{
                requestObj.setRequestHeader("Content-type", "application/json");
            }
            requestObj.setRequestHeader("Accept", "application/json");
            requestObj.setRequestHeader("Cache-Control", "no-cache");


            requestObj.withCredentials = true;
            requestObj.setRequestHeader("Accept", "*");
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
	}
}
