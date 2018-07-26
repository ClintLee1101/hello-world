import Vue from 'vue'
import VueRouter from 'vue-router'


// import Hello from '@/components/Hello'

// import home from '../page/Home.vue'
// import index from '../page/index.vue'
// import finance from '../components/Finance.vue'
// import login from '../components/Login.vue'
// import myAccount from '../components/MyAccount.vue'
// import goodsList from '../components/goodsList.vue'
// import goodsDetail from '../components/goodsDetail.vue'
// 路由懒加载 把路由对应的组件定义成异步组件：
const home = reslove => { require.ensure(['../page/Home.vue'], () => reslove(require('../page/Home.vue'))) }
const index = reslove => { require.ensure(['../page/Index.vue'], () => reslove(require('../page/Index.vue'))) }
const login = reslove => { require.ensure(['../page/Login.vue'], () => reslove(require('../page/Login.vue'))) }
const finance = reslove => { require.ensure(['../page/Finance.vue'], () => reslove(require('../page/Finance.vue'))) }
const myAccount = reslove => { require.ensure(['../page/MyAccount.vue'], () => reslove(require('../page/MyAccount.vue'))) }
const goodsList = reslove => { require.ensure(['../page/goodsList.vue'], () => reslove(require('../page/goodsList.vue'))) }
const goodsDetail = reslove => { require.ensure(['../page/goodsDetail.vue'], () => reslove(require('../page/goodsDetail.vue'))) }
const registrate = reslove => { require.ensure(['../page/Registrate.vue'], () => reslove(require('../page/Registrate.vue'))) }
const cartStore = reslove => { require.ensure(['../page/CartStore.vue'], () => reslove(require('../page/CartStore.vue'))) }
const order = reslove => { require.ensure(['../page/order.vue'], () => reslove(require('../page/order.vue'))) }
const address = reslove => { require.ensure(['../page/Address.vue'], () => reslove(require('../page/Address.vue'))) }
const newAddress = reslove => { require.ensure(['../page/NewAddress.vue'], () => reslove(require('../page/NewAddress.vue'))) }
const invoiceList = reslove => { require.ensure(['../page/invoiceList.vue'], () => reslove(require('../page/invoiceList.vue')))}
const NewInvoiceList = reslove => { require.ensure(['../page/NewInvoiceList.vue'], () => reslove(require('../page/NewInvoiceList.vue')))}
const OrderList = reslove => { require.ensure(['../page/OrderList.vue'], () => reslove(require('../page/OrderList.vue')))}
const ContractList = reslove => { require.ensure(['../page/ContractList.vue'], () => reslove(require('../page/ContractList.vue')))}
const ContractDetail = reslove => { require.ensure(['../page/ContractDetail.vue'], () => reslove(require('../page/ContractDetail.vue')))}
const ContractOrder = reslove => { require.ensure(['../page/ContractOrder.vue'], () => reslove(require('../page/ContractOrder.vue')))}
const payment = reslove => { require.ensure(['../page/payment.vue'], () => reslove(require('../page/payment.vue')))}
const myAccountMoneyDetail = reslove => { require.ensure(['../page/myAccountMoneyDetail.vue'], () => reslove(require('../page/myAccountMoneyDetail.vue')))}
const setting = reslove => { require.ensure(['../page/setting.vue'], () => reslove(require('../page/setting.vue')))}
const accountUserInfo = reslove => { require.ensure(['../page/AccountUserInfo.vue'], () => reslove(require('../page/AccountUserInfo.vue')))}
const myAccountLoan = reslove => { require.ensure(['../page/MyAccountLoan.vue'], () => reslove(require('../page/MyAccountLoan.vue')))}
const success = reslove => { require.ensure(['../page/success.vue'], () => reslove(require('../page/success.vue')))}
const orderDetail = reslove => { require.ensure(['../page/orderDetail.vue'], () => reslove(require('../page/orderDetail.vue')))}
const changePhone = reslove => { require.ensure(['../page/changePhone.vue'], () => reslove(require('../page/changePhone.vue')))}
const changePhoneSecond = reslove => { require.ensure(['../page/changePhoneSecond.vue'], () => reslove(require('../page/changePhoneSecond.vue')))}
const changePass = reslove => { require.ensure(['../page/changePass.vue'], () => reslove(require('../page/changePass.vue')))}
const tipsSuccess = reslove => { require.ensure(['../page/tipsSuccess.vue'], () => reslove(require('../page/tipsSuccess.vue')))}
const tipsFailed = reslove => { require.ensure(['../page/tipsFailed.vue'], () => reslove(require('../page/tipsFailed.vue')))}
const transactionPass = reslove => { require.ensure(['../page/transactionPass.vue'], () => reslove(require('../page/transactionPass.vue')))}
const idCard = reslove => { require.ensure(['../page/idCard.vue'], () => reslove(require('../page/idCard.vue')))}
const resetTradePass = reslove => { require.ensure(['../page/resetTradePass.vue'], () => reslove(require('../page/resetTradePass.vue')))}
const myAccountRisk = reslove => { require.ensure(['../page/myAccountRisk.vue'], () => reslove(require('../page/myAccountRisk.vue')))}
const myAccountRiskQuestion = reslove => { require.ensure(['../page/myAccountRiskQuestion.vue'], () => reslove(require('../page/myAccountRiskQuestion.vue')))}
const orgOpenAccount = reslove => { require.ensure(['../page/orgOpenAccount.vue'], () => reslove(require('../page/orgOpenAccount.vue')))}
// const bankList = reslove => { require.ensure(['../page/BankList.vue'], () => reslove(require('../page/BankList.vue')))}
const forgetPwd = reslove => { require.ensure(['../page/ForgetPwd.vue'], () => reslove(require('../page/ForgetPwd.vue')))}
const receptionGoodsDetail = reslove => { require.ensure(['../page/ReceptionGoodsDetail.vue'], () => reslove(require('../page/ReceptionGoodsDetail.vue')))}
const activate = reslove => { require.ensure(['../page/Activate.vue'], () => reslove(require('../page/Activate.vue')))}
const myBankList = reslove => { require.ensure(['../page/myBankList.vue'], () => reslove(require('../page/myBankList.vue')))}
const myAccountCardAdd = reslove => { require.ensure(['../page/MyAccountCardAdd.vue'], () => reslove(require('../page/MyAccountCardAdd.vue')))}
const testPay = reslove => { require.ensure(['../page/testPay.vue'], () => reslove(require('../page/testPay.vue')))}
const testDevice = reslove => { require.ensure(['../page/testDevice.vue'], () => reslove(require('../page/testDevice.vue')))}
const successRegist = reslove => { require.ensure(['../page/successRegist.vue'], () => reslove(require('../page/successRegist.vue')))}
const Carriage = reslove => { require.ensure(['../page/Carriage.vue'], () => reslove(require('../page/Carriage.vue')))}
const NewCarriage = reslove => { require.ensure(['../page/NewCarriage.vue'], () => reslove(require('../page/NewCarriage.vue')))}
const MyAccountCardAddSecond = reslove => { require.ensure(['../page/MyAccountCardAddSecond.vue'], () => reslove(require('../page/MyAccountCardAddSecond.vue')))}
const myBankDetail = reslove => { require.ensure(['../page/myBankDetail.vue'], () => reslove(require('../page/myBankDetail.vue')))}
const addIdCard = reslove => { require.ensure(['../page/addIdCard.vue'], () => reslove(require('../page/addIdCard.vue')))}
const cardResult = reslove => { require.ensure(['../page/cardResult.vue'], () => reslove(require('../page/cardResult.vue')))}
const idCardExample = reslove => { require.ensure(['../page/idCardExample.vue'], () => reslove(require('../page/idCardExample.vue')))}
const protocalService = reslove => { require.ensure(['../page/protocalService.vue'], () => reslove(require('../page/protocalService.vue')))}
const register = reslove => { require.ensure(['../page/register.vue'], () => reslove(require('../page/register.vue')))}
const protocalNotice = reslove => { require.ensure(['../page/protocalNotice.vue'], () => reslove(require('../page/protocalNotice.vue')))}
const zlPayService = reslove => { require.ensure(['../page/zlPayService.vue'], () => reslove(require('../page/zlPayService.vue')))}
const deleteBank = reslove => { require.ensure(['../page/deleteBank.vue'], () => reslove(require('../page/deleteBank.vue')))}


