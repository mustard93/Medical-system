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

  }

  angular.module('manageApp.project')
  .controller('validityStrategyController', ['$scope', 'modal', 'alertWarn', 'alertOk', 'alertError', 'requestData', validityStrategyController]);
});
