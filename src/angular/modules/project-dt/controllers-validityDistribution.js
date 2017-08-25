define('project-dt/controllers-validityDistribution', ['project-dt/init'], function() {
  /**
   * [validityStrategyController 效期策略模块控制器]
   * @method validityStrategyController
   * @param  {[type]}                   $scope      [description]
   * @param  {[type]}                   modal       [description]
   * @param  {[type]}                   alertWarn   [description]
   * @param  {[type]}                   alertOk     [description]
   * @param  {[type]}                   alertError  [description]
   * @param  {[type]}                   requestData [description]
   * @return {[type]}                               [description]
   */
  function validityDistributionController ($scope, modal, alertWarn, alertOk, alertError, requestData) {

    // 请求接口获取总计数量
    $scope.getTotalCount = function () {
      $scope.totalCount = 0;

      var _reqUrl = 'rest/authen/validityDistribution/countByNearValiditType';
      requestData(_reqUrl)
      .then(function (results) {
        if (results[1].code === 200) {
          var data = results[1].data;
          if (angular.isObject(data)) {
            for (var key in data) {
              if (data.hasOwnProperty(key)) {
                $scope.totalCount += ~~data[key]['totalQuantity'];
              }
            }
          } else {
            alertError('返回数据类型错误');
          }
        }
      })
      .catch(function (err) {
        throw new Error(err || '出错');
      });
    }


  };

  angular.module('manageApp.project-dt')
  .controller('validityDistributionController', ['$scope', 'modal', 'alertWarn', 'alertOk', 'alertError', 'requestData', validityDistributionController]);
});
