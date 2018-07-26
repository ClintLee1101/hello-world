/**
 * Created by lijian on 2018/6/7.
 */

class HczqService{
    constructor(clientAxios){
        this.http = clientAxios;
    }
    checkErrorTimes(parmas){
        let url = '/zlzf/checkPwd.do';
        return this.http.postJson(url,parmas)
    }






}

export default {
    HczqService
}