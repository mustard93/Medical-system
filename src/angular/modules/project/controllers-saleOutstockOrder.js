define('project/controllers-saleOutstockOrder', ['project/init'], function() {
  /**
   * [saleOutstockOrderController 销售出库单控制器]
   * @method saleOutstockOrderController
   * @param  {[type]}                    $scope      [description]
   * @param  {[type]}                    requestData [description]
   * @param  {[type]}                    utils       [description]
   * @return {[type]}                                [description]
   */
  function saleOutstockOrderController ($scope, requestData, utils) {
    // 添加物流信息
    $scope.saveExpressInfo = function (params) {
      var _data = angular.isObject(params) ? params : '';
      var saveUrl = 'rest/authen/wOutstockOrder/kuaidi/save';
      if (_data) {
        requestData(saveUrl, _data, 'POST')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.goOrRefreshHref();
          }
        })
        .catch(function (error) {
          console.log(error || '出错');
        });
      }
    };

    // 编辑物流信息
    $scope.editThisAreaInfo = function (item) {
      $scope.addAreaisShow = true;
      $scope.formData.type = item.type;
      $scope.formData.nu = item.nu;
      $scope.formData.id = item.id;
    };
  }

  angular.module('manageApp.project')
  .controller('saleOutstockOrderController', ['$scope', 'requestData', 'utils', saleOutstockOrderController]);
});
