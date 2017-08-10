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

      $scope.submitForm = function (fromId) {

          $('#' + fromId).trigger('submit');
      };

        //点击选中对象加入数组
      $scope.licenseCommodityType=function(item){
          if(item.value){
              if(!$scope.formData.enterpriseType){
                  $scope.formData.enterpriseType=[];
              }else {
                  if($scope.formData.enterpriseType.indexOf(item.text) == -1){
                      $scope.formData.enterpriseType.push(item.text);
                  }else {
                      $scope.formData.enterpriseType.pop(item.text);
                  }
              }
          }
      };

  }



  angular.module('manageApp.project')
  .controller('licenseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
