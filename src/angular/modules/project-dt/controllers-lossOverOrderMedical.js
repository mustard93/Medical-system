define('project-dt/controllers-lossOverOrderMedical', ['project-dt/init'], function() {
  /**
   * [lossOverOrderMedicalController 新版销售单药品列表行控制器]
   * @method lossOverOrderMedicalController
   * @param  {[type]}                      $scope [description]
   */
  function lossOverOrderMedicalController ($scope,requestData) {

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

    $scope.$watch('tr.stockBatchs',function(newVal,oldVal){
      if (newVal && newVal !== oldVal) {
        $scope.getAllBatchTotal(newVal);
        $scope.lossOverOrderCalculaTotal($scope.formData.orderMedicalNos,$scope.formData.orderBusinessType);
      }
    },true)

    // 获取所有选了的批次药品数量的合计
    $scope.getAllBatchTotal = function (batchsList) {
      if (batchsList && angular.isArray(batchsList)) {
        var _total = 0;
        angular.forEach(batchsList, function (item, index) {
          _total += parseInt(item.quantity, 10);
        });
        console.log('_total',_total);
        $scope.totalQuantity=_total;
        console.log('totalQuantity',$scope.totalQuantity);
        return _total;
      } else {
        return 0;
      }
    };


    $scope.lossOverOrderCalculaTotal = function (orderMedicalNos, orderBusinessType) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {

            var _tmp = 0;
            for (var i = 0; i < item.stockBatchs.length; i++) {
              _tmp += item.stockBatchs[i].quantity * item.strike_price * (item.discountRate / 100);
            }
            _total += _tmp;
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



    //计算日期
    function   DateAdd(interval,number,date,add)  {//如果add为true则加否则减
        switch(interval) {
              case   "年"   :   {
                      if(add) date.setFullYear(date.getFullYear()+number);
                      else date.setFullYear(date.getFullYear()-number);
                      return   date;
                      break;
              }
              case   "月"   :   {
                      if(add) date.setMonth(date.getMonth()+number);
                      else date.setMonth(date.getMonth()-number);
                      return   date;
                      break;
              }
              case   "日"   :   {
                      if(add) date.setDate(date.getDate()+number);
                      else date.setDate(date.getDate()-number);
                      return   date;
                      break;
              }
              default   :   {
                      date.setDate(d.getDate()+number);
                      return   date;
                      break;
              }
        }

    }
  }

  angular.module('manageApp.project-dt')
  .controller('lossOverOrderMedicalController', ['$scope','requestData', lossOverOrderMedicalController]);
});
