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

    // 计算所有批号的可用量之和，用于和购需数量做比较，判断当前状态是否是缺货状态。
    $scope.getAllBatchesTotalSalesQuantity=function(logisticsCenterId,relMedicalStockId,quantity){
      if (logisticsCenterId&&relMedicalStockId) {
        var _url='rest/authen/medicalStock/queryStockBatch?isOnlyAvailable=true&logisticsCenterId='+logisticsCenterId+'&&relMedicalStockId='+relMedicalStockId+'&&warehouseType=正常库&&pageSize=999';
        var data= {};
        requestData(_url, data, 'get')
          .then(function (results) {
            if (results[1].code==200) {
              var _data = results[1].data;
              $scope.totalQuantity=0;
              if (_data) {
                angular.forEach(_data, function (item, index) {
                  $scope.totalQuantity += parseInt(item.stockModel.salesQuantity, 10);
                  console.log('totalQuantity',$scope.totalQuantity);
                });
                if ($scope.totalQuantity<quantity) {
                  $scope.isShowRedBg=true;
                  return $scope.totalQuantity;
                }else {
                  $scope.isShowRedBg=false;
                }
              }
            }
          })
          .catch(function (error) {
            alertError(error || '出错');
          });
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

  }

  angular.module('manageApp.project-dt')
  .controller('ConfirmOrderMedicalController', ['$scope','requestData', ConfirmOrderMedicalController]);
});
