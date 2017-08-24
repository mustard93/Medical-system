define('project-dt/controllers-hospitalPurchaseContents', ['project-dt/init'], function() {
  /**
   * [hospitalPurchaseContentsCtrl 医院采购目录主控制器]
   * @method hospitalPurchaseContentsCtrl
   * @param  {[type]}                     $scope          [description]
   * @param  {[type]}                     watchFormChange [description]
   * @param  {[type]}                     requestData     [description]
   * @param  {[type]}                     utils           [description]
   * @param  {[type]}                     alertError      [description]
   * @param  {[type]}                     alertWarn       [description]
   * @param  {[type]}                     $timeout        [description]
   * @return {[type]}                                     [description]
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

       $scope.submitFormValidator(fromId);
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

  angular.module('manageApp.project-dt')
  .controller('hospitalPurchaseContentsCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", "$timeout", hospitalPurchaseContentsCtrl]);
});
