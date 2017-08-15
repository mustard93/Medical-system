define('project/controllers-freezeThawOrder', ['project/init'], function() {
  /**
   * [freezeThawOrderEditCtrl 批次冻结解冻模块]
   * @method freezeThawOrderEditCtrl
   * @param  {[type]}                $scope          [description]
   * @param  {[type]}                modal           [description]
   * @param  {[type]}                alertWarn       [description]
   * @param  {[type]}                watchFormChange [description]
   * @param  {[type]}                requestData     [description]
   * @return {[type]}                                [description]
   */
  function freezeThawOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData) {

      $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
      };
      $scope.$watch('initFlag', function () {
        var operationFlowSetMessage=[];
        var operationFlowSetKey=[];
        if ($scope.showData) {
          // 选择出当前状态相同的驳回理由，并放入一个数组中
         for (var i=0; i<$scope.showData.operationFlowSet.length; i++) {
           if ($scope.showData.operationFlowSet[i].status==$scope.showData.orderStatus) {
             operationFlowSetMessage.push($scope.showData.operationFlowSet[i].message);
             operationFlowSetKey.push($scope.showData.operationFlowSet[i].key);
           }
         }
        //  选择当前状态最近的一个驳回理由用于显示
         $scope.showData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
         $scope.showData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
         return;
        }

      });

      modal.closeAll();
      // $scope.formData={};
      $scope.addDataItem = {};

      //需要重新家长地址方法。编辑新建后
      $scope.customerAddressReload=function (){
        $scope.reloadTime=new Date().getTime();
          modal.closeAll();
      };

      // 医院地址加载后，回调方法
      $scope.customerAddressGetCallBack = function(formData,customerAddress) {
        formData.customerName=customerAddress.name;

        if(!customerAddress||!customerAddress.contacts||customerAddress.contacts.length===0){
          formData.contactsId=null;
          return;
        }

        if(!formData.contactsId){
            formData.contactsId=customerAddress.defaultContactId;
        }

        //判断当前地址列表是否包含，选中地址。不包含则设置为默认
        var hasContactsId=false;
        for(var i=0;i<customerAddress.contacts.length;i++){
            if(formData.contactsId==customerAddress.contacts[i].id){
                hasContactsId=true;
            }
        }

        if(!hasContactsId){
            formData.contactsId=customerAddress.defaultContactId;
        }
      };

      // 拆分药品数量
      $scope.caifenQuantity = function(tr, num) {
        tr.quantity_noInvoice_show = true;
        if (!num || tr.quantity < num) return;
        //点击拆分逻辑,不能发货数量为0,并且库存不足时,根据库存自动拆分数量.
        if (!tr.quantity_noInvoice || tr.quantity_noInvoice === 0) {
          tr.quantity_noInvoice = tr.quantity - num;
          tr.quantity = num;
        }
        //加入订单按钮状态变化
        if (tr.quantity <= num) {
          tr.handleFlag = true;
        }
      };

      // 添加一条。并缓存数据。返回true表示成功。会处理数据。
      $scope.flashAddDataCallbackFn = function(flashAddData) {
        if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
          alertWarn("请选择药品");
          return ;
        }
        var medical=flashAddData.data.data;
        var addDataItem = $.extend(true,{},medical);

            addDataItem.quantity=flashAddData.quantity;
            addDataItem.discountPrice='0';
            addDataItem.discountRate='100';
            addDataItem.relId=medical.id;

            addDataItem.strike_price=addDataItem.price;
            addDataItem.id=null;
          if (!(addDataItem.relId && addDataItem.name)) {
              alertWarn('请选择药品。');
              return false;
          }
          if (!addDataItem.quantity||addDataItem.quantity<1) {
              alertWarn('请输入大于0的数量。');
              return false;
          }

          if(addDataItem.quantity>medical.quantity){//库存不足情况
              addDataItem.handleFlag =false;//默认添加到订单
          }
          if (!$scope.formData.orderMedicalNos) {
            $scope.formData.orderMedicalNos = [];
          }
          // 如果已添加
          if ($scope.formData.orderMedicalNos.length !== 0) {
            var _len = $scope.formData.orderMedicalNos.length;
            // console.log(_len);
            // 未使用forEach方法，因为IE不兼容
            for (var i=0; i<_len; i++) {
              if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                alertWarn('此药械已添加到列表');
                return false;
              }
            }
          }
          //添加到列表
          $scope.formData.orderMedicalNos.push(addDataItem);
          //计算价格
          $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
          return true;
      };

      // 保存  type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {

        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo({tabHref:'#/salesOrder/query.html',tabName:'购需单'});
          return;
        }

        if ($scope.submitForm_type == 'submit') {
          // $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);

          var url='rest/authen/salesOrder/confirmSalesOrder';
          var data= {id:$scope.formData.id,status:'待审批'};
          requestData(url, data, 'POST')
            .then(function (results) {
              var _data = results[1].data;
              // console.log(_data);
              $scope.goTo('#/confirmOrder/get2.html?id='+_data.confirmOrder.id);

            })
            .catch(function (error) {
              // alertError(error || '出错');
            });
        }

        if ($scope.submitForm_type == 'save') {
          // console.log(this);
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
        $('#' + fromId).trigger('submit');

        // addDataItem_opt.submitUrl='';
        // $scope.formData.orderMedicalNos.push($scope.addDataItem);
        // $scope.addDataItem={};
      };

      // 取消订单
      $scope.cancelForm = function(fromId, url) {
        alertWarn('cancelForm');
      };
      // 取消删除表格中一条数据
      $scope.hideThisBtn = function () {
        // console.log($element);
        $('.sales-order-item-delbtn').hide();
        $scope.showHandleArea = false;
      };

  }

  angular.module('manageApp.project')
  .controller('freezeThawOrderEditCtrl', ['$scope',"modal",'alertWarn',"watchFormChange","requestData", freezeThawOrderEditCtrl]);
});
