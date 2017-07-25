define('project/controllers-validityStrategy', ['project/init'], function() {
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
  function validityStrategyController ($scope, modal, alertWarn, alertOk, alertError, requestData) {


      requestData('rest/authen/validityDistribution/countByNearValiditType?nearValiditType=', {}, 'GET')
        .then(function (results) {
          if (results[1].code === 200) {

               var data= results[1].data;
               $scope.totalCount=0;
               $scope.totalNep =0;
              $scope.totalExpired =0;

              $scope.totalExpired+= 1* data['已过期']['count'];

              $scope.totalNep+= 1* data['近效期']['count'];

              $scope.totalCount+= 1* data['正常']['totalQuantity'];
              $scope.totalCount+= 1* data['已过期']['totalQuantity'];
              $scope.totalCount+= 1* data['近效期']['totalQuantity'];

              console.log(" $scope.totalCount>>",$scope.totalCount);



          }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });


    };


  angular.module('manageApp.project')
  .controller('validityStrategyController', ['$scope', 'modal', 'alertWarn', 'alertOk', 'alertError', 'requestData', validityStrategyController]);
});
