define('project-dt/controllers-allocateOrder', ['project-dt/init'], function() {
  /**
   * [allocateOrderEditCtrl 调拨单模块控制器]
   * @method allocateOrderEditCtrl
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              alertError      [description]
   * @param  {[type]}              requestData     [description]
   * @param  {[type]}              watchFormChange [description]
   * @return {[type]}                              [description]
   */
  function allocateOrderEditCtrl($scope, modal, alertWarn, alertError, requestData, watchFormChange) {

    $scope.logistics=true;

    $scope.$watch('initFlag', function () {
      var operationFlowSetMessage=[];
      var operationFlowSetKey=[];
      if ($scope.tr.operationFlowSet) {
        // 选择出当前状态相同的驳回理由，并放入一个数组中
       for (var i=0; i<$scope.tr.operationFlowSet.length; i++) {
         if ($scope.tr.operationFlowSet[i].status==$scope.tr.orderStatus) {
           operationFlowSetMessage.push($scope.tr.operationFlowSet[i].message);
           operationFlowSetKey.push($scope.tr.operationFlowSet[i].key);
         }
       }
      //  选择当前状态最近的一个驳回理由用于显示
       $scope.tr.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
       $scope.tr.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
       return;
      }
    });

    //监控业务类型，实现用户选择直运销售后选中所有的已添加药品
    $scope.$watch('formData.orderBusinessType', function (newVal) {
      if (newVal === '直运销售' && $scope.formData.orderMedicalNos.length) {
        angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
          item.handleFlag = true;
        });
      }
    });

    // 监控用户变化，清空之前选择药械列表
    $scope.$watch('formData.customerId', function (newVal, oldVal) {
      if (newVal && oldVal && oldVal !== newVal) {
        $scope.logistics=false;
        if ($scope.formData.orderMedicalNos.length !== 0) { $scope.formData.orderMedicalNos = []; }
      }
    });

    $scope.deleteQuantity=function(item){
      angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
        if (item.quantityAndbatchNumber) {
          item.quantityAndbatchNumber = '';
          item.otherQuantity ='';
          item.otherSterilizationBatchNumber = '';
          item.otherWarehouseName ='';
          item.validTill=' ';
        }
      });
    };

    // 保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {
      if ($scope.submitForm_type == 'exit') {
        $scope.goTo({tabHref:'#/confirmOrder/query.html',tabName:'销售单'});
       return;
     }else   if ($scope.submitForm_type == 'print') {
       var url="indexOfPrint.html#/print/index.html?key=confirmOrderPrint&id="+$scope.formData.id;
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
           $scope.goTo({tabHref:'#/confirmOrder/get.html?id='+$scope.formData.id,tabName:'销售单'});

         })
         .catch(function (error) {
           alertError(error || '出错');
         });
      }
    };

    // 保存type:save-草稿,submit-提交订单。
    $scope.submitForm = function(fromId, type) {

      $scope.submitForm_type = type;

      // 如果点击提交无效，再次修改提交对象中的值，则在保存点击时将后端验证标识设置为false
      if ($scope.submitForm_type === 'save' && $scope.formData.validFlag === true) {
        $scope.formData.validFlag = false;
      }

      if ($scope.submitForm_type == 'submit') {
        $scope.formData.validFlag = true;
      }

      $scope.submitFormValidator(fromId);
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

    $scope.flashAddDataCallbackFn = function(flashAddData) {

      if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
        alertWarn("请选择药品");
        return ;
      }

      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      addDataItem.relId=medical.id;
      addDataItem.discountPrice='0';
      addDataItem.discountRate='100';
      addDataItem.strike_price=addDataItem.price;
      addDataItem.id=null;
      addDataItem.logistics=true;

      if (!addDataItem.planQuantity) {
        addDataItem.planQuantity = flashAddData.quantity;
      }

      if (!(addDataItem.relId && addDataItem.name)) {
          alertWarn('请选择药品。');
          return false;
      }
      if (!flashAddData.quantity||flashAddData.quantity<1) {
          alertWarn('请输入大于0的数量。');
          return false;
      }
      // if (!addDataItem.strike_price) {
      //     alertWarn('请输入成交价格。');
      //     return false;
      // }

      if(addDataItem.planQuantity>medical.quantity){//库存不足情况
          addDataItem.handleFlag =false;//默认添加到订单
      }

      if (!$scope.formData.orderMedicalNos) {
        $scope.formData.orderMedicalNos = [];
      }
      // 如果已添加
      if ($scope.formData.orderMedicalNos.length !== 0) {
        var _len = $scope.formData.orderMedicalNos.length;

        for (var i=0; i<_len; i++) {
          if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
            alertWarn('此药械已添加到列表');
            return false;
          }
        }
      }
      addDataItem.stockBatchs=[];

      // 添加药品后请求当前药品的历史价格
      if (addDataItem) {
        var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售',
            _data = {};

        requestData(_url, _data, 'GET')
        .then(function (results) {
          var _resObj = results[1].data;
          for (var item in _resObj) {
            if (item === addDataItem.relId && _resObj[item]) {
              addDataItem.strike_price = _resObj[item].value;
            } else {
              addDataItem.strike_price = '';
            }
          }
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }

      //添加到列表
      $scope.formData.orderMedicalNos.push(addDataItem);
      //计算价格
      $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.planQuantity;
      return true;
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

    // 发货方信息回调方法
    $scope.invoicesGetCallBack = function (formData,invoicesAddress) {

      // 新版购需单中处理发货方信息
      if (!formData.invoicesId) {
        $scope.formData.invoicesId = invoicesAddress.defaultContactId;
      }

      var _contacts = invoicesAddress.contacts;

      for (var i=0; i<_contacts.length; i++) {
        if (invoicesAddress.defaultContactId === _contacts[i].id) {
          formData.invoicesContacts = _contacts[i];
        }
      }

    };

    // 总价计算方法
    $scope.confirmOrderCalculaTotal = function (orderMedicalNos, orderBusinessType) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {
          // 如果订单类型为普通销售
          if (orderBusinessType === '普通销售' && item.stockBatchs) {
            var _tmp = 0;
            for (var i = 0; i < item.stockBatchs.length; i++) {
              _tmp += item.stockBatchs[i].quantity * item.strike_price * (item.discountRate / 100);
            }
            _total += _tmp;
          }
          //如果订单类型是直运销售
          if (orderBusinessType === '直运销售') {
            _total += item.planQuantity * item.strike_price * (item.discountRate / 100);
          }
        });
        $scope.formData.localTotalPrice = _total;
      }
    };

  }//end salesOrderEditCtrl

  angular.module('manageApp.project-dt')
  .controller('allocateOrderEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", allocateOrderEditCtrl]);
});
