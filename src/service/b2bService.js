/**
 * Created by lijian on 2018/5/28.
 */


class B2bService{
    constructor(clientAxios){
        this.http = clientAxios;
    }
    addCommonParams(value){
        console.log(value)
        this.http.addCommonParams(value)
    }

    logout(){
        let url = 'app/api/member!logout.do?t='+new Date().getTime();
        return this.http.postJson(url)
    }
    getIndexList(){
        let url = 'app/api/goods!indexGoods.do';
        return this.http.getJson(url)
    }
    searchList(parmas){
        let url = 'app/api/goods!listByKeyWords.do';
        return this.http.getJson(url,parmas)
    }
    getList(parmas){
        let url = 'app/api/goods!listByCat.do';
        return this.http.getJson(url,parmas)
    }
    getAddress(){
        let url = 'app/api/appAddress!myAddressList.do';
        return this.http.getJson(url)
    }
    getTransport(){
        let url = 'app/api/transportVehicles!list.do';
        return this.http.getJson(url)
    }
    updateTransport(parmas){
        let url = 'app/api/transportVehicles!edit.do';
        return this.http.getJson(url,parmas)
    }
    addTransport(parmas){
        let url = 'app/api/transportVehicles!add.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 删除承运信息
     * id
     */
    deleteTransport(parmas){
        let url = 'app/api/transportVehicles!delete.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取商品详情
     * goods_id
     */
    getGoodsDetail(parmas){
        let url = 'app/api/goods!getGoodsById.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取商品价格
     * goods_sns
     */
    getPrice(parmas){
        let url = 'app/api/goods!getGoodsPrice.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取购物车列表
     */
    getCartList(){
        let url = 'app/api/appCart!getCartList.do';
        return this.http.getJson(url)
    }
    /**
     * 获取购物车所选商品价格
     */
    getCartListPrice(){
        let url = 'app/api/appCart!getCartOrderPrice.do';
        return this.http.getJson(url)
    }
    /**
     * 删除购物车
     * deleteItem_ids
     */
    deleteCartList(parmas){
        let url = 'app/api/appCart!deleteCartItems.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 更新购物车
     * cartid,
     * num,
     */
    updateCartList(parmas){
        let url = 'app/api/appCart!updateNum.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 选择购物车商品
     */
    selectCartList(parmas){
        let url = 'app/api/appCart!changeChecked.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取省份
     */
    getProvince(){
        let url = 'app/api/appAddress!getRegions.do';
        return this.http.getJson(url)
    }
    /**
     * 删除地址
     * addr_id
     */
    deleteAddress(parmas){
        let url = 'app/api/appAddress!deleteAddress.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 默认地址
     * addr_id
     */
    setDefaultAddress(parmas){
        let url = 'app/api/appAddress!setDefaultAddress.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 添加地址
     * "memberAddress.receiver_type_id",
     *"memberAddress.company_name",
     *"memberAddress.province_id",
     *"memberAddress.contact_name",
     *"memberAddress.addr",
     *"memberAddress.mobile",
     *"memberAddress.defaultAddress",
     */
    addAddress(parmas){
        let url = 'app/api/appAddress!saveOrUpdateAddress.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 更新地址
     * "memberAddress.receiver_type_id",
     *"memberAddress.company_name",
     *"memberAddress.province_id",
     *"memberAddress.contact_name",
     *"memberAddress.addr",
     *"memberAddress.mobile",
     *"memberAddress.defaultAddress",
     */
    updateAddress(parmas){
        let url = 'app/api/appAddress!saveOrUpdateAddress.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 默认地址
     * addr_id
     */
    setDefaultAddress(parmas){
        let url = 'app/api/appAddress!setDefaultAddress.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 添加购物车数量
     * sn
     *num
     *store_id
     */
    addGoods(parmas){
        let url = 'app/api/appCart!addGoods.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 默认发票
     * invoiceCompany_id
     */
    setDefaultInvoice(parmas){
        let url = 'app/api/appInvoice!setDefaultInvoice.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 切换商品规格
     */
    getChangeGoods(parmas){
        let url = 'app/api/goods!searchGoodsByPropertys.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取购物车商品数量
     */
    getCartCount(){
        let url = 'app/api/appCart!getCartCount.do';
        return this.http.getJson(url)
    }
    /**
     * 商品详情页下单
     */
    getImmediateOrder(parmas){
        let url = 'app/api/order!immediateToOrder.do';
        return this.http.getJson(url,parmas)
    }
    //购物车直接下单
    getConfirmOrder(){
        let url = 'app/api/order!confirmOrder.do';
        return this.http.getJson(url)
    }
    //获取订单状态
    getOrderStatus(){
        let url = 'app/api/twinsOrder!getOrderCounts.do';
        return this.http.getJson(url)
    }
    //获取地址
    getAddr(parmas){
        let url = 'app/api/appAddress!getAddress.do';
        return this.http.getJson(url,parmas)
    }
    //获取发票信息
    // invoiceCompany_id
    getInvoice(parmas){
        let url = 'app/api/appInvoice!getInvoiceById.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 通过省份获取到站名
     * proviceCode/transType/
     */
    getTransportByTrain(parmas){
        let url = 'app/api/appTransport!getDestionsByProvinceID.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 通过省份获取运费
     * ship_area_code/transType/
     */
    getFreightByProvince(parmas){
        let url = 'app/api/appTransport!getFreight.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 通过合同获取运费及总价
     * contract_id/ship_area_code/transType/itemids/num
     */
    getFreightByContract(parmas){
        let url = 'app/api/appContact!getContractToOrderPrice.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 创建订单
     * paymentId,saveAddress,expectDeliveryTime,invoice_company_id,trans_type_id,destStationId,ship_area_code,tvids,
     */
    createOrder(parmas){
        let url = 'app/api/order!createOrder.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取发票列表
     */
    getInvoiceList(){
        let url = 'app/api/appInvoice!invoiceList.do';
        return this.http.getJson(url)
    }
    /**
     * 保存更新发票
     */
    saveOrUpdateInvoice(parmas){
        let url = 'app/api/appInvoice!saveOrUpdateInvoice.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 删除发票
     * invoiceCompany_id
     */
    delInvoice(parmas){
        let url = 'app/api/appInvoice!delInvoice.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取订单列表
     * status/page/rows
     */
    getOrderList(parmas){
        let url = 'app/api/twinsOrder!getOrdersBYStatus.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 取消订单
     * sn/reason
     */
    cancelOrder(parmas){
        let url = 'app/api/twinsOrder!cancel.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取订单详情
     * orderid
     */
    getOrderDetailInfo(parmas){
        let url = 'app/api/twinsOrder!getOrderDetail.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 收货详情
     * page/pageSize
     */
    getReceptionGoodsList(parmas){
        let url = 'app/api/delivery!list.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取合同列表
     * member_id
     * page
     * rows
     */
    getContractList(parmas){
        let url = 'app/api/appContact!contactList.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 获取合同详情
     * contract_code
     */
    getContracDetail(parmas){
        let url = 'app/api/appContact!coutractDetail.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 合同下单
     * contract_id
     */
    getContracOrder(parmas){
        let url = 'app/api/appContact!contractToOrderPage.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 合同下单
     * contract_id/destStationId/itemids/num/expectDeliveryTime/province_id/tvids
     */
    submitOrderByContract(parmas){
        let url = 'app/api/appContact!contractCreateOrder.do';
        return this.http.getJson(url,parmas)
    }
    /**
     * 是否登陆
     */
    checkLogin(){
        let url = 'app/api/member!isLogin.do';
        return this.http.getJson(url)
    }
    /**
     * 获取首页广告bannel
     */
    getIndexAd(){
        let url = 'app/api/goods!index_Photos.do';
        return this.http.getJson(url)
    }
    /**
     * 支付(供B2B接口使用)
     * order_id
     */
    b2bPay(parmas){
        let url = 'app/api/pay!order.do';
        return this.http.getJson(url,parmas)
    }



}

export default {
    B2bService
}