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
              // var _data = {
              //     'licenseType': $scope.dialogData.licenseType,
              //     'licenseSonType':$scope.dialogData.licenseSonType,
              //     'licenseTypeName':$scope.formData.licenseTypeName,
              //     'isWarning':$scope.formData.isWarning,
              //     'controllType':$scope.formData.controllType,
              //     'enterpriseType':$scope.formData.enterpriseType,
              //     'remark':$scope.formData.remark,
              //     'id':id
              // }

              $scope.formData = angular.extend($scope.formData ,$scope.dialogData);


              console.log("$scope.formData",$scope.formData);



              requestData('rest/authen/qualificationCertificate/save', $scope.formData , 'POST', 'parameterBody')
                  .then(function (results) {
                      if (results[1].code === 200) {
                          $scope.$emit('reloadListData',{});
                          modal.close();
                      }
                  })
                  .catch(function (error) {
                  });
          }

      };

        //点击选中对象加入数组
      // $scope.licenseCommodityType=function(item){
      //     if(item.value){
      //         if(!$scope.formData.enterpriseType){
      //             $scope.formData.enterpriseType=[];
      //         }else {
      //             if($scope.formData.enterpriseType.indexOf(item.text) == -1){
      //                 $scope.formData.enterpriseType.push(item.text);
      //             }else {
      //                 $scope.formData.enterpriseType.pop(item.text);
      //             }
      //          }
      //     }
      // };

  }

  angular.module('manageApp.project-dt')
  .controller('licenseController', ['$rootScope','$scope',"modal",'alertWarn',"alertError", "requestData", "utils", licenseController]);
});
