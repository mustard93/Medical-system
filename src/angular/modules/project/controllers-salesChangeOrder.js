define('project/controllers-salesChangeOrder', ['project/init'], function() {
  /**
   * [salesChangeOrderCtrl 销售换货单 Ctrl]
   * @method salesChangeOrderCtrl
   * @param  {[type]}        $scope          [description]
   * @param  {[type]}        modal           [description]
   * @param  {[type]}        watchFormChange [description]
   * @param  {[type]}        requestData     [description]
   * @param  {[type]}        utils           [description]
   * @param  {[type]}        alertError      [description]
   * @param  {[type]}        alertWarn       [description]
   * @return {[type]}                        [description]
   */


  function  salesChangeOrderEditCtrl($scope, modal, watchFormChange, requestData, utils, alertError, alertWarn) {

    //表单数据监控
    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };

    //校验计划归还输入数量   待还数量= 借出数量 - 已还数量
    $scope.checkQuantity=function(tr){
        var flag=false;
        if(tr.planReturnCount < tr.quantity  || tr.quantity <1){
            flag=true;
        }
        return flag;
    };
      $scope.confirmOrderCalculaTotal = function (orderMedicalNos) {
          if (orderMedicalNos) {
              var _total = 0;
              angular.forEach(orderMedicalNos, function (item, index) {
                  var _tmp = 0;
                  _tmp += item.quantity * item.duty_price;
                  _total += _tmp;
              });
              $scope.formData.totalPrice = _total;
          }
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

    // 检查批号与数量是否合法
    $scope.checkCanSubmit=function () {
        var flag=true;

        if(!$scope.formData.orderMedicalNos){
            return false;
        }

        angular.forEach($scope.formData.orderMedicalNos,function (tr,index) {

            //换货数量 大于 已选择的批次总和  认为数量不合法
            if((tr.stayCount > $scope.getAllBatchTotal(tr.stockBatchs,'quantity'))){
                flag=false;
            }
        });
        return flag;
    };


    // 回调  保存type:save-草稿,submit-提交订单。
    $scope.submitFormAfter = function() {

        if($scope.submitForm_type == 'save'){
            $scope.goTo({tabName:'销售换货单',tabHref:'#/salesChangeOrder/edit.html?id='+$scope.formData.id});
            return;
        }

        if ($scope.submitForm_type == 'submit') {
            var _url='rest/authen/salesChangeOrder/startProcessInstance';
            var data= {businessKey:$scope.formData.id};
            requestData(_url,data, 'POST')
                .then(function (results) {
                    var _data = results[1];

                    $scope.goTo({tabName:'销售换货单',tabHref:'#/salesChangeOrder/get.html?id='+$scope.formData.id});
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


    //获取所有批次的和
    $scope.getAllBatchTotal=function (list,attr) {
        return utils.countAttrVal(list,attr);
    };


    //更新药械的换货数量
    $scope.updateMedcalInfo=function (index,item) {

     $scope.formData.orderMedicalNos[index].stayCount= item.quantity;

     //   判断当前药械的 “换货数量” 是否 小于 已选择批次总数； 小于: 清空批次信息
     if($scope.formData.orderMedicalNos[index].stayCount < $scope.getAllBatchTotal($scope.formData.orderMedicalNos[index].stockBatchs,'quantity')){
         $scope.formData.orderMedicalNos[index].stockBatchs=[];
     }
    };

    //删除列表中的药械
    $scope.deleteMedcal=function (index) {
     $scope.formData.receiveOrderMedicalNos.splice(index,1);
     $scope.formData.orderMedicalNos.splice(index,1);

        if($scope.formData.receiveOrderMedicalNos.length<1){
            $scope.formData.relId='';
            $scope.formData.relOrderNo='';
            $scope.formData.relOrderCode='';
        }
    };

  }

  //销售换货单弹窗 Ctrl
  function  salesChangeOrderDialogCtrl($scope,modal, watchFormChange, requestData, utils, alertError, alertWarn) {

        //监控选择的发货单变化
        $scope.$watch('scopeData',function (newVal,oldVal){
            if(newVal){
                $scope.checkRelId($scope.dialogData.relId,newVal.id);
            }
        });

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
        $scope.addOrderDataToList=function (invoicesOrderId,orderInfo) {

            console.log("orderInfo>>>>>>>>>>>>>>>",orderInfo);

            //如果存在就判断是否相等  不相等就返回
            if(invoicesOrderId && invoicesOrderId != orderInfo.id){

               // if(invoicesOrderId != orderInfo.id){
                    alertWarn("只能选择同一换货单药械");
                    return;
               // }

            }else{
                //如果不存在就设置
                $scope.formData.relId=orderInfo.id;
                $scope.formData.relOrderNo= orderInfo.orderNo;

                $scope.formData.relOrderCode=orderInfo.orderCode; //发货单编号
                $scope.formData.customerName=  orderInfo.customerName; //设置客户名
                $scope.formData.customerId=orderInfo.customerId;//设置客户ID

            }

            //添加商品
            var hasOrderMedicalNos = $scope.formData.receiveOrderMedicalNos;


            var resultArr = $scope._compareArray(hasOrderMedicalNos,$scope.selectedBatchs2,'id','id');
            $scope.formData.receiveOrderMedicalNos = hasOrderMedicalNos.concat(resultArr);

            //添加到重新发货列表
            angular.forEach(resultArr,function (item,index) {
                item.stayCount= utils.countAttrVal(item.stockBatchs,'quantity') || 0;
                item.stockBatchs=[];
                $scope.formData.orderMedicalNos.push(item);
            });

        };

        /**
         * 判断item 是否存在
         * @param id item 唯一标识
         * @param batchlist 比较列表
         * @param attr 列表单个元素比对属性
         * @returns {boolean}
         */
        $scope.itemInArray=function (id,batchlist,attr) {

            if(!batchlist){
                var  batchlist= [];
            }

            var flag=false;
            for(var i=0; i<batchlist.length; i++){
                if(batchlist[i][attr] == id){
                    flag=true;
                }
            }
            return flag;
        };


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
            console.log("returnOderRelId,choiceReturnOderRelId",returnOderRelId,choiceReturnOderRelId);

            if(!$scope.compareOrderId(returnOderRelId,choiceReturnOderRelId)) {
                alertWarn("只能选择同一发货单药械");
            }
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

    angular.module('manageApp.project')
    .controller('salesChangeOrderEditCtrl', ['$scope',"modal",'watchFormChange',"requestData", "utils", "alertError", "alertWarn", salesChangeOrderEditCtrl])
    .controller('salesChangeOrderDialogCtrl', ['$scope','modal', 'watchFormChange', 'requestData', 'utils','alertError','alertWarn', salesChangeOrderDialogCtrl])
    ;
});
