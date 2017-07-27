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

    // // 已过期
    // $scope.getBeOverdueNum = function () {
    //   var _reqUrl = pReqUrl + '已过期';
    //   requestData(_reqUrl)
    //   .then(function (results) {
    //     if (results[1].code === 200) {
    //       var data = results[1].data;
    //       console.log(data);
    //     }
    //   })
    //   .catch(function (err) {
    //     throw new Error(err || '出错');
    //   })
    // }

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



    // 监控列表数据tbodyList，当数据不为空时，请求接口获取总计数量
    // $scope.$watchCollection('tbodyList', function (newVal, oldVal) {
    //   if (newVal && newVal !== oldVal) {
    //     // 定义总计数量
    //     $scope.totalNep = 0;
    //
    //     var _reqUrl = 'rest/authen/validityDistribution/countByNearValiditType?nearValiditType=近效期';
    //     requestData(_reqUrl)
    //     .then(function (results) {
    //       if (results[1].code === 200) {
    //         var data = results[1].data;
    //         console.log(data);
    //       }
    //     })
    //     .catch(function (err) {
    //       throw new Error(err || '出错');
    //     })
    //   } else {
    //     $scope.totalNep = 0;
    //   }
    // });



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
  }

  angular.module('manageApp.project')
  .controller('nearEffectPeriodController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", nearEffectPeriodController]);
});
