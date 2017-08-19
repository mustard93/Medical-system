define('project/controllers-lendOrder', ['project/init'], function() {
  /**
   * [lendOrderEditCtrl 借出单编辑Ctrl]
   * @method lendOrderEditCtrl
   * @param  {[type]}          $scope        [description]
   * @param  {[type]}          modal         [description]
   * @param  {[type]}          alertWarn     [description]
   * @param  {[type]}          requestData   [description]
   * @param  {[type]}          alertOk       [description]
   * @param  {[type]}          alertError    [description]
   * @param  {[type]}          utils         [description]
   * @param  {[type]}          dialogConfirm [description]
   * @return {[type]}                        [description]
   */
  function lendOrderEditCtrl($scope,modal,alertWarn,requestData,alertOk,alertError,utils,dialogConfirm) {

       $scope.logistics=true;
       $scope.isShowConfirmInfo = false;
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
       });

       // 监控用户选择的批次数量，如果不符合数量要求则弹出提示信息
       $scope.$watch('formData.orderMedicalNos', function (newVal) {

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
       }, true);


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
               $scope.goTo('#/confirmOrder/query.html');
               return;
           }else if($scope.submitForm_type == 'exit-allocate'){
               $scope.goTo('#/allocateOrder/query.html');
               return;
           }else   if ($scope.submitForm_type == 'print') {
               var url="indexOfPrint.html#/print/index.html?key=confirmOrderPrint&id="+$scope.formData.id;
               win1=window.open(url);

               if(!win1||!win1.location){
                   alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
               }

               return;
           }

           var _url = null, data = null;

           if ($scope.submitForm_type == 'submit') {
               _url='rest/authen/lendOrder/startProcessInstance';
               data= {businessKey:$scope.formData.id};
               requestData(_url, data, 'POST')
                   .then(function (results) {
                       var _data = results[1];
                       //  alertOk(_data.message || '操作成功');
                       $scope.goTo('#/lendOrder/get.html?id='+$scope.formData.id);

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
                       $scope.goTo('#/allocateOrder/get.html?id='+$scope.formData.id);

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

           //生成归还单
           if($scope.submitForm_type == 'cereatReturnOrder'){

           }

           $scope.submitFormValidator(fromId);
       };


       //生成归还单
       $scope.cereatReturnOrder=function (id) {
           $scope.goTo({
               tabName:'归还单',
               tabHref:'#/returnOrder/edit.html?lendOrderId='+id
           });
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

       //添加商品到列表
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

           addDataItem.handleFlag = true;

           //添加到列表
           $scope.formData.orderMedicalNos.push(addDataItem);

           console.log("addDataItem",addDataItem);


           //计算价格
           $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

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
                       _total += item.quantity * item.strike_price * (item.discountRate / 100);
                   }
               });
               $scope.formData.totalPrice = _total;
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

       $scope.checkQuantity = function (quantity,batches){
           var totalQuantity=0;
           for (var i = 0; i < batches.length; i++) {
              //  console.log(batches[i].quantity);
               totalQuantity+=batches[i].quantity;
           }
           if (totalQuantity>quantity) {
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


       // 获取所有批次药品数量的合计
       $scope.getAllBatchTotal = function (batchsList) {

          if (batchsList && angular.isArray(batchsList)) {
              var _total = 0;
              angular.forEach(batchsList, function (item, index) {
                  _total += parseInt(item.quantity, 10);
              });
              return _total;
          } else {
              return 0;
          }
      };

       //检测药械批次信息，如果不存在返回 true ;  否者  false;
       $scope.checkBatchsList=function () {
           var flag=false;

           angular.forEach($scope.formData.orderMedicalNos,function (goods,index) {

               if(goods.stockBatchs.length<1){
                   flag=true;
               }

           });

           return flag;

       }
   }

  angular.module('manageApp.project')
  .controller('lendOrderEditCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "utils", "dialogConfirm", lendOrderEditCtrl]);
});
