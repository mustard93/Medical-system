define('project/controllers-SalesOrderDetails', ['project/init'], function() {
  /**
   * [SalesOrderDetailsController 根据药品id和批号查询生产日期和失效日期]
   * @method SalesOrderDetailsController
   * @param  {[type]}                    $scope      [description]
   * @param  {[type]}                    $timeout    [description]
   * @param  {[type]}                    alertOk     [description]
   * @param  {[type]}                    alertError  [description]
   * @param  {[type]}                    requestData [description]
   */
  function SalesOrderDetailsController ($scope, $timeout, alertOk, alertError, requestData) {

    // 监视price价格变化，重置折扣额和折扣率
    $scope.$watch('tr.strike_price', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.tr.discountPrice = 0;   // 折扣额重置为0
        $scope.tr.discountRate = 100;  // 折扣率重置为100
      }
    });

    $scope.getCurrentProductionDate = function (relMedicalStockId,p_and_s) {

      if (relMedicalStockId && p_and_s) {
        var url='rest/authen/medicalStock/getStockBatch?relMedicalStockId='+relMedicalStockId+'&p_and_s='+p_and_s;
        var data= {};
        requestData(url,data,'get')
          .then(function (results) {
            var _data = results[1];
          // 根据药品id和批号查询到的生产日期和失效日期赋给对应字段以供页面显示
          $scope.tr.productionDate =_data.data.productionDate;
          $scope.tr.validTill =_data.data.validTill;
          })
          .catch(function (error) {
            alertError(error || '出错');
          });
      }
    };
  }

  angular.module('manageApp.project')
  .controller('SalesOrderDetailsController', ['$scope',"$timeout",'alertOk', "alertError", "requestData", SalesOrderDetailsController]);
});
