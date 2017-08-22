define('project/controllers-returnOrder2', ['project/init'], function() {
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
  function  returnOrderCtrl($scope, modal, watchFormChange, requestData, utils, alertError, alertWarn) {

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

  angular.module('manageApp.project')
  .controller('returnOrderCtrl', ['$scope',"modal",'watchFormChange',"requestData", "utils", "alertError", "alertWarn", returnOrderCtrl]);
});
