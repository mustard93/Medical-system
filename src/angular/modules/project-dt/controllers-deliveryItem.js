define('project-dt/controllers-deliveryItem', ['project-dt/init'], function() {
  /**
   * [deliveryItemcontroller 配送数据管理模块控制器]
   * @method deliveryItemcontroller
   * @param  {[type]}               $scope          [description]
   * @param  {[type]}               watchFormChange [description]
   * @param  {[type]}               requestData     [description]
   * @param  {[type]}               utils           [description]
   * @param  {[type]}               alertError      [description]
   * @param  {[type]}               alertWarn       [description]
   * @return {[type]}                               [description]
   */
  function deliveryItemcontroller ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };

    // 全选与全不选
    $scope.isChoiseAll = function (choiseStatus) {
      if (choiseStatus) {
        angular.forEach($scope.orderMedicalNos, function (item, index) {
          if (!item.handleFlag) {
            item.handleFlag = true;
          }
        });
      } else {
        angular.forEach($scope.orderMedicalNos, function (item, index) {
          if (item.handleFlag) {
            item.handleFlag = false;
          }
        });
      }
    };

    $scope.handleChoiseAllEvent = function () {
         var _dataSource = $scope.formData.orderMedicalNos;

         if (!$scope.choisedMedicalList) {
           $scope.choisedMedicalList = [];
         }

         if ($scope.isChoiseAll) {
           angular.forEach(_dataSource, function (data, index) {
             data.handleFlag = true;
             $scope.choisedMedicalList.push(data);
           });
         } else  {
           angular.forEach(_dataSource, function (data, index) {
             data.handleFlag = false;
             $scope.choisedMedicalList = [];
           });
         }
       };
  }

  angular.module('manageApp.project-dt')
  .controller('deliveryItemcontroller', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", deliveryItemcontroller]);
});
