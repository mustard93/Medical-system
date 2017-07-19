define('project/controllers-arrivalNoticeOrder', ['project/init'], function() {
  /**
   * [arrivalNoticeOrderEditCtrl 来货通知单控制器]
   * @method arrivalNoticeOrderEditCtrl
   * @param  {[type]}                   $scope          [description]
   * @param  {[type]}                   modal           [description]
   * @param  {[type]}                   alertWarn       [description]
   * @param  {[type]}                   alertError      [description]
   * @param  {[type]}                   requestData     [description]
   * @param  {[type]}                   watchFormChange [description]
   * @return {[type]}                                   [description]
   */
  function arrivalNoticeOrderEditCtrl($scope, modal, alertWarn, alertError, requestData, watchFormChange) {

    $scope.$watch('initFlag', function (newVal) {
      if (newVal && $scope.formData.orderMedicalNos) {

       for (var i=0; i<$scope.formData.orderMedicalNos.length; i++) {
         if ($scope.formData.orderMedicalNos[i].handleFlag) {
           $scope.choisedMedicals = true;
         }
         if (!$scope.formData.orderMedicalNos[i].handleFlag) {
           $scope.isChoiseAll = false;
         }
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
    // $scope.formData={};
    //
    $scope.addDataItem = {};

    //需要重新家长地址方法。编辑新建后
    $scope.customerAddressReload=function (){
      $scope.reloadTime=new Date().getTime();
      modal.closeAll();
    };

    /**
    * 医院地址加载后，回调方法
    */
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
          addDataItem.taxRate='17';
          addDataItem.batchRequirement='无';
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

    $scope.submitFormAfter = function() {

        $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/arrivalNoticeOrder/query.html');
       return;
     }
      if ($scope.submitForm_type == 'submit') {
        var url='rest/authen/arrivalNoticeOrder/updateStatus';
        var data= {id:$scope.formData.id,status:'入库中'};
        requestData(url,data, 'POST')
          .then(function (results) {
            var _data = results[1];
           //  alertOk(_data.message || '操作成功');
            $scope.goTo('#/arrivalNoticeOrder/get.html?id='+$scope.formData.id);

          })
          .catch(function (error) {
            alertError(error || '出错');
          });
      }

    };

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

    $scope.cancelForm = function(fromId, url) {
        alertWarn('cancelForm');
    };

    $scope.watchFormChange=function(watchName){
       watchFormChange(watchName,$scope);
     };

    /**
      * [chkChoiseMedicals 请购单中检查用户是否已选择部分药品]
      * @param  {[type]} item [description]
      * @return {[type]}      [description]
    */
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

    /**
      * [handleChoiseAllEvent 处理全选与全不选]
      * @param  {[type]} medicalsObj [description]
      * @return {[type]}             [description]
    */
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

    // 监控计划采购数量与实际采购数量的方法
    $scope.diffPurchaseNumber = function (orderMedicalList) {
       if (orderMedicalList) {
         // 用于放每一条判断数量后的结果
         isDisabledNextStepList=[];
         angular.forEach(orderMedicalList, function (data, index) {
           // 选择的数量小于计划数量，显示提示信息
           $scope.isShowPurchaseInfo = (data.planQuantity > data.quantity ) ? true : false;
           // ..

           $scope.isDisabledNextStep = (data.quantity== 0 || data.quantity > data.planQuantity ) ? true : false;
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
  }

  angular.module('manageApp.project')
  .controller('arrivalNoticeOrderEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", arrivalNoticeOrderEditCtrl]);
});
