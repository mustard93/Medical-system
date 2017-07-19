/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init',
                               'project/controllers-imTaobao',
                               'project/controllers-salesOrder',
                               'project/controllers-salesOrder2',
                               'project/controllers-lossOverOrder',
                               'project/controllers-freezeThawOrder',
                               'project/controllers-confirmOrder',
                               'project/controllers-confirmOrder2',
                               'project/controllers-ConfirmOrderMedical',
                               'project/controllers-invoicesOrder',
                               'project/controllers-notice',
                               'project/controllers-arrivalNoticeOrder',
                               'project/controllers-purchaseOrder',
                               'project/controllers-allocateOrder',
                               'project/controllers-requestPurchaseOrder',
                               'project/controllers-auditUserApplyOrganization',
                               'project/controllers-editWorkFlowProcess',
                               'project/controllers-QualificationApply',
                               'project/controllers-otherCustomerApplication',
                               'project/controllers-SelectedCommodity',
                               'project/controllers-hospitalPurchaseContents',
                               'project/controllers-medicalStock',
                               'project/controllers-deliveryItem',
                               'project/controllers-customerAddress',
                               'project/controllers-SalesOrderDetails',
                               'project/controllers-deleteUploader',
                               'project/controllers-ScreenFinanceApproval',
                               'project/controllers-returnOrder',
                               'project/controllers-purchasereturnOrder',
                               'project/controllers-returnOrderAdd',
                               'project/controllers-saleReturnMedicalItem',
                               'project/controllers-saleOutstockOrder',
                               'project/controllers-getAllExpress',
                               'project/controllers-inoutstockDetailQuery',
                               'project/controllers-infrastructure',
                               'project/controllers-saleContent',
                               'project/controllers-createCorrespond',
                               'project/controllers-cfgGoodsBarcode',
                               'project/controllers-orderCodeStrategy',
                               'project/controllers-archiveCodeStrategy',
                               'project/controllers-medicalAttribute',
                               'project/controllers-regionManage',
                               'project/controllers-lendOrder',
                               'project/controllers-returnOrder2'], function() {

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
   * [watchFormCtrl 站内消息]
   * @method watchFormCtrl
   * @param  {[type]}      $scope          [description]
   * @param  {[type]}      watchFormChange [description]
   * @return {[type]}                      [description]
   */
  function watchFormCtrl($scope, watchFormChange) {
    $scope.watchFormChange=function(watchName){
      watchFormChange(watchName,$scope);
    };


   }//watchFormCtrl


   /**
    * [intervalCtrl 定时任务ctrl]
    * @method intervalCtrl
    * @param  {[type]}     $scope      [description]
    * @param  {[type]}     modal       [description]
    * @param  {[type]}     alertWarn   [description]
    * @param  {[type]}     requestData [description]
    * @param  {[type]}     alertOk     [description]
    * @param  {[type]}     alertError  [description]
    * @param  {[type]}     $rootScope  [description]
    * @param  {[type]}     $interval   [description]
    * @return {[type]}                 [description]
    */
  function intervalCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {

  }


  /**
   * [indexPageController 首页控制器]
   * @param  {[type]} $socpe [description]
   * @return {[type]}        [description]
   */
  function indexPageController ($socpe, utils) {

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
              warehouseType: '正常库',
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
    $scope.choseBatch = function (obj,choisedList,id) {

      // 构建临时对象存储批号id、批号名和数量
      var _tmp = {
        stockBatchId: obj.id,                     // 批次号id
        batchNumber: obj.productionBatch,
        quantity: obj.stockModel.salesQuantity,    // 可选数量
        productionBatch: obj.productionBatch,     // 批号名
        validTill:obj.validTill,
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

      // if ($scope.formData.orderMedicalNos) {
      //   angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
      //     if (data.stockBatchs) {
      //       for (var i = 0; i < data.stockBatchs.length; i++) {
      //         if (data.stockBatchs[i].batchNumber)
      //         { _total += parseInt(data.stockBatchs[i].quantity, 10);
      //         }
      //       }
      //     }
      //   });
      // }

      // 如果当前批次数量大于或等于计划采购数量
      if ((obj.stockModel.salesQuantity + _total) > $scope.dialogData.quantity) {
        // 将计划采购数量赋值给临时对象
        _tmp.quantity = $scope.dialogData.quantity - _total;
      }

      // 根据药品id将批次存入当前药品formData数据中
      if ($scope.formData.orderMedicalNos) {
        angular.forEach($scope.formData.orderMedicalNos, function (data, index) {
          if (data.relId == id) {
            $scope.formData.orderMedicalNos[index].stockBatchs.push(_tmp);
             $scope.confirmOrderCalculaTotal($scope.formData.orderMedicalNos, '普通销售');
          }
        });
      }

      // 将当前批次的灭菌批号和仓库名传递到列表


    };

    $scope.$on('chosedBatch',function (e,data) {
        $scope.choseBatch(data.obj,data.choisedList,data.id);
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
      $scope.choiceThis=function (obj,choisedList,id){
          var obj ={
              'obj':obj,
              'choisedList':choisedList,
              'id':id
          };
          $scope.$emit('chosedBatch',obj);
      };
  }




  //归还单择归还商品弹窗 Ctrl
  function  returnOrderChoiceDialogCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

      //显示批次界面
      $scope.showLendOrder=false;
      $scope.showBatchs=false;
      $scope.changeShowBatchsFlag=function (flag) {
          $scope.showBatchs =flag;
      };

      /**
       * 根据单号查询借出单
       * @param orderCode
       */
      $scope.getByOrderCode=function(orderCode){
          //console.log("orderCode",orderCode,$scope.curOrder.orderCode);
          requestData("rest/authen/lendOrder/getByOrderCode?orderCode="+orderCode,{}, 'GET')
              .then(function (results) {
                  // 显示借出单信息
                  $scope.showLendOrder=true;

                  $scope.scopeData=results[1].data || {};

                  $scope.checkRelId($scope.formData.relId,$scope.scopeData.id);

              })
              .catch(function (error) {
                  alertError(error || '出错');
              });
      };


      $scope.flashAddDataCallbackFn=function (data1) {

          $scope.angucomplete_data=data1;

          if(!$scope.angucomplete_data.data){
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

          if(!relMedicalStockId){
              return;
          }

          var _data=angular.extend(listParams,{
              "relMedicalStockId":relMedicalStockId,
              "pageSize":12
              // "pageNo":1
          });

          console.log("_data",_data);

          requestData("rest/authen/lendOrder/queryByMedical", _data, 'GET')
              .then(function (results) {
                  // 请求成功之后，被选中货位的对应区域的选中标识符被置为了false，所以这里需要重新把选中的区域标识符置为true

                  console.log('results[1].data',results[1].data);

                  $scope.tbodyList=results[1].data || [];

              })
              .catch(function (error) {
                  alertError(error || '出错');
              });

      };


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

      //添加商品到列表
      $scope.addOrderDataToList=function (returnOderRelId,id,orderNo,orderCode) {

          //如果存在就判断是否相等  不相等就返回
          if(returnOderRelId){

              if(returnOderRelId != id){
                  alertWarn("只能选择同一借出单药械");
                  return;
              }

          }else{
              //如果不存在就设置
              $scope.formData.relId=id;
              $scope.formData.relOrderNo= orderNo;
              $scope.formData.relOrderCode=orderCode;
          }

          //添加商品
          var hasOrderMedicalNos = $scope.formData.orderMedicalNos;

          //添加的商品设置的计划归还数量为null, 在页面进行计算；
          angular.forEach($scope.selectedBatchs2,function (item,index) {
              item.quantity = null;
              $scope.selectedBatchs2[index]= item;
          });

          var resultArr = $scope._compareArray(hasOrderMedicalNos,$scope.selectedBatchs2,'relId','relId');
          $scope.formData.orderMedicalNos = hasOrderMedicalNos.concat(resultArr);
      };


      /**
       * 判断item 是否存在
       * @param id item 唯一标识
       * @param batchlist 比较列表
       * @param attr 列表单个元素比对属性
       * @returns {boolean}
       */
      $scope.itemInArray=function (id,batchlist,attr) {
          var flag=false;
          for(var i=0; i<batchlist.length; i++){
              if(batchlist[i][attr] == id){
                  flag=true;
              }
          }
          return flag;
      };

      //接受选择事件
      $scope.$on('selected',function (e, data) {
          $scope.curOrder= data;
      });


      //比对借出单ID 与已选择借出单ID  不相同返回false;
      $scope.compareOrderId=function(choicedLendOrderId,nowLendOrderId){

          var flag=true;

          if(choicedLendOrderId){
              if(choicedLendOrderId!=nowLendOrderId){
                  flag=false;
              }
          }
          return flag;
      };

      $scope.checkRelId=function (returnOderRelId,choiceReturnOderRelId) {
          // 判断借出单ID是否存在，如果存在且与选择的借出单 ID 不一致 给出提示
          if(!$scope.compareOrderId(returnOderRelId,choiceReturnOderRelId)) {
              alertWarn("只能选择同一借出单药械");
          }
      };

      //上一步 - bug
      $scope.prevStep=function(){
          $scope.showLendOrder=false;
          $scope.selectedBatchs2.length=0;
          $scope.isChoiseAll2=false;
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

  //还单择归还商品弹窗 Sub Ctrl
  function  returnOrderChoiceDialogSubCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {
      //选择当前订单-商品
      $scope.choiceThis=function (item,index,flag){
          if(!flag){
              $scope.$emit('selected',item);
          }
      };
  }

  function uiCustomTableController ($scope, alertOk, alertError, requestData) {

    // 树形菜单中选项被点击后，监控medicalAttribute对象变化，并获取响应数据重新渲染右侧表单内容
    $scope.$watchCollection('formData.customTable', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {

        var _reqUrl = 'rest/authen/uiCustomTable/getOfEdit.json?id=596d77bce4b06e338d596e6f';
        requestData(_reqUrl)
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.formData = results[1].data;  // 新获取的模块配置数据赋值给当前表单数据对象

          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        })
      }
    });

  }



  angular.module('manageApp.project')
  .controller('historicalPriceController', ['$scope', 'utils', historicalPriceController])
  .controller('editStockbatchNumberCtrl', ['$scope','modal', 'utils', 'requestData', editStockbatchNumberCtrl])
  .controller('indexPurchaseSuppleController', ['$scope', 'utils', indexPurchaseSuppleController])
  .controller('indexPageController', ['$scope', 'utils', indexPageController])
  .controller('mainCtrlProject',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter","UICustomTable","bottomButtonList","saleOrderUtils","purchaseOrderUtils","requestPurchaseOrderUtils","queryItemCardButtonList","customMenuUtils", mainCtrlProject])
  .controller('watchFormCtrl', ['$scope','watchFormChange', watchFormCtrl])
  .controller('intervalCtrl', ['$scope', 'modal','alertWarn','requestData','alertOk','alertError','$rootScope','$interval', intervalCtrl])
  .controller('uiCustomTableController', ['$scope', 'alertOk', 'alertError', 'requestData', uiCustomTableController])
  .controller('returnOrderChoiceDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', returnOrderChoiceDialogCtrl])
  .controller('returnOrderChoiceDialogSubCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', returnOrderChoiceDialogSubCtrl])
  .controller('choseBatchCtrl', ['$scope', choseBatchCtrl]);
});
