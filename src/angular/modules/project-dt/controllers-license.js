define('project-dt/controllers-license', ['project-dt/init'], function() {
  /**
   * [licenseController 证照档案模块控制器]
   * @method licenseController
   * @param  {[type]}                   $scope          [description]
   * @param  {[type]}                   modal           [description]
   * @param  {[type]}                   alertWarn       [description]
   * @param  {[type]}                   alertError      [description]
   * @param  {[type]}                   requestData     [description]
   * @param  {[type]}                   utls            [description]
   * @return {[type]}                                   [description]
   */
  function licenseController ($scope, modal, alertWarn, alertError, requestData, utils) {
    $scope.submitForm = function (fromId) {
      $scope.submitFormValidator(fromId);
    };
  }

  angular.module('manageApp.project-dt')
  .controller('licenseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
