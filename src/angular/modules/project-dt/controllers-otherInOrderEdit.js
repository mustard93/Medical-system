define("project-dt/controllers-otherInOrderEdit", ['project-dt/init'], function(){
  /**
   * [otherInOrderEditCtrl 其他业务单-入库  控制器模块]
   * @method otherInOrderEditCtrl
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
  function otherInOrderEdit($scope, modal, alertWarn, requestData, alertOk, alertError, utils, dialogConfirm, AmountCalculationService){
    $scope.identityForMedicalStocksMap={};
    //初始化校验数据
    $scope.checkData=function(){
      //初始化显示数据
      if($scope.formData.id && $scope.formData.orderMedicalNos.length){
          _getIdentityForMedicalStocks();
      }
    };

    $scope.logistics=true;
    $scope.isShowConfirmInfo = false;
    // $scope.noSuchStockBatchs = true;   // 是否选择批号的标志位

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
                // debugger;
                // 对数据中的价格字段进行计算处理
                var _priceObj = $scope.amountCalcuConfirmOrder.getAllAmountObject(addDataItem.strike_price,
                                                                                  addDataItem.tax,
                                                                                  addDataItem.discountRate,
                                                                                  $scope.returnQuantityByOrderType($scope.formData.orderBusinessType, addDataItem),
                                                                                  $scope.formData.orderMedicalNos);
                // 根据返回字段对象给addDataItem对象赋值
                if (angular.isObject(_priceObj)) {
                  for (var key in _priceObj) {
                    if (_priceObj.hasOwnProperty(key)) {
                      addDataItem[key] = _priceObj[key];
                    }
                  }
                }
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

      // 根据订单类型返回数量值
      $scope.returnQuantityByOrderType = function (typeName, medicalObj) {
        if (typeof typeName === 'string' && typeName.indexOf('普通') > -1) {    //  普通销售类型，返回所有批次数量的和
          if (angular.isObject(medicalObj) && medicalObj.stockBatchs.length) {
            var _quantity = 0;
            angular.forEach(medicalObj.stockBatchs, function (item, index) {
              _quantity += parseInt(item.quantity, 10);
            });

            return _quantity;
          }
        } else if (typeof typeName === 'string' && typeName.indexOf('直发') > -1) {   // 直发销售类型，直接返回购需数量
          return medicalObj.quantity;
        }
      }

      addDataItem.handleFlag = true;

      //添加到列表
      $scope.formData.orderMedicalNos.push(addDataItem);
      //计算价格
      $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
      // 校验该商品是否有证照过期
      _getIdentityForMedicalStocks();

      return true;
    };
    //判断是否需要传wms
    $scope.chgOrderBusinessType = function(a,id){//如果a为true表示物流中心false表示入库类型
      var _reqUrl = a ? "rest/authen/logisticsCenter/get?id=" + id : "rest/authen/otherInoutOrderType/get?id=" + id;
      requestData(_reqUrl)
          .then(function (results) {
            console.info(results);
              if(results[1].code ==200){
                if(!a) results[1].data.isCanWMS == "是" ? $scope.isCanWMSRu = true : $scope.isCanWMSRu = false;
                if(a) results[1].data.infrastructureId ? $scope.isCanWMSWu = true : $scope.isCanWMSWu = false;
              }
          })
          .catch(function (error) {
              throw new Error(error);
          });
    }
    // 检查添加的供应商是否有地址信息，没有则弹出层跳转到维护地址
    $scope.chkSupplierInfo = function (supplier) {
      if (!supplier.contact) {

          dialogConfirm('供应商信息不完整,请到供应商中心\供应商管理中补充发货人信息后再新建其他业务单-入库!',function () {

          },'pr-dialog-confirm.html','确认提示','确定',"", "",{},function () {

          })
          //dialogAlert('供应商信息不完整,请到供应商中心\供应商管理中补充发货人信息后再新建其他业务单-入库!', function () {
            // window.location.assign('#/supplier/edit-contact.html?id='+supplier.id);
          // });
      }
    };
    // 修改供应商后，调用获取历史价格的接口，拿到每一个药品对应的价格。
    $scope.setformData_supplier=function(supplier,formData){
        if(supplier&&formData.supplier&&supplier.id==formData.supplier.id){

        }else{
            //不能直接赋值，引用关系。
            formData.supplier=  utils.deepCopy(supplier);;
        }
    }

    /**
     *
     * @param tr
     * @param flag jisuan
     */
    $scope.countDate=function (tr,flag) {

        if(!tr.guaranteePeriod) return;

        //计算生产日期
        if(flag){

            var IsNewDate = new Date(Number(tr.productionDate));

            var isLose = utils.dateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,true);

            tr.validTill = new Date(isLose).getTime();

            return;
        }else{

            var IsNewDate = new Date(Number(tr.productionDate));

            var isLose = utils.dateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,false);

            tr.productionDate = new Date(isLose).getTime();

            return;
        }
        tr.validTill = new Date(isLose).getTime();
    };

    // 保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {
      if ($scope.submitForm_type == 'exit') {
        $scope.goTo({tabHref:'#/otherInOrder/query.html',tabName:'其他业务单-入库'});
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
       _url='rest/authen/otherInOrder/startProcessInstance';
       data= {businessKey:$scope.formData.id};
       requestData(_url, data, 'POST')
         .then(function (results) {
           var _data = results[1];
          //  alertOk(_data.message || '操作成功');
           $scope.goTo({tabHref:'#/otherInOrder/get.html?id='+$scope.formData.id,tabName:'其他业务单-入库'});

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

    // 实例化金额计算构造函数类
    // 请在编辑页获取数据之后的callback里执行此方法
    // 以便在当前页中调用此子类方法计算各金额
    $scope.initAmountCalcuAction = function () {
      $scope.amountCalcuConfirmOrder = new AmountCalculationService();
    }


    // ...
    $scope.handleFormElementChange = function (strikePrice, tax, discountRate, orderBusinessType, item, orderMedicalNos) {
      // 对数据中的价格字段进行计算处理
      var _priceObj = $scope.amountCalcuConfirmOrder.getAllAmountObject(strikePrice, tax, discountRate, $scope.returnQuantityByOrderType(orderBusinessType,item), orderMedicalNos);

      // 根据返回字段对象给addDataItem对象赋值
      if (angular.isObject(_priceObj)) {
        for (var key in _priceObj) {
          if (_priceObj.hasOwnProperty(key)) {
            item[key] = _priceObj[key];
          }
        }
      }
    }
  }
  angular.module('manageApp.project-dt')
  .controller('otherInOrderEdit', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'utils', 'dialogConfirm', 'AmountCalculationService', otherInOrderEdit]);
});
