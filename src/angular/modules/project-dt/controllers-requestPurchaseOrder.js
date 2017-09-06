define('project-dt/controllers-requestPurchaseOrder', ['project-dt/init'], function() {
  /**
   * [requestPurchaseOrderEditCtrl 请购单控制器]
   * @method requestPurchaseOrderEditCtrl
   * @param  {[type]}                     $scope          [description]
   * @param  {[type]}                     modal           [description]
   * @param  {[type]}                     alertWarn       [description]
   * @param  {[type]}                     alertError      [description]
   * @param  {[type]}                     requestData     [description]
   * @param  {[type]}                     watchFormChange [description]
   * @param  {[type]}                     $timeout        [description]
   * @return {[type]}                                     [description]
   */
  function requestPurchaseOrderEditCtrl($rootScope,$scope, modal, alertWarn, alertError, requestData, watchFormChange, $timeout) {

     var tabId= $rootScope.uiTabs.current.id;

    $scope.isShowCancelBtn = false;
    $scope.isGoNextStep = false;
    $scope.showSaveNoteInfo = false;    // 是否显示自动保存用户修改备注信息的提示

    //页面Loading时初始化数据
    $scope.$watch('initFlag', function (newVal) {

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
           $scope.goTo({tabHref:'#/purchaseOrder/edit.html?tabId='+tabId+'&id='+_data.data.purchaseOrder.id,tabName:'采购单'});
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

       $scope.submitFormValidator(fromId);
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
        console.log(item.supplierId);
        $scope._supplierArray.push(item.supplierId);
        console.log($scope._supplierArray);
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

    $scope.choisedMedicalIdList = [];
    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item.id) {
          $scope.choisedMedicalIdList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalIdList.length; i++) {
          if (item.id === $scope.choisedMedicalIdList[i]) {
            $scope.choisedMedicalIdList.splice(i,1);
          }
        }
      }
      if ($scope.choisedMedicalIdList.length) {
        $scope.isGoNextStep=true;
      }else {
        $scope.isGoNextStep=false;
      }
      if ($scope.choisedMedicalIdList.length==$scope.formData.orderMedicalNos.length) {
        $scope.isChoiseAll=true;
      }else {
        $scope.isChoiseAll=false;
      }
    };
    // 全选全不选
    $scope.handleChoiseAllEvent = function () {
      if ($scope.isChoiseAll) {
        if ($scope.formData.orderMedicalNos) {
          $scope.choisedMedicalIdList = [];
          angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
            $scope.choisedMedicalIdList.push(data.id);
            data.handleFlag=true;
          });
        }
          $scope.isGoNextStep=true;
      } else {
        if ($scope.formData.orderMedicalNos) {
          angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
            data.handleFlag=false;
          });
        }
        $scope.choisedMedicalIdList = [];
        $scope.isGoNextStep=false;
      }
    };
  }

  angular.module('manageApp.project-dt')
  .controller('requestPurchaseOrderEditCtrl', ['$rootScope','$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", "$timeout", requestPurchaseOrderEditCtrl]);
});
