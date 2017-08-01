define('project/controllers-businessScope', ['project/init'], function() {
  /**
   * [businessScopeController 经营范围管理]
   * @method businessScopeController
   * @param  {[type]}                   $scope          [description]
   * @param  {[type]}                   modal           [description]
   * @param  {[type]}                   alertWarn       [description]
   * @param  {[type]}                   alertError      [description]
   * @param  {[type]}                   requestData     [description]
   * @param  {[type]}                   utls            [description]
   * @return {[type]}                                   [description]
   */
  function businessScopeController ($scope, modal, alertWarn, alertError, requestData, utils) {

      $scope.submitForm = function(fromId, type) {
          $scope.submitForm_type = type;

          if ($scope.submitForm_type == 'submit-medical') {

              requestData('rest/authen/businessScope/save', $scope.formData, 'POST', 'parameterBody')
                  .then(function (results) {
                      if (results[1].code === 200) {
                          alertOk('操作成功');
                      }
                  })
                  .catch(function (error) {
                      if (error) { alertWarn(error); }
                  });
              $scope.formData.validFlag = false;
              $scope.goTo('#/medicalStock/get.html?id='+$scope.formData.id);

          }
          $('#' + fromId).trigger('submit');
      };

 }

  angular.module('manageApp.project')
  .controller('businessScopeController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", businessScopeController]);
});
