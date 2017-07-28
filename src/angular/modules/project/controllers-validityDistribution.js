define('project/controllers-validityDistribution', ['project/init'], function() {
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

    // 监控列表数据tbodyList，当数据不为空时，请求接口获取总计数量
    $scope.$watchCollection('tbodyList', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        // 定义总计数量
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
        })
      }
    });

      // requestData('rest/authen/validityDistribution/countByNearValiditType?nearValiditType=', {}, 'GET')
      //   .then(function (results) {
      //     if (results[1].code === 200) {
      //
      //          var data= results[1].data;
      //          $scope.totalCount=0;
      //          $scope.totalNep =0;
      //         $scope.totalExpired =0;
      //
      //         $scope.totalExpired+= 1* data['已过期']['count'];
      //
      //         $scope.totalNep+= 1* data['近效期']['count'];
      //
      //         $scope.totalCount+= 1* data['正常']['totalQuantity'];
      //         $scope.totalCount+= 1* data['已过期']['totalQuantity'];
      //         $scope.totalCount+= 1* data['近效期']['totalQuantity'];
      //
      //     }
      //   })
      //   .catch(function (error) {
      //     alertError(error || '出错');
      //   });


    };


  angular.module('manageApp.project')
  .controller('validityDistributionController', ['$scope', 'modal', 'alertWarn', 'alertOk', 'alertError', 'requestData', validityDistributionController]);
});
