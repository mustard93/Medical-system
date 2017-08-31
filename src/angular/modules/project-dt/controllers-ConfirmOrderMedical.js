define('project-dt/controllers-ConfirmOrderMedical', ['project-dt/init'], function() {
  /**
   * [ConfirmOrderMedicalController 新版销售单药品列表行控制器]
   * @method ConfirmOrderMedicalController
   * @param  {[type]}                      $scope [description]
   */
  function ConfirmOrderMedicalController ($scope,requestData) {

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

    // 获取所有选了的批次药品数量的合计
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


    // 总价计算方法
    $scope.confirmOrderCalculaTotal = function (orderMedicalNos, orderBusinessType) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {
          // 如果订单类型为普通销售
          if (orderBusinessType === '普通销售' && item.stockBatchs && item.handleFlag) {
            var _tmp = 0;
            for (var i = 0; i < item.stockBatchs.length; i++) {
              _tmp += item.stockBatchs[i].quantity * item.strike_price * (item.discountRate / 100);
            }
            _total += _tmp;
          }
          //如果订单类型是直运销售
          if (orderBusinessType === '直运销售' && item.handleFlag) {
            _total += item.quantity * item.strike_price * (item.discountRate / 100);
          }
        });
        $scope.formData.totalPrice = _total;
      }
    };

    //生产日期
    $scope.yieldTime = function(tr){
      if(!tr.guaranteePeriod) return;
      var IsNewDate = new Date(Number(tr.productionDate));
      var isLose = DateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,true);
      tr.validTill = new Date(isLose).getTime();
    }
    //失效日期
    $scope.loseTime = function(tr){
      if(!tr.guaranteePeriod) return;
      var IsNewDate = new Date(Number(tr.validTill));
      var isLose = DateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,false);
      tr.productionDate = new Date(isLose).getTime();
    }

  }

  angular.module('manageApp.project-dt')
  .controller('ConfirmOrderMedicalController', ['$scope','requestData', ConfirmOrderMedicalController]);
});
