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

      $scope.submitForm = function (fromId, type) {
          $scope.submitForm_type = type;

          if ($scope.submitForm_type == 'submit-medical') {

              requestData('rest/authen/qualificationCertificate/save', $scope.formData, 'POST', 'parameterBody')
                  .then(function (results) {
                      if (results[1].code === 200) {
                          alertOk('操作成功');
                      }
                  })
                  .catch(function (error) {
                      if (error) {
                          alertWarn(error);
                      }
                  });

          }
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
      //

      // return output;

      // $scope.$watch('!initFlag', function (newVal) {
      //     var scopeData= [];
      //
      //     for(var item in $scope.departments){
      //
      //         scopeData.push($scope.departments[item]);
      //
      //         if ($scope.formData.enterpriseType) {
      //             for(j=0;j<$scope.formData.enterpriseType.length;j++){
      //
      //                 if($scope.formData.enterpriseType[j]==$scope.departments[item].value){
      //                     $scope.departments[item].value=true;
      //                 }
      //             }
      //         }
      //     }
      // });

      $scope.watchFormChange = function(watchName){
          watchFormChange(watchName,$scope);
      };
  }



  angular.module('manageApp.project')
  .controller('licenseController', ['$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
