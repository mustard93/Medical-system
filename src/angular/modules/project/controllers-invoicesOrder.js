define('project/controllers-invoicesOrder', ['project/init'], function() {
  /**
   * [invoicesOrderCtrl 出库单模块控制器]
   * @method invoicesOrderCtrl
   * @param  {[type]}          $scope      [description]
   * @param  {[type]}          modal       [description]
   * @param  {[type]}          alertWarn   [description]
   * @param  {[type]}          requestData [description]
   * @param  {[type]}          alertOk     [description]
   * @param  {[type]}          alertError  [description]
   * @param  {[type]}          $timeout    [description]
   * @return {[type]}                      [description]
   */
  function invoicesOrderCtrl($scope, modal, alertWarn, requestData, alertOk, alertError, $timeout) {
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

  function invoicesOrderQrcodePrintDialogController ($scope, modal, alertOk, alertWarn, alertError, requestData) {
    // 获取单据中药品列表
    $scope.medicalDataList = angular.copy($scope.dialogData.data);

    // 求在当前商品数量下，所有辅助单位及基本单位的数量集合
    // @param quantity  商品总数
    // @param attributeList  所有辅助单位换算比例的数组，按降序baseUnit
    // @param baseUnit  此商品基本单位
    // @return tmpArr type array 由商品总数按基本单位+辅助单位（降序）换算的数量集合
    $scope.getConverResults = function (quantity, attributeList, baseUnit) {
      if (typeof quantity !== 'number' || Object.prototype.toString.call(attributeList) !== '[object Array]') {
        throw new Error('获取换算字符串失败，参数类型错误');
      }

      var tmpArr = [];
      for (var i = 0; i < attributeList.length; i++) {
        tmpArr.push({
          unitQuantity: Math.floor(quantity / attributeList[i]['ratio']),
          unit: attributeList[i]['name'],
          ratio: attributeList[i]['ratio'],
          baseUnit: baseUnit
        });

        // 重置数量
        if (quantity % attributeList[i]['ratio'] !== 0) {
          quantity = quantity - Math.floor(quantity / attributeList[i]['ratio']) * attributeList[i]['ratio'];
        } else {
          quantity = 0;
        }

      }

      return tmpArr;

    }

    // 二维码请求地址
    var _qrCodeReqUrl = 'rest/authen/qRCode/get.json';

    // 对辅助单位进行排序并生成换算后的显示字符串
    if ($scope.medicalDataList.orderMedicalNos) {
      try {
        angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
          if (!item.othersPackingAttribute) {
            throw new Error('该商品缺失辅助单位设置');
          }

          // 降序排序，也就是包装最大的在前面
          item.othersPackingAttribute.sort(function (a, b) {
            return b['ratio'] - a['ratio'];
          });

          item.othersPackingAttribute.push({
            ratio: 1,
            name: item.packingAttribute.name
          });

          item.converResults = $scope.getConverResults(item.quantity, item.othersPackingAttribute, item.packingAttribute.name);

          requestData(_qrCodeReqUrl,
                     [{
                       orderType: '发货单',
                       orderMedicalNoUuid: item.uuid,
                       orderId: item.id
                     }],
                     'POST', 'params-body')
          .then(function (results) {
            if (results[1].code === 200) {
              item.qrcode = results[1].data[0].qrCode;
            }
          });

          // for (var i = 0; i < item.converResults.length; i++) {
          //   (function() {
          //     var temp = i;
          //     requestData(_qrCodeReqUrl,
          //                [{
          //                  orderType: '发货单',
          //                  orderMedicalNoUuid: item.uuid,
          //                  orderId: item.id
          //                }],
          //                'POST', 'params-body')
          //     .then(function (results) {
          //       if (results[1].code === 200) {
          //         item.converResults[temp].qrcode = results[1].data[0].qrCode;
          //       }
          //     })
          //   })();
          // }
        });
      }
      catch(err) {
        throw new Error(err);
      }
    }

    // 计算打印总计份数
    $scope.calcuAllShare = function (num, data) {
      var _total = 0;
      angular.forEach(data, function (item, index) {
        _total += num * item.unitQuantity;
      });

      return _total;
    }

    console.log($scope.medicalDataList);
  }

  angular.module('manageApp.project')
  .controller('invoicesOrderCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "$timeout", invoicesOrderCtrl])
  .controller('invoicesOrderQrcodePrintDialogController', ['$scope', 'modal', 'alertOk', 'alertWarn', 'alertError', 'requestData', invoicesOrderQrcodePrintDialogController]);
});
