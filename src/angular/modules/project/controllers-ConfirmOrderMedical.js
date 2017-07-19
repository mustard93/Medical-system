define('project/controllers-ConfirmOrderMedical', ['project/init'], function() {
  /**
   * [ConfirmOrderMedicalController 新版销售单药品列表行控制器]
   * @method ConfirmOrderMedicalController
   * @param  {[type]}                      $scope [description]
   */
  function ConfirmOrderMedicalController ($scope) {

    // 当用户选择某条目的生产批号后，将该条目设置为已选择状态
    $scope.choiseProductionBatch = function (item,stockBatchsItem,selectData) {

      if(stockBatchsItem&&!stockBatchsItem.quantity){

        //库存批次数量，满足则数量设置为计划数量。
        if(!item.quantity)item.quantity=0;

        stockBatchsItem.quantity=item.planQuantity-item.quantity;

        if(selectData){
            if(!selectData.note)selectData.note={};
            if(!selectData.note.salesQuantity)selectData.note.salesQuantity=0;
        }

        if(selectData&&selectData.note&&selectData.note.salesQuantity){

          //批次库存不满足计划销售数量
          if(stockBatchsItem.quantity>selectData.note.salesQuantity){
            stockBatchsItem.quantity= selectData.note.salesQuantity;
            $scope.item.handleFlag=true;
          }
        }else{//未获取到批次数量
          stockBatchsItem.quantity=null;
        }
      }

    };

    // 获取所有批次药品数量的合计
    $scope.getAllBatchTotal = function (batchsList) {

      if (batchsList && angular.isArray(batchsList)) {
        var _total = 0;
        angular.forEach(batchsList, function (item, index) {
          _total += parseInt(item.quantity, 10);
        });
        return _total;
      } else {
        return 0;
      }
    };

  }

  angular.module('manageApp.project')
  .controller('ConfirmOrderMedicalController', ['$scope', ConfirmOrderMedicalController]);
});
