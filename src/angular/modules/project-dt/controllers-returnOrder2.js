define('project-dt/controllers-returnOrder2', ['project-dt/init'], function() {
  /**
   * [returnOrderCtrl 归还单 Ctrl]
   * @method returnOrderCtrl
   * @param  {[type]}        $scope          [description]
   * @param  {[type]}        modal           [description]
   * @param  {[type]}        watchFormChange [description]
   * @param  {[type]}        requestData     [description]
   * @param  {[type]}        utils           [description]
   * @param  {[type]}        alertError      [description]
   * @param  {[type]}        alertWarn       [description]
   * @return {[type]}                        [description]
   */
  function returnOrderCtrl($scope, modal, watchFormChange, requestData, utils, alertError, alertWarn) {

      //表单数据监控
      $scope.watchFormChange = function(watchName){
          watchFormChange(watchName,$scope);
      };

    //校验计划归还输入数量   待还数量= 借出数量 - 已还数量
    $scope.checkQuantity=function(tr){
        var flag=false;
        if((tr.actualCount - tr.cumulativeReturnCount) < tr.quantity  || tr.quantity <1){
            flag=true;
        }
        return flag;
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

    // 检查归还数量是否合法
    $scope.checkCanSubmit=function () {
        var flag=true;

        angular.forEach($scope.formData.orderMedicalNos,function (tr,index) {
            //实际归还数量大于待还数量 或 实际待还数量小于1 ，认为数量不合法
            if((tr.actualCount - tr.cumulativeReturnCount) < tr.quantity  || tr.quantity <1){
                flag=false;
            }
        });
        return flag;
    };


      $scope.$watch("submitForm_type",function(newValue,oldValue, scope){
          console.log("submitForm_type",newValue);
      },true);


    // 回调  保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {

        if($scope.submitForm_type == 'save'){

            $scope.goTo('#/returnOrder/edit.html?id='+$scope.formData.id);
            return;
        }

        if ($scope.submitForm_type == 'submit') {
            var _url='rest/authen/returnOrder/startProcessInstance';
            var data= {businessKey:$scope.formData.id};
            requestData(_url,data, 'POST')
                .then(function (results) {
                    var _data = results[1];
                    // $scope.goTo({
                    //     tabName:'归还单',
                    //     tabHref: '#/returnOrder/get.html?id='+$scope.formData.id
                    // });

                    $scope.goTo('#/returnOrder/get.html?id='+$scope.formData.id);
                })
                .catch(function (error) {
                    alertError(error || '出错');
                });
        }


        if($scope.submitForm_type == 'exit'){
            $scope.goTo('#/returnOrder/query.html');
            return;
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

        $scope.submitFormValidator(fromId);
    };

   // 重置 借出单 信息
   $scope.resetLendOrderInfo=function () {

       if($scope.formData.orderMedicalNos.length<1){
           $scope.formData.relId="";//关联原订单ID
           $scope.formData.relOrderNo="";//关联原订单号
           $scope.formData.relOrderCode="";//关联原订编号


           //发货方信息   收货方信息
           $scope.formData.customerContacts=null;
           $scope.formData.invoicesContacts=null;


       }
   }
  }

  /**
   * [returnOrderChoiceDialogCtrl 归还单择归还商品弹窗 Ctrl]
   * @method returnOrderChoiceDialogCtrl
   * @param  {[type]}                    $scope          [description]
   * @param  {[type]}                    modal           [description]
   * @param  {[type]}                    watchFormChange [description]
   * @param  {[type]}                    requestData     [description]
   * @param  {[type]}                    utils           [description]
   * @param  {[type]}                    alertError      [description]
   * @param  {[type]}                    alertWarn       [description]
   * @return {[type]}                                    [description]
   */
  function returnOrderChoiceDialogCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

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

  /**
   * [returnOrderChoiceDialogSubCtrl 还单择归还商品弹窗 Sub Ctrl]
   * @method returnOrderChoiceDialogSubCtrl
   * @param  {[type]}                       $scope          [description]
   * @param  {[type]}                       modal           [description]
   * @param  {[type]}                       watchFormChange [description]
   * @param  {[type]}                       requestData     [description]
   * @param  {[type]}                       utils           [description]
   * @param  {[type]}                       alertError      [description]
   * @param  {[type]}                       alertWarn       [description]
   * @return {[type]}                                       [description]
   */
  function returnOrderChoiceDialogSubCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {
      //选择当前订单-商品
      $scope.choiceThis=function (item,index,flag){
          if(!flag){
              $scope.$emit('selected',item);
          }
      };
  }

  angular.module('manageApp.project-dt')
  .controller('returnOrderCtrl', ['$scope',"modal",'watchFormChange',"requestData", "utils", "alertError", "alertWarn", returnOrderCtrl])
  .controller('returnOrderChoiceDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', returnOrderChoiceDialogCtrl])
  .controller('returnOrderChoiceDialogSubCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', returnOrderChoiceDialogSubCtrl]);
});
