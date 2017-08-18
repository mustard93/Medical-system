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
      $scope.submitFormValidator(fromId);

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

  function invoicesOrderQrcodePrintDialogController ($scope, modal, alertOk, alertWarn, alertError, requestData, OPrinter, $timeout) {
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

    // 检测用户是否安装打印插件
    $scope.loadCLodop = function () {
      $timeout(function () {
        if (!OPrinter.chkOPrinter()) {
          $scope.notInstallPlusin = true;
        }
      }, 1000);
    };

    // 二维码请求地址
    var _qrCodeReqUrl = 'rest/authen/qRCode/get.json';

    // 对辅助单位进行排序并生成换算后的显示字符串
    if ($scope.medicalDataList.orderMedicalNos) {
      try {
        angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
          // if (!item.othersPackingAttribute) {
          //   throw new Error('该商品缺失辅助单位设置');
          // }

          // 降序排序，也就是包装最大的在前面
          if (item.othersPackingAttribute) {
            // 降序排序，也就是包装最大的在前面
            item.othersPackingAttribute.sort(function (a, b) {
              return b['ratio'] - a['ratio'];
            });
          } else {
            item.othersPackingAttribute = [];
          }

          item.othersPackingAttribute.push({
            ratio: 1,
            name: item.packingAttribute.name
          });

          item.converResults = $scope.getConverResults(item.quantity, item.othersPackingAttribute, item.packingAttribute.name);

          requestData(_qrCodeReqUrl,
                     [{
                       orderType: '发货单',
                       orderMedicalNoUuid: item.uuid,
                       orderId: $scope.medicalDataList.id
                     }],
                     'POST', 'params-body')
          .then(function (results) {
            if (results[1].code === 200) {
              item.qrcode = results[1].data[0].qrCode;
            }
          });

          // 构建显示换算单位字符串
          item.converStr = item.quantity + item.unit + ' = ';
          angular.forEach(item.converResults, function (data, index) {
            if ((index + 1) !== item.converResults.length) {
              item.converStr += data.unitQuantity + data.unit + ' + ';
            } else {
              item.converStr += data.unitQuantity + data.unit;
            }

          });

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

    // 打印
    // @param printType 打印类型：preview为预览(默认)，print为直接打印
    $scope.qrCodePrint = function (printType) {
      if (!LODOP) {
        throw new Error('打印插件加载错误！');
      } else {
        LODOP.SET_LICENSES("四川盘谷智慧医疗科技有限公司","160CB03308929656138B8125A87D070B","","");
      }

      // 默认打印行为是预览，指定print为直接打印
      if (!printType) {
        printType = 'preview';
      }

      // 获取系统配置的纸张大小
      var getConfUrl = 'rest/authen/uiCustomHtml/getByKey.json?key=qrcodePrint';
      requestData(getConfUrl)
      .then(function (results) {
        // 定义从系统获取的纸张大小
        var uiCustomHtml= results[0];
        // 设定纸张大小
        LODOP.SET_PRINT_PAGESIZE(uiCustomHtml.print_orient, uiCustomHtml.paper_width, uiCustomHtml.paper_height, "");
        var firstPage=true;
        // 遍历数据设置每张打印
        angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
          // 当前商品获取打印数量
          var _tmpNum = 0;
          for (var i = 0; i < item.converResults.length; i++) {
            _tmpNum += parseInt(item.converResults[i].unitQuantity, 10);
          }

          // 循环遍历打印总数
          for (var i = 0; i < _tmpNum; i++) {
            var printScope = $scope.$new(true);
            printScope.qrcode=item.qrcode;//条码信息
            printScope.medicalName=item.name;//商品名称
            printScope.customerName=$scope.medicalDataList.customerName;//客户名称


            var tmpHtml=uiCustomHtml.html;
            tmpHtml=tmpHtml.replace(/\{\{qrcode\}\}/g, printScope.qrcode||"");
            tmpHtml=tmpHtml.replace(/\{\{medicalName\}\}/g,   printScope.medicalName||"");
            tmpHtml=tmpHtml.replace(/\{\{customerName\}\}/g,    printScope.customerName||"");

            var printHtml =tmpHtml;

            if(firstPage){
              firstPage=false;
            }else{
              LODOP.NewPage();
            }

            console.log("printHtml",printHtml);
            LODOP.ADD_PRINT_HTM(uiCustomHtml.html_top,uiCustomHtml.html_left,uiCustomHtml.html_width,uiCustomHtml.html_height, printHtml);
          }
        });
        LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);
        LODOP.SET_PRINT_COPIES($scope.scopeData.num);

        if (printType === 'preview') {
          LODOP.PREVIEW();
        } else if (printType === 'print') {
          LODOP.PRINT();
        }
      });

      // $scope.$watchCollection('printPageSize', function (newVal, oldVal) {
      //   if (newVal && newVal !== oldVal) {
      //     LODOP.SET_PRINT_PAGESIZE(1, $scope.printPageSize.w * 10, $scope.printPageSize.h * 10, "");
      //
      //     angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
      //       for (var i = 0; i < item.converResults.length; i++) {
      //         if (item.converResults[i].unitQuantity !== 0) {
      //           for (var j = 0; j < item.converResults[i].unitQuantity; j++) {
      //             var printHtml = '<div style="padding-top:5px;">' +
      //                               '<div style="text-align:center;"><img src="' + item.qrcode + '" style="width:150px;height:150px;"></div>' +
      //                               '<div style="text-align:center;font-size:13px;color:#333;">' +
      //                                 '<p>' + item.name + '</p>' +
      //                                 '<p>客户：' + $scope.medicalDataList.customerName + '</p>' +
      //                               '</div>' +
      //                             '</div>';
      //
      //             LODOP.NewPage();
      //             LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", printHtml);
      //           }
      //         }
      //       }
      //     });
      //     LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);
      //     LODOP.SET_PRINT_COPIES($scope.scopeData.num);
      //
      //     if (printType === 'preview') {
      //       LODOP.PREVIEW();
      //     } else if (printType === 'print') {
      //       LODOP.PRINT();
      //     }
      //   }
      // });

    }

    // 监控打印份数的设置i，只能为两位正整数
    $scope.$watch('scopeData.num', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if (parseInt(newVal, 10) > 99) { $scope.scopeData.num = oldVal; }
      }
    })

  }

  /**
   * [barcodePrintDialogItemController 二维码打印中每个商品的每个单位条码控制器]
   * @method barcodePrintDialogItemController
   * @param  {[type]}                         $scope      [description]
   * @param  {[type]}                         modal       [description]
   * @param  {[type]}                         alertOk     [description]
   * @param  {[type]}                         alertWarn   [description]
   * @param  {[type]}                         alertError  [description]
   * @param  {[type]}                         requestData [description]
   * @param  {[type]}                         OPrinter    [description]
   * @param  {[type]}                         $timeout    [description]
   * @return {[type]}                                     [description]
   */
  function qrcodePrintDialogItemController ($scope, modal, alertOk, alertWarn, alertError, requestData, OPrinter, $timeout) {
    $scope.originData = [];

    // 记录原始值
    $scope.saveOriginData = function (originData) {
      angular.copy(originData, $scope.originData);
    }

    // 用户修改数量后的操作
    $scope.chgThisUnitQuantity = function (unitQuantity, converResults, index) {
      var _temp = ($scope.originData.converResults[index].unitQuantity - unitQuantity) * converResults[index].ratio;
          _temp = parseInt(_temp / converResults[index+1].ratio, 10);

      converResults[index+1].unitQuantity = $scope.originData.converResults[index+1].unitQuantity + _temp;
      angular.copy(converResults, $scope.originData.converResults);
    }
  }

  angular.module('manageApp.project')
  .controller('invoicesOrderCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', '$timeout', invoicesOrderCtrl])
  .controller('invoicesOrderQrcodePrintDialogController', ['$scope', 'modal', 'alertOk', 'alertWarn', 'alertError', 'requestData', 'OPrinter', '$timeout', invoicesOrderQrcodePrintDialogController])
  .controller('qrcodePrintDialogItemController', ['$scope', 'modal', 'alertOk', 'alertWarn', 'alertError', 'requestData', 'OPrinter', '$timeout', qrcodePrintDialogItemController]);
});
