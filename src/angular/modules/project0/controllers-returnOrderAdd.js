define('project/controllers-returnOrderAdd', ['project/init'], function() {
  /**
   * [returnOrderAddController 销售退货单弹出模态框添加项目控制器]
   * @method returnOrderAddController
   * @param  {[type]}                 $scope      [description]
   * @param  {[type]}                 $rootScope  [description]
   * @param  {[type]}                 modal       [description]
   * @param  {[type]}                 utils       [description]
   * @param  {[type]}                 requestData [description]
   * @param  {[type]}                 alertError  [description]
   * @return {[type]}                             [description]
   */
  function returnOrderAddController ($scope, $rootScope, modal, utils, requestData, alertError) {

    $scope.addDataObj={};
    $scope.hasReturnList = false;

    // 监控用户选择的发货单，发生变化后立即检查当前单据中是否有可退的商品
    $scope.$watch('addDataObj.orderMedicalNos', function (newVal) {
      if (newVal) {
        $scope.hasReturnList = false;
        angular.forEach(newVal, function (item, index, array) {
          if (item.returnQuantity !== 0) {
            $scope.hasReturnList = true;
          }
        });
      }
    });

    //1.初始化选择状态。
    //addDataObj_orderMedicalNos:发货单细表，saleReturnOrder_orderMedicalNos 销售退货单细表
    $scope.initChoisedMedicalList=function(addDataObj_orderMedicalNos,saleReturnOrder_orderMedicalNos){
        var choisedMedicalList = [], _initFlag = 0;

        if (!addDataObj_orderMedicalNos) {
          return choisedMedicalList;
        }

        //如果销售退货细表中有该条目则选中
        angular.forEach(addDataObj_orderMedicalNos, function (data, index) {
          if (saleReturnOrder_orderMedicalNos) {
            for (var i = 0; i < saleReturnOrder_orderMedicalNos.length; i++) {
              if (data.relId === saleReturnOrder_orderMedicalNos[i].relId &&
                  data.productionBatch === saleReturnOrder_orderMedicalNos[i].productionBatch &&
                  data.sterilizationBatchNumber === saleReturnOrder_orderMedicalNos[i].sterilizationBatchNumber) {
                    data.itemSelected = true;
                    choisedMedicalList.push(data);
                    _initFlag++;
                  }
            }
          }

          if (!data.itemSelected) {
            $scope.isChoiseAll = false;
          }

          // if(utils.getObjectIndexByKeyOfArr(saleReturnOrder_orderMedicalNos,"relId",data.relId)>-1){
          //   data.itemSelected = true;
          //   choisedMedicalList.push(data);
          // }
          //
          // if (!data.itemSelected) {
          //   $scope.isChoiseAll = false;
          // }
        });

        if (_initFlag === addDataObj_orderMedicalNos.length) {
          $scope.isChoiseAll = true;
        }

        return choisedMedicalList;
    };

    // 单个药品点击添加与取消添加事件处理
    $scope.handleItemClickEvent = function (item) {

      var _dataSource = $scope.addDataObj.orderMedicalNos;

      if (!$scope.choisedMedicalList) {
        $scope.choisedMedicalList = [];
      }

      if (item.itemSelected) {

        $scope.choisedMedicalList.push(item);


        if ($scope.choisedMedicalList.length === _dataSource.length) {
          $scope.isChoiseAll = true;
        }
      } else {
        angular.forEach($scope.choisedMedicalList, function (data, index) {
          if (data.relId === item.relId && data.productionBatch === item.productionBatch && data.sterilizationBatchNumber === item.sterilizationBatchNumber) {
            $scope.choisedMedicalList.splice(index, 1);
          }
        });
        $scope.isChoiseAll = false;
      }

    };
    // $scope.initSelectAll=function(medicalList){
    //
    // }
    // 对比是否之前已经选择过，如果选择过，就打上勾。
     $scope.alreadySelect=function(medicalList,choisedMedicalList){
      // 把侧边框中的商品对象和编辑页面中已添加的商品对象分别取出来放在medical和choisedMedical两个数组中。
         medicalList= medicalList || [];
      var medical=eval(medicalList);
          choisedMedicalList=choisedMedicalList || [];
      var choisedMedical=eval(choisedMedicalList);

      // 对比两个数组中的id,是否有相同的。
      for(var i=0;i<medical.length; i++){

          for(var j=0; j<choisedMedical.length; j++){
              // 如果id相同，则选中该条
              if(choisedMedical[j].id==medical[i].id){
                medical[i].itemSelected=true;

              }
              // 是否选中全选复选框
              if(choisedMedical.length==medical.length){
                $scope.isChoiseAll = true;
              }else{
                  $scope.isChoiseAll = false;
              }
          }
      }
    }

    $scope.addToList=function(choisedMedicalList,medicalList){

        choisedMedicalList = choisedMedicalList || [];

        medicalList=medicalList||[];

        var list = compareArray(medicalList,choisedMedicalList,'id','id');
        return medicalList.concat(list);
    };

     //去重 返回 arrB 与 arrA 中 arrB不重复部分
    function compareArray(arrA,arrB,arrAAtrr,arrBAtrr){
          var temp=[];

          for (var i = 0; i<arrA.length; i++) {

              for(var j=0; j<arrB.length; j++){

                  if(arrA[i][arrAAtrr]==arrB[j][arrBAtrr]){

                      // console.log("重复的有：",arrB[j][arrBAtrr]);
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
          //  console.log("去重部分剩下部分：",arrB);
          return arrB;
      }

    // 全选与全不选
    $scope.handleChoiseAllEvent = function () {

      $scope.choisedMedicalList = [];

      var _dataSource = $scope.addDataObj.orderMedicalNos;

      if (!$scope.choisedMedicalList) {
        $scope.choisedMedicalList = [];
      }

      if ($scope.isChoiseAll) {
        angular.forEach(_dataSource, function (data, index) {
          data.itemSelected = true;
          if (data.returnQuantity !== 0) {
            $scope.choisedMedicalList.push(data);
          }
        });
      } else  {
        angular.forEach(_dataSource, function (data, index) {
          data.itemSelected = false;
          $scope.choisedMedicalList = [];
        });
      }

    };

    // 采购退货单模块根据设计变更重写hanleAddDataArray方法,需将选中的数据及id发送到后端进行拆分后将返回数据加载到主页面
    $scope.handleAddData = function (addDataObj_id, addDataObj_orderNo,choisedMedicalList,addDataObj) {

      // 发货单id不能为空,至少选择1条数据
      if (!addDataObj_id || !addDataObj_orderNo || !choisedMedicalList || choisedMedicalList.length === 0) {
        return ;
      }


      //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
      $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
      $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
      $scope.formData.purchaseType=addDataObj.purchaseType;
      $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
      $scope.formData.saleUser=addDataObj.saleUser;
      $scope.formData.supplier.name=addDataObj.supplier.name;
      $scope.formData.logisticsCenterName=addDataObj.logisticsCenterName;

      // 清空原有数据
      $scope.formData.relId = addDataObj_id;
      $scope.formData.orderMedicalNos = [];

      // 初始化
      var _data = {
        'arrivalNoticeOrderNo': '',
        'orderMedicalNoSet': []
      };

      _data.arrivalNoticeOrderNo = addDataObj_orderNo;
      angular.forEach(choisedMedicalList, function (data, index) {
        _data.orderMedicalNoSet.push(data);
      });

      var _url = 'rest/authen/purchaseReturnOrder/splitOrderMedicalNos';
      requestData(_url, _data, 'POST', 'parameter-body')
      .then(function (results) {

        var _resultData = results[1].data;

        angular.forEach(_resultData, function (data, index) {
          data.quantity=data.returnQuantity;
          $scope.formData.orderMedicalNos.push(data);
        });

        modal.closeAll();

      })
      .catch(function (error) {
        if (error) {
          alertError(error || '出错');
        }
      });
    };

    // 销售退货单模块点击添加要退货的药品列表功能
    $scope.handleAddDataArray = function (addDataObj_id, choisedMedicalList,addDataObj) {

      // 发货单id不能为空,至少选择1条数据
      if (!addDataObj_id || !choisedMedicalList || choisedMedicalList.length === 0) {
        return ;
      }

      if (choisedMedicalList.length) {
        for (var i = 0; i < choisedMedicalList.length; i++) {
          choisedMedicalList[i].quantity=choisedMedicalList[i].returnQuantity;
        }
      }
      // 首次添加数据
      if (!$scope.formData.orderMedicalNos.length) {
        $scope.formData.relId = addDataObj_id;
        $scope.formData.orderMedicalNos = choisedMedicalList;
      } else {    // 修改数据

        $scope.formData.orderMedicalNos = [];     // 清空原有数据
        $scope.formData.orderMedicalNos = choisedMedicalList;
        // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);   // 重新添加数据
      }

      //销退单、采退单：销售部门、业务人员、业务类型、 销售类型 应该选择发货单和来货通知单后就带出来
      $scope.formData.salesDepartmentId=addDataObj.salesDepartmentId;
      $scope.formData.salesDepartmentName=addDataObj.salesDepartmentName;
      $scope.formData.salesType=addDataObj.salesType;
      $scope.formData.orderBusinessType=addDataObj.orderBusinessType;
      $scope.formData.saleUser=addDataObj.saleUser;
      $scope.formData.customerName=addDataObj.customerName;


      //切换发货单时，清空原有数据
      if($scope.formData.relId!=addDataObj_id){
        $scope.formData.orderMedicalNos=[];
      }else{
        //否则删除没选中,再添加选中的
        for(var i=$scope.formData.orderMedicalNos.length-1;i>=0;i--){
          var data=$scope.formData.orderMedicalNos[i];
          if(utils.getObjectIndexByKeyOfArr(choisedMedicalList,"relId",data.relId)==-1){
              $scope.formData.orderMedicalNos.splice(i,1);
          }
        }
      }

      //重新绑定数据
      // $scope.formData.relId = addDataObj_id;
      // //已经添加过的不在添加。（保留已经修改的数据）
      //   angular.forEach(choisedMedicalList, function (data, index) {
      //     if(utils.getObjectIndexByKeyOfArr($scope.formData.orderMedicalNos,"relId",data.relId)==-1){
      //         $scope.formData.orderMedicalNos.push(data);
      //     }
      //
      //   });
      // $scope.formData.orderMedicalNos = angular.copy(choisedMedicalList);

      modal.closeAll();
    };
  }

  angular.module('manageApp.project')
  .controller('returnOrderAddController', ['$scope',"$rootScope",'modal',"utils", "requestData", "alertError", returnOrderAddController]);
});
