/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init'], function() {


  /**
   * [saleReturnMedicalItemController 新建销退单药品列表tr控制器]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function imTaobaoCtr ($scope,requestData,alertError,$rootScope) {
    //弹出与某人聊天.toUserId 聊天 人的userid
    $scope.openIm=function(toUserId,toUserName){
      var imTaobaoUserInfo=  $rootScope.MyImTaobaoUserInfo;
      if(!imTaobaoUserInfo){//没有帐号就获取帐号
        imTaobaoUserInfo_getMy(function(){$scope.openIm(toUserId)});
        return ;
      }
      if(!toUserId)toUserId="";
      if(!toUserName)toUserName="";
      var param="?uid="+imTaobaoUserInfo.userid+"&to="+toUserId+"&toUserName="+toUserName+"&appkey=23588140&pwd="+imTaobaoUserInfo.password+"&fullscreen";
      window.open('imtaobao/kit.html'+param, 'webcall', 'toolbar=no, status=no,scrollbars=0,resizable=0,menubar＝0,location=0,width=700,height=530');

    };

    //获取我的聊天帐号信息
    function imTaobaoUserInfo_getMy(callback) {
      var url='rest/authen/imTaobaoUserInfo/getMy.json';
      requestData(url)
        .then(function (results) {
          var _data = results[0];
          $rootScope.MyImTaobaoUserInfo= results[0];
          if(callback){
            callback();
          }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    }//imTaobaoUserInfo_getMy



  }//imTaobaoCtr


  /**
   * 主控（业务模块级别）
   */
  function mainCtrlProject($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,bottomButtonList,saleOrderUtils,purchaseOrderUtils,requestPurchaseOrderUtils,queryItemCardButtonList,customMenuUtils) {

    //底部菜单（业务相关）
    $rootScope.bottomButtonList=bottomButtonList;
    $rootScope.saleOrderUtils=saleOrderUtils;
    $rootScope.purchaseOrderUtils=purchaseOrderUtils;
    $rootScope.requestPurchaseOrderUtils=requestPurchaseOrderUtils;
    $rootScope.queryItemCardButtonList=queryItemCardButtonList;
    $rootScope.customMenuUtils=customMenuUtils;

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

      // 是否显示关闭按钮
      $scope.isShowCancelBtn = false;

      $scope.$watch('initFlag', function (newVal) {
         //发送请求判断当前订单状态是否可显示关闭按钮
         if (newVal) {
           var _url = 'rest/authen/salesOrder/isCanClose?id=' + $scope.formData.id;
           requestData(_url, {}, 'get')
           .then(function (results) {
             if (results[1].code === 200) {
               $scope.isShowCancelBtn = true;
             }
           })
           .catch(function (error) {
            //  if (error) {
            //    alertError(error);
            //  }
           });
         }
      });

      $scope.$watch('formData.customerId', function (newVal, oldVal) {
        if (newVal && oldVal && oldVal !== newVal) {
          document.getElementById('angucompleteMedical_searchInputId').focus();
          //清空用户先前的药械选择
          if ($scope.formData.orderMedicalNos.length !== 0) { $scope.formData.orderMedicalNos = []; }
        }
      });

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
            addDataItem.discountPrice='0';
            addDataItem.discountRate='100';
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
            for (var i=0; i<_len; i++) {
              if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                alertWarn('此药械已添加到列表');
                return false;
              }
            }
          }

          // 添加药品后请求当前药品的历史价格
          if (addDataItem) {
            var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售',
                _data = {};

            requestData(_url, _data, 'GET')
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
          var _url = 'rest/authen/salesOrder/isCanClose?id=' + $scope.formData.id;
          requestData(_url, {}, 'get')
          .then(function (results) {
            if (results[1].code === 200) {
              $scope.isShowCancelBtn = true;
            }
          })
          .catch(function (error) {

          });
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

      if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
        alertWarn("请选择药品");
        return ;
      }
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

    // 取消删除表格中一条数据
    $scope.hideThisBtn = function () {
      // console.log($element);
      $('.sales-order-item-delbtn').hide();
      $scope.showHandleArea = false;
    };

  }

  /**
   *  批次冻结解冻模块
   */
  function freezeThawOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData) {

      $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
      };
      $scope.$watch('initFlag', function () {
        var operationFlowSetMessage=[];
        var operationFlowSetKey=[];
        if ($scope.showData) {
          // 选择出当前状态相同的驳回理由，并放入一个数组中
         for (var i=0; i<$scope.showData.operationFlowSet.length; i++) {
           if ($scope.showData.operationFlowSet[i].status==$scope.showData.orderStatus) {
             operationFlowSetMessage.push($scope.showData.operationFlowSet[i].message);
             operationFlowSetKey.push($scope.showData.operationFlowSet[i].key);
           }
         }
        //  选择当前状态最近的一个驳回理由用于显示
         $scope.showData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
         $scope.showData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
         return;
        }

      });

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
            addDataItem.discountPrice='0';
            addDataItem.discountRate='100';
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
      // 取消删除表格中一条数据
      $scope.hideThisBtn = function () {
        // console.log($element);
        $('.sales-order-item-delbtn').hide();
        $scope.showHandleArea = false;
      };

  }

  /**
   *  销售单编辑页
   */
  function confirmOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError, dialogConfirm) {

    $scope.logistics=true;
    $scope.isShowConfirmInfo = false;

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
          $scope.isShowConfirmInfo = (_total < $scope.formData.orderMedicalNos[index].planQuantity && _total !== 0) ? true : false;

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
     }
     else   if ($scope.submitForm_type == 'print') {
       var url="indexOfPrint.html#/print/index.html?key=confirmOrderPrint&id="+$scope.formData.id;
         win1=window.open(url);

        if(!win1||!win1.location){
            alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
        }

        return;
      }


     if ($scope.submitForm_type == 'submit') {
       var _url='rest/authen/confirmOrder/startProcessInstance';
       var data= {businessKey:$scope.formData.id};
       requestData(_url, data, 'POST')
         .then(function (results) {
           var _data = results[1];
          //  alertOk(_data.message || '操作成功');
           $scope.goTo('#/confirmOrder/get.html?id='+$scope.formData.id);

         })
         .catch(function (error) {
           alertError(error || '出错');
         });
      }
     if ($scope.submitForm_type == 'submit-allocate') {
       var _url='rest/authen/allocateOrder/startProcessInstance';
       var data= {businessKey:$scope.formData.id};
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
        return ;
      }

      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      addDataItem.relId=medical.id;
      addDataItem.discountPrice='0';
      addDataItem.discountRate='100';
      addDataItem.strike_price=addDataItem.price;
      addDataItem.id=null;
      addDataItem.logistics=true;

      if (!addDataItem.planQuantity) {
        addDataItem.planQuantity = flashAddData.quantity;
      }

      if (!(addDataItem.relId && addDataItem.name)) {
          alertWarn('请选择药品。');
          return false;
      }
      if (!flashAddData.quantity||flashAddData.quantity<1) {
          alertWarn('请输入大于0的数量。');
          return false;
      }
      if(addDataItem.planQuantity>medical.quantity){//库存不足情况
          addDataItem.handleFlag =false;//默认添加到订单
      }
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

      //添加到列表
      $scope.formData.orderMedicalNos.push(addDataItem);
      //计算价格
      $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.planQuantity;
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
            _total += item.planQuantity * item.strike_price * (item.discountRate / 100);
          }
        });
        $scope.formData.totalPrice = _total;
      }
    };

    // 切换物流中心时提示用户，在用户选择确定后将已选择品种的批次清空
    $scope.$watch('formData.logisticsCenterId', function (newVal, oldVal) {
      if (newVal && oldVal && newVal !== oldVal) {
        dialogConfirm('切换物流中心后,所有批号信息需要重新选择.确认切换?', function () {
          // 将已选药品的批次选择清空
          if ($scope.formData.orderMedicalNos) {
            angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
              data.stockBatchs = [];
            });
          }
        },'pr-dialog-confirm.html','确认提示','确定');
      }
    });
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
  function confirmOrderEditCtrl2($scope, modal, alertWarn, requestData, alertOk, alertError, watchFormChange, saleOrderUtils) {

    $scope.$watch('initFlag', function () {
      var operationFlowSetMessage=[];
      var operationFlowSetKey=[];
      if ($scope.scopeData) {
        // 选择出当前状态相同的驳回理由，并放入一个数组中
       for (var i=0; i<$scope.scopeData.operationFlowSet.length; i++) {
         if ($scope.scopeData.operationFlowSet[i].status==$scope.scopeData.orderStatus) {
           operationFlowSetMessage.push($scope.scopeData.operationFlowSet[i].message);
           operationFlowSetKey.push($scope.scopeData.operationFlowSet[i].key);
         }
       }
      //  选择当前状态最近的一个驳回理由用于显示
       $scope.scopeData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
       $scope.scopeData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
       return;
      }
    });

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
        var _url='rest/authen/confirmOrder/startProcessInstance';
        var data= {businessKey:$scope.formData.id};
        requestData(_url, data, 'POST')
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
    // $scope.submitForm = function(fromId, type) {
    //   $scope.submitForm_type = type;
    //   if ($scope.submitForm_type == 'save') {
    //     $scope.formData.validFlag = false;
    //   }
    //   $('#' + fromId).trigger('submit');
    // };
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

    // 处理单选条目时是否自动选中全选复选框
    $scope.handleThischoise = function (item) {
      //检查药品列表是否被全部选中
      var _choiseCount = 0;
      if (item.handleFlag) {      // 点击选中
        angular.forEach($scope.orderMedicalNos, function (data, index) {
          if (data.handleFlag === true) { _choiseCount++; }
        });

        $scope.choiseStatus = ($scope.orderMedicalNos.length === _choiseCount) ? true : false;

      } else {      // 取消选中
        $scope.choiseStatus = false;
      }
    };

    // ..
    $scope.chkIsChoiseAll = function () {
      var _count  = 0;
      angular.forEach($scope.orderMedicalNos, function (data, index) {
        console.log(data.handleFlag);
        if (data.handleFlag === true) { _count++; }
      });

      $scope.choiseStatus = ($scope.orderMedicalNos.length === _count) ? true : false;
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

    //计算总价


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

    // 监听批次销售数量变化。
    $scope.$watch('item.stockBatchs', function (newVal,oldVal) {
      if (newVal !== undefined) {
        var item=$scope.item;
        item.quantity=0;//根据批次的销售数量，计算销售的总数量。
        //记录批次中是否有空的数量没填写，没有则根据，批次总数量，不满足销售单计划数量时，自动添加新的库存下拉选择

        if(!newVal)newVal=[{}];

        //记录添加新的批号选择下拉框的索引号。
        var noSelectproductionBatchValIndex=-1;
        for(var i=0;i<newVal.length;i++){
          if(!newVal[i].batchNumber){
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

        if (item.quantity > 0) { item.handleFlag = true; }

      }
    },true);

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

  }

  /**
   *出库单
   */
  function invoicesOrderCtrl($scope, modal,alertWarn,requestData,alertOk,alertError, $timeout) {
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
    };

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

    $scope.submitForm = function(fromId, type) {
       $scope.submitForm_type = type;
      $('#' + fromId).trigger('submit');

    };

    // 监视用户输入备注信息，当用户输入修改后1秒自动保存用户修改
    // $scope.$watch('scopeData.note', function (newVal, oldVal) {
    //   if (newVal && (oldVal!==undefined)) {
    //     $timeout(function () {
    //       var _url = "rest/authen/invoicesOrder/save",
    //           _data = $scope.scopeData;
    //       requestData(_url, _data, 'POST', 'parameterBody')
    //       .then(function (results) {
    //         if (results[1].code === 200) {
    //           $scope.showSaveNoteInfo = true;
    //         }
    //       })
    //       .catch(function (error) {
    //         if (error) { throw new Error(error || '出错!'); }
    //       });
    //     }, 1000);
    //   }
    // });

    // 监视备注提示信息，显示后1秒自动隐藏
    // $scope.$watch('showSaveNoteInfo', function (newVal) {
    //   if (newVal) {    // 如果信息显示了
    //     $timeout(function () {
    //       $scope.showSaveNoteInfo = false;
    //     }, 1500);
    //   }
    // });
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
   function arrivalNoticeOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange) {
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
           $scope.goTo('#/arrivalNoticeOrder/query.html');
          return;
        }
         if ($scope.submitForm_type == 'submit') {
           var url='rest/authen/arrivalNoticeOrder/updateStatus';
           var data= {id:$scope.formData.id,status:'待审核'};
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

   }//end salesOrderEditCtrl

  function purchaseOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange, dialogConfirm) {

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

    // 监控用户变化，清空之前选择药械列表
    $scope.$watch('formData.supplier.id', function (newVal, oldVal) {
      if (newVal && oldVal && oldVal !== newVal) {
        if ($scope.formData.orderMedicalNos.length !== 0) { $scope.formData.orderMedicalNos = []; }
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
         addDataItem.strick_price=addDataItem.purchasePrice;
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

         for (var i=0; i<_len; i++) {
           if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
             alertWarn('此药械已添加到列表');
             return false;
           }
         }
       }

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
    *保存 type:save-草稿,submit-提交订单。
    */
    $scope.submitFormAfter = function() {

      $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/purchaseOrder/query.html');
          return;
        }else if ($scope.submitForm_type == 'print') {
          var url="indexOfPrint.html#/print/index.html?key=purchaseVoucher&id="+$scope.formData.id;
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
    /**
    * 保 存 type:save-草稿,submit-提交订单。
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

    /**
     * [createPurVoBtnClick 点击生成采购凭证事件]
     * @param  {[type]} _id [当前采购单id]
     * @return {[type]}             [description]
     */
    $scope.createPurVoBtnClick = function (_id) {
      var url = 'rest/authen/purchaseVoucher/save';
      var data= {purchaseOrderId:_id};
      requestData(url,data, 'POST')
        .then(function (results) {
          var _data = results[1].data;
          console.log(_data);
          $scope.goTo('#/purchaseVoucher/get.html?id='+_data.id);
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    };

    /**
     * [handleMessageShow 将通过后的补充说明显示到备注里]
     * @return {[type]} [description]
     */
    $scope.handleMessageShow = function (obj) {
      if (obj.operationFlowSet) {
        // console.log(obj.operationFlowSet);
        angular.forEach(obj.operationFlowSet, function (item, index) {
          if (item.status === obj.orderStatus) { obj.note = item.key; }
        });
      }
    };

    // 监控计划采购数量与实际采购数量的方法
    $scope.diffPurchaseNumber = function (orderMedicalList) {
      if (orderMedicalList) {
        angular.forEach(orderMedicalList, function (data, index) {
          // 选择的数量小于计划数量，显示提示信息
          $scope.isShowPurchaseInfo = (data.planQuantity > data.quantity) ? true : false;
          // ..
          $scope.isDisabledNextStep = (data.quantity > data.planQuantity) ? true : false;

        });

      }
    };

    // 检查添加的供应商是否有地址信息，没有则弹出层跳转到维护地址
    $scope.chkSupplierInfo = function (supplier) {
      // console.log(supplier);
      if (!supplier.contact) {
        dialogConfirm('供应商地址信息不完整，请完善', function () {
          window.location.assign('#/supplier/edit-contact.html?id='+supplier.id);
        });
      }
    };

   }//end salesOrderEditCtrl

  function allocateOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange) {

    $scope.logistics=true;

    $scope.$watch('initFlag', function () {
      var operationFlowSetMessage=[];
      var operationFlowSetKey=[];
      if ($scope.tr.operationFlowSet) {
        // 选择出当前状态相同的驳回理由，并放入一个数组中
       for (var i=0; i<$scope.tr.operationFlowSet.length; i++) {
         if ($scope.tr.operationFlowSet[i].status==$scope.tr.orderStatus) {
           operationFlowSetMessage.push($scope.tr.operationFlowSet[i].message);
           operationFlowSetKey.push($scope.tr.operationFlowSet[i].key);
         }
       }
      //  选择当前状态最近的一个驳回理由用于显示
       $scope.tr.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
       $scope.tr.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
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
     }else   if ($scope.submitForm_type == 'print') {
       var url="indexOfPrint.html#/print/index.html?key=confirmOrderPrint&id="+$scope.formData.id;
         win1=window.open(url);

        if(!win1||!win1.location){
            alertError("被浏览器拦截了，请设置浏览器允许弹出窗口！");
        }

        return;
      }


     if ($scope.submitForm_type == 'submit') {
       var _url='rest/authen/confirmOrder/startProcessInstance';
       var data= {businessKey:$scope.formData.id};
       requestData(_url, data, 'POST')
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
        return ;
      }

      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      addDataItem.relId=medical.id;
      addDataItem.discountPrice='0';
      addDataItem.discountRate='100';
      addDataItem.strike_price=addDataItem.price;
      addDataItem.id=null;
      addDataItem.logistics=true;

      if (!addDataItem.planQuantity) {
        addDataItem.planQuantity = flashAddData.quantity;
      }

      if (!(addDataItem.relId && addDataItem.name)) {
          alertWarn('请选择药品。');
          return false;
      }
      if (!flashAddData.quantity||flashAddData.quantity<1) {
          alertWarn('请输入大于0的数量。');
          return false;
      }
      // if (!addDataItem.strike_price) {
      //     alertWarn('请输入成交价格。');
      //     return false;
      // }

      if(addDataItem.planQuantity>medical.quantity){//库存不足情况
          addDataItem.handleFlag =false;//默认添加到订单
      }

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

      // 添加药品后请求当前药品的历史价格
      if (addDataItem) {
        var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售',
            _data = {};

        requestData(_url, _data, 'GET')
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

      //添加到列表
      $scope.formData.orderMedicalNos.push(addDataItem);
      //计算价格
      $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.planQuantity;
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
            _total += item.planQuantity * item.strike_price * (item.discountRate / 100);
          }
        });
        $scope.formData.localTotalPrice = _total;
      }
    };

  }//end salesOrderEditCtrl


  /**
  * [requestPurchaseOrderEditCtrl 请购单控制器]
  * @param  {[type]} $scope          [description]
  * @param  {[type]} modal           [description]
  * @param  {[type]} alertWarn       [description]
  * @param  {[type]} alertError      [description]
  * @param  {[type]} requestData     [description]
  * @param  {[type]} watchFormChange [description]
  * @return {[type]}                 [description]
  */
  function requestPurchaseOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange, $timeout) {

    $scope.isShowCancelBtn = false;
    $scope.isGoNextStep = false;
    $scope.showSaveNoteInfo = false;    // 是否显示自动保存用户修改备注信息的提示

    //页面Loading时初始化数据
    $scope.$watch('initFlag', function (newVal) {

     // 初始化商品列表的状态为选中
    //  if (newVal && $scope.formData.orderMedicalNos) {
    //    for (var i=0; i<$scope.formData.orderMedicalNos.length; i++) {
    //      if ($scope.formData.orderMedicalNos[i].handleFlag) {
    //        $scope.choisedMedicals = true;
    //      }
    //      if (!$scope.formData.orderMedicalNos[i].handleFlag) {
    //        $scope.isChoiseAll = false;
    //      }
    //    }
    //   }


      if (newVal) {
        //创建临时变量存储商品列表，并将数据对象orderMedicalNos置空
        // $scope.tempDataList = $scope.formData.orderMedicalNos;
        // $scope.formData.orderMedicalNos = [];

        //发送请求判断当前订单状态是否可显示关闭按钮
        var _url = 'rest/authen/requestPurchaseOrder/isCanClose?id=' + $scope.formData.id;
        requestData(_url, {}, 'get')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.isShowCancelBtn = true;
          }
        });
      }
    });

    modal.closeAll();
    $scope.addDataItem = {};

    // 监视用户输入备注信息，当用户输入修改后1秒自动保存用户修改
    $scope.$watch('formData.note', function (newVal, oldVal) {
     if (newVal && (oldVal!==undefined)) {
       $timeout(function () {
         var _url = "rest/authen/requestPurchaseOrder/save",
             _data = $scope.formData;
         requestData(_url, _data, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             $scope.showSaveNoteInfo = true;
           }
         })
         .catch(function (error) {
           if (error) { throw new Error(error || '出错!'); }
         });
       }, 1000);
     }
    });

    // 监视备注提示信息，显示后1秒自动隐藏
    $scope.$watch('showSaveNoteInfo', function (newVal) {
     if (newVal) {    // 如果信息显示了
       $timeout(function () {
         $scope.showSaveNoteInfo = false;
       }, 1500);
     }
    });

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

    $scope.submitFormAfter = function() {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/requestPurchaseOrder/query.html');
        return;
      }

      if ($scope.submitForm_type == 'submit') {
        var url='rest/authen/requestPurchaseOrder/confirm';
        var data= {id:$scope.formData.id};
        requestData(url,data, 'POST')
         .then(function (results) {
           var _data = results[1];
           $scope.goTo('#/purchaseOrder/edit.html?id='+_data.data.purchaseOrder.id);
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
     };

    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);
    };

    //请购单中检查用户是否已选择部分药品
    $scope.chkChoiseMedicals = function (item,medicalsObj) {
      //定义存放厂家id数组
      if (!$scope._supplierArray) {
        $scope._supplierArray = [];
      }

      // 如果用户选中药品
      if (item.handleFlag) {
        // 数据对象中加入该项药品
        // $scope.formData.orderMedicalNos.push(item);
        // 将厂家id作为标识放入数组
        $scope._supplierArray.push(item.supplierId);
        // 设置标识为true，表示选中此项
        item.handleFlag = true;
        //判断是否可进行下一步
        $scope.isGoNextStep = chkMultipleId($scope._supplierArray) ? true : false;
      } else {      // 取消选中
        // 删除当前项
        // angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
        //   if (data.id === item.id) {
        //     $scope.formData.orderMedicalNos.splice(index,1);
        //   }
        // });

        // 删除标识
        angular.forEach($scope._supplierArray, function (data, index) {
          if (data === item.supplierId) {
            $scope._supplierArray.splice(index, 1);
          }
        });

        // 设置标识为false，表示取消此项
        item.handleFlag = false;

        //判断是否可进行下一步
        $scope.isGoNextStep = chkMultipleId($scope._supplierArray) ? true : false;
      }

      //检测用户是否选择了多个厂家的药品
      function chkMultipleId (arr) {
        if (arr.length > 0) {
          var _bool = arr.every(function (item, index, array) {
            return item === arr[0];
          });
          return _bool;
        }
      }
    };

    //处理全选与全不选
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
  }

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

      $scope.$watch('initFlag', function (newVal) {
         var operationFlowSetMessage=[];
         var operationFlowSetKey=[];
         var i;
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

         if ($scope.formData) {
           if (newVal && $scope.formData.orderMedicalNos) {
            for (i=0; i<$scope.formData.orderMedicalNos.length; i++) {
              if ($scope.formData.orderMedicalNos[i].handleFlag) {
                $scope.choisedMedicals = true;
              }
              if (!$scope.formData.orderMedicalNos[i].handleFlag) {
                $scope.isChoiseAll = false;
              }
            }
           }
         }

         if ($scope.formData) {
           for(var tr in $scope.formData.attachments){
             // 首先把Jason对象转化成数组，然后再把每条的证书编号字段取出来，如果有值，则把idAdmin字段设为false，相反设为true。该字段控制是否可以对证书编号进行编辑
             var attachments=[];
             attachments.push($scope.formData.attachments[tr]);
               attachments[0].isAdmin=true;
           }
         }
       });

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
         if ($scope.submitForm_type == 'submit-enterprise') {
           requestData('rest/authen/firstEnterpriseApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
               var url='rest/authen/firstEnterpriseApplication/startProcessInstance';
               var data= {businessKey:$scope.formData.id};
               requestData(url,data, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  $scope.goTo('#/firstEnterpriseApplication/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                  alertError(error || '出错');
                });
             }
           })
           .catch(function (error) {
           });
         }
         if ($scope.submitForm_type == 'submit-medical') {
           requestData('rest/authen/firstMedicalApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
               var url='rest/authen/firstMedicalApplication/startProcessInstance';
               var data= {businessKey:$scope.formData.id};
               requestData(url,data, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  $scope.goTo('#/firstMedicalApplication/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                  alertError(error || '出错');
                });
             }
           })
           .catch(function (error) {
           });
         }
         if ($scope.submitForm_type == 'submit-hospital') {
           requestData('rest/authen/hospitalApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
               var url='rest/authen/hospitalApplication/startProcessInstance';
               var data= {businessKey:$scope.formData.id};
               requestData(url,data, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  $scope.goTo('#/hospitalApplication/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                  alertError(error || '出错');
                });
             }
           })
           .catch(function (error) {
           });
         }
         if ($scope.submitForm_type == 'submit-otherCustomer') {
           requestData('rest/authen/otherCustomerApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
               var url='rest/authen/otherCustomerApplication/startProcessInstance';
               var data= {businessKey:$scope.formData.id};
               requestData(url,data, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  $scope.goTo('#/otherCustomerApplication/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                  alertError(error || '出错');
                });
             }
           })
           .catch(function (error) {
           });
         }

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

      // 选中相应药品类别，放入数组中传到后台
      $scope.choiceCommodityType=function(item){
        if(item.value){
          if($scope.formData.commodityType === null){
            $scope.formData.commodityType=[];
          }
        $scope.formData.commodityType.push(item.text);

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

      //医院采购目录增加采购目录有效期设置
      $scope.$watch('listParams.guaranteePeriod', function (newVal) {
        if (newVal === undefined) {
          return;
        }

        $scope.showData.guaranteePeriod = newVal;

        requestData('rest/authen/customerAddress/save', $scope.showData, 'POST', 'parameter-body')
        .then(function (results) {
          // console.log(results);
        })
        .catch(function (error) {
          if (error) {
            alertError(error || '出错');
          }
        });
      });

      // 监视用户是否更改是否基药选项，如果更改为非基药，将非基药价格重置为0
      $scope.$watch('formData.firstMedical.isBasicMedicine', function (newVal) {
        if (newVal === '否') {
          $scope.formData.firstMedical.quoteprice = 0;
        }
      });
    }

    function SelectedCommodityEditCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {
      $scope.$watch('!initFlag', function (newVal) {
        var scopeData= [];

        for(var item in $scope.scopeData){

          scopeData.push($scope.scopeData[item]);

          if ($scope.formData.commodityType) {
            for(j=0;j<$scope.formData.commodityType.length;j++){

              if($scope.formData.commodityType[j]==$scope.scopeData[item].value){
              $scope.scopeData[item].value=true;
              }
            }
          }
        }
      });

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };
    }

    /**
     * [hospitalPurchaseContentsCtrl 医院采购目录主控制器]
     * @param  {[type]} $scope          [注入项]
     * @param  {[type]} watchFormChange [注入项]
     * @param  {[type]} requestData     [注入项]
     * @param  {[type]} utils           [注入项]
     * @param  {[type]} alertError      [注入项]
     * @param  {[type]} alertWarn       [注入项]
     * @return {[type]}                 [description]
     */
    function hospitalPurchaseContentsCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn, $timeout) {

      // 临时存放要删除的药品列表
      $scope._tmpDelList = [];

      // 监控tbodyList数组变化
      $scope.$watch('tbodyList', function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          $scope.tbodyListChange = true;
        }
      });

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
          // $scope.isChoiseAll = true;
         }
       });

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

      // 监控医院采购目录中tbodyList对象的变化
      $scope.$watch('tbodyList', function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          $scope.changeFlag = true;
          // $scope.formData.orderMedicalNos = $scope.tbodyList;
        }
      }, true);

      // 监控分页页码的变化，解决点击分页后保存按钮可用的问题
      // $scope.$watch('status.currentPage', function (newVal, oldVal) {
      //   if (newVal && newVal !== oldVal) {
      //     console.log('aaa');
      //     $scope.changeFlag = false;
      //   }
      // });

      // 修改医院采购目录中药品价格后将当前药品插入formData中
      $scope.modifiedThisMedicalItem = function (item) {
        if (!$scope.formData.orderMedicalNos) {
          $scope.formData.orderMedicalNos = [];
        }

        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.id === item.id) {
            $scope.formData.orderMedicalNos.splice(index, 1);    // 删除重复数据
          }
        });

        $scope.formData.orderMedicalNos.push(item);   // 将修改后的药品数据放入数据体
      };

      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;

         if ($scope.submitForm_type == 'submit') {
           $scope.formData.validFlag = true;
         }

         $('#' + fromId).trigger('submit');
      };

      $scope.submitFormAfter = function () {
        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'submit') {
          utils.goTo('#/hospitalPurchaseContents/get.html?id='+$scope.formData.id);
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

      //医院采购目录增加采购目录有效期设置
      $scope.$watch('listParams.guaranteePeriod', function (newVal) {
        if (newVal === undefined) {
          return;
        }

        $scope.showData.guaranteePeriod = newVal;

        requestData('rest/authen/customerAddress/save', $scope.showData, 'POST', 'parameter-body')
        .then(function (results) {
          // console.log(results);
        })
        .catch(function (error) {
          if (error) {
            alertError(error || '出错');
          }
        });
      });

      // 监视用户是否更改是否基药选项，如果更改为非基药，将非基药价格重置为0
      $scope.$watch('formData.firstMedical.isBasicMedicine', function (newVal) {
        if (newVal === '否') {
          $scope.formData.firstMedical.quoteprice = 0;
        }
      });

      // 单选按钮
      $scope.handleItemClickEvent = function (tr) {
        $scope.changeFlag = false;    // 不能做修改确认操作

        if (tr.handleFlag) {          // 选中
          $scope._tmpDelList.push(tr.id);
        } else {                      // 取消选中
          angular.forEach($scope._tmpDelList, function (item, index) {
            if (item === tr.id) { $scope._tmpDelList.splice(index, 1); }
          });
        }
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

      // 处理全选和取消全选
      $scope.handleChoiseAllEvent = function () {
        $scope.changeFlag = false;      // 不能做修改确认操作

        if ($scope.isChoiseAll) {         // 选中全选
          if ($scope.tbodyList) {
            angular.forEach($scope.tbodyList, function (item, index) {
              $scope._tmpDelList.push(item.id);
            });
          }
        } else {                          // 取消全选
          $scope._tmpDelList = [];
          $scope.formData.delete.ids = [];
        }
      };

      // 处理批量删除按钮点击事件
      $scope.handleBatchDel = function () {
        if ($scope._tmpDelList.length) {

          angular.forEach($scope._tmpDelList, function (item, index) {
            for (var i=0; i<$scope.tbodyList.length; i++) {
              if (item === $scope.tbodyList[i].id) {
                $scope.tbodyList.splice(i, 1);
              }
            }
            $scope.formData.delete.ids.push(item);
            // 清空临时变量数组
            $scope._tmpDelList = [];
            // 可进行下一步操作
            $scope.changeFlag = true;
          });
        }
      };

      $scope.hospitalPurchaseContents_flashAddDataCallbackFn = function(flashAddData) {

        var i;

        if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
          alertWarn("请选择药品");
          return ;
        }

        var medical=flashAddData.data.data;
        var addDataItem = $.extend(true,{},medical);

        addDataItem.relId=medical.id;
        addDataItem.discountPrice='0';
        addDataItem.discountRate='100';
        // addDataItem.strike_price=addDataItem.price;
        // addDataItem.id=null;

        if (!addDataItem.planQuantity) {
          addDataItem.planQuantity = flashAddData.quantity;
        }

        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
            return false;
        }

        if(addDataItem.planQuantity>medical.quantity){//库存不足情况
            addDataItem.handleFlag =false;//默认添加到订单
        }

        if (!$scope.formData.orderMedicalNos) {
          $scope.formData.orderMedicalNos = [];
        }

        // 根据医院采购目录模块的业务需求，如果tbodyList对象存在，则将它赋值给orderMedicalNos对象
        if ($scope.tbodyList) {
          for (i = 0; i < $scope.tbodyList.length; i++) {
            if (addDataItem.id === $scope.tbodyList[i].relId) {
              alertWarn('此药械已添加到列表');
              return;
            }
          }
        }

        // 如果已添加
        if ($scope.formData.orderMedicalNos.length !== 0) {
          var _len = $scope.formData.orderMedicalNos.length;
          for (i=0; i<_len; i++) {
            if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
              alertWarn('此药械已添加到列表');
              return false;
            }
          }
        }
        addDataItem.stockBatchs=[];
        //添加到列表
        $scope.formData.orderMedicalNos.push(addDataItem);

        // 根据医院采购目录模块的业务需求，将用户添加的药品放入tbodyList对象中
        if ($scope.tbodyList) {
          $scope.tbodyList.push(addDataItem);
        }

        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price *

        addDataItem.planQuantity;
        return true;
      };
    }

    //品种管理模块
    function medicalStockCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

      $scope.$watch('initFlag', function (newVal) {
        var operationFlowSetMessage=[];
        var operationFlowSetKey=[];
        if ($scope.showData) {
          // 选择出当前状态相同的驳回理由，并放入一个数组中
          if ($scope.showData.operationFlowSet) {
            for (var i=0; i<$scope.showData.operationFlowSet.length; i++) {
              if ($scope.showData.operationFlowSet[i].status==$scope.showData.businessApplication.businessStatus ) {
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
         if (newVal && $scope.formData.orderMedicalNos) {
          for (j=0; j<$scope.formData.orderMedicalNos.length; j++) {
            if ($scope.formData.orderMedicalNos[j].handleFlag) {
              $scope.choisedMedicals = true;
            }
            if (!$scope.formData.orderMedicalNos[j].handleFlag) {
              $scope.isChoiseAll = false;
            }
          }
          // $scope.isChoiseAll = true;
         }
         // 编辑页面，如果证书编号是有值得情况下，不允许被修改
         if ($scope.formData) {
           for(var tr in $scope.formData.attachments){
             // 首先把Jason对象转化成数组，然后再把每条的证书编号字段取出来，如果有值，则把idAdmin字段设为false，相反设为true。该字段控制是否可以对证书编号进行编辑
             var attachments=[];
             attachments.push($scope.formData.attachments[tr]);
             if(attachments[0].certificateNumber){
               console.log(attachments[0].certificateNumber);
               attachments[0].isAdmin=false;
             }else{
                 attachments[0].isAdmin=true;
             }
           }
         }
       });
      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;

         if ($scope.submitForm_type == 'submit-medical') {

           requestData('rest/authen/medicalStock/save', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
             }
           })
           .catch(function (error) {

           });
          $scope.formData.validFlag = false;
          $scope.goTo('#/medicalStock/get.html?id='+$scope.formData.id);

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
          formData.medical.isBasicMedicine='是';
          formData.purchasePrice = formData.price;

        requestData('rest/authen/medicalStock/save', formData, 'POST', 'parameterBody')
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

      //医院采购目录增加采购目录有效期设置
      $scope.$watch('listParams.guaranteePeriod', function (newVal) {
        if (newVal === undefined) {
          return;
        }

        $scope.showData.guaranteePeriod = newVal;

        requestData('rest/authen/customerAddress/save', $scope.showData, 'POST', 'parameter-body')

        .then(function (results) {
          // console.log(results);
        })
        .catch(function (error) {
          if (error) {
            alertError(error || '出错');
          }
        });
      });

      // 监视用户是否更改是否基药选项，如果更改为非基药，将非基药价格重置为0
      $scope.$watch('formData.firstMedical.isBasicMedicine', function (newVal) {
        if (newVal === '否') {
          $scope.formData.firstMedical.quoteprice = 0;
        }
      });
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
      $scope.flashAddDataCallbackFn = function(flashAddData) {

        if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
          alertWarn("请选择药品");
          return ;
        }

        var medical=flashAddData.data.data;
        var addDataItem = $.extend(true,{},medical);

        addDataItem.relId=medical.id;
        addDataItem.discountPrice='0';
        addDataItem.discountRate='100';
        // addDataItem.strike_price=addDataItem.price;
        addDataItem.id=null;

        if (!addDataItem.planQuantity) {
          addDataItem.planQuantity = flashAddData.quantity;
        }

        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
            return false;
        }

        if(addDataItem.planQuantity>medical.quantity){//库存不足情况
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
        addDataItem.stockBatchs=[];
        //添加到列表
        $scope.formData.orderMedicalNos.push(addDataItem);
        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price *

        addDataItem.planQuantity;
        return true;
      };
    }

    // 客户管理(医院管理，经销商/零售商管理)模块
    function customerAddressCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {
      $scope.$watch('initFlag', function () {
          var operationFlowSetMessage=[];
          var operationFlowSetKey=[];
          if ($scope.showData) {
            // 选择出当前状态相同的驳回理由，并放入一个数组中
            if ($scope.showData.operationFlowSet) {
              for (var i=0; i<$scope.showData.operationFlowSet.length; i++) {
                if ($scope.showData.operationFlowSet[i].status==$scope.showData.businessApplication.businessStatus ) {
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
          // 编辑页面，如果证书编号是有值得情况下，不允许被修改
          if ($scope.formData) {
            for(var tr in $scope.formData.attachments){
              // 首先把Jason对象转化成数组，然后再把每条的证书编号字段取出来，如果有值，则把idAdmin字段设为false，相反设为true。该字段控制是否可以对证书编号进行编辑
              var attachments=[];
              attachments.push($scope.formData.attachments[tr]);
              if(attachments[0].certificateNumber){
                console.log(attachments[0].certificateNumber);
                attachments[0].isAdmin=false;
              }else{
                  attachments[0].isAdmin=true;
              }
            }
          }
      });

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;

         if ($scope.submitForm_type == 'submit-hospital') {
           requestData('rest/authen/customerAddress/save', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
             }
           })
           .catch(function (error) {

           });
           $scope.formData.validFlag = false;
           $scope.goTo('#/hospitalManagement/get.html?id='+$scope.formData.id);
         }
         if ($scope.submitForm_type == 'submit-supplier') {
           requestData('rest/authen/customerAddress/save', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
             }
           })
           .catch(function (error) {

           });
           $scope.formData.validFlag = false;
           $scope.goTo('#/supplier/get.html?id='+$scope.formData.id);
         }
         if ($scope.submitForm_type == 'submit-otherCustomer') {
           requestData('rest/authen/customerAddress/save', $scope.formData, 'POST', 'parameterBody')
           .then(function (results) {
             if (results[1].code === 200) {
             }
           })
           .catch(function (error) {

           });
           $scope.formData.validFlag = false;
           $scope.goTo('#/otherCustomerManagement/get.html?id='+$scope.formData.id);
         }
        $('#' + fromId).trigger('submit');
      };

      $scope.submitFormAfter = function (_url) {
        if ($scope.submitForm_type === 'submit') {
          $scope.goTo(_url + '?id=' + $scope.formData.id);
        }
      };
      $scope.choiceCommodityType=function(item){
        if(item.value){
          if($scope.formData.commodityType==null){
            $scope.formData.commodityType=[];
          }
        $scope.formData.commodityType.push(item.text);

        }
      }
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

        requestData('rest/authen/customerAddress/save', formData, 'POST', 'parameterBody')
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

      //医院采购目录增加采购目录有效期设置
      $scope.$watch('listParams.guaranteePeriod', function (newVal) {
        if (newVal === undefined) {
          return;
        }

        $scope.showData.guaranteePeriod = newVal;

        requestData('rest/authen/customerAddress/save', $scope.showData, 'POST', 'parameter-body')
        .then(function (results) {
          // console.log(results);
        })
        .catch(function (error) {
          if (error) {
            alertError(error || '出错');
          }
        });
      });

      // 监视用户是否更改是否基药选项，如果更改为非基药，将非基药价格重置为0
      $scope.$watch('formData.firstMedical.isBasicMedicine', function (newVal) {
        if (newVal === '否') {
          $scope.formData.firstMedical.quoteprice = 0;
        }
      });
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
      $scope.flashAddDataCallbackFn = function(flashAddData) {

        if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
          alertWarn("请选择药品");
          return ;
        }

        var medical=flashAddData.data.data;
        var addDataItem = $.extend(true,{},medical);

        addDataItem.relId=medical.id;
        addDataItem.discountPrice='0';
        addDataItem.discountRate='100';
        // addDataItem.strike_price=addDataItem.price;
        addDataItem.id=null;

        if (!addDataItem.planQuantity) {
          addDataItem.planQuantity = flashAddData.quantity;
        }

        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
            return false;
        }

        if(addDataItem.planQuantity>medical.quantity){//库存不足情况
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
        addDataItem.stockBatchs=[];
        //添加到列表
        $scope.formData.orderMedicalNos.push(addDataItem);
        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price *

        addDataItem.planQuantity;
        return true;
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
      //if(!formData1.didateFilter)formData1.didateFilter={};
      if(!formData1.buttons)formData1.buttons=[];
      var btnForm = {
        type: '通过',
        buttonName: '审核通过',
        requestMethod: 'POST',
        conditionType:'通过',
        requestParam: 'KeyValue',
        requestUrl : 'rest/authen/workflowTask/run.json'
      };
      formData1.buttons.push(btnForm);
    };

      //当一个节点的name改变后，需要更新对应的关联关系。
      function updateEventRelations(events,oldId,newId){

         for(var i=0;i<events.length;i++){
           if(events[i].sourceRef==oldId){
             events[i].sourceRef=newId;
           }
           if(events[i].targetRef==oldId){
             events[i].targetRef=newId;
           }
         }
       }
    // 保存节点信息（新建or创建）
    $scope.saveEvent = function(event1) {
      if(!$scope.formData.events)$scope.formData.events=[];
      var events=$scope.formData.events;
      var isInsert=true;
      //防止'' 保存到后台,枚举报错bug.
      if(!event1.conditionType)event1.conditionType=null;
      if(event1.id){
          var ind=$rootScope.utils.getObjectIndexByKeyOfArr(events,'id',event1.id);
          if(event1.id!=event1.name){
              updateEventRelations(events,event1.id,event1.name);
          }
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
      //删除关联关系
      updateEventRelations(events,id,null);

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

    // 监视price价格变化，重置折扣额和折扣率
    $scope.$watch('tr.strike_price', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.tr.discountPrice = 0;   // 折扣额重置为0
        $scope.tr.discountRate = 100;  // 折扣率重置为100
      }
    });

    // $scope.$watch('tr.discountPrice', function (newVal) {
    //   if (isNaN(newVal)) {
    //     $scope.tr.discountPrice = '';
    //   }
    // });

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
  function returnOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData, $rootScope,alertOk,utils) {

    //如果是新建，没有id下，将后端返回的returnQuantity字段值赋值给quantity
    // if (!$scope.formData) {
    //   angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
    //     item.quantity = item.returnQuantity;
    //   });
    // }
    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);

    };

    modal.closeAll();
    // $scope.formData={};
    $scope.addDataItem = {};

    // 保存  type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function(formData) {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/saleReturnOrder/query.html');
        alertOk(scopeResponse.msg);
        return;
      }

      if ($scope.submitForm_type == 'submit') {

        var url='rest/authen/saleReturnOrder/startProcessInstance';
        var data= {businessKey:$scope.formData.id};

        requestData(url, data, 'POST')
          .then(function (results) {
            if (results[1].code !== 200) {
              alertWarn(results[1].msg || '未知错误!');
            } else {
              $scope.goTo('#/saleReturnOrder/get.html?id='+$scope.formData.id);
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

    };

    // 取消订单
    $scope.cancelForm = function(fromId, url) {
      alertWarn('cancelForm');
    };

    // 添加选择项到编辑页
    // $scope.handleAddDataArray = function (addDataObj_id,choisedMedicalList,addDataObj) {
    //
    //
    //   if(!addDataObj_id){//发货单id不能为空
    //     return ;
    //   }
    //   if(!choisedMedicalList || choisedMedicalList.length===0){//至少选择1条数据
    //     return ;
    //   }
    //
    //
    //
    //
    //           //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
    //           $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
    //           $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
    //           $scope.formData.salesType=addDataObj.salesType;
    //           $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
    //           $scope.formData.saleUser=addDataObj.saleUser;
    //
    //   //切换发货单时，清空原有数据
    //   if($scope.formData.relId!=addDataObj_id){
    //     $scope.formData.orderMedicalNos=[];
    //
    //
    //   }else{
    //     //否则删除没选中,再添加选中的
    //     for(var i=$scope.formData.orderMedicalNos.length-1;i>=0;i--){
    //       var data=$scope.formData.orderMedicalNos[i];
    //       if(utils.getObjectIndexByKeyOfArr(choisedMedicalList,"relId",data.relId)==-1){
    //           $scope.formData.orderMedicalNos.splice(i,1);
    //       }
    //     }
    //   }
    //   //重新绑定数据
    //   $scope.formData.relId = addDataObj_id;
    //
    //   //清空原有数据，重新绑定到主页面
    //   $scope.formData.orderMedicalNos=[];
    //   angular.forEach(choisedMedicalList, function (data, index) {
    //     data.quantity = data.returnQuantity;    // 将可退数量赋值给显示的数量
    //     $scope.formData.orderMedicalNos.push(data);
    //   });
    //
    //   //已经添加过的不在添加。（保留已经修改的数据）
    //   // angular.forEach(choisedMedicalList, function (data, index) {
    //   //   if ($scope.formData.orderMedicalNos.length !== 0) {
    //   //     if(utils.getObjectIndexByKeyOfArr($scope.formData.orderMedicalNos,"relId",data.relId)==-1){
    //   //       $scope.formData.orderMedicalNos.push(data);
    //   //     }
    //   //   } else {
    //   //     $scope.formData.orderMedicalNos.push(data);
    //   //   }
    //   // });
    //
    //
    //   // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);
    //     modal.closeAll();
    //
    //
    // };

  }

  // 采购退货单
  function purchasereturnOrderEditCtrl($scope, modal, alertWarn, watchFormChange, requestData, $rootScope,alertOk,utils) {

    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);

    };

    modal.closeAll();
    $scope.addDataItem = {};

    // 保存  type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function(scopeResponse) {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/purchaseReturnOrder/query.html');
        alertOk(scopeResponse.msg);
        return;
      }

      if ($scope.submitForm_type == 'submit') {

        var url='rest/authen/purchaseReturnOrder/startProcessInstance';
        var data= {businessKey:$scope.formData.id};
          console.log($scope.formData);

        requestData(url, data, 'POST')
          .then(function (results) {
            if (results[1].code !== 200) {
              alertWarn(results[1].msg || '未知错误!');
            } else {
              $scope.goTo('#/purchaseReturnOrder/get.html?id='+$scope.formData.id);
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

    // 添加选择项到编辑页
    // $scope.handleAddDataArray = function (addDataObj_id,choisedMedicalList,addDataObj) {
    //   if(!addDataObj_id){//发货单id不能为空
    //     return ;
    //   }
    //   if(!choisedMedicalList||choisedMedicalList.length===0){//至少选择1条数据
    //     return ;
    //   }
    //
    //
    //           //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
    //           $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
    //           $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
    //           $scope.formData.salesType=addDataObj.salesType;
    //           $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
    //           $scope.formData.saleUser=addDataObj.saleUser;
    //
    //   //切换发货单时，清空原有数据
    //   if($scope.formData.relId!=addDataObj_id){
    //     $scope.formData.orderMedicalNos=[];
    //
    //
    //   }else{
    //     //否则删除没选中,再添加选中的
    //     for(var i=$scope.formData.orderMedicalNos.length-1;i>=0;i--){
    //       var data=$scope.formData.orderMedicalNos[i];
    //       if(utils.getObjectIndexByKeyOfArr(choisedMedicalList,"relId",data.relId)==-1){
    //           $scope.formData.orderMedicalNos.splice(i,1);
    //       }
    //     }
    //   }
    //   //重新绑定数据
    //   $scope.formData.relId = addDataObj_id;
    //   //已经添加过的不在添加。（保留已经修改的数据）
    //     angular.forEach(choisedMedicalList, function (data, index) {
    //       if(utils.getObjectIndexByKeyOfArr($scope.formData.orderMedicalNos,"relId",data.relId)==-1){
    //           $scope.formData.orderMedicalNos.push(data);
    //       }
    //
    //     });
    //   // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);
    //     modal.closeAll();
    // };

  }

  /**
   * [returnOrderAddController 销售退货单弹出模态框添加项目控制器]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function returnOrderAddController ($scope, $rootScope, modal, utils, requestData, alertError) {

    $scope.addDataObj={};
    $scope.hasReturnList = false;

    // 监控用户选择的返货单，发生变化后立即检查当前单据中是否有可退的商品
    $scope.$watch('addDataObj.orderMedicalNos', function (newVal) {
      if (newVal) {
        $scope.hasReturnList = false;
        angular.forEach(newVal, function (item, index, array) {
          if (item.returnQuantity !== 0) {
            $scope.hasReturnList = true;
          }
        });
      }
    });

    //1.初始化选择状态。
    //addDataObj_orderMedicalNos:发货单细表，saleReturnOrder_orderMedicalNos 销售退货单细表
    $scope.initChoisedMedicalList=function(addDataObj_orderMedicalNos,saleReturnOrder_orderMedicalNos){
        var choisedMedicalList = [], _initFlag = 0;

        if (!addDataObj_orderMedicalNos) {
          return choisedMedicalList;
        }

        //如果销售退货细表中有该条目则选中
        angular.forEach(addDataObj_orderMedicalNos, function (data, index) {
          if (saleReturnOrder_orderMedicalNos) {
            for (var i = 0; i < saleReturnOrder_orderMedicalNos.length; i++) {
              if (data.relId === saleReturnOrder_orderMedicalNos[i].relId &&
                  data.productionBatch === saleReturnOrder_orderMedicalNos[i].productionBatch &&
                  data.sterilizationBatchNumber === saleReturnOrder_orderMedicalNos[i].sterilizationBatchNumber) {
                    data.itemSelected = true;
                    choisedMedicalList.push(data);
                    _initFlag++;
                  }
            }
          }

          if (!data.itemSelected) {
            $scope.isChoiseAll = false;
          }

          // if(utils.getObjectIndexByKeyOfArr(saleReturnOrder_orderMedicalNos,"relId",data.relId)>-1){
          //   data.itemSelected = true;
          //   choisedMedicalList.push(data);
          // }
          //
          // if (!data.itemSelected) {
          //   $scope.isChoiseAll = false;
          // }
        });

        if (_initFlag === addDataObj_orderMedicalNos.length) {
          $scope.isChoiseAll = true;
        }

        return choisedMedicalList;
    };

    // 单个药品点击添加与取消添加事件处理
    $scope.handleItemClickEvent = function (item) {

      var _dataSource = $scope.addDataObj.orderMedicalNos;

      if (!$scope.choisedMedicalList) {
        $scope.choisedMedicalList = [];
      }

      if (item.itemSelected) {
        $scope.choisedMedicalList.push(item);
        if ($scope.choisedMedicalList.length === _dataSource.length) {
          $scope.isChoiseAll = true;
        }
      } else {
        angular.forEach($scope.choisedMedicalList, function (data, index) {
          if (data.relId === item.relId && data.productionBatch === item.productionBatch && data.sterilizationBatchNumber === item.sterilizationBatchNumber) {
            $scope.choisedMedicalList.splice(index, 1);
          }
        });
        $scope.isChoiseAll = false;
      }

    };

    // 全选与全不选
    $scope.handleChoiseAllEvent = function () {

      $scope.choisedMedicalList = [];

      var _dataSource = $scope.addDataObj.orderMedicalNos;

      if (!$scope.choisedMedicalList) {
        $scope.choisedMedicalList = [];
      }

      if ($scope.isChoiseAll) {
        angular.forEach(_dataSource, function (data, index) {
          data.itemSelected = true;
          if (data.returnQuantity !== 0) {
            $scope.choisedMedicalList.push(data);
          }
        });
      } else  {
        angular.forEach(_dataSource, function (data, index) {
          data.itemSelected = false;
          $scope.choisedMedicalList = [];
        });
      }

    };

    // 采购退货单模块根据设计变更重写hanleAddDataArray方法,需将选中的数据及id发送到后端进行拆分后将返回数据加载到主页面
    $scope.handleAddData = function (addDataObj_id, addDataObj_orderNo,choisedMedicalList,addDataObj) {

      // 发货单id不能为空,至少选择1条数据
      if (!addDataObj_id || !addDataObj_orderNo || !choisedMedicalList || choisedMedicalList.length === 0) {
        return ;
      }


      //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
      $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
      $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
      $scope.formData.purchaseType=addDataObj.purchaseType;
      $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
      $scope.formData.saleUser=addDataObj.saleUser;

      // 清空原有数据
      $scope.formData.relId = addDataObj_id;
      $scope.formData.orderMedicalNos = [];

      // 初始化
      var _data = {
        'arrivalNoticeOrderNo': '',
        'orderMedicalNoSet': []
      };

      _data.arrivalNoticeOrderNo = addDataObj_orderNo;
      angular.forEach(choisedMedicalList, function (data, index) {
        _data.orderMedicalNoSet.push(data);
      });

      var _url = 'rest/authen/purchaseReturnOrder/splitOrderMedicalNos';
      requestData(_url, _data, 'POST', 'parameter-body')
      .then(function (results) {

        var _resultData = results[1].data;

        angular.forEach(_resultData, function (data, index) {
          $scope.formData.orderMedicalNos.push(data);
        });

        modal.closeAll();

      })
      .catch(function (error) {
        if (error) {
          alertError(error || '出错');
        }
      });
    };

    // // 销售退货单模块点击添加要退货的药品列表功能
    $scope.handleAddDataArray = function (addDataObj_id, choisedMedicalList,addDataObj) {

      // 发货单id不能为空,至少选择1条数据
      if (!addDataObj_id || !choisedMedicalList || choisedMedicalList.length === 0) {
        return ;
      }

      // 首次添加数据
      if (!$scope.formData.orderMedicalNos.length) {
        $scope.formData.relId = addDataObj_id;
        $scope.formData.orderMedicalNos = choisedMedicalList;
      } else {    // 修改数据
        $scope.formData.orderMedicalNos = [];     // 清空原有数据
        $scope.formData.orderMedicalNos = choisedMedicalList;
        // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);   // 重新添加数据
      }


      //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
      $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
      $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
      $scope.formData.salesType=addDataObj.salesType;
      $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
      $scope.formData.saleUser=addDataObj.saleUser;

      //切换发货单时，清空原有数据
      if($scope.formData.relId!=addDataObj_id){
        $scope.formData.orderMedicalNos=[];



      }else{
        //否则删除没选中,再添加选中的
        for(var i=$scope.formData.orderMedicalNos.length-1;i>=0;i--){
          var data=$scope.formData.orderMedicalNos[i];
          if(utils.getObjectIndexByKeyOfArr(choisedMedicalList,"relId",data.relId)==-1){
              $scope.formData.orderMedicalNos.splice(i,1);
          }
        }
      }

      //重新绑定数据
      // $scope.formData.relId = addDataObj_id;
      // //已经添加过的不在添加。（保留已经修改的数据）
      //   angular.forEach(choisedMedicalList, function (data, index) {
      //     if(utils.getObjectIndexByKeyOfArr($scope.formData.orderMedicalNos,"relId",data.relId)==-1){
      //         $scope.formData.orderMedicalNos.push(data);
      //     }
      //
      //   });
      // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);

      modal.closeAll();
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
        if ($scope.item.returnQuantity >= 0) {
          if (newVal > $scope.item.returnQuantity) {
            $scope.quantityError = true;
            $scope.$parent.$parent.quantityError = true;
          } else {
            $scope.quantityError = false;
            $scope.$parent.$parent.quantityError = false;
          }
        }
    });
  }

  /**
   * [saleOutstockOrderController 销售出库单控制器]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function saleOutstockOrderController ($scope, requestData, utils) {
    // 添加物流信息
    $scope.saveExpressInfo = function (params) {
      var _data = angular.isObject(params) ? params : '';
      var saveUrl = 'rest/authen/wOutstockOrder/kuaidi/save';
      if (_data) {
        requestData(saveUrl, _data, 'POST')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.goOrRefreshHref();
          }
        })
        .catch(function (error) {
          console.log(error || '出错');
        });
      }
    };

    // 编辑物流信息
    $scope.editThisAreaInfo = function (item) {
      $scope.addAreaisShow = true;
      $scope.formData.type = item.type;
      $scope.formData.nu = item.nu;
      $scope.formData.id = item.id;
    };
  }

  /**
   * [getAllExpressController 获取当前单据的所有物流信息]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function getAllExpressController ($scope, requestData) {

    var _kuaidiSet = $scope.dialogData.kuaidiSet;
    var _url = 'rest/index/kuaidi/query2.json';
    $scope.expressInfoArray = [];

    angular.forEach(_kuaidiSet, function (data, index) {
      requestData(_url + '?type=' + data.type + '&nu=' + data.nu, {}, 'get')
      .then(function (results) {
        // console.log(results[1]);
        var _tmpObj = results[1];
        _tmpObj.index = index;
        _tmpObj.type = data.type;
        _tmpObj.nu = data.nu;
        $scope.expressInfoArray.push(_tmpObj);
      });
    });
  }

  /**
   * [indexPageController 首页控制器]
   * @param  {[type]} $socpe [description]
   * @return {[type]}        [description]
   */
  function indexPageController ($socpe, utils) {
    // 首页采购部分低库存报警区块发起采购方法

  }

  /**
   * [indexPurchaseSuppleController 首页采购辅助信息处理欲发起采购的动作]
   * @param  {[type]} $scope [注入项]
   * @param  {[type]} utils  [注入项]
   * @return {[type]}        [description]
   */
  function indexPurchaseSuppleController ($scope, utils) {

    $scope.relMedicalStockIdSet = '';

    // 全选与全不选
    $scope.handleChoiseAllEvent = function (data) {
      if ($scope.isChoiseAll && angular.isArray(data)) {
        angular.forEach(data, function (item, index) {
          item.handleFlag = true;
          if (!$scope.relMedicalStockIdSet) {
            $scope.relMedicalStockIdSet += item.id;
          } else {
            $scope.relMedicalStockIdSet += ',' + item.id;
          }
        });
      } else {
        angular.forEach(data, function (item, index) {
          item.handleFlag = false;
          $scope.relMedicalStockIdSet = '';
        });
      }
    };

    // 单选
    $scope.handleItemClickEvent = function (obj,dataList) {
      if (obj.handleFlag) {
        //获取当前点击选项的厂家id
        var _supplierId = obj.supplierId;
        //遍历列表判断那些药品跟当前点击选中的药品列不是一个厂家的
        angular.forEach(dataList, function (item, index) {
          if (item.supplierId !== _supplierId) {
            item.isCloseChiose = true;
          }
        });

        if (!$scope.relMedicalStockIdSet) {
          $scope.relMedicalStockIdSet += obj.id;
        } else {
          $scope.relMedicalStockIdSet += ',' + obj.id;
        }
      } else {
        var _tmp = $scope.relMedicalStockIdSet.split(',');

        angular.forEach(_tmp, function (data, index) {
          if (data === obj.id) {
            _tmp.splice(index, 1);
            return false;
          }
        });

        $scope.relMedicalStockIdSet = _tmp.toString();

        if (!$scope.relMedicalStockIdSet) {
          angular.forEach(dataList, function (item, index) {
            item.isCloseChiose = false;
          });
        }
      }
    };

  }

  /**
   * [historicalPriceController 历史价格查询及操作控制器]
   * @param  {[type]} $scope [注入项]
   * @param  {[type]} utils  [注入项]
   * @return {[type]}        [description]
   */
  function historicalPriceController ($scope, utils) {
    // 用户选择价格
    $scope.choiseThisItem = function (obj,id) {
      // 直接将用户选择的历史价格赋值给表单价格
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (item, index) {
          if (item.relId === id) {
            item.strike_price = obj.value;
           }
        });
      }
    };
  }

  /**
   * [editStockbatchNumberCtrl 销售单涉及到多仓库的批号数量选择及操作控制器]
   * @param  {[type]} $scope [注入项]
   * @param  {[type]} utils  [注入项]
   * @return {[type]}        [description]
   */
  function editStockbatchNumberCtrl ($scope, utils, requestData) {

    // 监控listparams对象中属性的更改，刷新结果列表
    $scope.$watchCollection('listParams', function (newVal, oldVal) {
      if ($scope.listParams) {

        if ($scope.dialogData.sourceId) {
          $scope.listParams.warehouseId = $scope.dialogData.sourceId;
        }

        var _url = 'rest/authen/medicalStock/queryStockBatch',
            _data = {
              relMedicalStockId: $scope.dialogData.id,
              logisticsCenterId: $scope.dialogData.logisticsCenterId,
              warehouseId: $scope.listParams.warehouseId,
              createAtBeg: $scope.listParams.createAtBeg,
              createAtEnd: $scope.listParams.createAtEnd,
              q: $scope.listParams.q
            };

        requestData(_url, _data, 'GET')
        .then(function (results) {
          if (results[1].data) { $scope.stockBatchList = results[1].data; }
        });
      }
    });

    // 获取用户已选择的药品批次，并将批次id存入数组
    $scope.getChoisedBatchsId = function (choisedBatchList) {
      if (choisedBatchList) {
        $scope.choisedBatchsIdList = [];
        angular.forEach(choisedBatchList, function (data, index) {
          if (data.stockBatchId) {
            $scope.choisedBatchsIdList.push(data.stockBatchId);
          }
        });
      }
    };

    // 用户选择生产批号
    $scope.choseBatch = function (obj,id) {

      // 构建临时对象存储批号id、批号名和数量
      var _tmp = {
        stockBatchId: obj.id,                     // 批次号id
        batchNumber: obj.productionBatch,
        quantity: obj.stockModel.salesQuantity,    // 可选数量
        productionBatch: obj.productionBatch,     // 批号名
        validTill:obj.validTill,
        sterilizationBatchNumber: obj.sterilizationBatchNumber,    // 灭菌批号
        warehouseName: obj.warehouseName,       // 仓库名
        warehouseId: obj.warehouseId,        // 仓库名id
        warehouseType: obj.warehouseType     // 仓库类型
      };

      // 初始化已添加的批次数量和
      var _total = 0;

      // 计算当前药品的批次数量和
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.stockBatchs) {
            for (var i = 0; i < data.stockBatchs.length; i++) {
              if (data.stockBatchs[i].batchNumber)
              { _total += parseInt(data.stockBatchs[i].quantity, 10);
              }
            }
          }

        });
      }

      // 如果当前批次数量大于或等于计划采购数量
      if ((obj.stockModel.salesQuantity + _total) > $scope.dialogData.planQuantity) {
        // 将计划采购数量赋值给临时对象
        _tmp.quantity = $scope.dialogData.planQuantity - _total;
      }

      // 根据药品id将批次存入当前药品formData数据中
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.relId == id) {
            $scope.formData.orderMedicalNos[index].stockBatchs.push(_tmp);
          }
        });
      }

      // 将当前批次的灭菌批号和仓库名传递到列表


    };
  }
  /**
   * [inoutstockDetailQueryCtr 库存报表 > 出入库明细 控制器]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function inoutstockDetailQueryCtr ($scope,utils) {
    //表格条目点击跳转方法，根据类型不同跳转页面不同
    $scope.queryItemClick=function(tr){
      var    url="#/otherOutstockOrder/get.html?orderNo=";
      switch (tr.type)
        {
        case "采购入库单":
          url="#/purchaseInstockOrder/get.html?orderNo=";
          break;
        case "采购入库单_红字":
           url="#/purchaseInstockOrder/get.html?orderNo=";
           break;
        case "销售出库单":
          url="#/saleOutstockOrder/get.html?orderNo=";
          break;
        case "销售出库单_红字":
            url="#/saleOutstockOrder/get.html?orderNo=";
            break;

        default :
          {
           if(tr.inoutType){
             if(tr.inoutType=='出库'){
                 url="#/otherOutstockOrder/get.html?orderNo=";
             }else{
                  url="#/otherInstockOrder/get.html?orderNo=";
             }
           }else{//兼容inoutType==null。根据type包含字符判断。不够准确。
             if(tr.type.indexOf('出')>-1){
                 url="#/otherOutstockOrder/get.html?orderNo=";
             }else{
                  url="#/otherInstockOrder/get.html?orderNo=";
             }
           }
          }//default

        }//end switch
        url+=tr.orderNo;


        utils.goTo(url);
        return url;
      };//getUrlByQueryOfType
    }//inoutstockDetailQueryCtr

  /**
   * [infrastructureController manage模块wms实例管理]
   * @return {[type]} [description]
   */
  function infrastructureController ($scope) {

    $scope.buildMapping = function (objName, keyName, valName) {

      if ($scope.formData[keyName] && $scope.formData[valName]) {
        if ($scope.formData[objName]) {
          // 检查key
          var _keys = Object.keys($scope.formData[objName]);
          if (_keys.indexOf($scope.formData[keyName]) != -1) {
            alert('选择的属性已存在'); return;
          }

          // 检查value
          for (var i in $scope.formData[objName]) {
            if ($scope.formData[objName][i] == $scope.formData[valName]) {
              alert('选择的值已存在'); return;
            }
          }
        }

        $scope.formData[objName][$scope.formData[keyName]] = $scope.formData[valName];

        if ($scope.formData[objName]) {
          $scope.formData[keyName] = '';
          $scope.formData[valName] = '';
        }
      }
    };

    // 初始化扩展属性
    $scope.initExtendedAttribute = function (extendedAttrObj) {

      if (angular.isObject(extendedAttrObj)) {
        $scope.extendedAttrList = [];
        for (var i in extendedAttrObj) {
          var _tmp = {name:i, val:extendedAttrObj[i]};
          $scope.extendedAttrList.push(_tmp);
        }

        // console.log($scope.extendedAttrList);
      }
    };

    // 扩展属性选择后操作
    $scope.handleChoiseEvent = function (extendedAttrList, key) {
      angular.forEach(extendedAttrList, function (item, index) {
        if (key == item.name) { $scope.formData.extendedAttributeValue = item.val; }
      });
    };

    // 保存扩展属性更改
    $scope.saveExtendedAttribute = function () {
      // console.log($scope.formData.extendedAttributeValue);
      for (var i in $scope.formData.extendedAttribute) {
        // console.log(i+' => '+$scope.formData.extendedAttributeKey.name);
        if (i == $scope.formData.extendedAttributeKey.name) {
          $scope.formData.extendedAttribute[i] = $scope.formData.extendedAttributeValue;
        }
      }
      // console.log($scope.formData);
    };
  }

  angular.module('manageApp.project')
  .controller('infrastructureController', ['$scope', infrastructureController])
  .controller('inoutstockDetailQueryCtr', ['$scope','utils', inoutstockDetailQueryCtr])
  .controller('historicalPriceController', ['$scope', 'utils', historicalPriceController])
  .controller('editStockbatchNumberCtrl', ['$scope', 'utils', 'requestData', editStockbatchNumberCtrl])
  .controller('indexPurchaseSuppleController', ['$scope', 'utils', indexPurchaseSuppleController])
  .controller('indexPageController', ['$scope', 'utils', indexPageController])
  .controller('getAllExpressController', ['$scope', 'requestData', getAllExpressController])
  .controller('saleOutstockOrderController', ['$scope', 'requestData', 'utils', saleOutstockOrderController])
  .controller('imTaobaoCtr', ['$scope',"requestData",'alertError',"$rootScope", imTaobaoCtr])
  .controller('saleReturnMedicalItemController', ['$scope', saleReturnMedicalItemController])
  .controller('returnOrderAddController', ["$scope", "$rootScope", "modal","utils", "requestData", "alertError", returnOrderAddController])
  .controller('mainCtrlProject',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils","purchaseOrderUtils","requestPurchaseOrderUtils","queryItemCardButtonList","customMenuUtils", mainCtrlProject])
  .controller('ScreenFinanceApprovalController', ['$scope', ScreenFinanceApprovalController])
  .controller('ConfirmOrderMedicalController', ['$scope', ConfirmOrderMedicalController])
  .controller('confirmOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'dialogConfirm', confirmOrderEditCtrl])
  .controller('confirmOrderEditCtrl2', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'watchFormChange', 'saleOrderUtils', confirmOrderEditCtrl2])
  .controller('SalesOrderDetailsController', ['$scope', '$timeout', 'alertOk', 'alertError', 'requestData', SalesOrderDetailsController])
  .controller('editWorkFlowProcessCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', '$rootScope', editWorkFlowProcessCtrl])
  .controller('QualificationApplyCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', QualificationApplyCtrl])
  .controller('SelectedCommodityEditCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', SelectedCommodityEditCtrl])
  .controller('hospitalPurchaseContentsCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', '$timeout', hospitalPurchaseContentsCtrl])
  .controller('medicalStockCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockCtrl])
  .controller('customerAddressCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', customerAddressCtrl])
  .controller('watchFormCtrl', ['$scope','watchFormChange', watchFormCtrl])
  .controller('intervalCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', intervalCtrl])
  .controller('auditUserApplyOrganizationCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','proLoading', auditUserApplyOrganizationCtrl])
  .controller('purchaseOrderEditCtrl', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', 'dialogConfirm', purchaseOrderEditCtrl])
  .controller('allocateOrderEditCtrl', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', allocateOrderEditCtrl])
  .controller('arrivalNoticeOrderEditCtrl', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', arrivalNoticeOrderEditCtrl])
  .controller('requestPurchaseOrderEditCtrl', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', '$timeout', requestPurchaseOrderEditCtrl])
  .controller('noticeCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', noticeCtrl])
  .controller('invoicesOrderCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError', '$timeout', invoicesOrderCtrl])
  .controller('salesOrderEditCtrl2', ['$scope', 'modal','alertWarn','watchFormChange', 'requestData', salesOrderEditCtrl2])
  .controller('salesOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', salesOrderEditCtrl])
  .controller('freezeThawOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', freezeThawOrderEditCtrl])
  .controller('lossOverOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', lossOverOrderEditCtrl])
  .controller('returnOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', 'requestData', '$rootScope','alertOk','utils', returnOrderEditCtrl])
  .controller('purchasereturnOrderEditCtrl', ['$scope', 'modal','alertWarn','watchFormChange', 'requestData', '$rootScope','alertOk','utils', purchasereturnOrderEditCtrl])
  .controller('deleteUploaderController', ['$scope', '$timeout', 'alertOk', 'alertError', 'requestData', deleteUploaderController]);
});
