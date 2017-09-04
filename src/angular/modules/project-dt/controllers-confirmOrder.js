define('project-dt/controllers-confirmOrder', ['project-dt/init'], function() {
  /**
   * [confirmOrderEditCtrl 销售单控制器模块]
   * @method confirmOrderEditCtrl
   * @param  {[type]}             $scope        [description]
   * @param  {[type]}             modal         [description]
   * @param  {[type]}             alertWarn     [description]
   * @param  {[type]}             requestData   [description]
   * @param  {[type]}             alertOk       [description]
   * @param  {[type]}             alertError    [description]
   * @param  {[type]}             utils         [description]
   * @param  {[type]}             dialogConfirm [description]
   * @return {[type]}                           [description]
   */
  function confirmOrderEditCtrl($scope, modal, alertWarn, requestData, alertOk, alertError, utils, dialogConfirm, AmountCalculationService) {

    $scope.identityForMedicalStocksMap={};

    //初始化校验数据
    $scope.checkData=function(){
      //初始化显示数据
      if($scope.formData.id && $scope.formData.orderMedicalNos.length){

          _getIdentityForMedicalStocks();

          // var ids=[];
          // angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
          //     ids.push(item.relId);
          // });
          //
          // requestData('rest/authen/qualificationCertificate/identityForMedicalStocks',{'ids':ids},'GET').then(function (result) {
          //
          //     if(result[1].code==200){
          //
          //         var datas = result[1].data;
          //
          //         angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
          //             item.info=datas[index];
          //         });
          //     }
          //
          // });
      }
    };

    $scope.logistics=true;
    $scope.isShowConfirmInfo = false;
    $scope.noSuchStockBatchs = true;   // 是否选择批号的标志位

    // 数量溢出标识符
    $scope.quantityOverloadFlag = [];

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
        // 当用户第一次选择客户时，检查该用户是否有证照过期
        if (newVal && oldVal !== newVal) {
            if ($scope.formData.customerId) {
                var _reqUrl = 'rest/authen/qualificationCertificate/identityForCustomerAddress?id=' +$scope.formData.customerId;
                // var _reqUrl = 'http://localhost:3000/src/dt/data/qualificationCertificate/identityForCustomerAddress.json'
                requestData(_reqUrl)
                    .then(function (results) {
                        if(results[1].code ==200){
                            $scope.customerInfo= results[1].data;
                        }
                    })
                    .catch(function (error) {
                        throw new Error(error);
                    });
            }
        }

    });

    // 监控药品列表数据对象变化
    $scope.$watch('formData.orderMedicalNos', function (newVal, oldVal) {
      // 监控用户选择的批次数量，如果不符合数量要求则弹出提示信息
      var _total = 0;
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.stockBatchs) {
            for (var i = 0; i < data.stockBatchs.length; i++) {
              _total += parseInt(data.stockBatchs[i].quantity,10);
            }
          }
          // 如果所有批次数量的和小于计划数量，则弹出提示
          $scope.isShowConfirmInfo = (_total < $scope.formData.orderMedicalNos[index].quantity && _total !== 0) ? true : false;

        });
      }

      // 判断在普通销售时如果有药品没有选择批号，则设置noSuchStockBatchs标志位为false
      if ($scope.formData.orderBusinessType === '普通销售') {
        var _count = 0;
        for (var i = 0; i < $scope.formData.orderMedicalNos.length; i++) {
          if (!$scope.formData.orderMedicalNos[i].stockBatchs.length) {
            $scope.noSuchStockBatchs = true;
            break;
          } else {
            _count++;
          }
        }

        // 如果所有商品的批号已经选择，则可以提交
        if (_count === $scope.formData.orderMedicalNos.length) { $scope.noSuchStockBatchs = false; }
      }

      // 重新计算商品的各个金额

    }, true);

    // 调接口取用户在自定义表格中编辑的表格的标题显示
    $scope.geThName = function () {
      var _url='rest/authen/uiCustomTable/getOfEdit.json?className=com.pangu.mss.domain.mongo.order.OrderMedicalNo&key=销售单详情列表';
      var data= {};
      requestData(_url, data, 'get')
      .then(function (results) {
        if (results[0].items && results[0].noShowItems) {
          angular.forEach(results[0].items, function (data, index) {
            $scope.thData[data.propertyKey] = angular.copy(data.propertyName);
          });

          angular.forEach(results[0].noShowItems, function (data, index) {
            $scope.thData[data.propertyKey] = angular.copy(data.propertyName);
          });
        }
      })
      .catch(function (err) {
        if (err) { throw new Error(err); }
      });
    }

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
      }else if($scope.submitForm_type == 'exit-allocate'){
        $scope.goTo({tabHref:'#/allocateOrder/query.html',tabName:'调拨单'});
        return;
      }else if ($scope.submitForm_type == 'print') {
        var url="indexOfPrint.html#/print/index.html?key=confirmOrderPrint&id="+$scope.formData.id;
          win1=window.open(url);
          if(!win1||!win1.location){
            alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
          }
          return;
      }

     var _url = null, data = null;

     if ($scope.submitForm_type == 'submit') {
       _url='rest/authen/confirmOrder/startProcessInstance';
       data= {businessKey:$scope.formData.id};
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

     if ($scope.submitForm_type == 'submit-allocate') {
       _url='rest/authen/allocateOrder/startProcessInstance';
       data= {businessKey:$scope.formData.id};
       requestData(_url, data, 'POST')
         .then(function (results) {
           var _data = results[1];
          //  alertOk(_data.message || '操作成功');
           $scope.goTo({tabHref:'#/allocateOrder/get.html?id='+$scope.formData.id,tabName:'调拨单'});

         })
         .catch(function (error) {
           alertError(error || '出错');
         });
      }

      // 如果是保存之后则进行类型转换
      if ($scope.submitForm_type == 'save') {
        $scope.transformTaxType($scope.formData.orderMedicalNos);
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
        angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
          item.handleFlag = true;
          // if (!item.handleFlag) {
          //   item.handleFlag = true;
          // }
        });
      } else {
        angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
          item.handleFlag = false;
          // if (item.handleFlag) {
          //   item.handleFlag = false;
          // }
        });
      }
    };

    $scope.handleThischoise = function (item) {
      //检查药品列表是否被全部选中
      var _choiseCount = 0;
      if (item.handleFlag) {      // 点击选中
        angular.forEach($scope.orderMedicalNos, function (data, index) {
          if (data.handleFlag === true) { _choiseCount++; }
        });

        if ($scope.orderMedicalNos.length == _choiseCount) {
          $scope.choiseStatus = true;
        }
      } else {      // 取消选中
        $scope.choiseStatus = false;
      }

      // 重新计算总价
      $scope.confirmOrderCalculaTotal($scope.formData.orderMedicalNos, $scope.formData.orderBusinessType);
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
        return;
      }

      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      addDataItem.relId=medical.id;
      addDataItem.discountPrice='0';
      addDataItem.discountRate='100';
      addDataItem.strike_price=addDataItem.price;
      addDataItem.id=null;
      addDataItem.logistics=true;
      addDataItem.quantity = flashAddData.quantity;

      if (!addDataItem.quantity) {
        addDataItem.quantity = flashAddData.quantity;
      }

      if (!(addDataItem.relId && addDataItem.name)) {
          alertWarn('请选择药品。');
          return false;
      }
      if (!flashAddData.quantity||flashAddData.quantity<1) {
          alertWarn('请输入大于0的数量。');
          return false;
      }
      if (!flashAddData.quantity||flashAddData.quantity>100000) {
          alertWarn('最大数量不能超过100000');
          return false;
      }
      // if(addDataItem.quantity>medical.quantity){//库存不足情况
      //     addDataItem.handleFlag =false;//默认添加到订单
      // }
      if (!$scope.formData.orderMedicalNos) {
        $scope.formData.orderMedicalNos = [];
      }
      // 如果已添加
      // if ($scope.formData.orderMedicalNos.length !== 0) {
      //   var _len = $scope.formData.orderMedicalNos.length;
      //
      //   for (var i=0; i<_len; i++) {
      //     if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
      //       alertWarn('此药械已添加到列表');
      //       return false;
      //     }
      //   }
      // }
      addDataItem.stockBatchs=[];


      // 添加药品后请求当前药品的最新价格
      if (addDataItem) {
        var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&customerId=' + $scope.formData.customerId + '&type=销售';

        if ($scope.initFlag) {
          requestData(_url)
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
      }

      addDataItem.handleFlag = true;

      // 转换税率字段的类型
      if (addDataItem.tax) {
        addDataItem.tax = utils.transformNumOrStr(addDataItem.tax);
      }

      //请求判断 是否过期
      // requestData('rest/authen/qualificationCertificate/identityForMedicalStock',{'id':addDataItem.relId},'GET').then(function (result) {
      //   if(result[1].code === 200){
      //     addDataItem.info=result[1].data;
      //     //添加到列表
      //     $scope.formData.orderMedicalNos.push(addDataItem);
      //     //计算价格
      //     $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
      //   }
      // });

      //添加到列表
      $scope.formData.orderMedicalNos.push(addDataItem);
      //计算价格
      $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
      // 获取该供应商的此商品最近的成交价格
      _getIdentityForMedicalStocks();
      // 


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

    $scope.diffPurchaseNumber = function (orderMedicalList) {
      if (orderMedicalList) {
        // 用于放每一条判断数量后的结果
        isDisabledNextStepList=[];
        angular.forEach(orderMedicalList, function (data, index) {
          // 选择的数量小于计划数量，显示提示信息
          $scope.isShowPurchaseInfo = (data.planQuantity > data.quantity) ? true : false;
          // ..
          $scope.isDisabledNextStep = (data.quantity > data.planQuantity) ? true : false;
          // 把每一条判断后的true或者是false放入数组中
          isDisabledNextStepList.push($scope.isDisabledNextStep);
        });
        // 用some方法判断只要有一条为true，就阻止提交。相反，若全为false。就允许提交
        if (isDisabledNextStepList.some(function(item){ return item == true;}))
        {
          return $scope.isDisabledNextStep=true;
        }else{
          return $scope.isDisabledNextStep=false;
        }
      }
    };

    // 切换物流中心时提示用户，在用户选择确定后将已选择品种的批次清空
    $scope.$watch('formData.logisticsCenterId', function (newVal, oldVal) {
      if (newVal && oldVal && newVal !== oldVal) {

        // 如果最新值等于初始值 不做更新；
        if($scope.defaultLogisticsCenterId==newVal){
            return;
        }

        //如果最新值不等于初始值, 清空商品批次信息-并把新值赋给 "defaultLogisticsCenterId";
        dialogConfirm('切换物流中心后,所有批号信息需要重新选择.确认切换?', function () {

            // 将已选药品的批次选择清空
          if ($scope.formData.orderMedicalNos) {
            angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
              data.stockBatchs = [];
            });

            $scope.defaultLogisticsCenterId=newVal;
          }

        },'pr-dialog-confirm.html','确认提示','确定',"", "",{},function () {
            //如果取消- 把之前的旧值赋给当前对象属性
            $scope.formData.logisticsCenterId=$scope.defaultLogisticsCenterId;
        });
      }
    });

    $scope.finishQuantity = function (medicalNos){

      var medicalList=[];
      for (var i = 0; i < medicalNos.length; i++) {
        medicalList.push(medicalNos[i].quantity);
      }
      if (medicalList.some(function(item){ return item == 0;}))
      {
        return $scope.isDisabledNextStep=false;

      }else{
        return $scope.isDisabledNextStep=true;
      }

    }

    $scope.checkQuantity = function (quantity,batches){
      var totalQuantity=0;
      for (var i = 0; i < batches.length; i++) {
        totalQuantity+=batches[i].quantity;
      }

      console.log(totalQuantity + '==>' +quantity);

      if (totalQuantity>quantity||totalQuantity==0) {
        $scope.quantityError=true;
      }else {
        $scope.quantityError=false;
      }
    }

    // 销售单中批号数量自己手动修改之后。
    $scope.checkConfirmOrderQuantity = function (batchQuantity,salesQuantity){
        // 确定是该商品的哪个批号，然后取出对应的可用量。与当前修改的数量做对比。如果修改的数量大于可用量，则不允许提交。
            if (batchQuantity > salesQuantity) {
              $scope.quantityConfirmOrderError=true;
            }else {
              $scope.quantityConfirmOrderError=false;
            }

    }

    $scope.totalQuantity=0;
    // 判断商品数量和该商品所选批号所有的数量之和的对比。
    $scope.checkSalesQuantity = function (batches,quantity){

      // 刚执行此方法时要把总数清空，置为0.
      $scope.totalQuantity=0;
      for (var i = 0; i < batches.length; i++) {
        $scope.totalQuantity+=batches[i].quantity;
      }
      console.log($scope.totalQuantity);
      if ($scope.totalQuantity > quantity) {
        $scope.quantityError=true;
      }else {
        $scope.quantityError=false;
      }
    }

    $scope.allocateNumOverloadFalg=[];
    $scope.checkItemAllocateNumOverload= function (item,index) {

            var _warehouseId = $scope.formData.sourceId;

            if(!_warehouseId){
                console.error('_warehouseId is null ');
                return;
            }
            // 获取实时可调拨数量
            var _url = 'rest/authen/medicalStock/getStockModelByWarehouseId?id='+item.relId+'&warehouseId='+_warehouseId;
            requestData(_url)
            .then(function (results) {
                var _salesQuantity = results[1].data.salesQuantity;

                if (item.quantity > _salesQuantity) {

                    if($scope.allocateNumOverloadFalg[index] !== ""){

                        $scope.allocateNumOverloadFalg[index]="true";
                    }else{
                        $scope.allocateNumOverloadFalg.push("true");
                    }

                } else {

                    if($scope.allocateNumOverloadFalg[index] !== ""){

                        $scope.allocateNumOverloadFalg[index]="false";

                    }else{
                        $scope.allocateNumOverloadFalg.push("false");
                    }
                }

            });

    }

    //根据资质条件判断时候允许下一步或提交
    $scope.canNextStep=function(){
        var flag=true;
        if($scope.customerInfo){
            if($scope.customerInfo.controllType =='限制交易' && $scope.customerInfo.msg){
                flag=false;
                return flag;
            }
        }


        if($scope.formData.orderMedicalNos){
            for(var i=0; i<$scope.formData.orderMedicalNos.length;i++){
                var tr = $scope.formData.orderMedicalNos[i];

                if($scope.identityForMedicalStocksMap[tr.relId]){

                    if($scope.identityForMedicalStocksMap[tr.relId].controllType =='限制交易' &&  $scope.identityForMedicalStocksMap[tr.relId].msg ){
                        flag=false;
                        return flag;
                    }
                }


            }
        }
        return flag;
    };

    //根据ids 获取商品是否过期校验
    function _getIdentityForMedicalStocks() {
        var ids=[];
        angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
            ids.push(item.relId);
        });

        requestData('rest/authen/qualificationCertificate/identityForMedicalStocks',{'ids':ids},'GET').then(function (result) {

            if(result[1].code==200){

                var datas = result[1].data;

                angular.forEach(datas,function (item,index) {
                    $scope.identityForMedicalStocksMap[item.medicalStockId]=item;
                    // item.info=datas[index];
                });
            }

        });

    }

    // 将后端返回的税率字段从数字转换为字符串
    $scope.transformTaxType = function (orderMedicalNos) {
      if (angular.isArray(orderMedicalNos)) {
        angular.forEach(orderMedicalNos, function (data, index) {
          data.tax = utils.transformNumOrStr(data.tax);
        });
      }
    }

    // 实例化金额计算构造函数类
    // 请在编辑页获取数据之后的callback里执行此方法
    // 以便在当前页中调用此子类方法计算各金额
    $scope.initAmountCalcuAction = function () {
      $scope.amountCalcuConfirmOrder = new AmountCalculationService()
    }

    // 计算金额
    // $scope.amountCalcuAction = function () {
    //   var _t = new AmountCalculationService();
    //   console.log(_t.getAllAmountObject(99, 17, 0, 50, 0));
    // }



  }

  angular.module('manageApp.project-dt')
  .controller('confirmOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'utils', 'dialogConfirm', 'AmountCalculationService', confirmOrderEditCtrl]);
});
