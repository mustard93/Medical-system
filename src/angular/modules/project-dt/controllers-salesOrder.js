define('project-dt/controllers-salesOrder', ['project-dt/init'], function() {
  /**
   * [salesOrderEditCtrl 购需单控制器]
   * @method salesOrderEditCtrl
   * @param  {[type]}           $scope          [description]
   * @param  {[type]}           modal           [description]
   * @param  {[type]}           alertWarn       [description]
   * @param  {[type]}           watchFormChange [description]
   * @return {[type]}                           [description]
   */
  function salesOrderEditCtrl($scope, modal, alertWarn, watchFormChange) {

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

      // 添加一条。并缓存数据。
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
        $scope.addDataItem.storageLocation = data.storageLocation;
        $scope.addDataItem.productionDate = data.productionDate;
        $scope.addDataItem.guaranteePeriod = data.guaranteePeriod;
        $scope.addDataItem.licenseNumber = data.licenseNumber;
          $scope.addDataItem.deliveryPlus = data.deliveryPlus;

        // alert($('#addDataItem_quantity').length);
        // $('#addDataItem_quantity').trigger('focus');
        $('#addDataItem_quantity').trigger('focus');
      };

      // 添加一条。并缓存数据。
      $scope.addDataItemClick = function(addDataItem,medical) {

          if (!(addDataItem.relId && addDataItem.name)) {
              alertWarn('请选择药品。');
              return;
          }
          if (!addDataItem.quantity||addDataItem.quantity<1) {
              alertWarn('请输入大于0的数量。');
              return;
          }
          if (!addDataItem.strike_price) {
              alertWarn('请输入成交价格。');
              return;
          }
          if(addDataItem.quantity>medical.quantity){//库存不足情况
              addDataItem.handleFlag =false;//默认添加到订单
          }
          if (!$scope.formData.orderMedicalNos) {
            $scope.formData.orderMedicalNos = [];
          }
          // 如果已添加
          // if ($scope.formData.orderMedicalNos.length !== 0) {
          //   var _len = $scope.formData.orderMedicalNos.length;
          //   // console.log(_len);
          //   // 未使用forEach方法，因为IE不兼容
          //   for (var i=0; i<_len; i++) {
          //     if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
          //       alertWarn('此药械已添加到列表');
          //       return;
          //     }
          //   }
          // }
          //添加到列表
          $scope.formData.orderMedicalNos.push(addDataItem);

          //计算价格
          $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

          $scope.addDataItem = {};

          $('input', '#addDataItem_relId_chosen').trigger('focus');
          // $('#addDataItem_relId_chosen').trigger('click');
      };

      // 新版购需单控制器点击添加条目到列表方法
      $scope.newAddDataItemClick = function(addDataItem,medical) {

          if (!(addDataItem.relId && addDataItem.name)) {
              alertWarn('请选择药品。');
              return;
          }
          if (!addDataItem.csmQuantity || addDataItem.csmQuantity<1) {
              alertWarn('请输入大于0的数量。');
              return;
          }
          // if (!addDataItem.strike_price) {
          //     alertWarn('请输入成交价格。');
          //     return;
          // }
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
                return;
              }
            }
          }

          addDataItem.priceWithoutTax = addDataItem.price - addDataItem.price*addDataItem.taxRate;

          //添加到列表
          addDataItem.quantity = addDataItem.csmQuantity;
          $scope.formData.orderMedicalNos.push(addDataItem);

          //计算价格
          $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

          $scope.addDataItem = {};

          $('input', '#addDataItem_relId_chosen').trigger('focus');
          // $('#addDataItem_relId_chosen').trigger('click');
      };

      // 保存  type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {
        $scope.formData.validFlag = false;
        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/salesOrder/query.html');
          return;
        }
        if ($scope.submitForm_type == 'submit') {
          // $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);
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

  }

  angular.module('manageApp.project-dt')
  .controller('salesOrderEditCtrl', ['$scope',"modal",'alertWarn',"watchFormChange", salesOrderEditCtrl]);
});
