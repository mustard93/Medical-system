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

        /**
         * 拆分药品数量
         */
        $scope.caifenQuantity = function(tr,num) {
             tr.quantity_noInvoice_show=true;
             if(!num)return;
             //点击拆分逻辑,不能发货数量为0,并且库存不足时,根据库存自动拆分数量.
             if(tr.quantity_noInvoice===0&&tr.quantity>num){
               tr.quantity_noInvoice=tr.quantity-num;
               tr.quantity=num;
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
          $scope.addDataItem.handleFlag =true;//默认添加到订单



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
            $scope.formData.orderMedicalNos.push($scope.addDataItem);

            //计算价格
            $scope.formData.totalPrice = $scope.addDataItem.strike_price * $scope.addDataItem.quantity;

            $scope.addDataItem = {};

            $("input", "#addDataItem_relId_chosen").trigger("focus");
            // $("#addDataItem_relId_chosen").trigger("click");
        };

        /**
        *保存
        type:save-草稿,submit-提交订单。
        */
        $scope.submitFormAfter = function() {
          if ($scope.submitForm_type == "exit") {
            $scope.goTo('#/invoicesOrder/query.html');
           return;
         }
          if ($scope.submitForm_type == "submit") {
            $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);
          }

        };

        /**
        *保存
        type:save-草稿,submit-提交订单。
        */
        $scope.submitForm = function(fromId, type) {
           $scope.submitForm_type = type;

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




    /**
     *编辑订单
     */
    function confirmOrderEditCtrl($scope, modal,alertWarn,requestData,alertOk,alertError) {
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitFormAfter = function() {

        if ($scope.submitForm_type == "exit") {
          $scope.goTo('#/invoicesOrder/query.html');
         return;
       }

       if ($scope.submitForm_type == "submit") {
         var url="rest/authen/confirmOrder/updateStatus"
         var data= {id:$scope.formData.id,orderStatus:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
             alertOk(_data.message || '操作成功');
             $scope.goTo('#/confirmOrder/confirm-order.html?id='+$scope.formData.id);

           })
           .catch(function (error) {
             alertError(error || '出错');
           });


        }

      };

      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
        $("#" + fromId).trigger("submit");

      };
    }


    /**
     *出库单
     */
    function invoicesOrderCtrl($scope, modal,alertWarn,requestData,alertOk,alertError) {
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitFormAfter = function() {


          if ($scope.submitForm_type == "exit") {
            $scope.goTo('#/invoicesOrder/query.html');
           return;
         }


       if ($scope.submitForm_type == "submit") {
         var url="rest/authen/invoicesOrder/updateStatus"
         var data= {id:$scope.formData.id,orderStatus:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
             alertOk(_data.message || '操作成功');
             $scope.goTo('#/invoicesOrder/confirm-order.html?id='+$scope.formData.id);

           })
           .catch(function (error) {
             alertError(error || '出错');
           });


        }

      };

      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;
        $("#" + fromId).trigger("submit");

      };
    }
    angular.module('manageApp.project')
    .controller('invoicesOrderCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError", invoicesOrderCtrl])
      .controller('confirmOrderEditCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError", confirmOrderEditCtrl])
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
