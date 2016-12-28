/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init'], function() {
    /**
     *编辑、新建订单
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
            if ($scope.formData.orderMedicalNos.length !== 0) {
              var _len = $scope.formData.orderMedicalNos.length;
              // console.log(_len);
              // 未使用forEach方法，因为IE不兼容
              for (var i=0; i<_len; i++) {
                if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                  alertWarn('此药械已添加到列表');
                  return;
                }
              }
            }
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
            $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);
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

    }

    /**
     *编辑、新建订单
     */
    function salesOrderEditCtrl2($scope, modal, alertWarn, watchFormChange, requestData) {

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

          var medical=flashAddData.data.data;
          var addDataItem = $.extend(true,{},medical);

              addDataItem.quantity=flashAddData.quantity;
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

        // 保存  type:save-草稿,submit-提交订单。
        $scope.submitFormAfter = function() {

          $scope.formData.validFlag = false;

          if ($scope.submitForm_type == 'exit') {
            $scope.goTo('#/salesOrder/query.html');
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

    }

    /**
     *  报损报溢模块
     */
    function lossOverOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData) {

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

          var medical=flashAddData.data.data;
          var addDataItem = $.extend(true,{},medical);

              addDataItem.quantity=flashAddData.quantity;
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
            if (!addDataItem.strike_price) {
                alertWarn('请输入成交价格。');
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
            $scope.goTo('#/salesOrder/query.html');
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

    }

    /**
     *  批次冻结解冻模块
     */
    function freezeThawOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData) {

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

          var medical=flashAddData.data.data;
          var addDataItem = $.extend(true,{},medical);

              addDataItem.quantity=flashAddData.quantity;
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
            if (!addDataItem.strike_price) {
                alertWarn('请输入成交价格。');
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
            $scope.goTo('#/salesOrder/query.html');
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

    }


    /**
     *编辑订单
     */
    function confirmOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError) {
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitFormAfter = function() {

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/invoicesOrder/query.html');
         return;
       }

       if ($scope.submitForm_type == 'submit') {
         var url='rest/authen/confirmOrder/updateStatus';
         var data= {id:$scope.formData.id,orderStatus:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
            //  alertOk(_data.message || '操作成功');
             $scope.goTo('#/confirmOrder/confirm-order.html?id='+$scope.formData.id);

           })
           .catch(function (error) {
             alertError(error || '出错');
           });


        }

      };

      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
        $('#' + fromId).trigger('submit');

      };
    }

    /**
     * [confirmOrderEditCtrl2 新版销售单Controller]
     * @param  {[type]} $scope      [description]
     * @param  {[type]} modal       [description]
     * @param  {[type]} alertWarn   [description]
     * @param  {[type]} requestData [description]
     * @param  {[type]} alertOk     [description]
     * @param  {[type]} alertError  [description]
     * @return {[type]}             [description]
     */
    function confirmOrderEditCtrl2($scope, modal,alertWarn,requestData,alertOk,alertError) {
      // 保存type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/invoicesOrder/query.html');
         return;
       }

       if ($scope.submitForm_type == 'submit') {
         var url='rest/authen/confirmOrder/updateStatus';
         var data= {id:$scope.formData.id,orderStatus:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
            //  alertOk(_data.message || '操作成功');
             $scope.goTo('#/confirmOrder/confirm-order.html?id='+$scope.formData.id);

           })
           .catch(function (error) {
             alertError(error || '出错');
           });


        }

      };

      // 保存type:save-草稿,submit-提交订单。
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
        $('#' + fromId).trigger('submit');

      };
      // function jishuzongjia(){
      //     jishuzongjia1();
      //         jishuzongjia2();
      // }



    }

    /**
     * [ConfirmOrderMedicalController 新版销售单药品列表行控制器]
     * @param {[type]} $scope [description]
     */
    function ConfirmOrderMedicalController ($scope) {



      // 当用户选择某条目的生产批号后，将该条目设置为已选择状态
      $scope.choiseProductionBatch = function (item,stockBatchsItem,selectData) {
        if(stockBatchsItem&&!stockBatchsItem.quantity){
                //库存批次数量，满足则数量设置为计划数量。
                if(!item.quantity)item.quantity=0;

                stockBatchsItem.quantity=item.planQuantity-item.quantity;

                if(selectData&&selectData.note&&selectData.note.salesQuantity){
                  //批次库存不满足计划销售数量
                  if(stockBatchsItem.quantity>selectData.note.salesQuantity){
                    stockBatchsItem.quantity= selectData.note.salesQuantity;

                  }
                }else{//未获取到批次数量
                  stockBatchsItem.quantity=null;
                }

        }

      };

      //监听批次销售数量变化。
      $scope.$watch('item.stockBatchs', function (newVal,oldVal) {
              console.log("item.stockBatchs");
              console.log(newVal);
              var item=$scope.item;
              item.quantity=0;//根据批次的销售数量，计算销售的总数量。
              //记录批次中是否有空的数量没填写，没有则根据，批次总数量，不满足销售单计划数量时，自动添加新的库存下拉选择
              var hasStockBatchsQuantityEmpty=false;
              if(!newVal)newVal=[];
              var noSelectproductionBatchValIndex=-1;
              for(var i=0;i<newVal.length;i++){
                if(!newVal[i].productionBatch){
                  newVal[i].quantity=0;
                  noSelectproductionBatchValIndex=i;
                }
                if(newVal[i].quantity){
                    item.quantity+=newVal[i].quantity;
                }

              }


              if(item.quantity<item.planQuantity){//批次总数量，不满足销售单计划数量时，自动添加新的库存下拉选择
                if(noSelectproductionBatchValIndex==-1){
                    item.stockBatchs.push({});
                }
              }else{//数量选择够了后，删除未选择批号的数据

                  if(noSelectproductionBatchValIndex>-1){
                      item.stockBatchs.splice(noSelectproductionBatchValIndex,1);
                  }

              }

      },true);//$scope.$watch

      // 监视条目状态，如果改变为真，则将该条目加入到formData对象的orderMedicalNos数组中
      // $scope.$watch('isAddItemData', function () {
      //   if ($scope.isAddItemData) {
      //     $scope.formData.orderMedicalNos.push($scope.orderMedicalNosList[$scope.$index]);
      //   } else {
      //     $scope.formData.orderMedicalNos.splice($scope.$index,1);
      //   }
      // });
    }

    /**
     *出库单
     */
    function invoicesOrderCtrl($scope, modal,alertWarn,requestData,alertOk,alertError) {

      //快递保存后
      $scope.kuaidiSaveAfter = function(kuaidi) {
          modal.closeAll();
        if(!kuaidi)return;
        if(!$scope.showData.kuaidiSet)$scope.showData.kuaidiSet=[];
        var arr=$scope.showData.kuaidiSet;

        for(var i=0;i<arr.length;i++){//有匹配就更新。
           if(arr[i].id==kuaidi.id){
             arr[i]=kuaidi;
             return;
           }
        }
       arr.push(kuaidi);//新建
     };//kuaidiSaveAfter


       /**
       *保存
       type:save-草稿,submit-提交订单。
       */
       $scope.deleteKuaidi = function(kuaidi,invoicesOrderId) {
         var url='rest/authen/invoicesOrder/kuaidi/delete';
         var data= {kuaidiId:kuaidi.id,invoicesOrderId:invoicesOrderId};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
             alertOk(_data.message || '操作成功');
             var arr=$scope.showData.kuaidiSet;
             for(var i=0;i<arr.length;i++){//有匹配就更新。
                if(arr[i].id==kuaidi.id){
                  arr.splice(i,1);
                  return;
                }
             }

           })
           .catch(function (error) {
             alertError(error || '出错');
           });
         };//deleteKuaidi
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitFormAfter = function() {


          if ($scope.submitForm_type == 'exit') {
            $scope.goTo('#/invoicesOrder/query.html');
           return;
         }


       if ($scope.submitForm_type == 'submit') {
         var url='rest/authen/invoicesOrder/updateStatus';
         var data= {id:$scope.formData.id,status:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];

             $scope.goTo('#/invoicesOrder/order-done.html?id='+$scope.formData.id);

           })
           .catch(function (error) {
             alertError(error || '出错');
           });


        }

      };

      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
        $('#' + fromId).trigger('submit');

      };
    }

    /**
     *站内消息
     */
    function noticeCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.noticeClick = function(notice) {

          requestRead(notice.id,notice);

          notice.readFlag=true;
        if($scope.scopeResponse&&$scope.scopeResponse.totalCount)$scope.scopeResponse.totalCount--;
          if (!(notice.moduleType&&notice.relId)){
              alertOk(notice.subject);
              return;
          }
              //相应跳转
            window.location.assign('#/'+notice.moduleType+'/get.html?id='+notice.relId);


       };//noticeClick

       //启动消息定时获取
       $rootScope.startGetMsg = function(){
           if(Config.stopIntervalNotice===true){
              return;
           }
           if($rootScope.startGetMsgObj)return;
             $rootScope.startGetMsgObj=$interval(function(){
                $rootScope.noticeRefreshTime=new Date().getTime();
             }, 10000);
         };
          $rootScope.startGetMsg();

       //标记已经阅读。
       requestRead = function(id,notice) {
         var url='rest/authen/notice/read';
         var data= {id:id};
         requestData(url,data, 'POST')
           .then(function (results) {

           })
           .catch(function (error) {

           });
       };//end $scope.requestRead

     }//noticeCtrl

     /**
      *编辑、新建采购单
      */
     function purchaseOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange) {
         modal.closeAll();
         // $scope.formData={};
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


         /**
         * 添加一条。并缓存数据。
         */
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
         /**
         * 添加一条。并缓存数据。
         */
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

         /**
         *保存
         type:save-草稿,submit-提交订单。
         */
         $scope.submitFormAfter = function() {

             $scope.formData.validFlag = false;

           if ($scope.submitForm_type == 'exit') {
             $scope.goTo('#/purchaseOrder/query.html');
            return;
          }
           if ($scope.submitForm_type == 'submit') {
             var url='rest/authen/purchaseOrder/updateStatus';
             var data= {id:$scope.formData.id,status:'待审批'};
             requestData(url,data, 'POST')
               .then(function (results) {
                 var _data = results[1];
                //  alertOk(_data.message || '操作成功');
                 $scope.goTo('#/purchaseOrder/confirm-order-done.html?id='+$scope.formData.id);

               })
               .catch(function (error) {
                 alertError(error || '出错');
               });
           }

         };

         /**
         *保存
         type:save-草稿,submit-提交订单。
         */
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
         /**
          *取消订单
          */
         $scope.cancelForm = function(fromId, url) {
             alertWarn('cancelForm');
         };


          $scope.watchFormChange=function(watchName){
            watchFormChange(watchName,$scope);
          };

     }//end salesOrderEditCtrl

     /**
      *用户审核
      */
     function auditUserApplyOrganizationCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,proLoading) {

       /**
       获取选择的用户对象，用于显示人名
       */
       $scope.getCheckUserApplyArr = function(arr,ids) {

         //
         var data=[];
          if(!ids||ids.length===0){
            return data;
          }
          for(var i=0;i<arr.length;i++){
            if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                      data.push(arr[i]);
            }
          }
            return data;
        };
       /**
       *保存
       type:save-草稿,submit-提交订单。
       */
       $scope.batchAuditUserApplyOrganization = function(arr,ids,status,key,message) {
          if(!ids||ids.length===0){
            alertWarn('请先勾选');
            return;
          }
          //
          var data=[];
          for(var i=0;i<arr.length;i++){

            if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                      arr[i].formData.status=status;
                      arr[i].formData.key=key;
                      arr[i].formData.message=message;
                      data.push(arr[i].formData);
            }
          }


          var url='rest/authen/distributor/batchAuditUserApplyOrganization';


          var  maskObj=proLoading();

          requestData(url,data, 'POST',true)
            .then(function (results) {
                     if(maskObj)maskObj.hide();
                      alertOk(results[1].msg);
                    $scope.$broadcast('reloadList');
                      $scope.$emit('reloadList');
                      modal.close();

            })
            .catch(function (error) {
              if(maskObj)maskObj.hide();
                modal.close();
               alertWarn(error);


            });

        };//batchAuditUserApplyOrganization

        //启动消息定时获取
        $rootScope.startGetMsg = function(){
            if($rootScope.startGetMsgObj)return;
              $rootScope.startGetMsgObj=$interval(function(){
                 $rootScope.noticeRefreshTime=new Date().getTime();
              }, 10000);
          };
           $rootScope.startGetMsg();

        //标记已经阅读。
        requestRead = function(id,notice) {
          var url='rest/authen/notice/read';
          var data= {id:id};
          requestData(url,data, 'POST')
            .then(function (results) {

            })
            .catch(function (error) {

            });
        };//end $scope.requestRead

      }//auditUserApplyOrganizationCtrl


      /**
       *站内消息
       */
      function watchFormCtrl($scope, watchFormChange) {
        $scope.watchFormChange=function(watchName){
          watchFormChange(watchName,$scope);
        };


       }//watchFormCtrl


       /**
        * 定时任务ctrl
        */
       function intervalCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {

      }//intervalCtrl


    function QualificationApplyCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;

         if ($scope.submitForm_type == 'submit') {
           $scope.formData.validFlag = true;
         }
        $('#' + fromId).trigger('submit');
      };

      $scope.submitFormAfter = function (_url) {
        if ($scope.submitForm_type === 'submit') {
          $scope.goTo(_url + '?id=' + $scope.formData.id);
        }
      };

      //判断当前审核意见是否可见
      $scope.showAuditOpinion = function (returnArr, pipeKey) {
        if (angular.isArray(returnArr)) {
          var i, len;
          len = returnArr.length;
          for (i = 0; i < len; i++) {
            if (returnArr[i].event.status !== pipeKey) {
              return true;
            }
          }
          return false;
        }
      };

      //医院采购目录医院添加单条药品信息
      $scope.addMedicinalDataItem = function (hospitalId) {

        // $scope.responseBody = {};

        // if (id) {
        //   $scope.responseBody.hospitalPurchaseContentsId = id;
        // }

            if (!$scope.medical||!$scope.medical.id) {
                alertWarn("请选择药械");
                return;

            }

          var formData = $.extend(true,{},$scope.medical);

          //处理药品内信息id和copyId，以区分新建和编辑
          formData.hospitalId = hospitalId;
          formData.relId = $scope.medical.id;
          formData.id = null;
          formData.purchasePrice = formData.price;

        requestData('rest/authen/hospitalPurchaseMedical/save', formData, 'POST', 'parameterBody')
        .then(function (results) {
          if (results[1].code === 200) {
            // utils.goTo('#/hospitalPurchaseContents/get.html?id='+hospitalId);
            $scope.$broadcast('reloadList');
          } else {
            alertError('出错!');
          }
        })
        .catch(function (error) {
           alertError('此药械已添加');
        });
      };

      // 首营品种新建页面用户输入零售价大于牌价的提示
      $scope.chkQuoteAndRetail = function () {
        if ($scope.formData.firstMedical.quoteprice) {
          $scope.$watch($scope.formData.firstMedical.retailPrice, function () {
            if (parseInt($scope.formData.firstMedical.retailPrice) > parseInt($scope.formData.firstMedical.quoteprice)) {
              alertWarn('当前输入的零售价大于输入的牌价!');
            }
          });
        }
      };
    }

    /**
     * 编辑工作流
     */
    function editWorkFlowProcessCtrl ($scope, modal, alertWarn, requestData, alertOk, alertError, $rootScope) {
      // 切换button顺序
      $scope.switchButtons = function(buttons,ind,ind2) {
        var tmp=buttons[ind];
        buttons[ind]=buttons[ind2];
        buttons[ind2]=tmp;

      };

      // 保存节点信息（新建or创建）
      $scope.addEventButtons = function(formData1) {
        if(!formData1)formData1={};
        if(!formData1.didateFilter)formData1.didateFilter={};
        if(!formData1.didateFilter.buttons)formData1.didateFilter.buttons=[];
        var btnForm = {
          type: '通过',
          buttonName: '审核通过',
          requestMethod: 'POST',
          conditionType:'通过',
          requestParam: 'KeyValue',
          requestUrl : 'rest/authen/workflowTask/run.json'
        };
        formData1.didateFilter.buttons.push(btnForm);
      };

      // 保存节点信息（新建or创建）
      $scope.saveEvent = function(event1) {
        if(!$scope.formData.events)$scope.formData.events=[];
        var events=$scope.formData.events;
        var isInsert=true;
        //防止'' 保存到后台,枚举报错bug.
        if(!event1.conditionType)event1.conditionType=null;
        if(event1.id){
            var ind=$rootScope.utils.getObjectIndexByKeyOfArr(events,'id',event1.id);
              event1.id=event1.name;
            if(ind>-1){
                events[ind]=event1;

                isInsert=false;
            }
        }

        if(isInsert){

              event1.id=event1.name;
             events.push(event1);
        }

        console.log(event1);

        if($scope.scopeExtend&&$scope.scopeExtend.workflow){
          $scope.scopeExtend.workflow.reload();
        }
        modal.closeAll();
      };

      // 删除节点信息（新建or创建）
      $scope.deleteEvent = function(id) {
        if(!$scope.formData.events)$scope.formData.events=[];
          var events=$scope.formData.events;
        var index=$rootScope.utils.removeObjectByKeyOfArr(events,'id',id);
        if(index<0){
            alertError('没有该节点，id='+event1.id);
            return;
        }
        if($scope.scopeExtend&&$scope.scopeExtend.workflow){
          $scope.scopeExtend.workflow.reload();
        }

          modal.closeAll();
      };

    }

    /**
     * [新版购需单商品条目控制器]
     * @param {[type]} $scope [依赖项]
     */
    function SalesOrderDetailsController ($scope, $timeout) {
      // 监视折扣额
      $scope.$watch('tr.discountPrice', function (newValue) {
        $scope.tr.discountRate = parseInt(($scope.tr.price - $scope.tr.discountPrice) / $scope.tr.price * 100);
      });
      // 监视折扣率
      $scope.$watch('tr.discountRate', function (newValue) {
        $scope.tr.discountPrice = ($scope.tr.price * (1 - newValue / 100)).toFixed(2);
      });
    }

    angular.module('manageApp.project')
    .controller('ConfirmOrderMedicalController', ['$scope', ConfirmOrderMedicalController])
    .controller('confirmOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', confirmOrderEditCtrl])
    .controller('confirmOrderEditCtrl2', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', confirmOrderEditCtrl2])
    .controller('SalesOrderDetailsController', ['$scope', '$timeout', SalesOrderDetailsController])
    .controller('editWorkFlowProcessCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', '$rootScope', editWorkFlowProcessCtrl])
    .controller('QualificationApplyCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', QualificationApplyCtrl])
    .controller('watchFormCtrl', ['$scope','watchFormChange', watchFormCtrl])
    .controller('intervalCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', intervalCtrl])
    .controller('auditUserApplyOrganizationCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','proLoading', auditUserApplyOrganizationCtrl])
    .controller('purchaseOrderEditCtrl', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', purchaseOrderEditCtrl])
    .controller('noticeCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', noticeCtrl])
    .controller('invoicesOrderCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError', invoicesOrderCtrl])
    .controller('salesOrderEditCtrl2', ['$scope', 'modal','alertWarn','watchFormChange', 'requestData', salesOrderEditCtrl2])
    .controller('salesOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', salesOrderEditCtrl])
    .controller('freezeThawOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', freezeThawOrderEditCtrl])
    .controller('lossOverOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', lossOverOrderEditCtrl]);
});
