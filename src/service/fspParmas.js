
class FspParmas{


    configParams(params) {
        params = FspParmas.getParams(params);
        return params;
    };
    static getParams(body) {
        var body = Object.assign({},body,{})
        return body;
    }
}
export default{
    FspParmas
}