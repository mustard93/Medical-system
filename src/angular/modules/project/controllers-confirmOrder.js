define('project/controllers-confirmOrder', ['project/init'], function() {
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
  function confirmOrderEditCtrl($scope, modal, alertWarn, requestData, alertOk, alertError, utils, dialogConfirm) {

      //初始化校验数据
      $scope.checkData=function(){

          //初始化显示数据
          if($scope.formData.id && $scope.formData.orderMedicalNos.length){

              var ids=[];
              angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
                  ids.push(item.relId);
              });

              requestData('rest/authen/qualificationCertificate/identityForMedicalStocks',{'ids':ids},'GET').then(function (result) {

                  if(result[1].code==200){

                      var datas = result[1].data;

                      angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
                          item.info=datas[index];
                      });
                  }

              });
          }
      };


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
        // 当用户第一次选择客户时，检查该用户是否有证照过期
        if (newVal && oldVal !== newVal) {
            console.log($scope.formData.customerId);
            if ($scope.formData.customerId) {
                var _reqUrl = 'rest/authen/qualificationCertificate/identityForCustomerAddress?id=' +$scope.formData.customerId;
                // var _reqUrl = 'http://localhost:3000/src/dt/data/qualificationCertificate/identityForCustomerAddress.json'
                requestData(_reqUrl)
                    .then(function (results) {
                        if(results[1].code ==200){
                            console.log(results[1].data);
                            $scope.customerInfo= results[1].data;
                        }
                    })
                    .catch(function (error) {
                        throw new Error(error);
                    });
            }
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

    // 调接口取用户在自定义表格中编辑的表格的标题显示
    $scope.geThName=function(medicalData){
      if (medicalData.length) {
        var _url='rest/authen/uiCustomTable/getOfEdit.json?className=com.pangu.mss.domain.mongo.order.OrderMedicalNo&key=销售单详情列表';
        var data= {};
        requestData(_url, data, 'get')
          .then(function (results) {
            var thData={};
            for (var i = 0; i < results[1].data.items.length; i++) {

            switch (results[1].data.items[i].propertyKey) {
              case 'code':
                thData.code=results[1].data.items[i].propertyName;
                break;

              case 'approvedName':
                thData.approvedName=results[1].data.items[i].propertyName;
                break;
              case 'dosageForms':
                thData.dosageForms=results[1].data.items[i].propertyName;
                break;

              case 'specificationAndModelType':
                thData.specificationAndModelType=results[1].data.items[i].propertyName;
                break;
              case 'unit':
                thData.unit=results[1].data.items[i].propertyName;
                break;
              case 'quantity':
                thData.quantity=results[1].data.items[i].propertyName;
                break;
              case 'productionBatch':
                thData.productionBatch=results[1].data.items[i].propertyName;
                break;
              case 'sterilizationBatchNumber':
                thData.sterilizationBatchNumber=results[1].data.items[i].propertyName;
                break;
              case 'strike_price':
                thData.strike_price=results[1].data.items[i].propertyName;
                break;
              case 'totalPrice':
                thData.totalPrice=results[1].data.items[i].propertyName;
                break;
              case 'validTill':
                thData.validTill=results[1].data.items[i].propertyName;
                break;
              default:
            }
            }
            $scope.thData= thData;
          })
          .catch(function (error) {
            alertError(error || '出错');
          });
      }
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
     }
     else   if ($scope.submitForm_type == 'print') {
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

      $('#' + fromId).trigger('submit');
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


      //请求判断 是否过期
      requestData('rest/authen/qualificationCertificate/identityForMedicalStock',{'id':addDataItem.relId},'GET').then(function (result) {

          if(result[1].code==200){
              addDataItem.info=result[1].data;

              //添加到列表
              $scope.formData.orderMedicalNos.push(addDataItem);

              console.log(addDataItem);

              //计算价格
              $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

          }
      });




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

    // 检测调拨数量是否大于可调拨数量
    // @param orderMedicalNos  当前药品列表数组
    // @return undefined
    // $scope.chkAllocateNumOverload = function (formData) {
    //   if (formData && angular.isObject(formData)) {
    //     // 获取当前单据的药品列表数组
    //     var _orderMedicalNos = formData.orderMedicalNos;
    //     // 获取当前仓库id
    //     var _warehouseId = formData.sourceId;
    //     // 数量溢出标识符
    //     $scope.quantityOverloadFlag = [];
    //     // 循环检查当前药品列表中是否有填写的调拨数量大于可调拨数量
    //     angular.forEach(_orderMedicalNos, function (item, index) {
    //       // 获取实时可调拨数量
    //       var _url = 'rest/authen/medicalStock/getStockModelByWarehouseId?id='+item.relId+'&warehouseId='+_warehouseId;
    //       requestData(_url)
    //       .then(function (results) {
    //         var _salesQuantity = results[1].data.salesQuantity;
    //         if (item.quantity > _salesQuantity) {
    //           $scope.quantityOverloadFlag.push('true');
    //         } else {
    //           $scope.quantityOverloadFlag.push('false');
    //         }
    //       });
    //     });
    //
    //   }
    // };
    //

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

          angular.forEach($scope.formData.orderMedicalNos,function (medical,index) {

            if(medical.info){


              if(medical.info.controllType =='限制交易' && medical.info.msg){
                  flag=false;
              }
            }
          });
          return flag;
      };

  }

  angular.module('manageApp.project')
  .controller('confirmOrderEditCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "utils", "dialogConfirm", confirmOrderEditCtrl]);
});
