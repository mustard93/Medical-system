/**
 * Created by hao on 15/11/5.
 */

define('project/controllers', ['project/init'], function() {
    /**
     *编辑、新建订单
     */
    function salesOrderEditCtrl($scope, modal,alertWarn) {
        modal.closeAll();
        // $scope.formData={};
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
        };

        /**
         * 拆分药品数量
         */
        $scope.caifenQuantity = function(tr,num) {
             tr.quantity_noInvoice_show=true;
             if(!num)return;
             //点击拆分逻辑,不能发货数量为0,并且库存不足时,根据库存自动拆分数量.
             if(tr.quantity_noInvoice===0&&tr.quantity_Invoice>num){
               tr.quantity_noInvoice=tr.quantity_Invoice-num;
               tr.quantity_Invoice=num;
             }

        };
        /**
        * 添加一条。并缓存数据。
        */
        $scope.selectRelIdCallBack = function(data) {
          $scope.addDataItem.relId = data.id;
          $scope.addDataItem.name = data.name;
          $scope.addDataItem.brand = data.brand;
          $scope.addDataItem.unit = data.unit;
          $scope.addDataItem.price = data.price;
          $scope.addDataItem.isSameBatch = "否";
          $scope.addDataItem.strike_price = data.price;
          $scope.addDataItem.headUrl = data.headUrl;
          $scope.addDataItem.specification = data.specification;
          $scope.addDataItem.manufacturer = data.manufacturer;


          // alert($('#addDataItem_quantity').length);
          // $('#addDataItem_quantity').trigger("focus");
          $('#addDataItem_quantity').trigger("focus");
        };
        /**
        * 添加一条。并缓存数据。
        */
        $scope.addDataItemClick = function() {
            if (!($scope.addDataItem.relId && $scope.addDataItem.name)) {
                alertWarn("请选择药品。");
                return;
            }
            if (!$scope.formData.orderMedicalNos) $scope.formData.orderMedicalNos = [];
                  console.log($scope.addDataItem);
            $scope.formData.orderMedicalNos.push($scope.addDataItem);

            $scope.addDataItem = {};

            $("input", "#addDataItem_relId_chosen").trigger("focus");
            // $("#addDataItem_relId_chosen").trigger("click");
            console.log($scope.formData.orderMedicalNos);
        };
        /**
        *保存
        type:save-草稿,submit-提交订单。
        */
        $scope.submitForm = function(fromId, type) {
          if (type == "save") {
              $scope.formData.orderStatus = "1";
          } else if (type == "submit") {
              $scope.formData.orderStatus = "2";
          }


          $("#" + fromId).trigger("submit");

          // addDataItem_opt.submitUrl="";
          // $scope.formData.orderMedicalNos.push($scope.addDataItem);
          // $scope.addDataItem={};
        };
        /**
         *取消订单
         */
        $scope.cancelForm = function(fromId, url) {
            alertWarn("cancelForm");
        };

    }

    angular.module('manageApp.project')
        .controller('salesOrderEditCtrl', ["$scope", "modal","alertWarn", salesOrderEditCtrl]);

        //
        // angular.module('manageApp.project', ['ngTagsInput'])
        //           .controller('MyCtrl', function($scope, $http) {
        //               $scope.tags = [
        //                   { text: 'just' },
        //                   { text: 'some' },
        //                   { text: 'cool' },
        //                   { text: 'tags' }
        //               ];
        //               $scope.loadTags = function(query) {
        //                    return $http.get('data/autocomplete0.json?q=' + query);
        //               };
        //           });
});
