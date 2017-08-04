define('project/controllers-license', ['project/init'], function() {
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

      $scope.submitForm = function(fromId, type) {
          $scope.submitForm_type = type;

          if ($scope.submitForm_type == 'submit-medical') {

              requestData('rest/authen/license/save', $scope.formData, 'POST', 'parameterBody')
                  .then(function (results) {
                      if (results[1].code === 200) {
                          alertOk('操作成功');
                      }
                  })
                  .catch(function (error) {
                      if (error) { alertWarn(error); }
                  });

          }
          $('#' + fromId).trigger('submit');
      };

  }



  angular.module('manageApp.project')
  .controller('licenseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
