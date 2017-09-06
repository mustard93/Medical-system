/**
 * Created by hao on 15/11/5.
 */
define('project-dt/controllers', ['project-dt/init',
                                  'project-dt/controllers-imTaobao',
                                  'project-dt/controllers-salesOrder',
                                  'project-dt/controllers-needToPurchase',
                                  'project-dt/controllers-lossOverOrder',
                                  'project-dt/controllers-freezeThawOrder',
                                  'project-dt/controllers-confirmOrder',
                                  'project-dt/controllers-confirmOrder2',
                                  'project-dt/controllers-ConfirmOrderMedical',
                                  'project-dt/controllers-lossOverOrderMedical',
                                  'project-dt/controllers-invoicesOrder',
                                  'project-dt/controllers-notice',
                                  'project-dt/controllers-arrivalNoticeOrder',
                                  'project-dt/controllers-purchaseOrder',
                                  'project-dt/controllers-allocateOrder',
                                  'project-dt/controllers-uiCustomTable',
                                  'project-dt/controllers-requestPurchaseOrder',
                                  'project-dt/controllers-auditUserApplyOrganization',
                                  'project-dt/controllers-editWorkFlowProcess',
                                  'project-dt/controllers-QualificationApply',
                                  'project-dt/controllers-otherCustomerApplication',
                                  'project-dt/controllers-SelectedCommodity',
                                  'project-dt/controllers-hospitalPurchaseContents',
                                  'project-dt/controllers-medicalStock',
                                  'project-dt/controllers-deliveryItem',
                                  'project-dt/controllers-customerAddress',
                                  'project-dt/controllers-SalesOrderDetails',
                                  'project-dt/controllers-deleteUploader',
                                  'project-dt/controllers-ScreenFinanceApproval',
                                  'project-dt/controllers-returnOrder',
                                  'project-dt/controllers-purchasereturnOrder',
                                  'project-dt/controllers-returnOrderAdd',
                                  'project-dt/controllers-saleReturnMedicalItem',
                                  'project-dt/controllers-saleOutstockOrder',
                                  'project-dt/controllers-getAllExpress',
                                  'project-dt/controllers-inoutstockDetailQuery',
                                  'project-dt/controllers-infrastructure',
                                  'project-dt/controllers-saleContent',
                                  'project-dt/controllers-createCorrespond',
                                  'project-dt/controllers-cfgGoodsBarcode',
                                  'project-dt/controllers-orderCodeStrategy',
                                  'project-dt/controllers-archiveCodeStrategy',
                                  'project-dt/controllers-medicalAttribute',
                                  'project-dt/controllers-regionManage',
                                  'project-dt/controllers-lendOrder',
                                  'project-dt/controllers-returnOrder2',
                                  'project-dt/controllers-validityStrategy',
                                  'project-dt/controllers-medicalFlashCheck',
                                  'project-dt/controllers-salesChangeOrder',
                                  'project-dt/controllers-orderStatistics',
                                  'project-dt/controllers-validityStrategy',
                                  'project-dt/controllers-validityDistribution',
                                  'project-dt/controllers-nearEffectPeriod',
                                  'project-dt/controllers-entryExitTypeSetting',
                                  'project-dt/controllers-businessScopeEditCtrl',
                                  'project-dt/controllers-businessScope',
                                  'project-dt/controllers-productEnterprise',
                                  'project-dt/controllers-license',
                                  'project-dt/controllers-announcement',
                                  'project-dt/controllers-requestPurchaseOrderDetail'], function() {

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
    // 重新选择历史价格之后哟啊实时重新计算总计
    $scope.confirmOrderCalculaTotal = function (orderMedicalNos, orderBusinessType) {
      if (orderMedicalNos) {
        var _total = 0;
        angular.forEach(orderMedicalNos, function (item, index) {
          // 如果订单类型为普通销售
          if (orderBusinessType === '普通销售' && item.stockBatchs && item.handleFlag) {
            var _tmp = 0;
            for (var i = 0; i < item.stockBatchs.length; i++) {
              _tmp += item.stockBatchs[i].quantity * item.strike_price * (item.discountRate / 100);
            }
            _total += _tmp;
          }
          //如果订单类型是直运销售
          if (orderBusinessType === '直运销售' && item.handleFlag) {
            _total += item.quantity * item.strike_price * (item.discountRate / 100);
          }
        });
        $scope.formData.totalPrice = _total;
      }
    };
  }

  /**
   * [editStockbatchNumberCtrl 销售单涉及到多仓库的批号数量选择及操作控制器]
   * @param  {[type]} $scope [注入项]
   * @param  {[type]} utils  [注入项]
   * @return {[type]}        [description]
   */
  function editStockbatchNumberCtrl ($scope,modal, utils, requestData) {

    // 监控listparams对象中属性的更改，刷新结果列表
    $scope.$watchCollection('listParams', function (newVal, oldVal) {
      if ($scope.listParams && oldVal !== undefined) {

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
              q: $scope.listParams.q,
              warehouseType:  $scope.dialogData.warehouseType,
              isOnlyAvailable: true
            };

        requestData(_url, _data, 'GET')
        .then(function (results) {
          if (results[1].data) { $scope.stockBatchList = results[1].data; }
        });
      }
    });

    // 获取用户已选择的药品批次，并将批次id存入数组
    $scope.getChoisedBatchsId = function (choisedBatchList) {

        var list=[];

        if (choisedBatchList) {
            $scope.choisedBatchsIdList = [];
            angular.forEach(choisedBatchList, function (data, index) {
              if (data.stockBatchId) {
                $scope.choisedBatchsIdList.push(data.stockBatchId);
              }
            });
            list = $scope.choisedBatchsIdList

        }

      return list;
    };

    // 用户选择生产批号
    $scope.choseBatch = function (obj,choisedList,id,i) {

      // 构建临时对象存储批号id、批号名和数量
      var _tmp = {
        stockBatchId: obj.id,                     // 批次号id
        batchNumber: obj.productionBatch,
        quantity: obj.stockModel.salesQuantity,    // 可选数量
        salesQuantity: obj.stockModel.salesQuantity,    // 可选数量
        productionBatch: obj.productionBatch,     // 批号名
        validTill:obj.validTill,
        strike_price:obj.strike_price,
        totalPrice:obj.totalPrice,
        productionDate:obj.productionDate,
        sterilizationBatchNumber: obj.sterilizationBatchNumber,    // 灭菌批号
        warehouseName: obj.warehouseName,       // 仓库名
        warehouseId: obj.warehouseId,        // 仓库名id
        warehouseType: obj.warehouseType     // 仓库类型
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
      if ((obj.stockModel.salesQuantity + _total) > $scope.dialogData.quantity) {
        // 将计划采购数量赋值给临时对象
        _tmp.quantity = $scope.dialogData.quantity - _total;
      }

      // 根据药品id将批次存入当前药品formData数据中
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          // if (data.relId == id) {
          //   $scope.formData.orderMedicalNos[index].stockBatchs.push(_tmp);
          //    // $scope.confirmOrderCalculaTotal($scope.formData.orderMedicalNos, '普通销售');
          // }
          if (index == i) {
            $scope.formData.orderMedicalNos[i].stockBatchs.push(_tmp);
          }
        });
      }

        if($scope.submitForm_type == 'save'){
            // $scope.goTo('#/returnOrder/edit.html?id='+$scope.formData.id);
            return;
        }


    };

    $scope.$on('chosedBatch',function (e,data) {
        $scope.choseBatch(data.obj,data.choisedList,data.id, data.index);
        modal.close();
    });


  }

  /**
   * [choseBatchCtrl 批号选择侧边栏中选择批号控制]
   * @method choseBatchCtrl
   * @param  {[type]}       $scope [description]
   * @return {[type]}              [description]
   */
  function choseBatchCtrl($scope) {
      //选择当前订单-商品
      $scope.choiceThis=function (obj,choisedList,id,listObject){

        try{
          //判断该批号已经添加过了，就不允许在添加了。
          if(listObject.choisedBatchsIdList.indexOf(obj.id)!=-1){
            // console.log(listObject.choisedBatchsIdList,obj);
            return ;
          }
            //解决该方法在span，ng-click上面，偶尔出现2次调用bug，临时解决方案。选择后，加入到批号选中
            listObject.choisedBatchsIdList.push(obj.id);
        }catch(e){
            console.log(e);
        }

          var obj ={
              'obj':obj,
              'choisedList':choisedList,
              'id':id,
              'index': listObject['index']
          };

          $scope.$emit('chosedBatch',obj);

      };
  }

  angular.module('manageApp.project-dt')
  .controller('indexPurchaseSuppleController', ['$scope', 'utils', indexPurchaseSuppleController])
  .controller('historicalPriceController', ['$scope', 'utils', historicalPriceController])
  .controller('editStockbatchNumberCtrl', ['$scope','modal', 'utils', 'requestData', editStockbatchNumberCtrl])
  .controller('choseBatchCtrl', ['$scope', choseBatchCtrl])
});
