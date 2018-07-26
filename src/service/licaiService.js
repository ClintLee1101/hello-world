/**
 * Created by lijian on 2018/5/29.
 */
import licaiParmas from './licaiParmas';

class LicaiService{
    constructor(clientAxios){
        this.http = clientAxios;
    }
    /**
     * @description 给当前service集合添加参数过滤器
     * @param value {Object} value 实现了filterParams方法的对象
     */
    addCommonParams(value){
        console.log(value)
        this.http.addCommonParams(value)
    }
    /**
     * 清除参数过滤器
     */
    clearCommonParams(){
        this.http.clearCommonParams();
    }
    getWealthUserAccount(parmas){
        let url = '/user/'+parmas.uid;
        return this.http.getJson(url,parmas)
    }
    getWealthUserInfo(parmas){
        let url = '/user/banks';
        return this.http.getJson(url,parmas)
    }
    getZlBanlance(parmas){
        let url = '/user/position/count';
        return this.http.getJson(url,parmas)
    }
    getCardList(parmas){
        let url = '/bankList';
        return this.http.getJson(url,parmas)
    }
    identifyId(parmas){
        let url = '/user/identifyall';
        return this.http.postJson(url,parmas)
    }
    addNewCard(parmas){
        let url = '/user/openAccount';
        return this.http.postJson(url,parmas)
    }
    getBankVerifyCode(parmas){
        let url = '/vcode/cards';
        return this.http.postJson(url,parmas)
    }
    deleteBankCard(parmas){
        let url = '/user/cancel.decryption';
        return this.http.postJson(url,parmas)
    }





}

export default {
    LicaiService
}