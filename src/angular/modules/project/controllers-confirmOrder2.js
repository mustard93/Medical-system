define('project/controllers-confirmOrder2', ['project/init'], function() {
  /**
   * [confirmOrderEditCtrl2 销售单控制器2]
   * @method confirmOrderEditCtrl2
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              requestData     [description]
   * @param  {[type]}              alertOk         [description]
   * @param  {[type]}              alertError      [description]
   * @param  {[type]}              watchFormChange [description]
   * @param  {[type]}              saleOrderUtils  [description]
   * @return {[type]}                              [description]
   */
  function confirmOrderEditCtrl2($scope, modal, alertWarn, requestData, alertOk, alertError, utils, dialogConfirm) {

    $scope.$watch('initFlag', function () {
      var operationFlowSetMessage=[];
      var operationFlowSetKey=[];
      if ($scope.scopeData) {
        // 选择出当前状态相同的驳回理由，并放入一个数组中
       for (var i=0; i<$scope.scopeData.operationFlowSet.length; i++) {
         if ($scope.scopeData.operationFlowSet[i].status==$scope.scopeData.orderStatus) {
           operationFlowSetMessage.push($scope.scopeData.operationFlowSet[i].message);
           operationFlowSetKey.push($scope.scopeData.operationFlowSet[i].key);
         }
       }
      //  选择当前状态最近的一个驳回理由用于显示
       $scope.scopeData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
       $scope.scopeData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
       return;
      }
    });

    // 保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {
      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/invoicesOrder/query.html');
       return;
     }else   if ($scope.submitForm_type == 'print') {
       var url="indexOfPrint.html#/print/confirmOrderPrint.html?id="+$scope.formData.id;
         win1=window.open(url);

        if(!win1||!win1.location){
            alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
        }

        return;
      }

      if ($scope.submitForm_type == 'submit') {
        var _url='rest/authen/confirmOrder/startProcessInstance';
        var data= {businessKey:$scope.formData.id};
        requestData(_url, data, 'POST')
          .then(function (results) {
            var _data = results[1];
           //  alertOk(_data.message || '操作成功');
            $scope.goTo('#/confirmOrder/get.html?id='+$scope.formData.id);

          })
          .catch(function (error) {
            alertError(error || '出错');
          });
       }

    };

    // 保存type:save-草稿,submit-提交订单。
    // $scope.submitForm = function(fromId, type) {
    //   $scope.submitForm_type = type;
    //   if ($scope.submitForm_type == 'save') {
    //     $scope.formData.validFlag = false;
    //   }
    //   $('#' + fromId).trigger('submit');
    // };
    $scope.submitForm = function(fromId, type) {

      $scope.submitForm_type = type;

      // 如果点击提交无效，再次修改提交对象中的值，则在保存点击时将后端验证标识设置为false
      if ($scope.submitForm_type === 'save' && $scope.formData.validFlag === true) {
        $scope.formData.validFlag = false;
      }

      if ($scope.submitForm_type == 'submit') {
        $scope.formData.validFlag = true;
      }

      $('#' + fromId).trigger('submit');
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

    // 处理单选条目时是否自动选中全选复选框
    $scope.handleThischoise = function (item) {
      console.log(1);
      //检查药品列表是否被全部选中
      var _choiseCount = 0;
      if (item.handleFlag) {      // 点击选中
        console.log($scope.choiseStatus);
        angular.forEach($scope.orderMedicalNos, function (data, index) {
          if (data.handleFlag === true) { _choiseCount++; }
        });
        if ($scope.orderMedicalNos.length == _choiseCount) {
          $scope.choiseStatus = true;

        }

        // $scope.choiseStatus = ($scope.orderMedicalNos.length === _choiseCount) ? true : false;

      } else {      // 取消选中
        $scope.choiseStatus = false;
      }
    };

    // ..
    $scope.chkIsChoiseAll = function () {
      var _count  = 0;
      angular.forEach($scope.orderMedicalNos, function (data, index) {
        console.log(data.handleFlag);
        if (data.handleFlag === true) { _count++; }
      });

      $scope.choiseStatus = ($scope.orderMedicalNos.length === _count) ? true : false;
    };

    //获取一个药械，已经选中的批次，返回成数组格式，用于同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
    //用于chosen 回调过滤数据用。
    $scope.getProductionBatchValueArray = function (stockBatchs) {
        var arr=[];
        if(!stockBatchs)return arr;
        for(var i=0;i<stockBatchs.length;i++){
            arr.push(stockBatchs[i].batchNumber);
        }
        return arr;
    };

    //计算总价


  }//confirmOrderEditCtrl2

  angular.module('manageApp.project')
  .controller('confirmOrderEditCtrl2', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "utils", "dialogConfirm", confirmOrderEditCtrl2]);
});
