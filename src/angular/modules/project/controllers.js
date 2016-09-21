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


                    // /**
                    // 添加一条。并缓存数据。
                    // */
                    $scope.selectRelIdCallBack=function(data){


                      $scope.addDataItem.relId=data.id;                      
                      $scope.addDataItem.medical={};
                      $scope.addDataItem.medical.name=data.name;
                    $scope.addDataItem.medical.brand=data.brand;
                      $scope.addDataItem.medical.unit=data.unit;
                        $scope.addDataItem.medical.price=data.price;



                        // alert($('#addDataItem_quantity').length);
                            // $('#addDataItem_quantity').trigger("focus");
                        $('#addDataItem_quantity').trigger("focus");

                    }
          /**
          添加一条。并缓存数据。
          */
          $scope.addDataItemClick=function(){

            if(!$scope.addDataItem.relId){

              alert("请选择药品。");
              return ;
            }
            if(!$scope.formData.orderMedicalNos)  $scope.formData.orderMedicalNos=[];

              $scope.formData.orderMedicalNos.push($scope.addDataItem);
              $scope.addDataItem={};

               $("input","#addDataItem_relId_chosen").trigger("focus");
// $("#addDataItem_relId_chosen").trigger("click");


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
