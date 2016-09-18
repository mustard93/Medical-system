/**
 * Created by hao on 15/11/5.
 */

define('project/controllers', ['project/init'], function () {





      /**
       *编辑、新建订单
       */
      function salesOrderEditCtrl($scope, modal) {
          modal.closeAll();
            // $scope.formData={};
          $scope.addDataItem={};


                    /**
                    添加一条。并缓存数据。
                    */
                    $scope.selectRelIdCallBack=function(data){
                        
                        requestData("rest/authen/medical/get.json?id="+data.value)
                            .then(function (results) {
                                var data = results[0];
                                if(data){
                                  $scope.addDataItem.brand=data.brand;
                                    $scope.addDataItem.unit=data.unit;
                                      $scope.addDataItem.price=data.price;
                                }

                            });
                    }
          /**
          添加一条。并缓存数据。
          */
          $scope.addDataItemClick=function(){

            if(!$scope.formData.orderMedicalNos)  $scope.formData.orderMedicalNos=[];
              $scope.formData.orderMedicalNos.push($scope.addDataItem);
              $scope.addDataItem={};

          }
          /**
          *保存
          type:save-草稿,submit-提交订单。
          */
          $scope.submitForm=function(fromId,type){



              if(type=="save"){
                  $scope.formData.orderStatus="1";
              }else if(type=="submit"){
                 $scope.formData.orderStatus="2";
              }


              $("#"+fromId).trigger("submit");

              // addDataItem_opt.submitUrl="";
              // $scope.formData.orderMedicalNos.push($scope.addDataItem);
              // $scope.addDataItem={};

          }
          /**
          *取消订单
          */
          $scope.cancelForm=function(fromId,url){

              alert("cancelForm");



          }

      }

      angular.module('manageApp.project')
          .controller('salesOrderEditCtrl',  ["$scope","modal",salesOrderEditCtrl]);

});
