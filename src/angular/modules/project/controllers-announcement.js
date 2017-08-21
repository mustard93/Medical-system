define('project/controllers-announcement', ['project/init'], function() {
  /**
   * [salesOrderEditCtrl 消息通知]
   * @method salesOrderEditCtrl
   * @param  {[type]}           $scope          [description]
   * @param  {[type]}           modal           [description]
   * @param  {[type]}           alertWarn       [description]
   * @param  {[type]}           watchFormChange [description]
   * @return {[type]}                           [description]
   */
  function announcementCtrl($scope, modal, alertWarn, watchFormChange, requestData, utils,dialogConfirm) {

      modal.closeAll();

      // 监视表单内子项目变化
      $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
      };
      // 保存  type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {
        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'submit') {
            requestData('rest/authen/announcement/publish',{id:$scope.formData.id},'POST').then(function (results) {
                if (results[1].code === 200) {
                    utils.goTo('#/announcement/query.html');
                }
            }).catch(function (error) {
                throw new Error(error || '出错');
            });
        }

        if ($scope.submitForm_type == 'save') {
        }
      };

      // 2保存 type:save-草稿,submit-提交订单。
      $scope.submitForm = function(fromId, type) {
        $scope.submitForm_type = type;
        if ($scope.submitForm_type == 'submit') {
          $scope.formData.validFlag = true;
        }

          if ($scope.submitForm_type == 'save') {
           $scope.formData.validFlag = false;
          }

          $scope.submitFormValidator(fromId);

      };


      // 处理全选与全不选
      $scope.choiced=[];
      $scope.handleChoiseAllEvent = function (medicalsObj,handleFlag) {
          if (medicalsObj && angular.isArray(medicalsObj)) {
              if ($scope.isChoiseAll) {   // 全选被选中
                  angular.forEach(medicalsObj, function (data, index) {
                      data.handleFlag = true;
                      $scope.choiced.push(data.id);
                  });
              } else {    //取消了全部选中
                  angular.forEach(medicalsObj, function (data, index) {
                      data.handleFlag = false;
                      $scope.choiced=[];
                  });
              }
          }
      };

      $scope.handleItemClickEvent = function (tr) {
          var _dataSource = $scope.tbodyList;
          if (!$scope.choiced) {
              $scope.choiced = [];
          }

          if (tr.handleFlag) {
              $scope.choiced.push(tr.id);
              if ($scope.choiced.length === _dataSource.length) {
                  $scope.isChoiseAll = true;
              }
          } else {
              angular.forEach($scope.choiced, function (data, index) {
                  if (data.id === tr.id) {
                      $scope.choiced.splice(index, 1);
                  }
              });
              $scope.isChoiseAll = false;
          }
      };







  }

  angular.module('manageApp.project')
  .controller('announcementCtrl', ['$scope',"modal",'alertWarn',"watchFormChange", "requestData", "utils","dialogConfirm", announcementCtrl]);
});
