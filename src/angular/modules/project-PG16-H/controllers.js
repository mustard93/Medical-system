
/**
 * Created by hao on 15/11/5.
 */
define('project-PG16-H/controllers', ['project-PG16-H/init'], function() {

  /**
   * [indexPageController SPD模块首页控制器]
   * @param  {[type]} $scope      [description]
   * @param  {[type]} requestData [description]
   * @param  {[type]} utils       [description]
   * @return {[type]}             [description]
   */
  function indexPageController ($scope, requestData, utils, OPrinter, $timeout, $rootScope) {
      // 检测当前用户系统是否安装打印插件Lodop，将检测结果保存至$rootScope中
      // 供具有打印功能的页面调用并提示用户下载安装插件
      $scope.loadCLodop = function () {
          // 初始化是否安装标识为false，标识已安装
          $rootScope.notInstallPrinterPlusin = false;



          $timeout(function () {
              if (window.CLODOP) {
                  $rootScope.notInstallPrinterPlusin = true;
              }
          }, 3000);

          console.log($rootScope.notInstallPrinterPlusin);
      };
  }

  // SPD系统-库存调整controller
  function  inventoryAdjustmentOrderCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

      //调整

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

          for(var i=0; i<arr.length; i++){

              if (batchId==arr[i]){
                  break;
              }
          }
      };

      $scope.changeQuantity=function(quantity){
          if(quantity>0){
              $scope.quantityError=false;
          }else{
              $scope.quantityError=true;
          }
      }


      //检查Quantity是否存在
      $scope.checkQuantityError=function(){
          var flag=false;
          angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
              if(item.stockBatchs.length<1){
                  flag=true;
              }
          });
          return flag;
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

    // 出入记录查询
    function inoutstockDetailController ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

        $scope.watchFormChange = function(watchName){
            watchFormChange(watchName,$scope);
        };

        $scope.$watch('listParams.storeRoomId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.regionId=null;
             $scope.listParams.goodsLocationId=null;
          }
        });
        $scope.$watch('listParams.regionId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.goodsLocationId=null;
          }
        });
    }


    //  SPD系统—商品信息管理模块controller
    function medicalStockCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

        $scope.watchFormChange = function(watchName){
            watchFormChange(watchName,$scope);
        };

        $scope.$watch('listParams.storeRoomId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.regionId=null;
             $scope.listParams.goodsLocationId=null;
          }
        });
        $scope.$watch('listParams.regionId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.goodsLocationId=null;
          }
        });

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
        // 全部拒收
        $scope.allReceipt = function (id) {
            if (id) {
                requestData('rest/authen/receiveItem/refuse?id=' + id, '', 'POST')
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

        // 批量收货
        $scope.handleBatchReceive = function () {
            if ($scope.choisedMedicalList.length) {

                requestData('rest/authen/receiveItem/batchConfirm', $scope.choisedMedicalList, 'POST', 'parameter-body')
                    .then(function (results) {
                        if (results[1].code === 200) {
                            // if(results[1].msg){
                            //   alertOk(results[1].msg);
                            // }
                            utils.refreshHref();
                            if (results[1].msg) { alertOk(results[1].msg); }
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

        // 初始化退货数量
        // deliveryQuantity :配送数量。
        // hasReceiveQuantity :已收数量。
        // hasRefuseQuantity :拒收数量。
        // 本次收货数量=配送数量-已收数量-拒收数量-本次拒收数量（初始为0）
        $scope.finalQuantity = function (deliveryQuantity,hasReceiveQuantity,hasRefuseQuantity){
            if(deliveryQuantity){
                $scope.formData.receiveQuantity=deliveryQuantity-hasReceiveQuantity-hasRefuseQuantity;
            }
        };

        // 修改实收数量或本次拒收数量时对应的本次拒收或实收改变。
        $scope.changeQuantity = function (deliveryQuantity,hasReceiveQuantity,hasRefuseQuantity,_hasReceiveQuantity,_hasRefuseQuantity){
            if(deliveryQuantity){
                var endQuantity=deliveryQuantity-hasReceiveQuantity-hasRefuseQuantity;
                var _endQuantity=parseInt(_hasReceiveQuantity)+parseInt(_hasRefuseQuantity);

                if(endQuantity<_endQuantity){
                  $scope.quantityError=true;
                  $scope.quantityFalse=true;
                }else {
                    $scope.quantityError=false;
                    $scope.quantityFalse=false;
                }
            }
        };


        // $scope.beforeGoto=function(){
        //     console.log('--------------beforeGoto--------------');
        // };
        // $scope.aftereGoto=function(){
        //     console.log('--------------aftereGoto--------------');
        // };
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
            $scope.formData.totalPrice = _total;
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

            var medical = null,
                addDataItem = null;

            if (flashAddData) {
                medical=flashAddData.data.data;
                addDataItem = $.extend(true,{},medical);
            } else {
                return;
            }

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
    function storeRoomController ($scope,watchFormChange, requestData, alertError, alertOk) {

      $scope.watchFormChange = function(watchName){
        watchFormChange(watchName,$scope);
      };

        // 定义存放用户选择的列表
        $scope.choisedList = [];


              $scope.submitForm = function(fromId, type) {
                 $scope.submitForm_type = type;
                 if ($scope.submitForm_type == 'submit-storeRoom') {
                   requestData('rest/authen/storeRoom/save', $scope.formData, 'POST', 'parameterBody')
                   .then(function (results) {
                     if (results[1].code === 200) {
                       var _data = results[1];
                       _data.data=$scope.formData;
                     }
                   })
                   .catch(function (error) {
                   });
                 }

                //  var url='rest/authen/firstEnterpriseApplication/startProcessInstance';
                //  var data= {businessKey:$scope.formData.id};
                //  requestData(url,data, 'POST')
                //   .then(function (results) {
                //     var _data = results[1];
                //     $scope.goTo('#/firstEnterpriseApplication/get.html?id='+$scope.formData.id);
                //   })
                //   .catch(function (error) {
                //     alertError(error || '出错');
                //   });

                 if ($scope.submitForm_type == 'submit') {
                   $scope.formData.validFlag = true;
                 }
                $('#' + fromId).trigger('submit');
              };

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
         * @param  dataType  以何种数据格式进行发送，有数组和对象两种 (array, object)
         * @return {[type]}            [description]
         */
        $scope.handleDelEvent = function (ids, requestUrl, returnUrl, dataType) {

          var _data = null;

          // 获取发送的数据类型，如果没有设置则默认为object
          var _dataType = dataType || 'object';

          if (ids) {      // 如果传入了id列表
            _data = angular.isArray(ids) ? {ids:ids} : {ids: [ids]};
          } else {        // 如果没有传入id列表
            if ($scope.choisedList && $scope.choisedList.length) {
              _data = (_dataType === 'object') ? {ids : $scope.choisedList} : $scope.choisedList;
            }
          }

          console.log(_data);

          requestData(requestUrl, _data, 'POST', 'parameter-body')
            .then(function (results) {
              if (results[1].code === 200) {
                _reloadListData(returnUrl);
                $scope.isChoiseAll = false;
                $scope.choisedList=[];
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
            var showQuantityError = false;
            if (addDataItem) {
                var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + addDataItem.relId+'&storeRoomId='+$scope.formData.storeRoomId,
                    _data = {};
                requestData(_url, _data, 'GET')
                    .then(function (results) {
                        var _resObj = results[1].data;
                        for (var item in _resObj) {
                            if (item === addDataItem.relId && _resObj[item]) {
                                addDataItem.salesQuantity=_resObj[item].salesQuantity;
                                if(addDataItem.applicationCount>addDataItem.salesQuantity){
                                    showQuantityError = true;
                                }
                            }
                        }
                        if(showQuantityError){
                            $scope.quantityError=true;
                        }else {
                            $scope.quantityError=false;
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
            var showQuantityError = false;
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
                                if (orderMedical[i].applicationCount>orderMedical[i].salesQuantity) {
                                    showQuantityError = true;
                                }
                            }
                        }
                    }
                    if(showQuantityError){
                        $scope.quantityError=true;
                    }else{
                        $scope.quantityError=false;
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

        $scope.comfirmQuantity = function (obj) {
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


        // 数量超过可用数量，组织不能提交
        $scope.changeQuantity= function(availbleQuantity,quantity){
            // 错误状态标识
            $scope.quantityError = false;

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

    // SPD采购退货控制器
    function purchaseReturnController ($scope, modal, alertWarn, watchFormChange, requestData, $rootScope, alertOk, utils) {

        $scope.batchsNumOverloadFlag = false;

        $scope.$watch('initFlag', function (newVal) {
            var operationFlowSetMessage=[];
            var operationFlowSetKey=[];
            var i;
            if (newVal && $scope.showData) {
                // 选择出当前状态相同的驳回理由，并放入一个数组中
                for (i=0; i<$scope.showData.operationFlowSet.length; i++) {
                    if ($scope.showData.operationFlowSet[i].status==$scope.showData.orderStatus) {
                        operationFlowSetMessage.push($scope.showData.operationFlowSet[i].message);
                        operationFlowSetKey.push($scope.showData.operationFlowSet[i].key);
                    }
                }
                //  选择当前状态最近的一个驳回理由用于显示
                $scope.showData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
                $scope.showData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
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
                storeRoomId:obj.storeRoomId,
                regionName:obj.regionName,
                regionId:obj.regionId,
                goodsLocationName: obj.goodsLocationName,    // 灭菌批号
                goodsLocationId: obj.goodsLocationId    // 灭菌批号
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

        // 检查每个商品的批次数量总和是否大于可退货数量
        $scope.changeQuantity = function (orderMedicalNos) {
            if (orderMedicalNos && angular.isArray(orderMedicalNos)) {
                angular.forEach(orderMedicalNos, function (data, index) {
                    // 定义当前商品批次和
                    var _batchTotal = 0;

                    // 获取批次总和
                    for (var i = 0, len = data.stockBatchs.length; i < len; i++) {
                        _batchTotal += data.stockBatchs[i].quantity;
                    }

                    // 判断是否大于可退数量
                    $scope.quantityError = _batchTotal > data.goodsCount ? true : false;
                });
            }
        };


        // $scope.changeQuantity = function(quantity,salesQuantity){
        //   $scope.quantityError=false;
        //   if(salesQuantity&&quantity){
        //     if(quantity>salesQuantity){
        //         $scope.quantityError=true;
        //     }
        //   }else{
        //        $scope.quantityError=true;
        //   }
        // };

    }

    // 上架计划控制器
    function shelvesUpController ($scope, watchFormChange, requestData, utils, alertError, alertWarn, alertOk) {

        $scope.$watch('listParams.storeRoomId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.regionId=null;
             $scope.listParams.goodsLocationId=null;
          }
        });
        $scope.$watch('listParams.regionId',function(newVal,oldVal){
          if (!newVal&&oldVal) {
             $scope.listParams.goodsLocationId=null;
          }
        });
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
                          if(results[1].msg){
                              alertOk(results[1].msg);
                          }
                          utils.refreshHref();
                      }

                  })
                  .catch(function (error) {
                    alertWarn(error);
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

      // 监控listParams.storeRoomId值的变化，当用户选择全部时，刷新重新获取所有数据
      $scope.$watch('listParams.storeRoomId', function (newVal, oldVal) {
        if (oldVal && !newVal) {
          utils.refreshHref();
        }
      });
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
                              if (results[1].msg) { alertOk(results[1].msg); }
                          }
                      })
                      .catch(function (error) {
                        alertWarn(error);
                          throw new Error(error || '出错');
                      });
            }
        };

        // 判断修改后的实际数量是否为正确的数量，不正确阻止提交
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
    function checkUpController ($scope, requestData, utils, modal,alertOk,alertWarn) {
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
            console.log($scope.choisedMedicalList.length);
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
            console.log($scope.choisedMedicalList.length);
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
                        if (results[1].code === 200) {
                            if(results[1].msg){
                                alertOk(results[1].msg);
                            }
                            utils.refreshHref();
                        }else if(results[1].msg){
                            alertWarn(results[1].msg);
                        }

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
                    if (results[1].code === 200)
                    {
                        // console.log("results[1]",results[1]);

                        //    待复核   0002638: web端，复核操作，当目前有2个需复核的任务，如果当前仅复核了一个，另一个扔处于需复核的状态，此时页面应该停留在待复核页面，现在跳转到详情页面

                        //
                         utils.goTo('#/pickBillOrder/get.html?id='+id);
                    }
                })
                .catch(function (error) {
                    if (error) throw new Error(error || '出错');
                });
        };

        // 检查任务列表是否含有可进行复核的任务
        $scope.chkHasReviewTasks = function (tbodyList) {
            if (tbodyList) {
                var types=[];
                angular.forEach(tbodyList, function (data, index) {
                    types.push(data.type);
                });

                if (types.some(function(item){ return item == '待复核';}))
                {
                    return false;
                }else{
                    return true;
                }
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

            if($scope.submitForm_type == 'save'){
                $scope.goTo('#/allocateOrder/edit.html?id='+$scope.formData.id);
                return;
            }


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
                var showQuantityError = false;
                var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + addDataItem.relId+'&&storeRoomId='+$scope.formData.storeRoomId,
                    _data = {};
                requestData(_url, _data, 'GET')
                    .then(function (results) {
                        var _resObj = results[1].data;
                        for (var item in _resObj) {
                            if(item === addDataItem.relId){
                                addDataItem.salesQuantity=_resObj[item].salesQuantity;
                                if (addDataItem.applicationCount>addDataItem.salesQuantity) {
                                    showQuantityError = true;
                                }
                            }
                        }
                        if (showQuantityError) {
                            $scope.quantityError = true;
                        }else {
                            $scope.quantityError = false;
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
            var showQuantityError = false;
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
                                if (orderMedical[i].applicationCount>orderMedical[i].salesQuantity) {
                                    showQuantityError = true;
                                }
                            }
                        }
                    }
                    if (showQuantityError) {
                        $scope.quantityError = true;
                    }else {
                        $scope.quantityError = false;
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
        $scope.comfirmQuantity = function (obj) {
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

        $scope.changeQuantity= function(availbleQuantity,quantity){
            // 错误状态标识
            $scope.quantityError = false;

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
        };

    }

    function transferRecordCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn,modal) {
      $scope.watchFormChange = function(watchName){
          watchFormChange(watchName,$scope);
      };

      $scope.$watch('listParams.storeRoomId',function(newVal,oldVal){
        if (!newVal&&oldVal) {
           $scope.listParams.sourceRegionId=null;
           $scope.listParams.sourceGoodsLocationId=null;
           $scope.listParams.targetRegionId=null;
           $scope.listParams.targetGoodsLocationId=null;
        }
      });
      $scope.$watch('listParams.sourceRegionId',function(newVal,oldVal){
        if (!newVal&&oldVal) {
           $scope.listParams.sourceGoodsLocationId=null;
        }
      });
      $scope.$watch('listParams.targetRegionId',function(newVal,oldVal){
        if (!newVal&&oldVal) {
           $scope.listParams.targetGoodsLocationId=null;
        }
      });

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

              //扩展提示最大数量和单位
              $scope.formData.tipsQuantity=salesQuantity;

          }
          modal.closeAll();
      };

      // 在确定之前，修改商品后需要清空上一个商品填写的信息
      $scope.$watch('formData.relMedicalStockId', function (newVal, oldVal) {
          console.log("newVal="+newVal);
          console.log("oldVal="+oldVal);
          if (newVal && newVal!==oldVal) {
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

              //清空提示数量和单位
              $scope.formData.tipsQuantity="";
          }
      });

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
    function cfgGoodsBarcodeCtroller ($scope, requestData, utils, OPrinter, $timeout) {

        var _url = 'rest/authen/gs1Barcode/get';

        $scope.notInstallPlusin = null;

        $scope.$watch('medical', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                $scope.medical.data.medicalType = '一段式';
            }
        }, true);

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
        $scope.getGoodsLocationBarcode = function (scopeData) {

            if (scopeData) {
                var _data = {
                    "barcode": scopeData.barcode,
                    "quantity": scopeData.quantity,
                    "productionBatch": scopeData.productionBatch,
                    "validTill": scopeData.validTill,
                    "barcodeType": null
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

        $scope.loadCLodop = function () {
            $timeout(function () {
                if (!OPrinter.chkOPrinter()) {
                    $scope.notInstallPlusin = true;
                }
            }, 1000);
        };
    }

    function inventoryOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError, dialogConfirm,utils) {


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
                $scope.goTo('#/inventoryApplicationOrder/query.html');
                return;
            }

            if ($scope.submitForm_type == 'submit-allocate') {
                var _url='rest/authen/inventoryApplicationOrder/startProcessInstance';
                var data= {businessKey:$scope.formData.id};
                requestData(_url, data, 'POST')
                    .then(function (results) {
                        var _data = results[1];
                        //  alertOk(_data.message || '操作成功');
                        $scope.goTo('#/inventoryApplicationOrder/get.html?id='+$scope.formData.id);

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

      // 按区域盘点
      // 把区域id组成ids，传到后台，侧边框再次打开时默认选中已选的区域
      function getRegionIds(regionSelects){
          $scope.formData.regionIds=[];
          $scope.formData.goodsLocationIds=[];

          for (var i = 0; i < regionSelects.length; i++) {
              // 如股区域下还有货位，则把选中的货位的id组织放在goodsLocationIds中传入后台，用于选中已选货位
              if (regionSelects[i].goodsLocationSelects.length) {
                  for (var j = 0; j < regionSelects[i].goodsLocationSelects.length; j++) {
                      $scope.formData.goodsLocationIds.push(regionSelects[i].goodsLocationSelects[j].id);
                  }
              }else {
                  $scope.formData.regionIds.push(regionSelects[i].id);
              }
          }
        };

    $scope.reloadRegionIds=function(storeRoomId,regionIds){
        if (!regionIds) {
            regionIds=[];
        }

        var _data={
            "storeRoomId":storeRoomId,
            "regionIds":regionIds
        };

        requestData("rest/authen/region/queryForCheckOption", _data, 'POST','parameterBody')
            .then(function (results) {
                $scope.formData.regionArr=results[1].data;
            })
            .catch(function (error) {
                alertError(error || '出错');
            });
    };

    // 删除区域id
    $scope.deleteRegionIds = function (id,ids){
        if (ids.length) {
            for (var i = 0; i < ids.length; i++) {
                if (id==ids[i]) {
                    ids.pop(ids[i]);
                }
            }
            $scope.formData.regionIds=ids;
        }
    };

    // 删除货位id,把要删除的id数组和现有的ids数组对比。从ids中去掉要删除的货位id。
    $scope.deleteGoodslocationIds = function (goodsLocationSelects,_ids){

        for (var i = 0 ; i < _ids.length ; i ++ ){

            for(var j = 0 ; j < goodsLocationSelects.length ; j ++ ){

                if (_ids[i] === goodsLocationSelects[j].id){

                    _ids.splice(i,1);

                }
            }
        }
        $scope.formData.goodsLocationIds=_ids;
    };

    // query页面点击发送盘点任务消息时请求接口获取信息内容
    $scope.previewMessage=function(_id){
        if (_id) {

            requestData('rest/authen/inventoryApplicationOrder/previewMessage?id='+$scope.dialogData.id, {}, 'post')
                .then(function (results) {
                    $scope.messageText=results[1].data;
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }
    };

    // 发送盘点任务信息
    $scope.sendMessage=function(_id){
        if (_id) {
            requestData('rest/authen/inventoryApplicationOrder/sendMessage?id='+_id, {},'post')
                .then(function (results) {
                    if (results[1].code === 200) {
                        utils.refreshHref();
                        alertOk('发送成功');
                    }
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }
    };

    // 选择区域后把区域ID和名称带到编辑页面
    $scope.submitRegion = function (regionArr){
        var regionSelects=[];
        if (regionArr) {

            for (var i = 0; i < regionArr.length; i++) {
                if (regionArr[i].checked===true) {
                    // 如果有货位，则对选中的货位进行组织
                    if (regionArr[i].goodsLocationSelects.length) {
                        // 一定要放在这里来声明。不然会出现重复添加的bug。
                        var goodsLocationSelects=[];

                        for (var j = 0; j < regionArr[i].goodsLocationSelects.length; j++) {
                            // 判断是否是选中的货位
                            if (regionArr[i].goodsLocationSelects[j].checked===true) {
                                goodsLocationSelects.push(regionArr[i].goodsLocationSelects[j]);

                            }
                        }
                        // 如果所有货位都没有被选中，则把对应区域也去掉，不选中。
                        if (regionArr[i].goodsLocationSelects.length) {
                            regionArr[i].goodsLocationSelects=goodsLocationSelects;
                        }else {
                            regionArr[i].checked=false;
                        }
                    }
                    regionSelects.push(regionArr[i]);
                    $scope.formData.regionSelects=regionSelects;
                }
            }
        }
        // 调用组织ids的方法，把对应的id组织起来，用于传入后台
        getRegionIds(regionSelects);
    };

    // 选择货位后，组装成相应对象
    $scope.selectGoodslocation= function(tr,item){
        // 如果选中货位，就选中相对应的区域
        if (item.checked) {
            tr.checked=true;
        }
    };

    // 区域/货位侧边框请求数据
    $scope.reloadgoodslocationIds = function (storeRoomId,goodsLocationIds){
        if (!goodsLocationIds) {
            goodsLocationIds=[];
        }
        var _data={
            "storeRoomId":storeRoomId,
            "goodsLocationIds":goodsLocationIds
        };

        requestData("rest/authen/goodsLocation/queryForCheckOption", _data, 'POST','parameterBody')
            .then(function (results) {
                // 请求成功之后，被选中货位的对应区域的选中标识符被置为了false，所以这里需要重新把选中的区域标识符置为true

                for (var i = 0; i < results[1].data.length; i++) {
                    if (results[1].data[i].goodsLocationSelects.length) {
                        for (var j = 0; j < results[1].data[i].goodsLocationSelects.length; j++) {
                            if (results[1].data[i].goodsLocationSelects[j].checked) {
                                results[1].data[i].checked=true;
                            }
                        }
                    }
                }
                $scope.formData.goodsLocationArr=results[1].data;
            })
            .catch(function (error) {
                alertError(error || '出错');
            });
    };
    }

  function inventoryTaskOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError, dialogConfirm,utils) {


    $scope.$watch('initFlag', function (newVal) {
        if(newVal){
            var operationFlowSetMessage=[];
            var operationFlowSetKey=[];
            if ($scope.orderData.operationFlowSet) {
                // 选择出当前状态相同的驳回理由，并放入一个数组中
                for (var i=0; i<$scope.orderData.operationFlowSet.length; i++) {
                    if ($scope.orderData.operationFlowSet[i].status==$scope.orderData.orderStatus) {
                        operationFlowSetMessage.push($scope.orderData.operationFlowSet[i].message);
                        operationFlowSetKey.push($scope.orderData.operationFlowSet[i].key);
                    }
                }
                //  选择当前状态最近的一个驳回理由用于显示
                $scope.orderData.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
                $scope.orderData.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
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
      if($scope.submitForm_type == 'exit'){
          $scope.goTo('#/inventoryOrder/query.html');
          return;
      }
    };

    $scope.submit = function (_id,_businessKey){
        var key=_id;
        if (!_id) {
            key=_businessKey;

        }
        var _url='rest/authen/inventoryOrder/startProcessInstance';
        var data= {businessKey:key};
        requestData(_url, data, 'POST')
            .then(function (results) {
                var _data = results[1];
                //  alertOk(_data.message || '操作成功');
                utils.goTo('#/inventoryOrder/get.html?id='+key);

            })
            .catch(function (error) {
                alertError(error || '出错');
            });
    };


    $scope.submitData = function (formData,regionId,goodsLocationId){
        // 添加漏盘商品

        if (formData) {
            // 把区域货位id放到save商品的对象中
            formData.regionId=regionId;
            formData.goodsLocationId=goodsLocationId;
            // 请求save保存添加一条商品信息
            requestData("rest/authen/inventoryMedicalNo/save", formData, 'POST','parameterBody')
                .then(function (results) {
                    console.log(results[1].data);
                    // 保存成功之后把该条商品信息放入编辑页面第二张表格中
                    $scope.listObject.customMedicalList.push(results[1].data);
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }
    };

    // 保存任务
    $scope.saveData = function (inventoryOrderId,businessKey,systemMedicalList,customMedicalList){
        var inventoryMedicalNos=[], i = 0;
        if (!inventoryOrderId) {
          inventoryOrderId=businessKey
        }
        // 组织两个表中的数据到inventoryMedicalNos中，保存后传入后台
        for (i = 0; i < systemMedicalList.length; i++) {
            inventoryMedicalNos.push(systemMedicalList[i]);
        }
        for (i = 0; i < customMedicalList.length; i++) {
            inventoryMedicalNos.push(customMedicalList[i]);
        }

        var data={
            "inventoryOrderId":inventoryOrderId,
            "inventoryMedicalNos":inventoryMedicalNos
        };

        requestData("rest/authen/inventoryMedicalNo/inputData", data , 'POST','parameterBody')
            .then(function (results) {
                if (results[1].code === 200) {
                    utils.refreshHref();
                    alertOk('操作成功');
                }
            })
            .catch(function (error) {
                alertError(error || '出错');
            });
    };

    // 数量关联
    $scope.calGainlossQuantity = function (item){

        if (!item.actualQuantity) {
            item.gainLossQuantity='';
        }else {
            item.gainLossQuantity=parseInt(item.actualQuantity-item.systemQuantity);
            console.log(item.gainLossQuantity);
        }
    };

    $scope.deleteInventory = function(_id){

        var data={};
        requestData("rest/authen/inventoryMedicalNo/delete?id="+_id, data, 'POST')
        .then(function (results) {
          if (results[1].code === 200) {
              alertOk('操作成功');
            }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });

      }

  }

    //领退模块
    function  collarReturnOrderCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

        $scope.watchFormChange = function(watchName){

            watchFormChange(watchName,$scope);

        };




        //设置或重置申请部门
        $scope.$watch('formData.orderMedicalNos',function (p1, p2, p3) {


            if($scope.formData.orderMedicalNos == undefined){
                return;
            }

            if($scope.formData.orderMedicalNos.length<1){
                // $scope.formData.departmentId='';
                // $scope.formData.departmentName='';
                //
                $scope.formData.applicationDepartmentId='';
                $scope.formData.applicationDepartmentName='';

            }
        },true);

        //检测商品的选择批次是否存在 并检查 批次数量是否在可选范围
        $scope.checkCanSubmit=function () {
            var flag=true;

            $scope.zeroFlag=false;

            angular.forEach($scope.formData.orderMedicalNos,function (item,index) {

                //检测可退数量是否为0;
                if(item.returnTotal<1){
                    $scope.zeroFlag=true;
                    flag=false;
                    return;
                }

                //检查批次是否存在
                if(item.stockBatchs.length<1){
                    flag=false;
                }else{
                    //批次存在 检查批次数量是否合法
                    angular.forEach(item.stockBatchs,function (batch) {
                        if(batch.quantity > batch.maxQuantity || batch.quantity < 1){
                            flag=false;
                        }
                    });
                }
            });
            return flag;
        };



        //校验批次输入数量
        $scope.changeQuantity=function(nowVal,oldVal){

            // console.log("nowVal,oldVal",nowVal,oldVal);

            if(nowVal>oldVal){
                return true;
            }

            if(nowVal<=0){
                return true;
            }
            return false;
        };

        $scope.getGoodsBatchsCount=function (stockBatchs) {
            var count =0;
            if(stockBatchs){
                angular.forEach(stockBatchs,function (item,index) {
                    count += (item.quantity*1);
                });
            }
            return count;
        };



        // 回调  保存type:save-草稿,submit-提交订单。
        $scope.submitFormAfter = function() {

            if($scope.submitForm_type == 'save'){
                // $scope.goTo('#/collarReturnOrder/edit.html');
                return;
            }

            if ($scope.submitForm_type == 'submit') {
                var _url='rest/authen/collarReturnOrder/startProcessInstance';
                var data= {businessKey:$scope.formData.id};
                requestData(_url,data, 'POST')
                    .then(function (results) {
                        var _data = results[1];
                        $scope.goTo('#/collarReturnOrder/get.html?id='+$scope.formData.id);
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
            if ($scope.submitForm_type === 'save') {
                $scope.formData.validFlag = false;
            }

            if ($scope.submitForm_type == 'submit') {
                $scope.formData.validFlag = true;
            }

            $('#' + fromId).trigger('submit');
        };

    }

    //领退模块选择退货商品弹窗
    function  collarReturnOrderChoiceDialogCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

        //显示批次界面
        $scope.showBatchs=false;
        $scope.changeShowBatchsFlag=function (flag) {
            $scope.showBatchs =flag;
        };


        /**
         * 根据单号查询领用单
         * @param orderCode
         */
        $scope.getByOrderCode=function(orderCode){
            var _data={
                orderCode:orderCode
            };
            requestData("rest/authen/collarApplicationOrder/getByOrderCode", _data, 'GET')
                .then(function (results) {
                    $scope.scopeData=results[1].data || {};
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });

        };

        $scope.flashAddDataCallbackFn=function (data1) {

            $scope.angucomplete_data=data1;

            if($scope.angucomplete_data.data == undefined){
                return;
            }
            $scope.handleSearchFilter($scope.listParams,$scope.angucomplete_data.data.id);
        };

        $scope.angucomplete_data={};
        $scope.$watch('angucomplete_data',function(){
            $scope.curOrder=null;
            // console.log("angucomplete_data:$watch"+$scope.angucomplete_data.id);
            if($scope.angucomplete_data.data == undefined){
                return;
            }
            $scope.handleSearchFilter($scope.listParams,$scope.angucomplete_data.data.id);
        },true);



        //监听筛选条件并获取商品列表
        $scope.$watch('listParams',function (newValue,oldValue) {
            $scope.handleSearchFilter($scope.listParams,$scope.angucomplete_data.id);
        },true);
        //获取商品列表
        $scope.handleSearchFilter=function(listParams,relMedicalStockId){

            if(relMedicalStockId == undefined || relMedicalStockId==null || relMedicalStockId==''){
                return;
            }

            var _data=angular.extend(listParams,{
                "relMedicalStockId":relMedicalStockId,
                "pageSize":12
                // "pageNo":1
            });

            // console.log("_data",_data);

            requestData("rest/authen/collarApplicationOrder/queryByMedical", _data, 'GET')
                .then(function (results) {
                    // 请求成功之后，被选中货位的对应区域的选中标识符被置为了false，所以这里需要重新把选中的区域标识符置为true

                    console.log('results[1].data',results[1].data);

                    $scope.tbodyList=results[1].data || [];

                })
                .catch(function (error) {
                    alertError(error || '出错');
                });

        };


        //获取商品批次信息
        $scope.getGoodsBatchs=function(onlyId){

            //1.判断是否选择商品
            if($scope.curOrder== null){
                alertWarn("请选择领用单！");
                return;
            }

            //step0 判断部门
            if($scope.formData.applicationDepartmentId){
                if($scope.curOrder.applicationDepartmentId != $scope.formData.applicationDepartmentId){
                    alertWarn("退货列表已有"+$scope.formData.applicationDepartmentName+"的退货任务，不同部门的退货需要创建不同的退货单！");
                    return;
                }
            }

            //step1 判断去重复
            // var flag=false;
            // for(var i=0; i<$scope.formData.orderMedicalNos.length; i++){
            //     if($scope.formData.orderMedicalNos[i].onlyId ==  $scope.curOrder.medicalNo.onlyId){
            //         flag=true;
            //         break;
            //     }
            // }

            // if(flag){
            //     alertWarn("該商品已存在,请重新选择");
            //     return;
            // }








            // 4.跳转到批次选择界面-请求批次列表信息
            $scope.changeShowBatchsFlag(true);
            var _data={
                id:$scope.curOrder.relId,//单据主键ID
                relMedicalStockId:$scope.curOrder.relMedicalStockId
            };
            requestData("rest/authen/collarApplicationOrder/queryMedicalProductionBatch", _data, 'GET')
                .then(function (results) {
                    $scope.stockBatchList=results[1].data || [];


                    //查找已选择的该对象; 如果存在就获取已选择的批次信息;
                    var goods= $scope.findGoodsByOnlyId($scope.curOrder.medicalNo.onlyId);
                    if(goods.object){
                        $scope.dialogData.stockBatchs=goods.object.stockBatchs;
                    }else{
                        $scope.dialogData.stockBatchs=[];
                    }

                })
                .catch(function (error) {
                    alertError(error || '出错');
            });



        };


        /**
         * 根据 onlyId 查找已经添加的药械;
         * @param onlyId
         * @returns {{object: number, index: *}}
         */
        $scope.findGoodsByOnlyId=function (onlyId) {
            var _index=-1;
            var _object=null;

            angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
                if(onlyId === item.onlyId){
                    _index=index;
                    _object=item;
                }
            });

            return{
                object:_object,
                index:_index
            }
        };


        $scope.selectedBatchs2=[];

        //单击选择
        $scope.selectedBatchs2=[];
        $scope.handleItemClickEvent=function (item,dataSource,attr) {

            if(item.handleFlag){

                $scope.selectedBatchs2.push(item);

                if($scope.selectedBatchs2.length == dataSource.length){

                    $scope.isChoiseAll2=true;
                }else{
                    $scope.isChoiseAll2=false;
                }

            }else{
                angular.forEach($scope.selectedBatchs2,function (item2,index2) {
                    if(item[attr] == item2[attr]){
                        $scope.selectedBatchs2.splice(index2,1); // index. bug
                        $scope.isChoiseAll2=false;
                    }
                });
            }

        };

        // 全选全不选
        $scope.handleChoiseAllEvent = function (flag,list) {

            if (flag) {   // 全选被选中

                $scope.selectedBatchs2=[];
                angular.forEach(list, function (data, index) {
                    if(!data.disabled){
                        data.handleFlag = true;
                        $scope.selectedBatchs2.push(data);
                    }
                });

            } else {    //取消了全部选中
                angular.forEach(list, function (data, index) {

                    if(!data.disabled){
                        data.handleFlag = false;
                    }
                    // $scope.selectedBatchs2.splice(index,1);
                });
                $scope.selectedBatchs2=[];
            }

            // console.log("$scope.selectedBatchs",$scope.selectedBatchs2.length);

        };


        /**
         * 初始化是否已选择
         * @param choiceList
         * @param dataList
         * @param attr
         */
        $scope.initChoisedMedicalList=function (choiceList,dataList,attr) {

            //判断是否全部选中标识
            var counter=0;
            var choicedList=[];

            angular.forEach(choiceList,function (item,index) {
                for(var i=0; i<dataList.length; i++){
                    if(item[attr] == dataList[i][attr]){
                        dataList[i].handleFlag=true;
                        choicedList.push(item);
                        counter++;
                    }
                    if(!dataList[i].handleFlag){
                        $scope.isChoiseAll=false;
                    }
                }
            });

            if(dataList){
                if(dataList.length == counter){
                    $scope.isChoiseAll=true;
                }
            }


            $scope.selectedBatchs=choicedList;

            return choicedList;
        };


        //添加到商品数据列表
        $scope.addToList=function(){

           var goods= $scope.findGoodsByOnlyId($scope.curOrder.medicalNo.onlyId);

           if(goods.object == null){

                var obj = $scope.curOrder.medicalNo;
                    obj.relOrderCode=$scope.curOrder.relOrderCode; //領用單編號
                    obj.returnTotal=$scope.curOrder.returnTotal || 0;//可退數量
                    obj.relMedicalStockId=obj.id; //药品ID
                    obj.relCollarApplicationId=$scope.curOrder.relId;//领用单ID
                    obj.relId=$scope.curOrder.relId;
                    obj.stockBatchs=$scope.selectedBatchs2; //批次信息

                // console.log("obj",obj);
                $scope.formData.orderMedicalNos.push(obj);
                $scope.formData.relIds.push(obj.relId);

                $scope.formData.applicationDepartmentId=$scope.curOrder.applicationDepartmentId ;//设置部门ID
                $scope.formData.applicationDepartmentName=  $scope.curOrder.applicationDepartmentName; //设置部门 name
                $scope.formData.applicant.id=$scope.curOrder.applicant.id;//设置申请人

                $scope.selectedBatchs2=[]; //清空选择的批次

           }else{
               $scope.choiceBaths(goods.index);
           }



        };

        //检查部门是否存在
        $scope.checkDepartment=function(departmentId,departmentName){
            if(departmentId){
                var flag=false;
                if($scope.formData.applicationDepartmentId){
                    if($scope.formData.applicationDepartmentId != departmentId){
                        alertWarn("退货列表已有"+$scope.formData.applicationDepartmentName+"的退货任务，不同部门的退货需要创建新的领退单！");
                        flag=true;
                    }
                }
                return flag;
            }
            return false;
        };

        //添加领用单中的商品到列表
        $scope.addOrderDataToList=function (departmentId,departmentName,relCollarApplicationId,applicantId) {

            //step0 设置部门
            if(!$scope.formData.applicationDepartmentId){
                //设置部门ID 和 name
                $scope.formData.applicationDepartmentId=departmentId ;
                $scope.formData.applicationDepartmentName= departmentName;

                //设置申请人
                $scope.formData.applicant.id=applicantId;
            }

            //添加商品
            var hasOrderMedicalNos = $scope.formData.orderMedicalNos;

            var resultArr = $scope._compareArray(hasOrderMedicalNos,$scope.selectedBatchs2,'onlyId','onlyId');

            angular.forEach(resultArr,function (item,index) {
                item.relCollarApplicationId=relCollarApplicationId;
            });

            $scope.formData.orderMedicalNos = hasOrderMedicalNos.concat(resultArr);

            for(var i=0; i<resultArr.length; i++){
                var goods= resultArr[i];
                $scope.formData.relIds.push(goods.relId);
            }
        };

        //选择批次
        $scope.choiceBaths=function(index){

            var hasStockBatchs= $scope.formData.orderMedicalNos[index].stockBatchs;

            var list = $scope._compareArray(hasStockBatchs,$scope.selectedBatchs2,'stockBatchId','stockBatchId')

            $scope.formData.orderMedicalNos[index].stockBatchs = hasStockBatchs.concat(list);


            // $scope.selectedBatchs2=[];
        };

        //选择商品
        $scope.$on('selected',function (e, data) {
           $scope.curOrder= data;
        });

        $scope.itemInArray=function (id,batchlist,attr) {
            var flag=false;
            for(var i=0; i<batchlist.length; i++){
                if(batchlist[i][attr] == id){
                    flag=true;
                }
            }
            return flag;
        };

        //去重 返回 arrB 与 arrA 中 arrB不重复部分
         $scope._compareArray=function(arrA,arrB,arrAAtrr,arrBAtrr){
            var temp=[];

            for (var i = 0; i<arrA.length; i++) {

                for(var j=0; j<arrB.length; j++){

                    if(arrA[i][arrAAtrr]==arrB[j][arrBAtrr]){
                        temp.push(arrB[j][arrBAtrr]);
                    }
                }
            }


            for(var i=0;i<temp.length; i++){

                for(var j=0; j<arrB.length; j++){
                    // console.log(arrB[j][arrBAtrr],temp[i],arrB[j][arrBAtrr]==temp[i]);
                    if(arrB[j][arrBAtrr]==temp[i]){
                        arrB.splice(j,1);
                    }
                }
            }

            return arrB;
        }
    }

    //领退模块选择退货商品
    function  collarReturnOrderChoiceDialogSubCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

        //选择当前订单-商品
        $scope.choiceThis=function (item,index,flag){
            if(!flag){
                $scope.$emit('selected',item);
            }
        };


    }







    angular.module('manageApp.project-PG16-H')
        .controller('indexPageController', ['$scope', 'requestData', 'utils', 'OPrinter', '$timeout', '$rootScope', indexPageController])
        .controller('mainCtrlProjectPG16H',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils","purchaseOrderUtils","requestPurchaseOrderUtils","queryItemCardButtonList","customMenuUtils", mainCtrlProjectPG16H])
        .controller('medicalStockCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockCtrl])
        .controller('inoutstockDetailController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', inoutstockDetailController])
        .controller('transferRecordCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn','modal', transferRecordCtrl])
        .controller('medicalStockStrategyCtrl', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', medicalStockStrategyCtrl])
        .controller('allocateOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'dialogConfirm', allocateOrderEditCtrl])
        .controller('inventoryOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'dialogConfirm', "utils",inventoryOrderEditCtrl])
        .controller('inventoryTaskOrderEditCtrl', ['$scope', 'modal', 'alertWarn', 'requestData', 'alertOk', 'alertError', 'dialogConfirm', "utils",inventoryTaskOrderEditCtrl])
        .controller('receiveItemController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', receiveItemController])
        .controller('shelvesUpController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', shelvesUpController])
        .controller('pickStockOutMedicalController', ['$scope', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', 'alertOk', pickStockOutMedicalController])
        .controller('purchasePlanOrderController', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', 'dialogConfirm', purchasePlanOrderController])
        .controller('collarApplicationOrderController', ['$scope', 'modal','alertWarn','alertError','requestData','watchFormChange', 'dialogConfirm', collarApplicationOrderController])
        .controller('purchaseContentController', ['$scope', 'modal', 'alertWarn', 'watchFormChange', 'requestData', 'utils', purchaseContentController])
        .controller('createCorrespondController', ['$scope', 'requestData', 'modal', 'alertWarn', 'utils', createCorrespondController])
        .controller('storeRoomController', ['$scope','watchFormChange', 'requestData', 'alertError', 'alertOk', storeRoomController])
        .controller('purchaseReturnController', ['$scope', 'modal', 'alertWarn', 'watchFormChange', 'requestData', '$rootScope', 'alertOk', 'utils', purchaseReturnController])
        .controller('checkUpController', ['$scope', 'requestData', 'utils', 'modal','alertWarn', 'alertOk', checkUpController])
        .controller('pickBillOrderController', ['$scope', 'requestData', 'utils', 'modal', pickBillOrderController])
        .controller('cfgGoodsBarcodeCtroller', ['$scope', 'requestData', 'utils', 'OPrinter', '$timeout', cfgGoodsBarcodeCtroller])
        .controller('inventoryAdjustmentOrderCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', inventoryAdjustmentOrderCtrl])
        .controller('inventoryAdjustmentOrderDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', inventoryAdjustmentOrderDialogCtrl])
        .controller('collarReturnOrderCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', collarReturnOrderCtrl])
        .controller('collarReturnOrderChoiceDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', collarReturnOrderChoiceDialogCtrl])
        .controller('collarReturnOrderChoiceDialogSubCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', collarReturnOrderChoiceDialogSubCtrl]);
});
