/**
 * Created by Administrator on 2016/8/1.
 */
Ext.define('JHXGW.controller.XuanGuController',{
   extend:'Ext.app.Controller',
    requires: ['Ext.Img'],
    config:{
        refs:{
            xuanGu: '#xuanGu'
        },
        control:{
            xuanGu: {
                itemtap: 'goToList'
            }
        }
    },
    goToList: function(dataview, index, item, record,e)
    {
        //if(record.data.icon == 'icon_xs')
        //{
        //    var ctrl = JHXGW.app.getController('RecStocksController');
        //    ctrl.redirectTo('recStocks');
        //}
        var ctrl = JHXGW.app.getController('RecStocksController');
        ctrl.redirectTo('recStocks');
    }
});