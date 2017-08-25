define('project-dt/controllers-requestPurchaseOrderDetail', ['project-dt/init'], function() {
  /**
   * [requestPurchaseOrderDetailCtrl 请购单合并生成采购单]
   * @method salesOrderEditCtrl
   * @param  {[type]}           $scope          [description]
   * @param  {[type]}           modal           [description]
   * @param  {[type]}           alertWarn       [description]
   * @param  {[type]}           watchFormChange [description]
   * @return {[type]}                           [description]
  */
  function requestPurchaseOrderDetailCtrl($scope, modal, alertWarn, alertError, requestData, watchFormChange, dialogAlert) {

    //初始化校验数据
    $scope.checkData=function(){
        console.log("checkData");
        //初始化显示数据

        if($scope.formData.orderMedicalNos.length){

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

    $scope.$watch('formData.orderMedicalNos',function (newVal,oldVal) {

        if( oldVal && newVal){
            if(newVal.length != oldVal.length){
                $scope.checkData();
            }
        }
    });

    // 监控用户变化，清空之前选择药械列表
    $scope.$watch('formData.supplier.id', function (newVal, oldVal) {

        // 当用户第一次选择客户时，检查该用户是否有证照过期
        if (newVal && oldVal !== newVal) {
            console.log($scope.formData.customerId);
            // if ($scope.formData.customerId) {
                var _reqUrl = 'rest/authen/qualificationCertificate/identityForSupplier?id=' +$scope.formData.supplier.id;
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
            // }
        }

    });

    // 先声明一个ids数组，用于存放药品id，以备后续查询历史价格时使用。
    $scope.ids=[];
    // 根据实际采购数量的变化与计划采购数量做对比的标识变量
    $scope.isShowPurchaseInfo = false;

    // 如果实际采购数量大于计划采购数量，则屏蔽下一步操作
    $scope.isDisabledNextStep = false;

    $scope.$watch('initFlag', function (newVal) {

        var operationFlowSetMessage=[];
        var operationFlowSetKey=[];
        var i;
        if (newVal && $scope.scopeData) {

            // 选择出当前状态相同的驳回理由，并放入一个数组中

            for (i=0; i<$scope.scopeData.operationFlowSet.length; i++) {
                if ($scope.scopeData.operationFlowSet[i].status==$scope.scopeData.orderStatus) {
                    operationFlowSetMessage.push($scope.scopeData.operationFlowSet[i].message);
                    operationFlowSetKey.push($scope.scopeData.operationFlowSet[i].key);
                }
            }
            //  选择当前状态最近的一个驳回理由用于显示
            $scope.scopeData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
            $scope.scopeData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];

        }
        if (newVal && $scope.formData) {
            // 选择出当前状态相同的驳回理由，并放入一个数组中
            if ($scope.formData.operationFlowSet) {
                for (i=0; i<$scope.formData.operationFlowSet.length; i++) {
                    if ($scope.formData.operationFlowSet[i].status==$scope.formData.orderStatus) {
                        operationFlowSetMessage.push($scope.formData.operationFlowSet[i].message);
                        operationFlowSetKey.push($scope.formData.operationFlowSet[i].key);
                    }
                }

                //选择当前状态最近的一个驳回理由用于显示
                $scope.formData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
                $scope.formData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
            }


        }
        if (newVal && $scope.tr) {
            // 选择出当前状态相同的驳回理由，并放入一个数组中
            if ($scope.tr.operationFlowSet) {
                for (i=0; i<$scope.tr.operationFlowSet.length; i++) {
                    if ($scope.tr.operationFlowSet[i].status==$scope.tr.orderStatus) {
                        operationFlowSetMessage.push($scope.tr.operationFlowSet[i].message);
                        operationFlowSetKey.push($scope.tr.operationFlowSet[i].key);
                    }
                }

                //选择当前状态最近的一个驳回理由用于显示
                $scope.tr.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
                $scope.tr.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
            }
        }

        if (newVal && $scope.formData) {
            if (newVal && $scope.formData.orderMedicalNos) {
                //  angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
                //    if (data.handleFlag)
                //  })
                for (i=0; i<$scope.formData.orderMedicalNos.length; i++) {
                    if ($scope.formData.orderMedicalNos[i].handleFlag) {
                        $scope.choisedMedicals = true;
                    }
                    if (!$scope.formData.orderMedicalNos[i].handleFlag) {
                        $scope.isChoiseAll = false;
                    }
                }
                // $scope.isChoiseAll = true;
            }
        }


    });

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

    $scope.chkChoiseMedicals = function (item,medicalsObj) {
        if (item.handleFlag) {

            $scope.choisedMedicals = true;  // 标识为true，底部生成采购单按钮可用

            for (var i=0; i<medicalsObj.length; i++) {
                if (medicalsObj[i].handleFlag === false) {
                    $scope.isChoiseAll = false;
                    return;
                }
            }

            $scope.isChoiseAll = true;
        } else {      // 处理用户取消选择,需遍历药品列表，判断是否还有没有取消的药品

            $scope.isChoiseAll = false;

            for (var j=0; j<medicalsObj.length; j++) {
                if (medicalsObj[j].handleFlag === true) {
                    $scope.choisedMedicals = true;
                    return;
                }
            }

            $scope.choisedMedicals = false;   // 没有药品被选中，设置按钮不可用
        }
    };

    $scope.handleItemClickEvent = function (tr) {
        var _dataSource = $scope.formData.orderMedicalNos;
        if (!$scope.choisedMedicalList) {
            $scope.choisedMedicalList = [];
        }
        if (tr.handleFlag) {
            $scope.choisedMedicalList.push(tr);
            if ($scope.choisedMedicalList.length === _dataSource.length) {
                $scope.isChoiseAll = true;
            }
        } else {
            angular.forEach($scope.choisedMedicalList, function (data, index) {
                if (data.relId === tr.relId) {
                    $scope.choisedMedicalList.splice(index, 1);
                }
            });
            $scope.isChoiseAll = false;
        }
    };

    modal.closeAll();
    $scope.addDataItem = {};

    //需要重新家长地址方法。编辑新建后
    $scope.customerAddressReload=function (){
        $scope.reloadTime=new Date().getTime();
        modal.closeAll();
    };

    $scope.customerAddressGetCallBack = function(formData,customerAddress) {
        formData.customerName=customerAddress.name;
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
        addDataItem.strick_price=addDataItem.purchasePrice;
        addDataItem.taxRate='17';
        addDataItem.batchRequirement='无';
        addDataItem.relId=medical.id;
        addDataItem.warehouseId=$scope.formData.warehouseId;

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
        // if (!addDataItem.strike_price) {
        //     alertWarn('请输入成交价格。');
        //     return false;
        // }
        if(addDataItem.quantity>medical.quantity){//库存不足情况
            addDataItem.handleFlag =false;//默认添加到订单
        }
        if (!$scope.formData.orderMedicalNos) {
            $scope.formData.orderMedicalNos = [];
        }
        // 如果已添加
        //  if ($scope.formData.orderMedicalNos.length !== 0) {
        //    var _len = $scope.formData.orderMedicalNos.length;
        //
        //    for (var i=0; i<_len; i++) {
        //      if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
        //        alertWarn('此药械已添加到列表');
        //         // $scope.ids.push($scope.formData.orderMedicalNos[i].relId);
        //        return false;
        //      }
        //
        //    }
        //  }

        // 添加药品后请求当前药品的历史价格
        if (addDataItem) {
            //  var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=采购';
            var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&supplierId=' + $scope.formData.supplier.id + '&type=采购';

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


        //请求判断 是否过期
        requestData('rest/authen/qualificationCertificate/identityForMedicalStock',{'id':addDataItem.relId},'GET').then(function (result) {

            if(result[1].code==200){
                addDataItem.info=result[1].data;

                //添加到列表
                $scope.formData.orderMedicalNos.push(addDataItem);
            }
        });




        //添加到列表
        // $scope.formData.orderMedicalNos.push(addDataItem);

        // 计算总价
        //  $scope.formData.totalPrice = $scope.purchaseOrderCalculaTotal($scope.formData.orderMedicalNos);

        return true;
    };

    $scope.selectRelIdCallBack = function(data) {
        $scope.addDataItem.relId = data.id;
        $scope.addDataItem.name = data.name;
        $scope.addDataItem.brand = data.brand;
        $scope.addDataItem.unit = data.unit;
        $scope.addDataItem.price = data.price;
        // $scope.addDataItem.isSameBatch = '否';
        $scope.addDataItem.strike_price = data.price;
        $scope.addDataItem.headUrl = data.headUrl;
        $scope.addDataItem.specification = data.specification;
        $scope.addDataItem.manufacturer = data.manufacturer;
        $scope.addDataItem.handleFlag =true;//默认添加到订单
        $scope.addDataItem.productionBatch = '无';
        $scope.addDataItem.dosageForms = data.dosageForms;
        $scope.addDataItem.code = data.code;
        $scope.addDataItem.productionBatch = data.productionBatch;
        $scope.addDataItem.productionDate = data.productionDate;
        $scope.addDataItem.guaranteePeriod = data.guaranteePeriod;
        $scope.addDataItem.licenseNumber = data.licenseNumber;
        $scope.addDataItem.deliveryPlus = data.deliveryPlus;
        $scope.addDataItem.drugAdministrationCode = data.drugAdministrationCode;

        // alert($('#addDataItem_quantity').length);
        // $('#addDataItem_quantity').trigger('focus');
        $('#addDataItem_quantity').trigger('focus');
    };

    $scope.addDataItemClick = function(addDataItem,medical) {
        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
            return;
        }
        if (!addDataItem.quantity||addDataItem.quantity<1) {
            alertWarn('请输入大于0的数量。');
            return;
        }

        if(addDataItem.quantity>medical.quantity){//库存不足情况
            addDataItem.handleFlag =false;//默认添加到订单
        }

        // 如果已添加
        if ($scope.formData.orderMedicalNos.length > 0) {
            var _len = $scope.formData.orderMedicalNos.length;
            // 未使用forEach方法，因为IE不兼容
            for (var i=0; i<_len; i++) {
                if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                    alertWarn('此药械已添加到列表');
                    return;
                }
            }
        }

        if (!$scope.formData.orderMedicalNos) $scope.formData.orderMedicalNos = [];
        $scope.formData.orderMedicalNos.push(addDataItem);

        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

        $scope.addDataItem = {};

        $('input', '#addDataItem_relId_chosen').trigger('focus');
        // $('#addDataItem_relId_chosen').trigger('click');
    };


    $scope.cancelForm = function(fromId, url) {
        alertWarn('cancelForm');
    };

    $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
    };

    // 请购单中检查用户是否已选择部分药品
    $scope.chkChoiseMedicals = function (item,medicalsObj) {
        if (item.handleFlag) {

            $scope.choisedMedicals = true;  // 标识为true，底部生成采购单按钮可用

            for (var i=0; i<medicalsObj.length; i++) {
                if (medicalsObj[i].handleFlag === false) {
                    $scope.isChoiseAll = false;
                    return;
                }
            }

            $scope.isChoiseAll = true;
        } else {      // 处理用户取消选择,需遍历药品列表，判断是否还有没有取消的药品

            $scope.isChoiseAll = false;

            for (var j=0; j<medicalsObj.length; j++) {
                if (medicalsObj[j].handleFlag === true) {
                    $scope.choisedMedicals = true;
                    return;
                }
            }

            $scope.choisedMedicals = false;   // 没有药品被选中，设置按钮不可用
        }
    };

    // 处理全选与全不选
    $scope.handleChoiseAllEvent = function (medicalsObj) {
        if (medicalsObj && angular.isArray(medicalsObj)) {
            if ($scope.isChoiseAll) {   // 全选被选中
                angular.forEach(medicalsObj, function (data, index) {
                    data.handleFlag = true;
                    $scope.choisedMedicals = true;    // 生成按钮可用
                });
            } else {    //取消了全部选中
                angular.forEach(medicalsObj, function (data, index) {
                    data.handleFlag = false;
                    $scope.choisedMedicals = false;   // 生成按钮不可用
                });
            }
        }
    };

    // 点击生成采购凭证事件
    $scope.createPurVoBtnClick = function (_id) {
        var url = 'rest/authen/purchaseVoucher/save';
        var data= {purchaseOrderId:_id};
        requestData(url,data, 'POST')
            .then(function (results) {
                var _data = results[1].data;
                console.log(_data);
                $scope.goTo({tabHref:'#/purchaseVoucher/get.html?id='+_data.id,tabName:'采购凭证'});
            })
            .catch(function (error) {
                alertError(error || '出错');
            });
    };

    // 监控计划采购数量与实际采购数量的方法
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

    // 检查添加的供应商是否有地址信息，没有则弹出层跳转到维护地址
    $scope.chkSupplierInfo = function (supplier) {
        // console.log(supplier);
        if (!supplier.contact) {
            dialogAlert('供应商信息不完整,请到供应商中心\供应商管理中补充发货人信息后再新建采购单!', function () {
                // window.location.assign('#/supplier/edit-contact.html?id='+supplier.id);
            });
        }
    };
    // 监听商品对象，只要加入商品后就把id取出来放入ids中，用于后续请求历史价格

    // $scope.$watchCollection('formData.orderMedicalNos',function(newVal,oldVal){
    //     if (newVal && newVal!==oldVal) {
    //         for (var i = 0; i < newVal.length; i++) {
    //             $scope.ids.push(newVal[i].relId);
    //         }
    //
    //         $scope.ids=unique1($scope.ids);
    //         console.log($scope.ids);
    //     }
    // })

    // 数组去重
    function unique1(array){
        var n = []; //一个新的临时数组
        //遍历当前数组
        for(var i = 0; i < array.length; i++){
            if (n.indexOf(array[i]) == -1) n.push(array[i]);
        }
        return n;
    }

    // 修改供应商后，调用获取历史价格的接口，拿到每一个药品对应的价格。
    $scope.getHistoryFirstPrice=function(supplier){

        if (!$scope.ids.length) {
            for (var i = 0; i <  $scope.formData.orderMedicalNos.length; i++) {
                $scope.ids.push( $scope.formData.orderMedicalNos[i].id);
            }
        }
        console.log($scope.ids.length);
        if (supplier.id&&$scope.ids.length&&supplier.contact) {
            var _url="rest/authen/historicalPrice/batchGetByrelIds?id="+  $scope.ids+'&type=采购'+'&supplierId='+supplier.id,
                _data={};
            requestData(_url,_data, 'get')
                .then(function (results) {
                    var _data = results[1].data;
                    console.log(_data);
                    // 把相应的历史价格赋值叨叨相应的商品上
                    for (var i = 0; i <  $scope.formData.orderMedicalNos.length; i++) {
                        console.log($scope.formData.orderMedicalNos[i]);

                        if ($scope.formData.orderMedicalNos[i].id!=null) {
                            $scope.formData.orderMedicalNos[i].strike_price=_data[ $scope.formData.orderMedicalNos[i].id].value;
                        }else {
                            $scope.formData.orderMedicalNos[i].strike_price=_data[ $scope.formData.orderMedicalNos[i].relId].value;
                        }

                    }
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }
    }

    // 总价金额计算方法
    $scope.purchaseOrderCalculaTotal = function (orderMedicalList) {
        var _total = 0;

        if (orderMedicalList) {
            angular.forEach(orderMedicalList, function (data, index) {
                _total += data.quantity * data.strike_price;
            });
        }

        return _total.toFixed(2);
    };



    $scope.warehouselist=[];

    // $scope.$watch('formData.logisticsCenterId',function (newVal,oldVal) {
    //
    //     if(newVal){
    //         requestData('rest/authen/warehouse/queryForSelectOption?logisticsCenterId='+$scope.formData.logisticsCenterId+'&type=虚拟库',{},"GET")
    //         .then(function (results) {
    //             var _data = results[1];
    //
    //             if(_data.code ==200){
    //                 $scope.warehouselist=_data.data;
    //
    //                 console.log("warehouselist" ,$scope.warehouselist);
    //             }
    //
    //             $scope.goTo('#/purchaseOrder/get.html?id='+$scope.formData.id);
    //         })
    //         .catch(function (error) {
    //             alertError(error || '出错');
    //         });
    //     }
    // });

    //设置预入库房
    $scope.changeWarehouse = function (warehouseId,orderMedicalNos,warehouseList){

        var  warehouseName = "";
        if(warehouseList){
            angular.forEach(warehouseList,function (item,index) {
                if(item.value == warehouseId){
                    warehouseName=item.text;
                }
            });
        }
        if (orderMedicalNos) {
            angular.forEach(orderMedicalNos, function (data, index) {
                data.warehouseId=warehouseId;
                data.warehouseName=warehouseName;
            });
        }
    };

    //提交表单回调方法
    $scope.submitFormAfter = function() {

        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
            $scope.goTo('#/purchaseOrder/query.html');
            return;
        }else if ($scope.submitForm_type == 'print') {
            var url="indexOfPrint.html#/print/index.html?key=purchaseOrderPrint&id="+$scope.formData.id;
            win1=window.open(url);

            if(!win1||!win1.location){
                alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
            }
            return;
        }

        if ($scope.submitForm_type == 'submit') {
            var _url='rest/authen/purchaseOrder/startProcessInstance';
            var data= {businessKey:$scope.formData.id};
            requestData(_url,data, 'POST')
                .then(function (results) {
                    var _data = results[1];
                    $scope.goTo('#/purchaseOrder/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }
    };

    //提交表单
    $scope.submitForm = function(fromId, type) {
        $scope.submitForm_type = type;
        $scope.formData.isMerge=true;

        if ($scope.submitForm_type == 'submit') {
            $scope.formData.validFlag = true;
        }
        if ($scope.submitForm_type == 'save') {
            $scope.formData.validFlag = false;
        }

        $scope.submitFormValidator(fromId);

        // addDataItem_opt.submitUrl='';
        // $scope.formData.orderMedicalNos.push($scope.addDataItem);
        // $scope.addDataItem={};
    };

    //清除客户信息
    $scope.clearCustomer=function () {
        if($scope.formData.orderMedicalNos.length==0){
            $scope.formData.customerId='';
            $scope.formData.customerName='';
        }
    };

    //选择事件
    $scope.$on("selctedMed",function (e,data) {

        //设置客户名称
        $scope.formData.customerId=data.customer.id;
        $scope.formData.customerName=data.customer.name;

        $scope.formData.orderMedicalNos=data.choiced;

        //设置仓库
        if($scope.formData.warehouseId){
            $scope.changeWarehouse($scope.formData.warehouseId,$scope.formData.orderMedicalNos,$scope.warehouseList);
        }

        e.stopPropagation();
        modal.close();
    });

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


    $scope.uuids="";

    //获取UUIDS
    $scope.getOrderMedicalNosUUID=function(){
        var arr=[];
        var list=[];
        if($scope.formData){
            list = $scope.formData.orderMedicalNos || [];
        }


        angular.forEach(list,function (item,index) {
            arr.push(item['uuid']);
        });

        $scope.uuids= arr.join(',');

        return arr.join(',');
    }

    $scope.getOrderMedicalNosUUID();

  }

  function requestPurchaseOrderDetailDialogCtrl($scope, modal, alertWarn, watchFormChange, requestData, utils,dialogConfirm) {

        modal.closeAll();

        //监控选择的发货单变化
        $scope.$watch('scopeData',function (newVal,oldVal){
            if(newVal){
                $scope.listParams.customerId= newVal.id;
                $scope.customerName=newVal.title;
            }
        });

        $scope.$watch('selectedOrderCode2',function (newVal,oldVal){
            console.log("$scope.selectedOrderCode2",$scope.selectedOrderCode2)
            if(newVal){
                $scope.listParams.orderCode= $scope.selectedOrderCode2.data.orderCode;
            }
        },true);



        $scope.setOrderCode=function (object) {
            console.log("object",object);

            $scope.listParams.orderCode= object.data.orderCode;
            console.log("$scope.listParams.orderCode",$scope.listParams.orderCode);
        };


        $scope.addOrderDataToList=function () {
            var datas={
                customer:{
                    id:$scope.listParams.customerId,
                    name:$scope.customerName,
                },
                choiced:$scope.choiced
            };
            $scope.$emit('selctedMed',datas);
        };


        // 处理全选与全不选
        // $scope.choiced=[];
        $scope.handleChoiseAllEvent = function (medicalsObj,handleFlag) {
            if (medicalsObj && angular.isArray(medicalsObj)) {
                if (handleFlag) {   // 全选被选中
                    angular.forEach(medicalsObj, function (data, index) {
                        data.handleFlag = true;
                        $scope.choiced.push(data.orderMedicalNo);
                    });
                } else {    //取消了全部选中
                    angular.forEach(medicalsObj, function (data, index) {
                        data.handleFlag = false;
                        $scope.choiced=[];
                    });
                }
            }
        };

        $scope.handleItemClickEvent = function (tr) {
            var _dataSource = $scope.tbodyList;
            if (!$scope.choiced) {
                $scope.choiced = [];
            }

            if (tr.handleFlag) {
                $scope.choiced.push(tr.orderMedicalNo);
                if ($scope.choiced.length === _dataSource.length) {
                    $scope.isChoiseAll = true;
                }
            } else {
                angular.forEach($scope.choiced, function (data, index) {
                    if (data.uuid == tr.orderMedicalNo.uuid) {
                        $scope.choiced.splice(index, 1);
                    }
                });
                $scope.isChoiseAll = false;
            }
        };

        $scope.itemInArray=function (id,batchlist,attr) {

            if(!batchlist){
                var  batchlist= [];
            }

            var flag=false;
            for(var i=0; i<batchlist.length; i++){
                if(batchlist[i][attr] == id){
                    flag=true;
                }
            }
            return flag;
        };


        $scope.$watch('listParams',function (p1, p2, p3) {

                console.log("listParams",$scope.listParams);

        });


        $scope.$on('tbodyListLoaded',function (p1, p2) {
            $scope.isCheckAll();
        });



        $scope.isCheckAll=function () {

            var count =0;

            angular.forEach($scope.tbodyList,function (item) {

                console.log($scope.itemInArray(item.orderMedicalNo.uuid,$scope.choiced,'uuid'));
                if($scope.itemInArray(item.orderMedicalNo.uuid,$scope.choiced,'uuid')){
                    count++;
                }
            });

            console.log("$scope.tbodyList.length == count",$scope.tbodyList.length , count);
            if($scope.tbodyList.length == count){
                $scope.isChoiseAll = true;
            }else{
                $scope.isChoiseAll = false;
            }

            console.log("isChoiseAll",$scope.isChoiseAll);
        }
    }

  angular.module('manageApp.project-dt')
  .controller('requestPurchaseOrderDetailDialogCtrl', ['$scope',"modal",'alertWarn',"watchFormChange", "requestData", "utils","dialogConfirm", requestPurchaseOrderDetailDialogCtrl])
  .controller('requestPurchaseOrderDetailCtrl', ['$scope', 'modal', 'alertWarn', 'alertError', 'requestData', 'watchFormChange', 'dialogAlert', requestPurchaseOrderDetailCtrl]);

});
