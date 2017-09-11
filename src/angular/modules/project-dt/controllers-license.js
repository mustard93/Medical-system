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
  function licenseController ($rootScope,$scope, modal, alertWarn, alertError, requestData, utils) {

      $scope.$on("reloadListData",function (e,data) {
          $scope.listObject.reloadTime=$rootScope.utils.getNowTime()
          e.stopPropagation();
      })
      // $scope.submitForm = function (fromId) {
      //
      //     $scope.submitFormValidator(fromId);
      // };licenseType=公司&licenseSonType={{dialogData.licenseSonType}}
      // 保存 type:save-草稿,submit-提交订单。
      $scope.submitForm = function(fromId, type) {
          $scope.submitForm_type = type;
          if ($scope.submitForm_type == 'submit-licenseType') {
              $scope.formData = angular.extend($scope.formData ,$scope.dialogData);

              requestData('rest/authen/qualificationCertificate/save', $scope.formData , 'POST', 'parameterBody')
                  .then(function (results) {
                    debugger;
                      if (results[1].code === 200) {
                          $scope.$emit('reloadListData',{});
                          modal.close();
                      } else {
                        alertError(results[1].msg);
                      }
                  })
                  .catch(function (error) {
                    if (error) { alertError(error); }
                  });
          }

      };

  }

  angular.module('manageApp.project-dt')
  .controller('licenseController', ['$rootScope','$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
