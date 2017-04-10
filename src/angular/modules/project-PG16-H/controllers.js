/**
 * Created by hao on 15/11/5.
 */
define('project-PG16-H/controllers', ['project-PG16-H/init'], function() {

  //  SPD系统—商品信息管理模块controller
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
        formData.deliveryPlus='常温'

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

  

  angular.module('manageApp.project')
  .controller('medicalStockCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockCtrl])

});
