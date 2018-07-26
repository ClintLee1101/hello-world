/**
 * Created by lijian on 2018/5/28.
 */
import ClientAxios from '../lib/clientAxios';
import B2bService from './b2bService';
import FspService from './fspService';
import LicaiService from './licaiService';
import HczqService from './hczqService';
import LicaiParmas from './licaiParmas';
import B2bParmas from './b2bParmas';
import FspParmas from './FspParmas';
let proxy = {
    // b2b:'/b2b/',
    // fsp:'/fsp/',
    // zl:'/zl/',
    // hczq:'/hczq/',
    // img: 'https://ifile.staging.china-lin.com/',//服务器下
    // jinhuiImg: 'https://ifile.staging.china-lin.com/',//服务器下
    //
    //
    // fsp:'https://ifsp.staging.china-lin.com/',//app本地staging
    // b2b:'https://bshop.staging.china-lin.com/',//app本地staging
    // img:'https://ifile.staging.china-lin.com/',//app本地staging
    // jinhuiImg:'https://ifile.staging.china-lin.com/',//app本地staging
    // zl:'https://wealth-staging.rxhui.com/',//jinhui staging
    // hczq:'http://hczq-staging.jinhui001.com/',

    fsp:'https://fsp.china-lin.com/', //app本地生产
    b2b:'https://bshop.china-lin.com/',//app本地生产
    zl:'https://wealth-home.rxhui.com/',//jinhui staging
    hczq:'https://www.hczq.com/',
    jinhuiImg:'http://ftdfslicai.china-lin.com/',//金汇身份证图片前缀
    img:'https://iftracker.china-lin.com/',//app生产图片

    appKey:'jh4a045c200bb38c90',
    appSecret:'f1cec8aaed7efcb3c2e113bbe7ad6481'
}

let licaiFilter= new LicaiParmas.LicaiParmas(proxy.appKey,proxy.appSecret)
let b2bFilter= new B2bParmas.B2bParmas()
let fspFilter= new FspParmas.FspParmas()

let client = {
    b2b:new ClientAxios.ClientAxios(proxy.b2b),
    fsp:new ClientAxios.ClientAxios(proxy.fsp),
    zl:new ClientAxios.ClientAxios(proxy.zl),
    hczq:new ClientAxios.ClientAxios(proxy.hczq),
}

let b2bService = new B2bService.B2bService(client.b2b);
let fspService = new FspService.FspService(client.fsp);
let licaiService = new LicaiService.LicaiService(client.zl);
let hczqService = new HczqService.HczqService(client.hczq);

licaiService.addCommonParams(licaiFilter);
b2bService.addCommonParams(b2bFilter);
fspService.addCommonParams(fspFilter);


export {
    b2bService,
    fspService,
    licaiService,
    hczqService,
    proxy
}