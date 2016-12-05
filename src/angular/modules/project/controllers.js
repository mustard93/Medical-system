/**
 * Created by hao on 15/11/5.
 */
define('project/controllers', ['project/init'], function() {
    /**
     *编辑、新建订单
     */
    function salesOrderEditCtrl($scope, modal,alertWarn,watchFormChange) {


                    $scope.watchFormChange=function(watchName){
                      watchFormChange(watchName,$scope);
                    };

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

          if(!customerAddress||!customerAddress.contacts||customerAddress.contacts.length===0){

            formData.contactsId=null;
            return;
          }
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
        $scope.caifenQuantity = function(tr, num) {
          tr.quantity_noInvoice_show = true;
          if (!num || tr.quantity < num) return;
          //点击拆分逻辑,不能发货数量为0,并且库存不足时,根据库存自动拆分数量.
          if (!tr.quantity_noInvoice || tr.quantity_noInvoice === 0) {
            tr.quantity_noInvoice = tr.quantity - num;
            tr.quantity = num;
          }
          //加入订单按钮状态变化
          if (tr.quantity <= num) {
            tr.handleFlag = true;
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
          // $scope.addDataItem.isSameBatch = "否";
          $scope.addDataItem.strike_price = data.price;
          $scope.addDataItem.headUrl = data.headUrl;
          $scope.addDataItem.specification = data.specification;
          $scope.addDataItem.manufacturer = data.manufacturer;
          $scope.addDataItem.handleFlag =true;//默认添加到订单
          $scope.addDataItem.productionBatch = "无";
          $scope.addDataItem.dosageForms = data.dosageForms;
          $scope.addDataItem.code = data.code;
          $scope.addDataItem.productionBatch = data.productionBatch;
          $scope.addDataItem.productionDate = data.productionDate;
          $scope.addDataItem.guaranteePeriod = data.guaranteePeriod;
          $scope.addDataItem.licenseNumber = data.licenseNumber;
          $scope.addDataItem.deliveryPlus = data.deliveryPlus;
          $scope.addDataItem.storageLocation = data.storageLocation;
          $scope.addDataItem.productionDate = data.productionDate;
          $scope.addDataItem.guaranteePeriod = data.guaranteePeriod;
          $scope.addDataItem.licenseNumber = data.licenseNumber;
            $scope.addDataItem.deliveryPlus = data.deliveryPlus;

          // alert($('#addDataItem_quantity').length);
          // $('#addDataItem_quantity').trigger("focus");
          $('#addDataItem_quantity').trigger("focus");
        };
        /**
        * 添加一条。并缓存数据。
        */
        $scope.addDataItemClick = function(addDataItem,medical) {
            if (!(addDataItem.relId && addDataItem.name)) {
                alertWarn("请选择药品。");
                return;
            }
            if (!addDataItem.quantity||addDataItem.quantity<1) {
                alertWarn("请输入大于0的数量。");
                return;
            }
            if (!addDataItem.strike_price) {
                alertWarn("请输入成交价格。");
                return;
            }
            if(addDataItem.quantity>medical.quantity){//库存不足情况
                addDataItem.handleFlag =false;//默认添加到订单
            }
            if (!$scope.formData.orderMedicalNos) {
              $scope.formData.orderMedicalNos = [];
            }
            // 如果已添加
            if ($scope.formData.orderMedicalNos.length !== 0) {
              var _len = $scope.formData.orderMedicalNos.length;
              console.log(_len);
              // 未使用forEach方法，因为IE不兼容
              for (var i=0; i<_len; i++) {
                if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                  alertWarn('此药械已添加到列表');
                  return;
                }
              }
            }
            //添加到列表
            $scope.formData.orderMedicalNos.push(addDataItem);

            //计算价格
            $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

            $scope.addDataItem = {};

            $("input", "#addDataItem_relId_chosen").trigger("focus");
            // $("#addDataItem_relId_chosen").trigger("click");
        };

        /**
        *保存
        type:save-草稿,submit-提交订单。
        */
        $scope.submitFormAfter = function() {
          $scope.formData.validFlag = false;
          if ($scope.submitForm_type == "exit") {
            $scope.goTo('#/salesOrder/query.html');
            return;
          }
          if ($scope.submitForm_type == "submit") {
            $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);
          }
          if ($scope.submitForm_type == "save") {
            console.log(this);
          }
        };
        /**
        *能否提交验证
        type:save-草稿,submit-提交订单。
        */
        $scope.canSubmitForm = function() {

          //必须有1条是勾选加入订单的。
          var arr=$scope.formData.orderMedicalNos;
          for(var i=0;i<arr.length;i++){
             if(arr[i].handleFlag){
               return true;
             }
          }

          return false;

        };
        /**
        *保存
        type:save-草稿,submit-提交订单。
        */
        $scope.submitForm = function(fromId, type) {
          $scope.submitForm_type = type;
          if ($scope.submitForm_type == "submit") {
            $scope.formData.validFlag = true;
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

    }//end salesOrderEditCtrl

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
         var url="rest/authen/confirmOrder/updateStatus";
         var data= {id:$scope.formData.id,orderStatus:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
            //  alertOk(_data.message || '操作成功');
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

      //快递保存后
      $scope.kuaidiSaveAfter = function(kuaidi) {
          modal.closeAll();
        if(!kuaidi)return;
        if(!$scope.showData.kuaidiSet)$scope.showData.kuaidiSet=[];
        var arr=$scope.showData.kuaidiSet;

        for(var i=0;i<arr.length;i++){//有匹配就更新。
           if(arr[i].id==kuaidi.id){
             arr[i]=kuaidi;
             return;
           }
        }
       arr.push(kuaidi);//新建
     };//kuaidiSaveAfter


       /**
       *保存
       type:save-草稿,submit-提交订单。
       */
       $scope.deleteKuaidi = function(kuaidi,invoicesOrderId) {
         var url="rest/authen/invoicesOrder/kuaidi/delete";
         var data= {kuaidiId:kuaidi.id,invoicesOrderId:invoicesOrderId};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];
             alertOk(_data.message || '操作成功');
             var arr=$scope.showData.kuaidiSet;
             for(var i=0;i<arr.length;i++){//有匹配就更新。
                if(arr[i].id==kuaidi.id){
                  arr.splice(i,1);
                  return;
                }
             }

           })
           .catch(function (error) {
             alertError(error || '出错');
           });
         };//deleteKuaidi
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
         var url="rest/authen/invoicesOrder/updateStatus";
         var data= {id:$scope.formData.id,status:'待发货'};
         requestData(url,data, 'POST')
           .then(function (results) {
             var _data = results[1];

             $scope.goTo('#/invoicesOrder/order-done.html?id='+$scope.formData.id);

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
     *站内消息
     */
    function noticeCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {
      /**
      *保存
      type:save-草稿,submit-提交订单。
      */
      $scope.noticeClick = function(notice) {

          requestRead(notice.id,notice);

          notice.readFlag=true;
        if($scope.scopeResponse&&$scope.scopeResponse.totalCount)$scope.scopeResponse.totalCount--;
          if (!(notice.moduleType&&notice.relId)){
              alertOk(notice.subject);
              return;
          }
              //相应跳转
            window.location.assign('#/'+notice.moduleType+'/get.html?id='+notice.relId);


       };//noticeClick

       //启动消息定时获取
       $rootScope.startGetMsg = function(){
           if(Config.stopIntervalNotice===true){
              return;
           }
           if($rootScope.startGetMsgObj)return;
             $rootScope.startGetMsgObj=$interval(function(){
                $rootScope.noticeRefreshTime=new Date().getTime();
             }, 10000);
         };
          $rootScope.startGetMsg();

       //标记已经阅读。
       requestRead = function(id,notice) {
         var url="rest/authen/notice/read";
         var data= {id:id};
         requestData(url,data, 'POST')
           .then(function (results) {

           })
           .catch(function (error) {

           });
       };//end $scope.requestRead

     }//noticeCtrl

     /**
      *编辑、新建采购单
      */
     function purchaseOrderEditCtrl($scope, modal,alertWarn,alertError,requestData,watchFormChange) {
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
         * 添加一条。并缓存数据。
         */
         $scope.selectRelIdCallBack = function(data) {
           $scope.addDataItem.relId = data.id;
           $scope.addDataItem.name = data.name;
           $scope.addDataItem.brand = data.brand;
           $scope.addDataItem.unit = data.unit;
           $scope.addDataItem.price = data.price;
           // $scope.addDataItem.isSameBatch = "否";
           $scope.addDataItem.strike_price = data.price;
           $scope.addDataItem.headUrl = data.headUrl;
           $scope.addDataItem.specification = data.specification;
           $scope.addDataItem.manufacturer = data.manufacturer;
           $scope.addDataItem.handleFlag =true;//默认添加到订单
           $scope.addDataItem.productionBatch = "无";
           $scope.addDataItem.dosageForms = data.dosageForms;
           $scope.addDataItem.code = data.code;
           $scope.addDataItem.productionBatch = data.productionBatch;
           $scope.addDataItem.productionDate = data.productionDate;
           $scope.addDataItem.guaranteePeriod = data.guaranteePeriod;
           $scope.addDataItem.licenseNumber = data.licenseNumber;
           $scope.addDataItem.deliveryPlus = data.deliveryPlus;
           $scope.addDataItem.drugAdministrationCode = data.drugAdministrationCode;

           // alert($('#addDataItem_quantity').length);
           // $('#addDataItem_quantity').trigger("focus");
           $('#addDataItem_quantity').trigger("focus");
         };
         /**
         * 添加一条。并缓存数据。
         */
         $scope.addDataItemClick = function(addDataItem,medical) {
             if (!(addDataItem.relId && addDataItem.name)) {
                 alertWarn("请选择药品。");
                 return;
             }
             if (!addDataItem.quantity||addDataItem.quantity<1) {
                 alertWarn("请输入大于0的数量。");
                 return;
             }

             if(addDataItem.quantity>medical.quantity){//库存不足情况
                 addDataItem.handleFlag =false;//默认添加到订单
             }

             // 如果已添加
              if ($scope.formData.orderMedicalNos.length > 0) {
                var _len = $scope.formData.orderMedicalNos.length;
                // 未使用forEach方法，因为IE不兼容
                for (var i=0; i<_len; i++) {
                  if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
                    alertWarn('此药械已添加到列表');
                    return;
                  }
                }
              }

             if (!$scope.formData.orderMedicalNos) $scope.formData.orderMedicalNos = [];
             $scope.formData.orderMedicalNos.push(addDataItem);

             //计算价格
             $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

             $scope.addDataItem = {};

             $("input", "#addDataItem_relId_chosen").trigger("focus");
             // $("#addDataItem_relId_chosen").trigger("click");
         };

         /**
         *保存
         type:save-草稿,submit-提交订单。
         */
         $scope.submitFormAfter = function() {

             $scope.formData.validFlag = false;

           if ($scope.submitForm_type == "exit") {
             $scope.goTo('#/purchaseOrder/query.html');
            return;
          }
           if ($scope.submitForm_type == "submit") {
             var url="rest/authen/purchaseOrder/updateStatus";
             var data= {id:$scope.formData.id,status:'待审批'};
             requestData(url,data, 'POST')
               .then(function (results) {
                 var _data = results[1];
                //  alertOk(_data.message || '操作成功');
                 $scope.goTo('#/purchaseOrder/confirm-order-done.html?id='+$scope.formData.id);

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
            if ($scope.submitForm_type == "submit") {
              $scope.formData.validFlag = true;
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


          $scope.watchFormChange=function(watchName){
            watchFormChange(watchName,$scope);
          };

     }//end salesOrderEditCtrl

     /**
      *用户审核
      */
     function auditUserApplyOrganizationCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,proLoading) {

       /**
       获取选择的用户对象，用于显示人名
       */
       $scope.getCheckUserApplyArr = function(arr,ids) {

         //
         var data=[];
          if(!ids||ids.length===0){
            return data;
          }
          for(var i=0;i<arr.length;i++){
            if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                      data.push(arr[i]);
            }
          }
            return data;
        };
       /**
       *保存
       type:save-草稿,submit-提交订单。
       */
       $scope.batchAuditUserApplyOrganization = function(arr,ids,status,key,message) {
          if(!ids||ids.length===0){
            alertWarn("请先勾选");
            return;
          }
          //
          var data=[];
          for(var i=0;i<arr.length;i++){

            if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                      arr[i].formData.status=status;
                      arr[i].formData.key=key;
                      arr[i].formData.message=message;
                      data.push(arr[i].formData);
            }
          }


          var url="rest/authen/distributor/batchAuditUserApplyOrganization";


          var  maskObj=proLoading();

          requestData(url,data, 'POST',true)
            .then(function (results) {
                     if(maskObj)maskObj.hide();
                      alertOk(results[1].msg);
                    $scope.$broadcast("reloadList");
                      $scope.$emit("reloadList");
                      modal.close();

            })
            .catch(function (error) {
              if(maskObj)maskObj.hide();
                modal.close();
               alertWarn(error);


            });

        };//batchAuditUserApplyOrganization

        //启动消息定时获取
        $rootScope.startGetMsg = function(){
            if($rootScope.startGetMsgObj)return;
              $rootScope.startGetMsgObj=$interval(function(){
                 $rootScope.noticeRefreshTime=new Date().getTime();
              }, 10000);
          };
           $rootScope.startGetMsg();

        //标记已经阅读。
        requestRead = function(id,notice) {
          var url="rest/authen/notice/read";
          var data= {id:id};
          requestData(url,data, 'POST')
            .then(function (results) {

            })
            .catch(function (error) {

            });
        };//end $scope.requestRead

      }//auditUserApplyOrganizationCtrl


      /**
       *站内消息
       */
      function watchFormCtrl($scope, watchFormChange) {
        $scope.watchFormChange=function(watchName){
          watchFormChange(watchName,$scope);
        };


       }//watchFormCtrl


       /**
        * 定时任务ctrl
        */
       function intervalCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {

      }//intervalCtrl

    /**
     * 首营品种、首营企业、医院资格申请通用控制器
     */
    function QualificationApplyCtrl ($scope) {
      $scope.submitForm = function(fromId, type) {
         $scope.submitForm_type = type;

         if ($scope.submitForm_type == "submit") {
           $scope.formData.validFlag = true;
         }
        $("#" + fromId).trigger("submit");
      };

      $scope.submitFormAfter = function (_url) {
        if ($scope.submitForm_type === 'submit') {
          $scope.goTo(_url + '?id=' + $scope.formData.id);
        }
      };

      //清空当前列的审核资料
      $scope.resetThisItem = function (item) {
        if (angular.isObject(item)) {
          item.uploadUserName = null;
          item.uploadTime = null;
          item.guaranteePeriod = null;
          item.attachmentUrl = null;
          item.note = null;
        }
      };

      //添加自定义审核资料
      $scope.addCustomExamineItem = function () {
        if ($scope.formData.addCustomExamineItem.name) {
          $scope.formData.attachments.push($scope.formData.addCustomExamineItem);
        }
      };
    }

    /**
     * 编辑工作流
     */
    function editWorkFlowProcessCtrl ($scope, modal, alertWarn, requestData, alertOk, alertError, $rootScope) {


      /**
       切换button顺序
      */
      $scope.switchButtons = function(buttons,ind,ind2) {
        var tmp=buttons[ind];
        buttons[ind]=buttons[ind2];
        buttons[ind2]=tmp;

    };
      /**
      保存节点信息（新建or创建）
      */
      $scope.addEventButtons = function(formData1) {
        if(!formData1)formData1={};
        if(!formData1.didateFilter)formData1.didateFilter={};
        if(!formData1.didateFilter.buttons)formData1.didateFilter.buttons=[];
        var btnForm = {
          type: "通过",
          buttonName: "审核通过",
          requestMethod: "POST",
          requestMethod: "KeyValue",
          requestUrl : "rest/authen/workflowTask/run.json"
        };
        formData1.didateFilter.buttons.push(btnForm);

    };
      /**
      保存节点信息（新建or创建）
      */
      $scope.saveEvent = function(event1) {
        if(!$scope.formData.events)$scope.formData.events=[];
        var events=$scope.formData.events;
        var isInsert=true;
        //防止"" 保存到后台,枚举报错bug.
        if(!event1.conditionType)event1.conditionType=null;
        if(event1.id){
            var ind=$rootScope.utils.getObjectIndexByKeyOfArr(events,'id',event1.id);
              var eventTmp=$rootScope.utils.getObjectByKeyOfArr(events,'id',event1.id);

            if(ind>-1){
                events[ind]=event1;

                isInsert=false;
            }
        }

        if(isInsert){

              event1.id=event1.name;
             events.push(event1);
        }

        if($scope.scopeExtend&&$scope.scopeExtend.workflow){
          $scope.scopeExtend.workflow.reload();
        }
        modal.closeAll();
      };

      /**
      删除节点信息（新建or创建）
      */
      $scope.deleteEvent = function(id) {
        if(!$scope.formData.events)$scope.formData.events=[];
          var events=$scope.formData.events;
        var index=$rootScope.utils.removeObjectByKeyOfArr(events,'id',id);
        if(index<0){
            alertError("没有该节点，id="+event1.id);
            return;
        }
        if($scope.scopeExtend&&$scope.scopeExtend.workflow){
          $scope.scopeExtend.workflow.reload();
        }

          modal.closeAll();
      };//deleteEvent

    }//editWorkFlowProcessCtrl


    angular.module('manageApp.project')
    .controller('editWorkFlowProcessCtrl', ["$scope", "modal", "alertWarn", "requestData", "alertOk", "alertError", "$rootScope", editWorkFlowProcessCtrl])
    .controller('QualificationApplyCtrl', ["$scope", QualificationApplyCtrl])
    .controller('watchFormCtrl', ["$scope","watchFormChange", watchFormCtrl])
    .controller('intervalCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError","$rootScope","$interval", intervalCtrl])
    .controller('auditUserApplyOrganizationCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError","$rootScope","proLoading", auditUserApplyOrganizationCtrl])
    .controller('purchaseOrderEditCtrl', ["$scope", "modal","alertWarn","alertError","requestData","watchFormChange", purchaseOrderEditCtrl])
    .controller('noticeCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError","$rootScope","$interval", noticeCtrl])
    .controller('invoicesOrderCtrl', ["$scope", "modal","alertWarn","requestData","alertOk","alertError", invoicesOrderCtrl])
    .controller('salesOrderEditCtrl', ["$scope", "modal","alertWarn","watchFormChange", salesOrderEditCtrl]);


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
