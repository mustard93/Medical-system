/**
 * Created by hao on 15/11/5.
 */
define('project-PG16-H/controllers', ['project-PG16-H/init'], function() {

  // SPD系统-库存调整controller
  function  inventoryAdjustmentOrderCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

      //调整
      $scope.flag=false;

      $scope.watchFormChange=function(watchName){
          watchFormChange(watchName,$scope);
      };
      modal.closeAll();



      // 向列表添加数据的回调函数
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

          if (!$scope.formData.orderMedicalNos) {
              $scope.formData.orderMedicalNos = [];
          }

          // 如果已添加
          // if ($scope.formData.orderMedicalNos.length !== 0) {
          //     var _len = $scope.formData.orderMedicalNos.length;
          //     for (var i=0; i<_len; i++) {
          //         if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
          //             alertWarn('此药械已添加到列表');
          //             return false;
          //         }
          //     }
          // }

          // 添加药品后请求当前药品的历史价格
          // if (addDataItem) {
          //     var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售',
          //         _data = {};
          //
          //     requestData(_url, _data, 'GET')
          //         .then(function (results) {
          //             var _resObj = results[1].data;
          //             for (var item in _resObj) {
          //                 if (item === addDataItem.relId && _resObj[item]) {
          //                     addDataItem.strike_price = _resObj[item].value;
          //                 } else {
          //                     addDataItem.strike_price = '';
          //                 }
          //             }
          //         })
          //         .catch(function (error) {
          //             if (error) { console.log(error || '出错!'); }
          //         });
          // }
          //

          //添加到列表
          $scope.formData.orderMedicalNos.push(addDataItem);
          $scope.flag=false;

          return true;
      };


      // 提交后的回启动任务流
      $scope.submitFormAfter = function() {

          console.log("执行回调任务流程。。。");

          console.log("$scope.formData:",$scope.formData);


          if ($scope.submitForm_type == 'submit') {
              var _url='rest/authen/inventoryAdjustmentOrder/startProcessInstance';
              var data= { businessKey:$scope.formData.id };
              requestData(_url, data, 'POST')
                  .then(function (results) {
                      var _data = results[1];
                      //  alertOk(_data.message || '操作成功');


                      $scope.goTo('#/inventoryAdjustmentOrder/get.html?id='+$scope.formData.id+'&businessKey='+$scope.formData.id);

                  })
                  .catch(function (error) {
                      alertError(error || '出错');
                  });
          }

          if ($scope.submitForm_type == 'exit') {
              $scope.goTo('#/inventoryAdjustmentOrder/query.html');
              return;
          }


      };






      // 保存 type:save-草稿,submit-提交订单。
      $scope.submitForm = function(fromId, type) {

          $scope.submitForm_type = type;
          if ($scope.submitForm_type == 'submit') {
              $scope.formData.validFlag = true;
          }
          $('#' + fromId).trigger('submit');
      };



      // 侧边栏选择生产批号
      $scope.spdChoiseBatchs = function (obj,choisedList,id,goodsCount,strikePrice,index) {

          // 异常处理
          // if (!obj || !choisedList || !goodsCount || !strikePrice) {
          //   throw new Error('Parameters are required');
          // }


          console.log("obj",obj);

          // 构建临时对象存储批号id、批号名和数量
          var _tmp = {
              stockBatchId: obj.id,                     // 批次号id

              batchNumber: obj.productionBatch,

              quantity: 0,//obj.stockModel.salesQuantity,    // 可选数量
              goodsCount: obj.stockModel.salesQuantity,
              productionBatch: obj.productionBatch,     // 批号名
              validTill:obj.validTill,
              productionDate:obj.productionDate,
              sterilizationBatchNumber: obj.sterilizationBatchNumber ,   // 灭菌批号


              storeRoomId:obj.storeRoomId,//仓库ID
              regionId:obj.regionId,//区域ID
              goodsLocationId:obj.goodsLocationId,// 货位ID
              goodsLocationCode:obj.goodsLocationCode//货位编号


          };
          $scope.quantityError=true;

          if($scope.formData.type=='报损'){
              _tmp.quantity=obj.stockModel.salesQuantity;
              if (obj.stockModel.salesQuantity<=0) {
                $scope.quantityError=true;
              }else{
                $scope.quantityError=false;
              }
          }



          angular.forEach($scope.formData.orderMedicalNos,function (item,index2) {
              if(item.relId==id){
                  $scope.formData.orderMedicalNos[index].choisedBatchList2.push(_tmp);
              }
          });


          $scope.formData.orderMedicalNos[index].stockBatchs[0]=_tmp;

          // 根据药品id将批次存入当前药品formData数据中

          $scope.formData.orderMedicalNos[index].storeRoomName = obj.storeRoomName;       // 仓库名

          // $scope.formData.orderMedicalNos[index].storeRoomId = obj.storeRoomId;       // 仓库名
          $scope.formData.orderMedicalNos[index].regionName = obj.regionName;       // 区域名称

          // $scope.formData.orderMedicalNos[index].regionId = obj.regionId;       // 仓库名

          $scope.formData.orderMedicalNos[index].goodsLocationCode = obj.goodsLocationCode;       // 货位编号
          $scope.formData.orderMedicalNos[index].goodsLocationName = obj.goodsLocationName;       // 货位名称
          $scope.formData.orderMedicalNos[index].goodsLocationId = obj.goodsLocationId;       // 货位ID

          $scope.formData.orderMedicalNos[index].productionDate=obj.productionDate;//生产日期
          $scope.formData.orderMedicalNos[index].validTill= obj.validTill;//有效期至



          $scope.flag=true;
      };


      //获取商品已选择的批次-
      $scope.getGoodsBatchs=function (goodsRelId,batchId) {
          var arr=[];
          angular.forEach( $scope.formData.orderMedicalNos, function(data,index){

              if(data.relId==goodsRelId){

                  if(data.stockBatchs.length>0){
                      arr.push( data.stockBatchs[0].stockBatchId);
                  }
              }
          });


          var flag=false;

          for(var i=0; i<arr.length; i++){

              if (batchId==arr[i]){
                  flag=true;
                  break;
              }
          }
          return flag;
      };

      $scope.changeQuantity=function(quantity){
        if(quantity>0){
          $scope.quantityError=false;
        }else{
          $scope.quantityError=true;
        }
      }
  }

  // SPD系统-库存调整-右侧弹出框 controller
  function inventoryAdjustmentOrderDialogCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

      $scope.getGoodsBatchsData=function (listParams) {

          // console.log("listParams",$scope.listParams,listParams);

          var _url = 'rest/authen/medicalStock/queryStockBatch',

              // relMedicalStockId={{dialogData.id}}&
              // logisticsCenterId={{dialogData.logisticsCenterId}}
              // warehouseId={{dialogData.sourceId}}&
              // isOnlyAvailable=true&warehouseType=正常库"

              _data = {
                  relMedicalStockId: $scope.dialogData.id,

                  storeRoomId: listParams.storeRoomId,
                  // createAtBeg: listParams.createAtBeg,
                  // createAtEnd: listParams.createAtEnd,

                  regionId:listParams.regionId,
                  goodsLocationId:listParams.goodsLocationId,

                  q: listParams.q||'',

                  // warehouseType: '正常库',

                  isOnlyAvailable:false// ($scope.dialogData.type=="报溢")
              };


          console.log(angular.toJson(_data,true));

          requestData(_url, _data, 'GET')
              .then(function (results) {
                  if (results[1].data) { $scope.stockBatchList = results[1].data; }
              });

      };

  }

  //  SPD系统—商品信息管理模块controller
  function medicalStockCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };

    $scope.reloadQuery =function (){
      var _data={};
      requestData('rest/authen/medicalStockStrategy/query', _data, 'GET')
      .then(function (results) {
        if (results[1].code === 200) {
          $scope.tbodyList = results[1].data;
          utils.goTo('#/medicalStock/query.html?type=库存');
        }
      })
      .catch(function (error) {
        alertWarn(error || '出错');
      });
    };
    // 点击新增商品单位信息，新增一条商品辅助单位
    $scope.addMedicalUnit = function(){
      // 判断othersPackingAttribute对象是否是空值，如果是，就新建一个为空的数组，不是则直接就把新的一条辅助单位的数据加入数组
      if (!$scope.formData.othersPackingAttribute) {
        $scope.formData.othersPackingAttribute=[];
      }
      var otherPobject={
        type:"辅助单位",
        name:"",
        ratio:"",
        barcode:"",
        bidPrice:"",
        length:"",
        width:"",
        height:"",
        unitWeightKg:""
      };
      if($scope.formData.othersPackingAttribute){
      $scope.formData.othersPackingAttribute.push(otherPobject);
      }else{
        $scope.formData.othersPackingAttribute.push(otherPobject);
      }
    };

    $scope.changeUnit = function (unit_name,othersPackingAttribute,packingAttribute_name){
      var packing_unit=[];
      if(!packingAttribute_name){
        return;
      }
      if(packingAttribute_name){
        packing_unit.push(packingAttribute_name);
      }

     if(othersPackingAttribute && othersPackingAttribute.length!==0){
        for (var i = 0; i < othersPackingAttribute.length; i++) {
          packing_unit.push(othersPackingAttribute[i].name);
        }
      }
      if(unit_name){
          packing_unit.push(unit_name);
      }
      packing_unit.pop();
      // 判断是否有重复单位出现
      for (var i = 0; i < packing_unit.length-1;i++) {
        for (var j = i+1; j < packing_unit.length; j++) {
          if(packing_unit[i]===packing_unit[j]){
            $scope.showUnit=true;
            return;
          }
        }
      }
      $scope.showUnit=false;
    }

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
    $scope.clearQuantity =function(){
      if(!$scope.formData.id){
        $scope.formData.guaranteePeriodAlarmDay='';
        $scope.formData.purchaseQuantity='';
        $scope.formData.inventoryCap='';
        $scope.formData.inventoryLimit='';
        return;
      }
      return;
    }


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
  }

  function medicalStockStrategyCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {
    // 定义存放用户选择药品的列表
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

    };
    // 全选全不选
    $scope.handleChoiseAllEvent = function () {
      if ($scope.isChoiseAll) {
        if ($scope.tbodyList) {
          $scope.choisedMedicalIdList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalIdList.push(data.id);
          });
        }
        console.log($scope.choisedMedicalIdList);
      } else {
        $scope.choisedMedicalIdList = [];
      }
    };

    // 批量删除
    $scope.handleBatchDelete = function (id) {
      if ($scope.choisedMedicalIdList.length) {
        var _data = {
          id: id,
          ids: $scope.choisedMedicalIdList
        };
        requestData('rest/authen/medicalStockStrategy/delete', _data, 'POST')
        .then(function (results) {
          console.log('_data'+_data);
          if (results[1].code === 200) {
            utils.goTo('#/medicalStock/query.html?type=库存');
            $scope.isChoiseAll = false;
          }
        })
        .catch(function (error) {
          alertWarn(error || '出错');
        });
      console.log($scope.choisedMedicalIdList);
      }
    };

    $scope.deleteOne = function (id) {
      var medicalId=[];
      medicalId.push(id);
      console.log(medicalId);
      var _data ={
        ids:medicalId
      };
        requestData('rest/authen/medicalStockStrategy/delete', _data, 'POST')
        .then(function (results) {
          console.log('_data'+_data);
          if (results[1].code === 200) {
          utils.goTo('#/medicalStock/query.html?type=库存');
          }
        })
        .catch(function (error) {
          alertWarn(error || '出错');
        });
    };

    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
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
  }

  // 收货单模块controller
  function receiveItemController ($scope, watchFormChange, requestData, utils, alertError, alertWarn, alertOk) {

    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];

    // 结束收货
    $scope.endReceipt = function (id) {
      if (id) {
        requestData('rest/authen/receiveItem/endReceipt?id=' + id, '', 'POST')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.refreshHref();
            alertOk('操作成功');
          }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
      }
    };

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedMedicalList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          if (item.id === $scope.choisedMedicalList[i]) {
            $scope.choisedMedicalList.splice(i,1);
          }
        }
      }
    };

    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中

        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedMedicalList = [];
      }
    };


    // 全选全不选
    // $scope.handleChoiseAllEvent = function () {
    //   console.log($scope.isChoiseAll);
    //   if ($scope.isChoiseAll) {
    //     console.log(2);
    //     if ($scope.tbodyList) {
    //       $scope.choisedMedicalList = [];
    //       angular.forEach($scope.tbodyList, function (data, index) {
    //         $scope.choisedMedicalList.push(data.id);
    //       });
    //       console.log($scope.choisedMedicalList);
    //     }
    //   } else {
    //     $scope.choisedMedicalList = [];
    //   }
    // };

    // 批量收货
    $scope.handleBatchReceive = function () {
      if ($scope.choisedMedicalList.length) {

        requestData('rest/authen/receiveItem/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.refreshHref();
          }
        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });
      }
    };

    // 立即匹配操作
    $scope.onceMatch = function (item) {
      if (item) {
        var _data = {
          supplierId: item.hospitalSupplierId,
          distributorId: item.distributorId,
          distributorMedicalId: item.distributorMedicalId,
          distributorMedicalCode: item.distributorMedicalCode
        };

        requestData('rest/authen/purchasecontentmedical/onceMatch', _data)
        .then(function (results) {
          if (results[1].code === 200) { utils.refreshHref(); }
        })
        .catch(function (error) {
          if (error) throw new Error(error);
        });
      }
    };

  }

  // 采购计划controller
  function purchasePlanOrderController($scope, modal,alertWarn,alertError,requestData,watchFormChange, dialogConfirm) {

    // 定义商品总价变量
    $scope.totalPrice = null;

    // 数量和价格变化时调用计算总价
    $scope.calcTotalPrice = function (orderMedicalNos,obj) {
      var _total = 0;
      if (orderMedicalNos.length) {
        angular.forEach(orderMedicalNos, function (data, index) {
          _total += data.strike_price * data.quantity;
        });
      }
      $scope.totalPrice = _total;
    };

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
          $scope.goTo('#/purchasePlanOrder/query.html');
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
          var _url='rest/authen/purchasePlanOrder/startProcessInstance';
          var data= {businessKey:$scope.formData.id};
          requestData(_url,data, 'POST')
            .then(function (results) {
              var _data = results[1];
              $scope.goTo('#/purchasePlanOrder/get.html?id='+$scope.formData.id);
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
    // $scope.handleMessageShow = function (obj) {
    //   if (obj.operationFlowSet) {
    //     // console.log(obj.operationFlowSet);
    //     angular.forEach(obj.operationFlowSet, function (item, index) {
    //       if (item.status === obj.orderStatus) { obj.note = item.key; }
    //     });
    //   }
    // };

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

  // 主控（业务模块级别）
  function mainCtrlProjectPG16H($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,bottomButtonList,saleOrderUtils,purchaseOrderUtils,requestPurchaseOrderUtils,queryItemCardButtonList2,customMenuUtils) {

    //底部菜单（业务相关）
    $rootScope.bottomButtonList=bottomButtonList;
    $rootScope.saleOrderUtils=saleOrderUtils;
    $rootScope.purchaseOrderUtils=purchaseOrderUtils;
    $rootScope.requestPurchaseOrderUtils=requestPurchaseOrderUtils;
    $rootScope.queryItemCardButtonList2=queryItemCardButtonList2;
    $rootScope.customMenuUtils=customMenuUtils;

  }

  // SPD采购目录模块控制器
  function purchaseContentController ($scope, modal, alertWarn, watchFormChange, requestData, utils) {

    // 定义存放用户选择药品的列表
    $scope.choisedMedicalIdList = [];

    // 向列表添加数据的回调函数
    $scope.flashAddDataCallbackFn = function(flashAddData) {

      // if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
      //   alertWarn("请选择药品");
      //   return ;
      // }
      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      // 检查数据是否已被添加
      var _supplierId = $scope.mainStatus.pageParams.supplierId,    // 供应商id
          _medicalId = addDataItem.id;   // 药械id

      requestData('rest/authen/purchasecontentmedical/isExist?supplierId='+_supplierId+'&medicalId='+_medicalId)
      .then(function (results) {
        if (results[1].code === 200) {
          // 添加到后台
          var _data = {
            relId: $scope.mainStatus.pageParams.id,
            supplierId: $scope.mainStatus.pageParams.supplierId,
            distributorId: $scope.formData.distributorId,
            medical: addDataItem
          };

          requestData('rest/authen/purchasecontentmedical/save', _data, 'POST', 'parameter-body')
          .then(function (results) {
            if (results[1].code === 200) {
              utils.refreshHref();
              // _reloadListData('rest/authen/purchasecontentmedical/query?supplierId=' + $scope.mainStatus.pageParams.supplierId);
            }
          })
          .catch(function (error) {
            alertWarn(error || '添加药品失败');
          });
        }
      })
      .catch(function (error) {
        if (error) {
          alertWarn(error || '出错');
          return false;
        }
      });

      return true;
    };

    // 删除某条信息
    $scope.handleDelThisItem = function (id,distributorId,hospitalSupplierId) {
      if (id) {
        var _url = 'rest/authen/purchasecontentmedical/delete?ids=' + id + '&distributorId=' + distributorId + '&supplierId=' + hospitalSupplierId;
        requestData(_url)
        .then(function (results) {
          if (results[1].code === 200) {
            utils.refreshHref();
            // _reloadListData('rest/authen/purchasecontentmedical/query?supplierId=' + $scope.mainStatus.pageParams.supplierId);
          }
        })
        .catch(function (error) {
          alertWarn(error || '删除出错');
        });
      }
    };

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
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function () {
      if ($scope.isChoiseAll) {
        if ($scope.tbodyList) {
          $scope.choisedMedicalIdList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalIdList.push(data.id);
          });
        }
      } else {
        $scope.choisedMedicalIdList = [];
      }
    };

    // 批量删除
    $scope.handleBatchDelete = function (supplierId,distributorId) {
      if ($scope.choisedMedicalIdList.length) {
        var _data = {
          supplierId: supplierId,
          distributorId: distributorId,
          ids: $scope.choisedMedicalIdList
        };

        requestData('rest/authen/purchasecontentmedical/delete', _data, 'GET')
        .then(function (results) {
          if (results[1].code === 200) {
            _reloadListData('rest/authen/purchasecontentmedical/query?supplierId=' + $scope.mainStatus.pageParams.supplierId);
            $scope.isChoiseAll = false;
          }
        })
        .catch(function (error) {
          alertWarn(error || '出错');
        });
      }
    };

    // 完成按钮功能，保存备注及跳转页面
    $scope.purchaseConentGetDone = function (formData) {
      if (formData) {
        requestData('rest/authen/purchasecontent/save', formData, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.goTo('#/purchasecontent/query.html');
          }
        });
      }
    };

    // 重新请求数据
    var _reloadListData = function (_url) {
      if (_url) {
        requestData(_url)
        .then(function (results) {
          if (results[1].data) {
            $scope.tbodyList = results[1].data;
          }
        });
      }
    };
  }

  // 创建医院药品与经销商药品关联关系dialog控制器
  function createCorrespondController ($scope, requestData, modal, alertWarn, utils) {

    // 侧边栏搜索过滤
    // $scope.handleSearchFilter = function (key,distributorId,customerAddressId) {
    //   // var _url = 'rest/authen/purchasecontentmedical/queryDistributorMedical?distributorId=' + $scope.mainStatus.pageParams.distributorId + '&q=' + key;
    //
    //   var _url = 'rest/authen/purchasecontentmedical/queryDistributorMedical?distributorId='+distributorId+'&customerAddressId='+customerAddressId+'&q='+key;
    //
    //   requestData(_url)
    //   .then(function (results) {
    //     $scope.codesList = results[1].data;
    //   });
    // };

    // 侧边框过滤筛选
    $scope.handleSearchFilter = function (listParams, relMedicalStockId) {

      // 判断参数是否正确
      if (!listParams || !angular.isObject(listParams)) { throw new Error('Params is Required'); }

      // 获取参数对象中所有的key
      var _keys = Object.keys(listParams);

      // 构建查询参数字符串
      var _hashString = '';
      for (var i = 0, len = _keys.length; i < len; i++) {
        _hashString += '&' + _keys[i] + '=' + listParams[_keys[i]];
      }

      // 构建完整的查询url
      var _queryUrl = 'rest/authen/medicalStock/queryStockBatch?relMedicalStockId=' + relMedicalStockId + '&isOnlyAvailable=true' + _hashString;

      // 更新数据
      requestData(_queryUrl)
      .then(function (results) {
        $scope.stockBatchList = results[1].data;
      })
      .catch(function (error) {
        throw new Error(error || '出错');
      });
    };

    $scope.handleSearchFilter2 = function (key) {
      var _url = 'rest/authen/medicalStock/query?q=' + key;
      requestData(_url)
      .then(function (results) {
        $scope.codesList = results[1].data;
      });
    };
    $scope.handleSearchFilter3 = function (key) {
      var _url = 'rest/authen/medicalStock/queryStockBatch?q=' + key+'&&relMedicalStockId='+$scope.dialogData.id;
      requestData(_url)
      .then(function (results) {
        $scope.codesList = results[1].data;
      });
    };

    // 选择供应商编码与医院药品编码建立对应关系
    $scope.spdChoiseCode = function (code,medicalId,distributorMedicalId) {
      // 将当前选择的医院编码赋值到数据对象中
      if ($scope.tbodyList) {
        angular.forEach($scope.tbodyList, function (data, index) {
          if (data.id === medicalId) {

            // 添加到后台
            var _data = {
              id: $scope.tbodyList[index].id,
              relId: $scope.mainStatus.pageParams.id,
              supplierId: $scope.mainStatus.pageParams.supplierId,
              distributorId: $scope.formData.distributorId,
              distributorMedicalCode: code,
              distributorMedicalId: distributorMedicalId,
              // saleContentMedicalId: ,
              medical: $scope.tbodyList[index].medical,
              flag: true
            };

            requestData('rest/authen/purchasecontentmedical/save', _data, 'POST', 'parameter-body')
            .then(function (results) {
              if (results[1].code === 200) {
                // $scope.tbodyList[index].distributorMedicalCode = code;
                // _reloadListData('rest/authen/purchasecontentmedical/query?distributorId=' + $scope.mainStatus.pageParams.distributorId);
                utils.refreshHref();
              }
            })
            .catch(function (error) {
              alertWarn(error || '添加药品失败');
            });
          }
        });
      }

      modal.closeAll();
    };

    $scope.spdChoiseCode2 = function (code,medicalId,distributorMedicalId) {

      // 将当前选择的医院编码赋值到数据对象中
      if ($scope.tbodyList) {
        angular.forEach($scope.tbodyList, function (data, index) {
          if (data.id === medicalId) {

            // 添加到后台
            var _data = {
              id: $scope.tbodyList[index].id,
              relId: $scope.mainStatus.pageParams.id,
              supplierId: $scope.mainStatus.pageParams.supplierId,
              distributorId: $scope.formData.distributorId,
              distributorMedicalCode: $scope.tbodyList[index].distributorMedicalCode,
              distributorMedicalId: $scope.tbodyList[index].distributorMedicalId,
              // saleContentMedicalId: ,
              medical: {id:distributorMedicalId},
              flag: false
            };

            requestData('rest/authen/purchasecontentmedical/save', _data, 'POST', 'parameter-body')
            .then(function (results) {
              if (results[1].code === 200) {
                // $scope.tbodyList[index].medical.code = code;
                // requestData('rest/authen/purchasecontentmedical/query?supplierId='+$scope.mainStatus.pageParams.supplierId)
                // .then(function (results) {
                //   if (results) { $scope.tbodyList = results[1].data; }
                // });
                // $scope.tbodyList[index].medical.code = code;
                utils.refreshHref();
              }
            })
            .catch(function (error) {
              alertWarn(error || '添加药品失败');
            });
          }
        });
      }

      modal.closeAll();
    };

  }

  // 库房管理模块控制器
  function storeRoomController ($scope, requestData, alertError, alertOk) {
    // 定义存放用户选择的列表
    $scope.choisedList = [];

    // 请求列表数据
    $scope.queryStoreRoomAndOthersList = function (type,requestUrl) {
      if (type && requestUrl) {
        $scope.type = type;
        var _url = requestUrl;
        // 请求数据
        requestData(_url)
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.tbodyList = results[1].data;
          }
        })
        .catch(function (error) {
          throw new Error(error);
        });
      } else {
        throw new Errow('Params type is Reqired');
      }
    };

    // 仓库单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedList.length; i++) {
          if (item.id === $scope.choisedList[i]) {
            $scope.choisedList.splice(i,1);
          }
        }
      }
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中

        if ($scope.tbodyList) {
          $scope.choisedList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedList = [];
      }
    };

    /**
     * [handleDelEvent 处理单个删除与批量删除操作]
     * @param  {[type]} ids        [需要删除的项目id列表]
     * @param  {[type]} requestUrl [删除请求的API]
     * @param  {[type]} returnUrl  [删除成功后需要跳转的地址]
     * @return {[type]}            [description]
     */
    $scope.handleDelEvent = function (ids, requestUrl, returnUrl) {

      var _data = null;

      if (ids) {      // 如果传入了id列表
        _data = angular.isArray(ids) ? {ids:ids} : {ids: [ids]};
      } else {        // 如果没有传入id列表
        if ($scope.choisedList && $scope.choisedList.length) {
          _data = { ids:$scope.choisedList };
        }
      }

      requestData(requestUrl, _data, 'POST')
      .then(function (results) {
        if (results[1].code === 200) {
          _reloadListData(returnUrl);
          $scope.isChoiseAll = false;
        }
      })
      .catch(function (error) {
        alertError(error || '出错');
      });

    };

    // 重新请求数据
    var _reloadListData = function (_url) {
      console.log(_url);
      if (_url) {
        requestData(_url)
        .then(function (results) {
          if (results[1].data) {
            $scope.tbodyList = results[1].data;
          }
        });
      }
    };

  }

  // 领用申请单controller
  function collarApplicationOrderController($scope, modal,alertWarn,alertError,requestData,watchFormChange, dialogConfirm) {


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

         addDataItem.applicationCount=flashAddData.quantity;
         addDataItem.discountPrice='0';
         addDataItem.discountRate='100';
         addDataItem.relId=medical.id;

         addDataItem.strike_price=addDataItem.price;

       if (!(addDataItem.relId && addDataItem.name)) {
           alertWarn('请选择药品。');
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
         for (var i=0; i<_len; i++) {
           if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
             alertWarn('此药械已添加到列表');
             return false;
           }
         }
       }
       //添加到列表
       $scope.formData.orderMedicalNos.push(addDataItem);
            if (addDataItem) {
              var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + addDataItem.relId+'&storeRoomId='+$scope.formData.storeRoomId,
                  _data = {};
              requestData(_url, _data, 'GET')
              .then(function (results) {
                var _resObj = results[1].data;
                for (var item in _resObj) {
                  if (item === addDataItem.relId && _resObj[item]) {
                  addDataItem.salesQuantity=_resObj[item].salesQuantity;
                  }
                }
              })
              .catch(function (error) {
                if (error) { console.log(error || '出错!'); }
              });
            }
       //计算价格
       $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
       return true;
   };
    $scope.addDataItemClick = function(addDataItem,medical) {
       if (!(addDataItem.relId && addDataItem.name)) {
           alertWarn('请选择药品。');
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

   $scope.changeStoreRoom =function(orderMedical,storeRoomId){
     var _ids=[];
     if(orderMedical.length!==0){
       for(var i= 0;i<orderMedical.length; i++){
         _ids.push(orderMedical[i].id);
       }
     }
     var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + _ids+'&&storeRoomId='+storeRoomId,
     _data = {};
       requestData(_url, _data, 'GET')
       .then(function (results) {
         var _resObj = results[1].data;
         for (var i = 0; i < _ids.length; i++) {
             for (var item in _resObj) {
               if(orderMedical[i].id===item){
                 orderMedical[i].salesQuantity=_resObj[item].salesQuantity;
               }
             }
         }
       })
       .catch(function (error) {
         if (error) { console.log(error || '出错!'); }
       });
   }

    /**
    *保存 type:save-草稿,submit-提交订单。
    */
    $scope.submitFormAfter = function() {
      $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo('#/collarApplicationOrder/query.html');
          return;
        }

        if ($scope.submitForm_type == 'submit') {
          var _url='rest/authen/collarApplicationOrder/startProcessInstance';
          var data= {businessKey:$scope.formData.id};
          requestData(_url,data, 'POST')
            .then(function (results) {
              var _data = results[1];
              $scope.goTo('#/collarApplicationOrder/get.html?id='+$scope.formData.id);
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
      var url = 'rest/authen/collarApplicationOrder/save';
      var data= {purchaseOrderId:_id};
      requestData(url,data, 'POST')
        .then(function (results) {
          var _data = results[1].data;
          console.log(_data);
          $scope.goTo('#/collarApplicationOrder/get.html?id='+_data.id);
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    };

    /**
     * [handleMessageShow 将通过后的补充说明显示到备注里]
     * @return {[type]} [description]
     */
    // $scope.handleMessageShow = function (obj) {
    //   if (obj.operationFlowSet) {
    //     // console.log(obj.operationFlowSet);
    //     angular.forEach(obj.operationFlowSet, function (item, index) {
    //       if (item.status === obj.orderStatus) { obj.note = item.key; }
    //     });
    //   }
    // };
    // 数量超过可用数量，组织不能提交
    $scope.changeQuantity= function(availbleQuantity,quantity){
      // 错误状态标识
      $scope.quantityError = false;
      console.log('quantity='+quantity);
      console.log('availbleQuantity='+availbleQuantity);
      if (availbleQuantity >= 0 && quantity>=0) {
        if (quantity >availbleQuantity || quantity<=0) {
          $scope.quantityError = true;
          $scope.$parent.$parent.quantityError = true;
        } else {
          $scope.quantityError = false;
          $scope.$parent.$parent.quantityError = false;
        }
      }else{
        $scope.quantityError = true;
        $scope.$parent.$parent.quantityError = true;
      }
    }


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

  // SPD采购退货控制器
  function purchaseReturnController ($scope, modal, alertWarn, watchFormChange, requestData, $rootScope, alertOk, utils) {

    $scope.batchsNumOverloadFlag = false;

    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);
    };

    modal.closeAll();
    $scope.addDataItem = {};

    // 保存  type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function(scopeResponse) {

      $scope.formData.validFlag = false;

      if ($scope.submitForm_type == 'exit') {
        $scope.goTo('#/purchaseReturn/query.html');
        alertOk(scopeResponse.msg);
        return;
      }

      if ($scope.submitForm_type == 'submit') {

        var url='rest/authen/purchaseReturn/startProcessInstance';
        var data= {businessKey:$scope.formData.id};
          console.log($scope.formData);

        requestData(url, data, 'POST')
          .then(function (results) {
            if (results[1].code !== 200) {
              alertWarn(results[1].msg || '未知错误!');
            } else {
              $scope.goTo('#/purchaseReturn/get.html?id='+$scope.formData.id);
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
    };

    // 取消订单
    $scope.cancelForm = function(fromId, url) {
      alertWarn('cancelForm');
    };

    // 侧边栏选择生产批号
    $scope.spdChoiseBatchs = function (obj,choisedList,id,goodsCount,strikePrice) {

      // 异常处理
      // if (!obj || !choisedList || !goodsCount || !strikePrice) {
      //   throw new Error('Parameters are required');
      // }

      // 构建临时对象存储批号id、批号名和数量
      var _tmp = {
        stockBatchId: obj.id,                     // 批次号id
        batchNumber: obj.productionBatch,
        quantity: obj.stockModel.salesQuantity,    // 可选数量
        salesQuantity: obj.stockModel.salesQuantity,
        goodsCount: obj.stockModel.salesQuantity,
        productionBatch: obj.productionBatch,     // 批号名
        storeRoomName:obj.storeRoomName,
        regionName:obj.regionName,
        goodsLocationName: obj.goodsLocationName    // 灭菌批号
      };

      // 初始化已添加的批次数量和
      var _total = 0;

      // 计算当前药品的批次数量和
      if (choisedList) {
        angular.forEach(choisedList, function (data, index) {
          if (data.batchNumber) {
            _total += parseInt(data.quantity, 10);
          }
        });
      }

      // 如果当前批次数量大于或等于计划采购数量
      if ((obj.stockModel.salesQuantity + _total) > goodsCount) {
        // 将计划采购数量赋值给临时对象
        _tmp.quantity = goodsCount - _total;
      }

      // 根据药品id将批次存入当前药品formData数据中
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.relId == id) {
            $scope.formData.orderMedicalNos[index].stockBatchs.push(_tmp);
            // $scope.confirmOrderCalculaTotal($scope.formData.orderMedicalNos, '普通销售');

            $scope.formData.orderMedicalNos[index].storeRoomName = obj.storeRoomName;       // 仓库名
            $scope.formData.orderMedicalNos[index].storeRoomId = obj.storeRoomId;       // 仓库名
            $scope.formData.orderMedicalNos[index].regionName = obj.regionName;       // 仓库名
            $scope.formData.orderMedicalNos[index].regionId = obj.regionId;       // 仓库名
            $scope.formData.orderMedicalNos[index].goodsLocationName = obj.goodsLocationName;       // 仓库名
            $scope.formData.orderMedicalNos[index].goodsLocationId = obj.goodsLocationId;       // 仓库名
            $scope.formData.orderMedicalNos[index].planReturnPrice = _tmp.quantity * strikePrice;
          }
        });
      }

      // 计算当前药品所有批次总价

      // 计算总价：
      $scope.formData.totalPrice = $scope.calculaTotalPrice($scope.formData.orderMedicalNos);

    };

    // 统计批次数量总和
    $scope.calculaBatchsTotal = function (item,planReturnCount) {

      if (item) {
        if (item.stockBatchs.length === 0) {
          return 0;
        }

        var _total = 0;
        angular.forEach(item.stockBatchs, function (data, index) {
          _total += parseInt(data.quantity,10);
        });

        return _total;
      }
    };

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

    // 计算当前当前药品所有批次的总金额
    $scope.calculaCurrentMedicalPrice = function (item) {
      if (item && item.stockBatchs) {
        var _total = 0;
        angular.forEach(item.stockBatchs, function (data, index) {
          _total += data.quantity * item.strike_price;
        });
        return _total;
      }
    };

    // 计算总价金额
    $scope.calculaTotalPrice = function (orderMedicalNos) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (data, index) {
          // var _batchTotal = 0;
          if (data.stockBatchs.length) {
            for (var i = 0, len = data.stockBatchs.length; i < len; i++) {
              _total += data.stockBatchs[i].quantity * data.strike_price;
            }
          }
        });
        return _total;
      }
    };

    // 判断当前退货药品列表里批次数量总和是否有
    $scope.batchsNumOverload = function (orderMedicalNos) {
      if (orderMedicalNos) {
        angular.forEach(orderMedicalNos, function (data, index) {
          $scope.batchsNumOverloadFlag = $scope.calculaBatchsTotal(data) > data.goodsCount ? true : false;
          return $scope.batchsNumOverloadFlag;
        });
      }
    };

    $scope.changeQuantity = function(quantity,salesQuantity){
      $scope.quantityError=false;
      if(salesQuantity&&quantity){
        if(quantity>salesQuantity){
            $scope.quantityError=true;
        }
      }else{
           $scope.quantityError=true;
      }
    }

  }

  // 上架计划控制器
  function shelvesUpController ($scope, watchFormChange, requestData, utils, alertError, alertWarn, alertOk) {

    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedMedicalList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          if (item.id === $scope.choisedMedicalList[i]) {
            $scope.choisedMedicalList.splice(i,1);
          }
        }
      }
    };
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中

        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedMedicalList = [];
      }
    };

    // 批量上架
    $scope.handleBatchReceive = function () {
      if ($scope.choisedMedicalList.length) {
        // var _data = {
        //   ids: $scope.choisedMedicalList
        // };
        requestData('rest/authen/shelvesUp/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.refreshHref();
          }

        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });
      }
    };

        $scope.changeQuantity = function(quantity,salesQuantity){
          $scope.quantityError=false;
          if (quantity && salesQuantity) {
            if (quantity>salesQuantity || quantity>$scope.formData.applicationCount) {
            $scope.quantityError=true;
            }
          }else {
            $scope.quantityError=true;
          }
        };

  }

  function pickStockOutMedicalController ($scope, watchFormChange, requestData, utils, alertError, alertWarn, alertOk) {

    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedMedicalList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          if (item.id === $scope.choisedMedicalList[i]) {
            $scope.choisedMedicalList.splice(i,1);
          }
        }
      }
    };
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中

        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedMedicalList = [];
      }
    };

    // 批量拣选
    $scope.handleBatchReceive = function () {
      if ($scope.choisedMedicalList.length) {
        // var _data = {
        //   ids: $scope.choisedMedicalList
        // };
        requestData('rest/authen/pickStockOutMedical/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.refreshHref();
          }

        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });
      }
    };

    $scope.changeQuantity = function(quantity,salesQuantity){
      $scope.quantityError=false;
      if (quantity && salesQuantity) {
        if (quantity>salesQuantity || quantity>$scope.formData.applicationCount) {
        $scope.quantityError=true;
        }
      }else {
        $scope.quantityError=true;
      }
    };
  }

  // 验收计划控制器
  function checkUpController ($scope, requestData, utils, modal) {
    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          $scope.choisedMedicalList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          if (item.id === $scope.choisedMedicalList[i]) {
            $scope.choisedMedicalList.splice(i,1);
          }
        }
      }
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中
        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        $scope.choisedMedicalList = [];
      }
    };

    // 切换请求不同状态数据
    $scope.chgRequestStatus = function (status) {
      // 参数status是必须的
      if (!status) throw new Error('params status is required!');

      var _url = 'rest/authen/checkUp/query?' + 'checkUpStatus=' + status;
      requestData(_url)
      .then(function (results) {
        if (results[1].data) {
          $scope.tbodyList = results[1].data;
        }
      })
      .catch(function (error) {
        throw new Error(error || '获取数据出错');
      });
    };

    // 批量验收
    $scope.handlebatchCheckUp = function () {
      if ($scope.choisedMedicalList.length) {
        requestData('rest/authen/checkUp/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) { utils.refreshHref(); }
        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });
      }
    };

  }

  // 复核任务模块控制器
  function pickBillOrderController ($scope, requestData, utils, modal) {
    // 定义存放用户选择药品的列表
    $scope.choisedMedicalList = [];
    // 标识是否可以进行全选
    $scope.isCanChoiseAll = false;

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item) {
          angular.forEach(item.pickStockOutMedicalIds, function (data) {
            $scope.choisedMedicalList.push(data);
          });
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalList.length; i++) {
          for (var j=0; j<item.pickStockOutMedicalIds.length; j++) {
            if ($scope.choisedMedicalList[i] == item.pickStockOutMedicalIds[j]) {
              $scope.choisedMedicalList.splice(i,1);
            }
          }
          // if (item.id === $scope.choisedMedicalList[i]) {
          //   $scope.choisedMedicalList.splice(i,1);
          // }
        }
      }
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
      if (isChoiseAll) {      // 全部选中
        if ($scope.tbodyList) {
          $scope.choisedMedicalList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            if (data.type === '待复核') {
              data.handleFlag = true;     // 当状态为待复核时才选中
              angular.forEach(data.pickStockOutMedicalIds, function (data2, index) {
                $scope.choisedMedicalList.push(data2);
              });
            } else {
              data.handleFlag = false;
            }
            // $scope.choisedMedicalList.push(data.id);
          });
        }
      } else {        // 取消全部选中
        angular.forEach($scope.tbodyList, function (data) {
          data.handleFlag = false;
        });
        $scope.choisedMedicalList = [];
      }
    };

    // 提交复核任务
    $scope.submitPickBillOrder = function (id) {
      if (!$scope.choisedMedicalList.length) throw new Error('Submit Data is Empty!');

      var _url = 'rest/authen/pickBillOrder/batchConfirm';
      requestData(_url, $scope.choisedMedicalList, 'POST', 'parameterBody')
      .then(function (results) {
        if (results[1].code === 200) { utils.goTo('#/pickBillOrder/get.html?id='+id); }
      })
      .catch(function (error) {
        if (error) throw new Error(error || '出错');
      });
    };

    // 检查任务列表是否含有可进行复核的任务
    $scope.chkHasReviewTasks = function (tbodyList) {
      if (tbodyList) {
        angular.forEach(tbodyList, function (data, index) {
          if (data.type === '待复核') {
            return false;
          }
        });
        return true;
      }
    };


  }

  function allocateOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError, dialogConfirm) {

    $scope.logistics=true;

    $scope.$watch('initFlag', function (newVal) {
      if(newVal){
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
      }
    });
    $scope.$watch('showFlag', function (newVal) {
      if(newVal){
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
      }
    });


    // 保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {
      if($scope.submitForm_type == 'exit-allocate'){
       $scope.goTo('#/allocateOrder/query.html');
      return;
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

          addDataItem.applicationCount=flashAddData.quantity;
          addDataItem.discountPrice='0';
          addDataItem.discountRate='100';
          addDataItem.relId=medical.id;

          addDataItem.strike_price=addDataItem.price;

        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
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
          for (var i=0; i<_len; i++) {
            if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
              alertWarn('此药械已添加到列表');
              return false;
            }
          }
        }
        //添加到列表
        $scope.formData.orderMedicalNos.push(addDataItem);
             if (addDataItem) {
               var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + addDataItem.relId+'&&storeRoomId='+$scope.formData.storeRoomId,
                   _data = {};
               requestData(_url, _data, 'GET')
               .then(function (results) {
                 var _resObj = results[1].data;
                    for (var item in _resObj) {
                      if(item === addDataItem.relId){
                         addDataItem.salesQuantity=_resObj[item].salesQuantity;
                      }
                    }
               })
               .catch(function (error) {
                 if (error) { console.log(error || '出错!'); }
               });
             }
        //计算价格
        $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;
        return true;
    };

    $scope.changeStoreRoom =function(orderMedical,storeRoomId){
        var _ids=[];
        if(orderMedical.length!==0){
          for(var i= 0;i<orderMedical.length; i++){
            _ids.push(orderMedical[i].id);
          }
        }
        var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + _ids+'&&storeRoomId='+storeRoomId,
        _data = {};
          requestData(_url, _data, 'GET')
          .then(function (results) {
            var _resObj = results[1].data;
            for (var i = 0; i < _ids.length; i++) {
                for (var item in _resObj) {
                  if(orderMedical[i].id===item){
                    orderMedical[i].salesQuantity=_resObj[item].salesQuantity;
                  }
                }
            }
          })
          .catch(function (error) {
            if (error) { console.log(error || '出错!'); }
          });
    };

    $scope.addDataItemClick = function(addDataItem,medical) {
        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
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

    // $scope.changeQuantity= function(availbleQuantity,quantity){
    //   // 错误状态标识
    //   $scope.quantityError = false;
    //   if (availbleQuantity >= 0) {
    //     if (quantity >availbleQuantity) {
    //       $scope.quantityError = true;
    //       $scope.$parent.$parent.quantityError = true;
    //     } else {
    //       $scope.quantityError = false;
    //       $scope.$parent.$parent.quantityError = false;
    //     }
    //   }
    // };
    // 扩展changeQuantity方法，参数指定为当前的药品列表对象，以便能在页面初始化后对数据进行检测
    $scope.changeQuantity = function (obj) {
      // 错误状态标识
      $scope.quantityError = false;

      if (obj && angular.isArray(obj)) {
        angular.forEach(obj, function (data, index) {

          // 实时请求可调拨数量
          requestData('rest/authen/medicalStock/countStockByIds?ids='+data.id+'&&storeRoomId='+$scope.formData.storeRoomId)
          .then(function (results) {
            if (results[1].code === 200) {
              var _tmpObj = results[0][data.id];
              if (data.applicationCount > _tmpObj.salesQuantity) {
                $scope.quantityError = true;
                $scope.$parent.$parent.quantityError = true;
              } else {
                $scope.quantityError = false;
                $scope.$parent.$parent.quantityError = false;
              }
            }
          });
        });
      }
    };
  }


  function transferRecordCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn,modal) {


    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };


    $scope.submitForm = function(fromId, type) {
       $scope.submitForm_type = type;
       if ($scope.submitForm_type == 'submit') {

         requestData('rest/authen/transferRecord/save', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
           }
         })
         .catch(function (error) {

         });
       }
      $('#' + fromId).trigger('submit');
    };

    $scope.submitFormAfter = function (_url) {
      if ($scope.submitForm_type === 'submit') {
        $scope.goTo(_url + '?id=' + $scope.formData.id);
      }
    };
    // 侧边框过滤筛选
    $scope.handleSearchFilter = function (listParams, relMedicalStockId) {

      // 判断参数是否正确
      if (!listParams || !angular.isObject(listParams)) { throw new Error('Params is Required'); }

      // 获取参数对象中所有的key
      var _keys = Object.keys(listParams);

      // 构建查询参数字符串
      var _hashString = '';
      for (var i = 0, len = _keys.length; i < len; i++) {
        _hashString += '&' + _keys[i] + '=' + listParams[_keys[i]];
      }

      // 构建完整的查询url
      var _queryUrl = 'rest/authen/medicalStock/queryStockBatch?relMedicalStockId=' + relMedicalStockId + '&isOnlyAvailable=true' + _hashString;

      // 更新数据
      requestData(_queryUrl)
      .then(function (results) {
        $scope.codesList = results[1].data;
      })
      .catch(function (error) {
        throw new Error(error || '出错');
      });
    };


    $scope.spdChoiseBatches = function (medicalId,productionBatch,storeRoomName,storeRoomId,regionId,goodsLocationId,salesQuantity,sterilizationBatchNumber) {
      // 将当前选择的医院编码赋值到数据对象中
      if ($scope.formData) {
              $scope.formData.relMedicalStockId= medicalId;
              $scope.formData.productionBatch= productionBatch;
              $scope.formData.storeRoomId=storeRoomId;
              $scope.formData.storeRoomName=storeRoomName;
              $scope.formData.sourceRegionId=regionId;
              $scope.formData.sourceGoodsLocationId=goodsLocationId;
              $scope.formData.localQuantity=salesQuantity;
              $scope.formData.sterilizationBatchNumber=sterilizationBatchNumber;
      }
      modal.closeAll();
    };

    // 在确定之前，修改商品后需要清空上一个商品填写的信息
    $scope.$watch('formData.relMedicalStockId', function (newVal, oldVal) {
      if (newVal) {
        if($scope.formData.productionBatch){
          $scope.formData.productionBatch='';
          $scope.formData.storeRoomId='';
          $scope.formData.sourceRegionId='';
          $scope.formData.targetRegionId='';
          $scope.formData.targetGoodsLocationId='';
          $scope.formData.sourceGoodsLocationId='';
          $scope.formData.localQuantity='';
          $scope.formData.transferQuantity='';
          $scope.formData.storeRoomName='';
          $scope.formData.transferReason='';
        }
      }
    })

    $scope.$watch('formData.medical_unit', function (newVal, oldVal) {
      var newQuantity='';
      if(newVal){
        var quantityList=[];
        var url='rest/authen/medicalStock/queryStockBatch?relMedicalStockId='+$scope.formData.relMedicalStockId;
        requestData(url)
        .then(function (results) {
          quantityList=results[1].data;
          if (quantityList.length !== 0) {
            var _len = quantityList.length;
            for (var i=0; i<_len; i++) {
              if ($scope.formData.relMedicalStockId === quantityList[i].relMedicalStockId && $scope.formData.productionBatch === quantityList[i].productionBatch
              &&$scope.formData.sourceGoodsLocationId===quantityList[i].goodsLocationId) {
                newQuantity=quantityList[i].stockModel.salesQuantity;
                var _url = 'rest/authen/medicalStock/getPackingAttributeQuantityById?id=' + $scope.formData.relMedicalStockId+'&&quantity='+$scope.formData.localQuantity+'&&unit='+$scope.formData.medical_unit;
                requestData(_url)
                .then(function (results) {
                  $scope.scopeData = results[1].data;
                  console.log(results[1].data[0].quantity);
                  console.log(newQuantity);
                  if( results[1].data[0].quantity>newQuantity){
                    $scope.showQuantity=true;
                  }else{
                    $scope.showQuantity=false;
                  }
                });
              }
            }
          }
        });
      }
    });

    $scope.$watch('formData.localQuantity', function (newVal, oldVal) {
      var newQuantity='';
      console.log(newVal);

    if(newVal){
      if (newVal<=0) {
          $scope.showQuantity=true;
          return;
      }
        var quantityList=[];
        var url='rest/authen/medicalStock/queryStockBatch?relMedicalStockId='+$scope.formData.relMedicalStockId;
        requestData(url)
        .then(function (results) {
          quantityList=results[1].data;
          if (quantityList.length !== 0) {
            var _len = quantityList.length;
            for (var i=0; i<_len; i++) {
              if ($scope.formData.relMedicalStockId === quantityList[i].relMedicalStockId && $scope.formData.productionBatch === quantityList[i].productionBatch
                &&$scope.formData.sourceGoodsLocationId===quantityList[i].goodsLocationId) {
                newQuantity=quantityList[i].stockModel.salesQuantity;
                var _url = 'rest/authen/medicalStock/getPackingAttributeQuantityById?id=' + $scope.formData.relMedicalStockId+'&&quantity='+$scope.formData.localQuantity+'&&unit='+$scope.formData.medical_unit;
                requestData(_url)
                .then(function (results) {
                  $scope.scopeData = results[1].data;
                  if( results[1].data[0].quantity>newQuantity){
                    $scope.showQuantity=true;
                  }else{
                    $scope.showQuantity=false;
                  }
                });
              }
            }
          }
        });
      }else{
        $scope.showQuantity=true;
      }
    });

  }


  /**
   * [cfgGoodsBarcodeCtroller SPD商品管理中GS1条码打印控制器]
   * @param  {[type]} $scope      [description]
   * @param  {[type]} requestData [description]
   * @param  {[type]} utils       [description]
   * @return {[type]}             [description]
   */
  function cfgGoodsBarcodeCtroller ($scope, requestData, utils) {

    var _url = 'rest/authen/gs1Barcode/get';

    // 获取商品条码
    $scope.getGoodsBarcode = function (barcode) {

      if (barcode) {
        var _data = {
              "barcode": barcode,
              "barcodeType": "一段式"
            };

        requestData(_url, _data, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.goodsBarcode = results[1].data;   // 商品条码
            $scope.goodsFullBarcode = results[1].data;   // 完整的商品条码，包含批号、数量
            $scope.scopeData.medicalType = '一段式';   // 设置默认的条码选择样式
          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        });
      }
    };

    // 请求包含批号和数量的完整的条码
    $scope.getFullGoodsBarcode = function (scopeData) {

      if (scopeData) {
        if (!scopeData.medicalType) { scopeData.medicalType = '一段式'; }

        var _data = {
          "barcode": scopeData.barcode,
          "quantity": scopeData.quantity,
          "productionBatch": scopeData.productionBatch,
          "validTill": scopeData.validTill,
          "barcodeType": scopeData.medicalType
        };

        requestData(_url, _data, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.goodsFullBarcode = results[1].data;   // 完整的商品条码，包含批号、数量
            $scope.enabledPrintBtn = true;
          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        });
      }
    };

    // 用户更改商品包装单位时的处理方法
    $scope.chgCommodityUnitEvent = function (url, unit, medical) {
      // 获取商品单位集合信息
      if (url && unit) {
        requestData(url)
        .then(function (results) {
          if (results[1].code === 200) {
            var _unitObj = results[1].data;
            angular.forEach(_unitObj, function (data, index) {
              if (data.text === unit) {
                if ($scope.medical) {
                  $scope.medical.data.quantity = parseInt(_unitObj[index].note,10);
                }
                if ($scope.scopeData) {
                  $scope.scopeData.quantity = parseInt(_unitObj[index].note,10);
                }
              }
            });
          }
        });
      }



    };

    // 获取货位条码打印图片
    $scope.getGoodsLocationBarcode = function () {

    };
  }

  angular.module('manageApp.project-PG16-H')
  .controller('mainCtrlProjectPG16H',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils","purchaseOrderUtils","requestPurchaseOrderUtils","queryItemCardButtonList","customMenuUtils", mainCtrlProjectPG16H])
  .controller('medicalStockCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockCtrl])
  .controller('transferRecordCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn','modal', transferRecordCtrl])
  .controller('medicalStockStrategyCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockStrategyCtrl])
  .controller('allocateOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'dialogConfirm', allocateOrderEditCtrl])
  .controller('receiveItemController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', receiveItemController])
  .controller('shelvesUpController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', shelvesUpController])
  .controller('pickStockOutMedicalController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', pickStockOutMedicalController])
  .controller('purchasePlanOrderController', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', 'dialogConfirm', purchasePlanOrderController])
  .controller('collarApplicationOrderController', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', 'dialogConfirm', collarApplicationOrderController])
  .controller('purchaseContentController', ['$scope', 'modal', 'alertWarn', 'watchFormChange', 'requestData', 'utils', purchaseContentController])
  .controller('createCorrespondController', ['$scope', 'requestData', 'modal', 'alertWarn', 'utils', createCorrespondController])
  .controller('storeRoomController', ['$scope', 'requestData', 'alertError', 'alertOk', storeRoomController])
  .controller('purchaseReturnController', ['$scope', 'modal', 'alertWarn', 'watchFormChange', 'requestData', '$rootScope', 'alertOk', 'utils', purchaseReturnController])
  .controller('checkUpController', ['$scope', 'requestData', 'utils', 'modal', checkUpController])
  .controller('pickBillOrderController', ['$scope', 'requestData', 'utils', 'modal', pickBillOrderController])
  .controller('cfgGoodsBarcodeCtroller', ['$scope', 'requestData', 'utils', cfgGoodsBarcodeCtroller])
  .controller('inventoryAdjustmentOrderCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', inventoryAdjustmentOrderCtrl])
  .controller('inventoryAdjustmentOrderDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', inventoryAdjustmentOrderDialogCtrl]);
});
