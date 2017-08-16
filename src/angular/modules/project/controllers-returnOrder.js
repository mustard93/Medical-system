define('project/controllers-returnOrder', ['project/init'], function() {
  /**
   * [returnOrderEditCtrl 销售退货]
   * @method returnOrderEditCtrl
   * @param  {[type]}            $scope          [description]
   * @param  {[type]}            modal           [description]
   * @param  {[type]}            alertWarn       [description]
   * @param  {[type]}            watchFormChange [description]
   * @param  {[type]}            requestData     [description]
   * @param  {[type]}            $rootScope      [description]
   * @param  {[type]}            alertOk         [description]
   * @param  {[type]}            utils           [description]
   * @return {[type]}                            [description]
   */
  function returnOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData, $rootScope,alertOk,utils) {

    //如果是新建，没有id下，将后端返回的returnQuantity字段值赋值给quantity
    // if (!$scope.formData) {
    //   angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
    //     item.quantity = item.returnQuantity;
    //   });
    // }
    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);

    };
    $scope.$watch('initFlag', function () {
      var operationFlowSetMessage=[];
      var operationFlowSetKey=[];
      if ($scope.formData.operationFlowSet) {
        // 选择出当前状态相同的驳回理由，并放入一个数组中
       for (var i=0; i<$scope.formData.operationFlowSet.length; i++) {
         if ($scope.formData.operationFlowSet[i].status==$scope.formData.orderStatus) {
           operationFlowSetMessage.push($scope.formData.operationFlowSet[i].message);
           operationFlowSetKey.push($scope.formData.operationFlowSet[i].key);
         }
       }
      //  选择当前状态最近的一个驳回理由用于显示
       $scope.formData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
       $scope.formData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
       return;
      }
    });
    modal.closeAll();
    // $scope.formData={};
    $scope.addDataItem = {};

    // 保存  type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function(formData) {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/saleReturnOrder/query.html');
        return;
      }

      if ($scope.submitForm_type == 'submit') {

        var url='rest/authen/saleReturnOrder/startProcessInstance';
        var data= {businessKey:$scope.formData.id};

        requestData(url, data, 'POST')
          .then(function (results) {
            if (results[1].code !== 200) {
              alertWarn(results[1].msg || '未知错误!');
            } else {
              $scope.goTo('#/saleReturnOrder/get.html?id='+$scope.formData.id);
            }
          })
          .catch(function (error) {
            if (error) {
              alertWarn(error || '未知错误!');
              return;
            }
          });


          return;
      }

      if ($scope.submitForm_type == 'save') {

      }
    };

    // 能否提交验证 type:save-草稿,submit-提交订单。
    $scope.canSubmitForm = function() {
      //必须有1条是勾选加入订单的。
      var arr=$scope.formData.orderMedicalNos;
      for(var i=0;i<arr.length;i++){
         if(arr[i].handleFlag){
           return true;
         }
      }

      return false;

    };

    // 保存 type:save-草稿,submit-提交订单。
    $scope.submitForm = function(fromId, type) {

      $scope.submitForm_type = type;
      if ($scope.submitForm_type == 'submit') {
        $scope.formData.validFlag = true;
      }
      $scope.submitFormValidator(fromId);

    };

    // 取消订单
    $scope.cancelForm = function(fromId, url) {
      alertWarn('cancelForm');
    };


    $scope.confirmOrderCalculaTotal = function (orderMedicalNos) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {
            var _tmp = 0;
            _tmp += item.quantity * item.duty_price;
            _total += _tmp;
        });
        $scope.formData.totalPrice = _total;
      }
    };

    // 添加选择项到编辑页
    // $scope.handleAddDataArray = function (addDataObj_id,choisedMedicalList,addDataObj) {
    //
    //
    //   if(!addDataObj_id){//发货单id不能为空
    //     return ;
    //   }
    //   if(!choisedMedicalList || choisedMedicalList.length===0){//至少选择1条数据
    //     return ;
    //   }
    //
    //
    //
    //
    //           //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
    //           $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
    //           $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
    //           $scope.formData.salesType=addDataObj.salesType;
    //           $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
    //           $scope.formData.saleUser=addDataObj.saleUser;
    //
    //   //切换发货单时，清空原有数据
    //   if($scope.formData.relId!=addDataObj_id){
    //     $scope.formData.orderMedicalNos=[];
    //
    //
    //   }else{
    //     //否则删除没选中,再添加选中的
    //     for(var i=$scope.formData.orderMedicalNos.length-1;i>=0;i--){
    //       var data=$scope.formData.orderMedicalNos[i];
    //       if(utils.getObjectIndexByKeyOfArr(choisedMedicalList,"relId",data.relId)==-1){
    //           $scope.formData.orderMedicalNos.splice(i,1);
    //       }
    //     }
    //   }
    //   //重新绑定数据
    //   $scope.formData.relId = addDataObj_id;
    //
    //   //清空原有数据，重新绑定到主页面
    //   $scope.formData.orderMedicalNos=[];
    //   angular.forEach(choisedMedicalList, function (data, index) {
    //     data.quantity = data.returnQuantity;    // 将可退数量赋值给显示的数量
    //     $scope.formData.orderMedicalNos.push(data);
    //   });
    //
    //   //已经添加过的不在添加。（保留已经修改的数据）
    //   // angular.forEach(choisedMedicalList, function (data, index) {
    //   //   if ($scope.formData.orderMedicalNos.length !== 0) {
    //   //     if(utils.getObjectIndexByKeyOfArr($scope.formData.orderMedicalNos,"relId",data.relId)==-1){
    //   //       $scope.formData.orderMedicalNos.push(data);
    //   //     }
    //   //   } else {
    //   //     $scope.formData.orderMedicalNos.push(data);
    //   //   }
    //   // });
    //
    //
    //   // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);
    //     modal.closeAll();
    //
    //
    // };

  }

  angular.module('manageApp.project')
  .controller('returnOrderEditCtrl', ['$scope',"modal",'alertWarn',"watchFormChange", "requestData", "$rootScope", "alertOk", "utils", returnOrderEditCtrl]);
});
