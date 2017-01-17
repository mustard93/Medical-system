/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init'], function() {




      /**
       * 主控（业务模块级别）
       */
      function mainCtrlProject($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,bottomButtonList,saleOrderUtils) {

        //底部菜单（业务相关）
        $rootScope.bottomButtonList=bottomButtonList;
        $rootScope.saleOrderUtils=saleOrderUtils;

      }

    /**
     * 主控
     */
    function dynamicHtmlTemplateCtrl($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable) {

    }
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

        modal.closeAll();
        // $scope.formData={};
        $scope.addDataItem = {};

        // 监视表单内子项目变化
        $scope.watchFormChange=function(watchName){
          watchFormChange(watchName,$scope);
        };

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

          if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
            alertWarn("请选择药品");
            return ;
          }
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
                $scope.goTo('#/confirmOrder/edit-from-salesOrder.html?id='+_data.confirmOrder.id);

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

          if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
            alertWarn("请选择药品");
            return ;
          }
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
          if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
            alertWarn("请选择药品");
            return ;
          }
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
      $scope.watchFormChange = function (watchName) {
        watchFormChange(watchName,$scope);
      };

      // 保存type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {
        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/invoicesOrder/query.html');
         return;
       }else   if ($scope.submitForm_type == 'print') {
         var url="indexOfPrint.html#/print/confirmOrderPrint.html?id="+$scope.formData.id;
           win1=window.open(url);

          if(!win1||!win1.location){
              alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
          }

          return;
        }


       if ($scope.submitForm_type == 'submit') {
         var url='rest/authen/confirmOrder/updateStatus';
         var data= {id:$scope.formData.id,status:'待发单'};
         requestData(url, data, 'POST')
           .then(function (results) {
             var _data = results[1];
            //  alertOk(_data.message || '操作成功');
             $scope.goTo('#/confirmOrder/get.html?id='+$scope.formData.id);

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


      //获取一个药械，已经选中的批次，返回成数组格式，用于同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
      //用于chosen 回调过滤数据用。
      $scope.getProductionBatchValueArray = function (stockBatchs) {
          var arr=[];
          if(!stockBatchs)return arr;
          for(var i=0;i<stockBatchs.length;i++){
              arr.push(stockBatchs[i].productionBatch);
          }
          return arr;
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
    function confirmOrderEditCtrl2($scope, modal, alertWarn, requestData, alertOk, alertError, watchFormChange) {

      $scope.watchFormChange = function (watchName) {
        watchFormChange(watchName,$scope);
      };

      // 保存type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {
        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/invoicesOrder/query.html');
         return;
       }else   if ($scope.submitForm_type == 'print') {
         var url="indexOfPrint.html#/print/confirmOrderPrint.html?id="+$scope.formData.id;
           win1=window.open(url);

          if(!win1||!win1.location){
              alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
          }

          return;
        }


       if ($scope.submitForm_type == 'submit') {
         var url='rest/authen/confirmOrder/updateStatus';
         var data= {id:$scope.formData.id,status:'待发单'};
         requestData(url, data, 'POST')
           .then(function (results) {
             var _data = results[1];
            //  alertOk(_data.message || '操作成功');
             $scope.goTo('#/confirmOrder/get.html?id='+$scope.formData.id);

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

      //获取一个药械，已经选中的批次，返回成数组格式，用于同一批次只能选择一次.过滤掉要已已经选过的数据。当前选中的批次不过滤。
      //用于chosen 回调过滤数据用。
      $scope.getProductionBatchValueArray = function (stockBatchs) {
          var arr=[];
          if(!stockBatchs)return arr;
          for(var i=0;i<stockBatchs.length;i++){
              arr.push(stockBatchs[i].productionBatch);
          }
          return arr;
      };

    }//confirmOrderEditCtrl2

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

          if(selectData){
              if(!selectData.note)selectData.note={};
              if(!selectData.note.salesQuantity)selectData.note.salesQuantity=0;
          }

          if(selectData&&selectData.note&&selectData.note.salesQuantity){

            //批次库存不满足计划销售数量
            if(stockBatchsItem.quantity>selectData.note.salesQuantity){
              stockBatchsItem.quantity= selectData.note.salesQuantity;
              $scope.item.handleFlag=true;
            }
          }else{//未获取到批次数量
            stockBatchsItem.quantity=null;
          }
        }


      };

      //监听批次销售数量变化。
      $scope.$watch('item.stockBatchs', function (newVal,oldVal) {
              // console.log("item.stockBatchs");
              // console.log(newVal);
              var item=$scope.item;
              item.quantity=0;//根据批次的销售数量，计算销售的总数量。
              //记录批次中是否有空的数量没填写，没有则根据，批次总数量，不满足销售单计划数量时，自动添加新的库存下拉选择

              if(!newVal)newVal=[{}];

              //记录添加新的批号选择下拉框的索引号。
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

              if(item.quantity>0)item.handleFlag=true;
      },true);
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



       //刷新未读消息通知
       function refreshNotice(){
           $rootScope.noticeRefreshTime=new Date().getTime();
       }

       //启动消息定时获取未读消息通知
       $rootScope.startGetMsg = function(){
           if(Config.stopIntervalNotice===true){
              return;
           }
           if($rootScope.startGetMsgObj)return;
             $rootScope.startGetMsgObj=$interval(function(){
               refreshNotice();
             }, 10000);
         };
          $rootScope.startGetMsg();

       //标记已经阅读。
       requestRead = function(id,notice) {
         var url='rest/authen/notice/read';
         var data= {id:id};
         requestData(url,data, 'POST')
           .then(function (results) {
               refreshNotice();
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
          $scope.scopeExtend.workflow.reload($scope.formData);
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
 * [报损报溢批次冻结解冻模块选择生产批号/灭菌批号后显示生产日期和失效日期]
 */

/**
 * [getCurrentProductionDate 根据药品id和批号查询生产日期和失效日期]
 * @param  {[type]} relMedicalStockId [药品id]
 * @param  {[type]} p_and_s           [生产批号/灭菌批号]
 */
function SalesOrderDetailsController ($scope, $timeout, alertOk, alertError, requestData) {

  $scope.getCurrentProductionDate = function (relMedicalStockId,p_and_s) {

    if (relMedicalStockId && p_and_s) {
      var url='rest/authen/medicalStock/getStockBatch?relMedicalStockId='+relMedicalStockId+'&p_and_s='+p_and_s;
      var data= {};
      requestData(url,data,'get')
        .then(function (results) {
          var _data = results[1];
        // 根据药品id和批号查询到的生产日期和失效日期赋给对应字段以供页面显示
        $scope.tr.productionDate =_data.data.productionDate;
        $scope.tr.validTill =_data.data.validTill;
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    }
  };

}

    /**
     * [deleteUploaderController 删除上传的附件]
     */
    function deleteUploaderController($scope, $timeout, alertOk, alertError, requestData){
      $scope.deleteUploader = function (_key) {

        if (_key) {
          var url='rest/authen/fileUpload/delete';
          var data= {key:_key};
          requestData(url,data,'post')
            .then(function (results) {

            })
            .catch(function (error) {
              alertError(error || '出错');
            });

        }
      };
    }



    /**
     * [MedicalStockController 库存明细查询模块控制器]
     * @param {[type]} $scope   [description]
     * @param {[type]} $timeout [description]
     */
    function MedicalStockController ($scope, $timeout) {

    }

    /**
     * [CalculateTotalController 数据表格内计算各列和]
     * @param {[type]} $scope [description]
     */
    function CalculateTotalController ($scope) {

    }

    /**
     * [PurchasePayOrderController 付款申请单模块控制器]
     * @param {[type]} $scope [description]
     */
    function PurchasePayOrderController ($scope) {

    }

    /**
     * [ScreenFinanceApprovalController 财务审批模块中queyr页面获取当前财务审批人]
     * @param {[type]} $scope [description]
     */
    function ScreenFinanceApprovalController ($scope) {
      if ($scope.tr.operationFlowSet) {
        // 获取当前订单状态
        // var _status = $scope.tr.orderStatus;
        // 查找流程数组里符合当前订单状态的
        angular.forEach($scope.tr.operationFlowSet, function (item, index) {
          if(item.status === '待付款') {
            $scope.tr.approvalPayUser = item;
          }
        });
      }
    }
    /**
    /**
     * 销售退货
     */
    function saleReturnOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData, $rootScope,alertOk) {

      $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
      };

      modal.closeAll();
      // $scope.formData={};
      $scope.addDataItem = {};

      // 保存  type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function(scopeResponse) {

        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/saleReturnOrder/query.html');
          alertOk(scopeResponse.msg);
          return;
        }

        if ($scope.submitForm_type == 'submit') {

          var url='rest/authen/saleReturnOrder/updateStatus';
          var data= {id:$scope.formData.id,status:'待出库'};

          requestData(url, data, 'POST')
            .then(function (results) {
              if (results[1].code !== 200) {
                alertWarn(results[1].msg || '未知错误!');
              } else {
                $scope.goTo('#/saleReturnOrder/get-pinBack.html?id='+$scope.formData.id);
              }
            })
            .catch(function (error) {
              if (error) {
                alertWarn(error || '未知错误!');
                return;
              }
            });


            return;
        }

        if ($scope.submitForm_type == 'save') {
          if (scopeResponse) {
            alertOk(scopeResponse.msg);
          }
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

      //
      $scope.$watch('addDataObj', function (newVal) {
        if (newVal && $scope.formData) {
          $scope.formData.relId = $scope.addDataObj.id;
          $scope.formData.orderMedicalNos = angular.copy($scope.addDataObj.choisedMedicalList);
        }
      }, true);
    }

    /**
     * [saleReturnOrderAddController 销售退货单弹出模态框添加项目控制器]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    function saleReturnOrderAddController ($scope, $rootScope, modal) {

      // 单个药品点击添加与取消添加事件处理
      $scope.handleItemClickEvent = function (item) {

        var _dataSource = $scope.addDataObj.data.orderMedicalNos;

        if (!$scope.addDataObj.choisedMedicalList) {
          $scope.addDataObj.choisedMedicalList = [];
        }

        if (item.itemSelected) {
          $scope.addDataObj.choisedMedicalList.push(item);
          if ($scope.addDataObj.choisedMedicalList.length === _dataSource.length) {
            $scope.isChoiseAll = true;
          }
        } else {
          angular.forEach($scope.addDataObj.choisedMedicalList, function (data, index) {
            if (data.relId === item.relId) {
              $scope.addDataObj.choisedMedicalList.splice(index, 1);
            }
          });
          $scope.isChoiseAll = false;
        }
      };

      // 全选与全不选
      $scope.handleChoiseAllEvent = function () {
        var _dataSource = $scope.addDataObj.data.orderMedicalNos;

        if (!$scope.addDataObj.choisedMedicalList) {
          $scope.addDataObj.choisedMedicalList = [];
        }

        if ($scope.isChoiseAll) {
          angular.forEach(_dataSource, function (data, index) {
            data.itemSelected = true;
            $scope.addDataObj.choisedMedicalList.push(data);
          });
        } else  {
          angular.forEach(_dataSource, function (data, index) {
            data.itemSelected = false;
            $scope.addDataObj.choisedMedicalList = [];
          });
        }
      };

      // 添加选择项到编辑页
      $scope.handleAddDataArray = function () {
        if ($scope.addDataObj.choisedMedicalList) {
          $rootScope.addDataObj = angular.copy($scope.addDataObj);
          modal.closeAll();
        }
      };
    }

    /**
     * [saleReturnMedicalItemController 新建销退单药品列表tr控制器]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    function saleReturnMedicalItemController ($scope) {

      // 错误状态标识
      $scope.quantityError = false;

      // 监视值变化
      $scope.$watch('item.quantity', function (newVal) {

        if ($scope.item.outgoingQuantity && newVal > $scope.item.outgoingQuantity) {         // 如果解决这个wms返回数据的问题
          $scope.quantityError = true;
          $scope.$parent.$parent.quantityError = true;
        } else {                                    // 如果没有，使用planQuantity字段判断
          if ($scope.item.planQuantity) {
            if (newVal > $scope.item.planQuantity) {
              $scope.quantityError = true;
              $scope.$parent.$parent.quantityError = true;
            } else {
              $scope.quantityError = false;
              $scope.$parent.$parent.quantityError = false;
            }
          }
        }
      });
    }


    angular.module('manageApp.project')
    .controller('saleReturnMedicalItemController', ['$scope', saleReturnMedicalItemController])
    .controller('saleReturnOrderAddController', ["$scope", "$rootScope", "modal", saleReturnOrderAddController])
    .controller('mainCtrlProject',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils", mainCtrlProject])
    .controller('ScreenFinanceApprovalController', ['$scope', ScreenFinanceApprovalController])
    .controller('PurchasePayOrderController', ['$scope', PurchasePayOrderController])
    .controller('ConfirmOrderMedicalController', ['$scope', ConfirmOrderMedicalController])
    .controller('confirmOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', confirmOrderEditCtrl])
    .controller('confirmOrderEditCtrl2', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'watchFormChange', confirmOrderEditCtrl2])
    .controller('SalesOrderDetailsController', ['$scope', '$timeout', 'alertOk', 'alertError', 'requestData', SalesOrderDetailsController])
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
    .controller('lossOverOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', lossOverOrderEditCtrl])
    .controller('saleReturnOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', 'requestData', '$rootScope','alertOk', saleReturnOrderEditCtrl])
    .controller('MedicalStockController', ['$scope', '$timeout', MedicalStockController])
    .controller('CalculateTotalController', ['$scope', CalculateTotalController])
    .controller('deleteUploaderController', ['$scope', '$timeout', 'alertOk', 'alertError', 'requestData', deleteUploaderController]);
});
