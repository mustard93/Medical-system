define('project-dt/controllers-lossOverOrder', ['project-dt/init'], function() {
  /**
   * [lossOverOrderEditCtrl 报损报溢模块]
   * @method lossOverOrderEditCtrl
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              watchFormChange [description]
   * @param  {[type]}              requestData     [description]
   * @return {[type]}                              [description]
   */
  function lossOverOrderEditCtrl($scope, modal, alertWarn,alertOk,alertError, watchFormChange, requestData,utils) {


      /**
       *
       * @param tr
       * @param index
       * @param flag jisuan
       */
      $scope.countDate=function (tr,index,flag) {

          if(!tr.guaranteePeriod) return;

          //计算生产日期
          if(flag){

              var IsNewDate = new Date(Number(tr.productionDate));

              var isLose = utils.dateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,true);

              tr.validTill = new Date(isLose).getTime();

              $scope.formData.orderMedicalNos[index] =tr;
              return;
          }else{

              var IsNewDate = new Date(Number(tr.productionDate));

              var isLose = utils.dateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,false);

              tr.productionDate = new Date(isLose).getTime();

              $scope.formData.orderMedicalNos[index] =tr;
              return;
          }





          tr.validTill = new Date(isLose).getTime();



      };






      //失效日期
      $scope.loseTime = function(tr){
          if(!tr.guaranteePeriod) return;
          var IsNewDate = new Date(Number(tr.validTill));
          var isLose = DateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,false);
          tr.productionDate = new Date(isLose).getTime();
      }




        $scope.$watch('initFlag', function () {
          var operationFlowSetMessage=[];
          var operationFlowSetKey=[];
          console.log($scope.tbodyList);
          if ($scope.showData||$scope.tr) {
            // 选择出当前状态相同的驳回理由，并放入一个数组中
            if ($scope.showData.operationFlowSet||$scope.tr.operationFlowSet) {
              for (var i=0; i<$scope.showData.operationFlowSet.length; i++) {
                if ($scope.showData.operationFlowSet[i].status==$scope.showData.orderStatus) {
                  operationFlowSetMessage.push($scope.showData.operationFlowSet[i].message);
                  operationFlowSetKey.push($scope.showData.operationFlowSet[i].key);
                }
              }
            }
          //  选择当前状态最近的一个驳回理由用于显示
           $scope.showData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
           $scope.showData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
           return;
          }

        });
    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);
    };


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

      // if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
      //   alertWarn("请选择药品");
      //   return ;
      // }
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
        if(addDataItem.quantity>medical.quantity){//库存不足情况
            addDataItem.handleFlag =false;//默认添加到订单
        }
        if (!$scope.formData.orderMedicalNos) {
          $scope.formData.orderMedicalNos = [];
        }

        addDataItem.stockBatchs=[];

        //添加到列表
        $scope.formData.orderMedicalNos.push(addDataItem);
        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
        return true;
    };

    // 重新选择历史价格之后哟啊实时重新计算总计
    $scope.lossOverOrderCalculaTotal = function (orderMedicalNos, orderBusinessType) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {

            var _tmp = 0;
            for (var i = 0; i < item.stockBatchs.length; i++) {
              _tmp += item.stockBatchs[i].quantity * item.strike_price * (item.discountRate / 100);
            }
            _total += _tmp;
        });
        $scope.formData.totalPrice = _total;
      }
    };

    // 保存  type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        return;
      }

      if ($scope.submitForm_type == 'submit-loss') {
        _url='rest/authen/lossOrder/startProcessInstance';
        data= {businessKey:$scope.formData.id};
        requestData(_url, data, 'POST')
          .then(function (results) {
            var _data = results[1];
           //  alertOk(_data.message || '操作成功');
            $scope.goTo({tabHref:'#/lossOrder/get.html?id='+$scope.formData.id,tabName:'报损单'});

          })
          .catch(function (error) {
            alertError(error || '出错');
          });
       }


      if ($scope.submitForm_type == 'submit-over') {
            _url='rest/authen/overOrder/startProcessInstance';
            data= {businessKey:$scope.formData.id};
            requestData(_url, data, 'POST')
                .then(function (results) {
                    var _data = results[1];
                    alertOk(_data.message || '操作成功');
                    $scope.goTo({tabHref:'#/overOrder/get.html?id='+$scope.formData.id,tabName:'报溢单'});

                })
                .catch(function (error) {
                    alertError(error || '出错');
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
      $scope.submitFormValidator(fromId);

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

    // 监控用户选择的批次数量，如果不符合数量要求则弹出提示信息
    $scope.$watch('formData.orderMedicalNos', function (newVal) {

      var _total = 0;
      if ($scope.formData.orderMedicalNos) {
        // 判断只要有一个商品的批号没有选就不允许提交
        if ($scope.formData.orderMedicalNos.some(function(item){return item.stockBatchs.length==0;})) {
          $scope.stockBatchsFlag=true;
        }else {
          $scope.stockBatchsFlag=false;
        };
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {

          if (data.stockBatchs) {
            for (var i = 0; i < data.stockBatchs.length; i++) {
              _total += parseInt(data.stockBatchs[i].quantity,10);
            }
            // 判断只要有一个数量大于当前的可用量就不允许提交
            if (data.stockBatchs.some(function(item){return item.quantity>item.salesQuantity;})) {
              $scope.canNextStep=true;
            }else {
              $scope.canNextStep=false;
            };
          }

          // 如果所有批次数量的和小于计划数量，则弹出提示
          $scope.isShowConfirmInfo = (_total < $scope.formData.orderMedicalNos[index].quantity && _total !== 0) ? true : false;

        });

        // 如果商品数量有变动，也要重新计算总价
        $scope.lossOverOrderCalculaTotal(newVal,$scope.formData.orderBusinessType);

      }

      if(!newVal.length){
        // 否则说明商品被删完，所以总计也是为0.
        $scope.formData.totalPrice=0;
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

  }

  angular.module('manageApp.project-dt')
  .controller('lossOverOrderEditCtrl', ['$scope',"modal",'alertWarn','alertOk',"alertError","watchFormChange","requestData","utils", lossOverOrderEditCtrl]);
});
