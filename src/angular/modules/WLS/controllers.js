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


    // 批量确认
    $scope.handlebatchInConfirm = function () {

      if ($scope.choisedMedicalList.length) {
        requestData('rest/authen/inStockOrder/batchConfirmInStock',$scope.choisedMedicalList, 'post', 'parameter-body')
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
    // 批量确认
    $scope.handlebatchOutConfirm = function () {

      if ($scope.choisedMedicalList.length) {
        requestData('rest/authen/outStockOrder/batchConfirmOutStock',$scope.choisedMedicalList, 'post', 'parameter-body')
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

    $scope.confirmInStock=function(_id){
      console.log(_id);
      if (_id) {
        requestData('rest/authen/inStockOrder/confirmInStock?id='+_id, 'get')
        .then(function (results) {
          if (results[1].code === 200) {
            alertOk('操作成功');
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
    $scope.confirmOutStock=function(_id){
      console.log(_id);
      if (_id) {
        requestData('rest/authen/outStockOrder/confirmInStock?id='+_id, 'get')
        .then(function (results) {
          if (results[1].code === 200) {
            alertOk('操作成功');
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






    /**
     * 货主管理
     * @param $scope
     * @param requestData
     * @param utils
     * @param modal
     * @param alertOk
     * @param alertWarn
     */
  function goodsOwnerCtrl($scope, requestData, utils, modal,alertOk,alertWarn) {


        // 保存  type:save-草稿,submit-提交订单。
        // $scope.submitFormAfter = function() {
        //     $scope.formData.validFlag = false;
        //     if ($scope.submitForm_type == 'exit') {
        //         $scope.goTo('#/salesOrder/query.html');
        //         return;
        //     }
        //     if ($scope.submitForm_type == 'submit') {
        //         $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);
        //     }
        //     if ($scope.submitForm_type == 'save') {
        //         // console.log(this);
        //     }
        // };


        // 保存 type:save-草稿,submit-提交订单。
        $scope.submitForm = function(fromId, type) {
            console.log(">>>>>>>>>>>>>>",$scope.goodsOwner);
            $('#' + fromId).trigger('submit');
        };


  }









  angular.module('manageApp.WLS')
  .controller('inOutStockController', ['$scope', 'requestData', 'utils', 'modal','alertWarn', 'alertOk', inOutStockController])
  .controller('goodsOwnerCtrl', ['$scope', 'requestData', 'utils', 'modal','alertWarn', 'alertOk', goodsOwnerCtrl])
  ;
});
