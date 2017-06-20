/**
 *  物流平台模块控制器
 */
define('WLS/controllers', ['WLS/init'], function() {

  function inOutStockController ($scope, requestData, utils, modal,alertOk,alertWarn) {
    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedMedicalList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          if (item.id === $scope.choisedMedicalList[i]) {
            $scope.choisedMedicalList.splice(i,1);
          }
        }
      }
        console.log($scope.choisedMedicalList.length);
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中
        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedMedicalList = [];
      }
      console.log($scope.choisedMedicalList.length);
    };

    // 切换请求不同状态数据
    $scope.chgRequestStatus = function (status) {
      // 参数status是必须的
      if (!status) throw new Error('params status is required!');

      var _url = 'rest/authen/checkUp/query?' + 'checkUpStatus=' + status;
      requestData(_url)
      .then(function (results) {
        if (results[1].data) {
          $scope.tbodyList = results[1].data;
        }
      })
      .catch(function (error) {
        throw new Error(error || '获取数据出错');
      });
    };

    // 批量验收
    $scope.handlebatchCheckUp = function () {
      if ($scope.choisedMedicalList.length) {
        requestData('rest/authen/checkUp/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            if(results[1].msg){
              alertOk(results[1].msg);
            }
            utils.refreshHref();
          }else if(results[1].msg){
            alertWarn(results[1].msg);
          }

        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });
      }
    };

  };

  angular.module('manageApp.WLS')
  .controller('inOutStockController', ['$scope', 'requestData', 'utils', 'modal','alertWarn', 'alertOk', inOutStockController]);
});
