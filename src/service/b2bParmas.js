/**
 * Created by lijian on 2018/5/31.
 */
import store from '../store/index'
import{
    GlobelObj
} from '../components/Global.vue'

class B2bParmas{


    configParams(params, url) {
        let EncryptToken=store.state.EncryptToken||GlobelObj.AssessToken;
        params = B2bParmas.getParams(params, EncryptToken);
        return params;
    };
    static getParams(body, EncryptToken) {
       var body = Object.assign({},body,{access_token:EncryptToken})
        return body;
    }
}
export default{
    B2bParmas
}