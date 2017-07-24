define('project/controllers-inoutstockDetailQuery', ['project/init'], function() {
  /**
   * [inoutstockDetailQueryCtrl 库存报表 > 出入库明细 控制器]
   * @method inoutstockDetailQueryCtrl
   * @param  {[type]}                  $scope [description]
   * @param  {[type]}                  utils  [description]
   * @return {[type]}                         [description]
   */
  function inoutstockDetailQueryCtrl ($scope,utils) {

      var moment = require('moment');
      var startTime=moment().format("x");
      var endTime=moment().format("x");

      // "最近7天":
      startTime= moment().subtract(1, "weeks").format("x");

      $scope.listParams={
          createAtBeg:startTime,
          createAtEnd:endTime
      };


    //表格条目点击跳转方法，根据类型不同跳转页面不同
    $scope.queryItemClick=function(tr){
      var    url="#/otherOutstockOrder/get.html?orderNo=";
      var name='其他出库单';
      switch (tr.type)
        {
        case "采购入库单":
          url="#/purchaseInstockOrder/get.html?orderNo=";
          name="采购入库单";
          break;
        case "采购入库单_红字":
           url="#/purchaseInstockOrder/get.html?orderNo=";
           name="采购入库单";
           break;
        case "销售出库单":
          url="#/saleOutstockOrder/get.html?orderNo=";
          name="销售出库单";
          break;
        case "销售出库单_红字":
            url="#/saleOutstockOrder/get.html?orderNo=";
            name="销售出库单";
            break;

        default :
          {
           if(tr.inoutType){
             if(tr.inoutType=='出库'){
                 url="#/otherOutstockOrder/get.html?orderNo=";
                 name="其他出库单";
             }else{
                  url="#/otherInstockOrder/get.html?orderNo=";
                  name="其他入库单";
             }
           }else{//兼容inoutType==null。根据type包含字符判断。不够准确。
             if(tr.type.indexOf('出')>-1){
                 url="#/otherOutstockOrder/get.html?orderNo=";
                 name="其他出库单";
             }else{
                  url="#/otherInstockOrder/get.html?orderNo=";
                  name="其他入库单";
             }
           }
          }//default

        }//end switch
        url+=tr.orderNo;


        utils.goTo({
          tabHref:url,
          tabName:name
        });
        return url;
      };//getUrlByQueryOfType
    }

  angular.module('manageApp.project')
  .controller('inoutstockDetailQueryCtrl', ['$scope',"utils", inoutstockDetailQueryCtrl]);
});