// 或者你可以新建一个方法
VueRouter.prototype.goBack = function () {
    this.isBack = true
    this.go(-1)
}

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home/'
        },
        {
            path: '/home',
            component: home,
            children: [
                {
                    path: '',
                    redirect: '/home/index'
                },
                {
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    path: 'index',
                    component: index
                    // children:[
                    //   {
                    //     path: 'goodsList',
                    //     component: goodsList,
                    //   }
                    // ]
                },
                {
                    // 当 /user/:id/posts 匹配成功
                    // UserPosts 会被渲染在 User 的 <router-view> 中
                    path: 'finance',
                    component: finance
                },
                {
                    // 当 /user/:id/posts 匹配成功
                    // UserPosts 会被渲染在 User 的 <router-view> 中
                    path: 'myAccount',
                    component: myAccount
                }
            ]
        },
        { path: '/login', component: login },
        { path: '/goodsList', component: goodsList },
        { path: '/goodsDetail/:id', component: goodsDetail },
        { path: '/goodsDetail/:cat_id', component: goodsDetail },
        { path: '/goodsDetail/:keyWordd', component: goodsDetail },
        { path: '/Registrate', component: registrate },
        { path: '/cartStore', component: cartStore },
        { path: '/order', component:order},
        { path: '/address', component:address},
        { path: '/newAddress', component:newAddress},
        { path: '/invoiceList', component:invoiceList},
        { path: '/NewInvoiceList', component:NewInvoiceList},
        { path: '/OrderList', component:OrderList},
        { path: '/ContractList', component:ContractList},
        { path: '/ContractDetail', component:ContractDetail},
        { path: '/ContractOrder', component:ContractOrder},
        { path: '/payment', component:payment},
        { path: '/myAccountMoneyDetail', component:myAccountMoneyDetail},
        { path: '/setting', component:setting},
        { path: '/accountUserInfo', component:accountUserInfo},
        { path: '/myAccountLoan', component:myAccountLoan},
        { path: '/success', component:success},
        { path: '/orderDetail', component:orderDetail},
        { path: '/changePhone', component:changePhone},
        { path: '/changePhoneSecond', component:changePhoneSecond},
        { path: '/changePass', component:changePass},
        { path: '/tipsFailed', component:tipsFailed},
        { path: '/tipsSuccess', component:tipsSuccess},
        { path: '/transactionPass', component:transactionPass},
        { path: '/idCard', component:idCard},
        { path: '/resetTradePass', component:resetTradePass},
        { path: '/myAccountRisk', component:myAccountRisk},
        { path: '/myAccountRiskQuestion', component:myAccountRiskQuestion},
        { path: '/orgOpenAccount', component:orgOpenAccount},
        // { path: '/BankList', component:bankList},
        { path: '/ForgetPwd', component:forgetPwd},
        { path: '/receptionGoodsDetail', component:receptionGoodsDetail},
        { path: '/Activate', component:activate},
        { path: '/MyBankList', component:myBankList},
        { path: '/MyAccountCardAdd', component:myAccountCardAdd},
        { path: '/testPay', component:testPay},
        { path: '/testDevice', component:testDevice},
        { path: '/successRegist', component:successRegist},
        { path: '/Carriage', component:Carriage},
        { path: '/NewCarriage', component:NewCarriage},
        { path: '/MyAccountCardAddSecond', component:MyAccountCardAddSecond},
        { path: '/myBankDetail', component:myBankDetail},
        { path: '/addIdCard', component:addIdCard},
        { path: '/cardResult', component:cardResult},
        { path: '/idCardExample', component:idCardExample},
        { path: '/protocalService', component:protocalService},
        { path: '/register', component:register},
        { path: '/protocalNotice', component:protocalNotice},
        { path: '/zlPayService', component:zlPayService},
        { path: '/deleteBank', component:deleteBank},
        // { path: '*', redirect: '/home' }
    ]
})
export default router

