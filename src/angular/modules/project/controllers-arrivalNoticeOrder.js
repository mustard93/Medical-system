define('project/controllers-arrivalNoticeOrder', ['project/init'], function() {
  /**
   * [arrivalNoticeOrderEditCtrl 控制器]
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
    //计算日期
    function   DateAdd(interval,number,date,add)  {//如果add为true则加否则减
        switch(interval) {
              case   "年"   :   {
                      if(add) date.setFullYear(date.getFullYear()+number);
                      else date.setFullYear(date.getFullYear()-number);
                      return   date;
                      break;
              }
              case   "月"   :   {
                      if(add) date.setMonth(date.getMonth()+number);
                      else date.setMonth(date.getMonth()-number);
                      return   date;
                      break;
              }
              case   "日"   :   {
                      if(add) date.setDate(date.getDate()+number);
                      else date.setDate(date.getDate()-number);
                      return   date;
                      break;
              }
              default   :   {
                      date.setDate(d.getDate()+number);
                      return   date;
                      break;
              }
        }

    }
    //生产日期
    $scope.yieldTime = function(tr){
      var IsNewDate = new Date(Number(tr.productionDate));
      var isLose = DateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,true);
      tr.validTill = new Date(isLose).getTime();
    }
    //失效日期
    $scope.loseTime = function(tr){
      var IsNewDate = new Date(Number(tr.validTill));
      var isLose = DateAdd(tr.guaranteePeriodUnit,tr.guaranteePeriod,IsNewDate,false);
      tr.productionDate = new Date(isLose).getTime();
    }

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
        $scope.goTo({tabHref:'#/arrivalNoticeOrder/query.html',tabName:'来货通知单'});
       return;
     }
      if ($scope.submitForm_type == 'submit') {
        var url='rest/authen/arrivalNoticeOrder/updateStatus';
        var data= {id:$scope.formData.id,status:'入库中'};
        requestData(url,data, 'POST')
          .then(function (results) {
            var _data = results[1];
           //  alertOk(_data.message || '操作成功');
            $scope.goTo({tabHref:'#/arrivalNoticeOrder/get.html?id='+$scope.formData.id,tabName:'来货通知单'});

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

  /**
   * [arrivalBarcodePrintDialogController 来货通知单模块中条码打印弹出层控制器]
   * @method arrivalBarcodePrintDialogController
   * @param  {[type]}                            $scope      [description]
   * @param  {[type]}                            modal       [description]
   * @param  {[type]}                            alertOk     [description]
   * @param  {[type]}                            alertWarn   [description]
   * @param  {[type]}                            alertError  [description]
   * @param  {[type]}                            requestData [description]
   * @return {[type]}                                        [description]
   */
  function arrivalBarcodePrintDialogController ($scope, modal, alertOk, alertWarn, alertError, requestData, OPrinter, $timeout,$compile) {
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
          $scope.notInstallPrintPlusin = true;
        }
      }, 1000);
    };

    // 定义条码请求地址
    var _barCodeReqUrl = 'rest/authen/invoiceBarCode/get.json';

    // 对辅助单位进行排序并生成换算后的显示字符串
    if ($scope.medicalDataList.orderMedicalNos) {
      try {
        var _data = [];
        angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
          _data.push({
            invoiceId: $scope.medicalDataList.id,
            barcode:item.barcode,
            quantity: item.quantity,
            productionBatch: item.productionBatch !== '默认批号' ? item.productionBatch : null,
            validTill: item.validTill
          });
        });

        requestData(_barCodeReqUrl, _data, 'POST', 'params-body')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.barCodeDataList = results[1].data;
          }
        })  // http://localhost:3000/src/dt/rest/arrivalNoticeOrder/get.json

      }
      catch(err) {
        throw new Error(err);
      }
    }




    // if ($scope.medicalDataList.orderMedicalNos) {
    //   try {
    //     angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
    //
    //       if (item.othersPackingAttribute) {
    //         // 降序排序，也就是包装最大的在前面
    //         item.othersPackingAttribute.sort(function (a, b) {
    //           return b['ratio'] - a['ratio'];
    //         });
    //       } else {
    //         item.othersPackingAttribute = [];
    //       }
    //
    //       item.othersPackingAttribute.push({
    //         ratio: 1,
    //         name: item.packingAttribute.name
    //       });
    //
    //       item.converResults = $scope.getConverResults(item.quantity, item.othersPackingAttribute, item.packingAttribute.name);
    //
    //       for (var i = 0; i < item.converResults.length; i++) {
    //         (function() {
    //           var temp = i;
    //           requestData(_barCodeReqUrl,
    //                      [{
    //                        id: $scope.medicalDataList.id,
    //                        barcode:item.barcode,
    //                        quantity: item.converResults[temp].ratio,
    //                        productionBatch: item.productionBatch !== '默认批号' ? item.productionBatch : null,
    //                        validTill: item.validTill
    //                      }],
    //                      'POST', 'params-body')
    //           .then(function (results) {
    //             if (results[1].code === 200) {
    //               item.converResults[temp].barcode = results[1].data[0].barcode;
    //             }
    //           })
    //         })();
    //       }
    //
    //       // 构建显示换算单位字符串
    //       item.converStr = item.quantity + item.unit + ' = ';
    //       angular.forEach(item.converResults, function (data, index) {
    //         if ((index + 1) !== item.converResults.length) {
    //           item.converStr += data.unitQuantity + data.unit + ' + ';
    //         } else {
    //           item.converStr += data.unitQuantity + data.unit;
    //         }
    //
    //       });
    //
    //     });
    //   }
    //   catch(err) {
    //     throw new Error(err);
    //   }
    // }

    // 打印
    // @param printType 打印类型：preview为预览(默认)，print为直接打印
    $scope.barCodePrint = function (printType) {
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
      var getConfUrl = 'rest/authen/uiCustomHtml/getByKey.json?key=barcodePrint';
      requestData(getConfUrl)
      .then(function (results) {
        // 定义从系统获取的纸张大小
        // $scope.uiCustomHtml = results[0];
        var uiCustomHtml= results[0];
        // 设定纸张大小
        LODOP.SET_PRINT_PAGESIZE(uiCustomHtml.print_orient, uiCustomHtml.paper_width, uiCustomHtml.paper_height, "");
        var firstPage=true;
        // 遍历数据设置每张打印
        angular.forEach($scope.barCodeDataList, function (item, index) {
          angular.forEach(item.barCodeVos, function (item2, index) {
            for (var i = 0; i < item2.stockBatch.length; i++) {
              if (item2.stockBatch[i].unitNumber !== 0) {
                for (var j = 0; j < item2.stockBatch[i].unitNumber; j++) {
                  // var printScope = new Scope();
                  var printScope = $scope.$new(true);
                  printScope.medicalItem=item;//药械信息
                  printScope.converResult=item2.stockBatch[i];//条码信息
                  printScope.supplier=$scope.medicalDataList.supplier;//供应商信息
                  printScope.intentionalCustomer=$scope.medicalDataList.intentionalCustomer;//货主信息


                  var tmpHtml=uiCustomHtml.html;
                  tmpHtml=tmpHtml.replace(/\{\{medicalItem.name\}\}/g, printScope.medicalItem.productName||"");
                  tmpHtml=tmpHtml.replace(/\{\{medicalItem.specificationAndModelType\}\}/g,   printScope.medicalItem.specificationAndModelType||"");
                  tmpHtml=tmpHtml.replace(/\{\{medicalItem.validTill\}\}/g,   getDateFormat(printScope.medicalItem.validTill)||"");


                  tmpHtml=tmpHtml.replace(/\{\{converResult.barcode\}\}/g,   printScope.converResult.barcode||"");
                  tmpHtml=tmpHtml.replace(/\{\{converResult.unit\}\}/g,   printScope.converResult.unit||"");

                  tmpHtml=tmpHtml.replace(/\{\{intentionalCustomer.intentionalCustomer\}\}/g,   printScope.intentionalCustomer||"");
                  tmpHtml=tmpHtml.replace(/\{\{supplier.name\}\}/g,   printScope.supplier.name||"");

                  // tmpHtml=tmpHtml.replace(/\{\{converResult.barcode\}\}/g, converResult.barcode);
                  // tmpHtml=tmpHtml.replace(/\{\{converResult.barcode\}\}/g, converResult.barcode);


                  var printHtml =tmpHtml;

                  //   var compileFn = $compile(uiCustomHtml.html);
                  // // 传入scope，得到编译好的dom对象(已封装为jqlite对象)
                  // // 也可以用$scope.$new()创建继承的作用域
                  // var complieDom = compileFn(printScope);
                  // var printHtml =complieDom[0].outerHTML;
                  //
                  //
                  //
                  // $("#barCodePrint_divid").append(complieDom);
                  //   console.log("barCodePrint_divid",$("#barCodePrint_divid").html());

                  if(firstPage){
                    firstPage=false;
                  }else{
                    LODOP.NewPage();
                  }

                  console.log("printHtml",printHtml);
                  LODOP.ADD_PRINT_HTM(uiCustomHtml.html_top,uiCustomHtml.html_left,uiCustomHtml.html_width,uiCustomHtml.html_height, printHtml);

                }//end for
              }// end   if
            }//end for
          });
        });
        LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);
        LODOP.SET_PRINT_COPIES($scope.scopeData.num);

        if (printType === 'preview') {
          LODOP.PREVIEW();
        } else if (printType === 'print') {
          LODOP.PRINT();
        }

      });

    }//barCodePrint

    // 打印(不在使用)
    // @param printType 打印类型：preview为预览(默认)，print为直接打印
    $scope.barCodePrint_bak = function (printType) {
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
      var getConfUrl = 'rest/authen/uiCustomHtml/getByKey.json?key=barcodePrint';
      requestData(getConfUrl)
      .then(function (results) {
        // 定义从系统获取的纸张大小
        $scope.printPageSize = {
          w: parseInt(results[1].data.paper_width, 10),
          h: parseInt(results[1].data.paper_height, 10)
        }

        // 设定纸张大小
        LODOP.SET_PRINT_PAGESIZE(1, $scope.printPageSize.w * 10, $scope.printPageSize.h * 10, "");

        // 遍历数据设置每张打印
        angular.forEach($scope.medicalDataList.orderMedicalNos, function (item, index) {
          for (var i = 0; i < item.converResults.length; i++) {
            if (item.converResults[i].unitQuantity !== 0) {

              for (var j = 0; j < item.converResults[i].unitQuantity; j++) {
                var printHtml = '<div style="padding:10px;">' +
                                  '<div style="margin-bottom:5px;">' +
                                      '<div style="margin-bottom:10px;text-align:center;"><img src="' + item.converResults[i].barcode + '"></div>' +
                                      '<div style="clear:both;">' +
                                        '<span style="float:left;">'+ item.name +'</span>' +
                                        '<span style="float:right;">包装单位：'+ item.converResults[i].unit +'</span>' +
                                      '</div>' +
                                  '</div>' +
                                  '<p style="height:1px;border-top:1px dashed #ccc;margin-top:45px;"></p>' +
                                  '<div style="font-size:13px">' +
                                    '<div style="margin-bottom:5px;">' +
                                      '<span style="margin-right:30px;">规格/型号：'+ item.specificationAndModelType +'</span>' +
                                      '<span>有效期至：' + getDateFormat(item.validTill) + '</span>' +
                                    '</div>' +
                                    '<div style="margin-bottom:5px;">货主：'+ $scope.medicalDataList.intentionalCustomer +'</div>' +
                                    '<div>生产企业：'+ $scope.medicalDataList.supplier.name +'</div>' +
                                  '</div>' +
                                '</div>';

                LODOP.NewPage();
                LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", printHtml);

              }
            }
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
      //
      //           for (var j = 0; j < item.converResults[i].unitQuantity; j++) {
      //             var printHtml = '<div style="padding:10px;">' +
      //                               '<div style="margin-bottom:5px;">' +
      //                                   '<div style="margin-bottom:10px;text-align:center;"><img src="' + item.converResults[i].barcode + '"></div>' +
      //                                   '<div style="clear:both;">' +
      //                                     '<span style="float:left;">'+ item.name +'</span>' +
      //                                     '<span style="float:right;">包装单位：'+ item.converResults[i].unit +'</span>' +
      //                                   '</div>' +
      //                               '</div>' +
      //                               '<p style="height:1px;border-top:1px dashed #ccc;margin-top:45px;"></p>' +
      //                               '<div style="font-size:13px">' +
      //                                 '<div style="margin-bottom:5px;">' +
      //                                   '<span style="margin-right:30px;">规格/型号：'+ item.specificationAndModelType +'</span>' +
      //                                   '<span>有效期至：' + getDateFormat(item.validTill) + '</span>' +
      //                                 '</div>' +
      //                                 '<div style="margin-bottom:5px;">货主：'+ $scope.medicalDataList.intentionalCustomer +'</div>' +
      //                                 '<div>生产企业：'+ $scope.medicalDataList.supplier.name +'</div>' +
      //                               '</div>' +
      //                             '</div>';
      //
      //             LODOP.NewPage();
      //             LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", printHtml);
      //
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
    }//barCodePrint_bak

    // 监控打印份数的设置i，只能为两位正整数  item.validTill
    $scope.$watch('scopeData.num', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if (parseInt(newVal, 10) > 99) { $scope.scopeData.num = oldVal; }
      }
    })

    // 返回特定时间戳的日期
    var getDateFormat = function (time) {
      if (time) {
        return new Date(time).getFullYear() + '-' + (new Date(time).getMonth() + 1) + '-' + new Date(time).getDay();
      } else {
        return '暂无';
      }
    }



  }

  /**
   * [barcodePrintDialogItemController 条码打印中每个商品的每个单位条码控制器]
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
  function barcodePrintDialogItemController ($scope, modal, alertOk, alertWarn, alertError, requestData, OPrinter, $timeout) {
    $scope.originData = [];

    // 记录原始值
    $scope.saveOriginData = function (originData) {
      angular.copy(originData, $scope.originData);
    }

    // 用户修改数量后的操作
    $scope.chgThisUnitQuantity = function (unitNumber, index) {

      var _temp = ($scope.originData[index].unitNumber - unitNumber) * $scope.originData[index].ratios;
          _temp = parseInt(_temp / $scope.originData[index+1].ratios, 10);

      $scope.mItem.stockBatch[index+1].unitNumber = $scope.mItem.stockBatch[index+1].unitNumber + _temp;
      angular.copy($scope.mItem.stockBatch, $scope.originData);
    }

  }

  angular.module('manageApp.project')
  .controller('arrivalNoticeOrderEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", arrivalNoticeOrderEditCtrl])
  .controller('arrivalBarcodePrintDialogController', ['$scope', 'modal', 'alertOk', 'alertWarn', 'alertError', 'requestData', 'OPrinter', '$timeout','$compile', arrivalBarcodePrintDialogController])
  .controller('barcodePrintDialogItemController', ['$scope', 'modal', 'alertOk', 'alertWarn', 'alertError', 'requestData', 'OPrinter', '$timeout', barcodePrintDialogItemController]);
});
