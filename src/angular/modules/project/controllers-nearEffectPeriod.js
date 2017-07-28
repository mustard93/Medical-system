define('project/controllers-nearEffectPeriod', ['project/init'], function() {
  /**
   * [nearEffectPeriodController 近效期/已过期模块控制器]
   * @method nearEffectPeriodController
   * @param  {[type]}                   $scope          [description]
   * @param  {[type]}                   modal           [description]
   * @param  {[type]}                   alertWarn       [description]
   * @param  {[type]}                   alertError      [description]
   * @param  {[type]}                   requestData     [description]
   * @param  {[type]}                   utls            [description]
   * @return {[type]}                                   [description]
   */
  function nearEffectPeriodController ($scope, modal, alertWarn, alertError, requestData, utils) {

    // 公共请求地址
    var pReqUrl = 'rest/authen/nearEffectPeriod/countByNearValiditType';

    // 获取近效期、的数量
    $scope.getNearEffectNum = function () {
      requestData(pReqUrl)
      .then(function (results) {
        if (results[1].code === 200) {
          $scope.numCollection = results[1].data;
        }
      })
      .catch(function (err) {
        throw new Error(err || '出错');
      })
    }

    // 刷新效期
    $scope.refreshNearEffect = function () {
      // 定义请求地址
      var reqUrl = 'rest/authen/nearEffectPeriod/flush';
      requestData(reqUrl)
      .then(function (results) {
        if (results[1].code === 200) {
          $scope.$parent.listObject.reloadTime = new Date().getTime();
        }
      })
      .catch(function (err) {
        throw new Errow(err);
      })
    }
  }

  angular.module('manageApp.project')
  .controller('nearEffectPeriodController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", nearEffectPeriodController]);
});
