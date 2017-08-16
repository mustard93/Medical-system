define('project/controllers-needToPurchase', ['project/init'], function() {
  /**
   * [salesOrderEditCtrl 购需单控制器2]
   * @method salesOrderEditCtrl
   * @param  {[type]}           $scope          [description]
   * @param  {[type]}           modal           [description]
   * @param  {[type]}           alertWarn       [description]
   * @param  {[type]}           watchFormChange [description]
   * @return {[type]}                           [description]
   */
  function needToPurchaseEditCtrl($scope, modal, alertWarn, watchFormChange, requestData, utils,dialogConfirm) {

      modal.closeAll();

      //初始化校验数据
      $scope.checkData=function(){

          //初始化显示数据
          if($scope.formData.id && $scope.formData.orderMedicalNos.length){

              var ids=[];
              angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
                    ids.push(item.relId);
              });

              requestData('rest/authen/qualificationCertificate/identityForMedicalStocks',{'ids':ids},'GET').then(function (result) {

                  if(result[1].code==200){

                      var datas = result[1].data;

                      angular.forEach($scope.formData.orderMedicalNos,function (item,index) {
                          item.info=datas[index];
                      });
                  }

              });
          }
      };






      $scope.addDataItem = {};

      // 是否显示关闭按钮
      $scope.isShowCancelBtn = false;

      $scope.$watch('initFlag', function (newVal) {
         //发送请求判断当前订单状态是否可显示关闭按钮
         if (newVal) {
           var _url = 'rest/authen/salesOrder/isCanClose?id=' + $scope.formData.id;
           requestData(_url, {}, 'get')
           .then(function (results) {
             if (results[1].code === 200) {
               $scope.isShowCancelBtn = true;
             }
           })
           .catch(function (error) {
            //  if (error) {
            //    alertError(error);
            //  }
           });
         }
      });

      $scope.$watch('formData.customerId', function (newVal, oldVal) {
        if (newVal && oldVal && oldVal !== newVal) {
          document.getElementById('angucompleteMedical_searchInputId').focus();
          //清空用户先前的药械选择
          if ($scope.formData.orderMedicalNos.length !== 0) { $scope.formData.orderMedicalNos = []; }
        }

        // 当用户第一次选择客户时，检查该用户是否有证照过期
        if (newVal && oldVal !== newVal) {
           console.log($scope.formData.customerId);
          if ($scope.formData.customerId) {
            var _reqUrl = 'rest/authen/qualificationCertificate/identityForCustomerAddress?id=' +$scope.formData.customerId;
            // var _reqUrl = 'http://localhost:3000/src/dt/data/qualificationCertificate/identityForCustomerAddress.json'
            requestData(_reqUrl)
            .then(function (results) {
                if(results[1].code ==200){
                    console.log(results[1].data);
                    $scope.customerInfo= results[1].data;
                }
            })
            .catch(function (error) {
              throw new Error(error);
            });
          }
        }
      });

      // 监视表单内子项目变化
      $scope.watchFormChange=function(watchName){
        watchFormChange(watchName,$scope);
      };

      //需要重新家长地址方法。编辑新建后
      $scope.customerAddressReload=function (){
        $scope.reloadTime=new Date().getTime();
          modal.closeAll();
      };

      // 医院地址加载后，回调方法
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

      // 发货方信息回调方法
      $scope.invoicesGetCallBack = function (formData,invoicesAddress) {

        // 新版购需单中处理发货方信息
        if (!formData.invoicesId) {
          $scope.formData.invoicesId = invoicesAddress.defaultContactId;
        }

        var _contacts = invoicesAddress.contacts;

        for (var i=0; i<_contacts.length; i++) {
          if (invoicesAddress.defaultContactId === _contacts[i].id) {
            formData.invoicesContacts = _contacts[i];
          }
        }

      };

      // 拆分药品数量
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

      // 添加一条。并缓存数据。返回true表示成功。会处理数据。
      $scope.flashAddDataCallbackFn = function(flashAddData) {
        if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
          alertWarn("请选择药品");
          return ;
        }

        var medical=flashAddData.data.data;
        var addDataItem = $.extend(true,{},medical);
        addDataItem.quantity=flashAddData.quantity;
        addDataItem.discountPrice='0';
        addDataItem.discountRate='100';
        addDataItem.relId=medical.id;
        addDataItem.strike_price=addDataItem.price;
        addDataItem.id=null;

        if (!(addDataItem.relId && addDataItem.name)) {
            alertWarn('请选择药品。');
            return false;
        }
        if (!addDataItem.quantity||addDataItem.quantity<1) {
            alertWarn('请输入大于0的数量。');
            return false;
        }
        // if (!addDataItem.strike_price) {
        //     alertWarn('请输入成交价格。');
        //     return false;
        // }
        if(addDataItem.quantity>medical.quantity){//库存不足情况
            addDataItem.handleFlag =false;//默认添加到订单
        }
        if (!$scope.formData.orderMedicalNos) {
          $scope.formData.orderMedicalNos = [];
        }
        // 如果已添加
        // if ($scope.formData.orderMedicalNos.length !== 0) {
        //   var _len = $scope.formData.orderMedicalNos.length;
        //   for (var i=0; i<_len; i++) {
        //     if (addDataItem.relId === $scope.formData.orderMedicalNos[i].relId) {
        //       alertWarn('此药械已添加到列表');
        //       return false;
        //     }
        //   }
        // }

        // 添加药品后请求当前药品的历史价格
        if (addDataItem) {
          // var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售',
          var _url = 'rest/authen/historicalPrice/batchGetByrelIds?id=' + addDataItem.relId + '&type=销售&customerId='+$scope.formData.customerId,
              _data = {};
          requestData(_url, _data, 'GET')
          .then(function (results) {
            var _resObj = results[1].data;
            for (var item in _resObj) {
              if (item === addDataItem.relId && _resObj[item]) {
                addDataItem.strike_price = _resObj[item].value;
              } else {
                addDataItem.strike_price = '';
              }
            }
          })
          .catch(function (error) {
            if (error) { console.log(error || '出错!'); }
          });
        }

        //请求判断 是否过期
        requestData('rest/authen/qualificationCertificate/identityForMedicalStock',{'id':addDataItem.relId},'GET').then(function (result) {

            if(result[1].code==200){
                addDataItem.info=result[1].data;

                //添加到列表
                $scope.formData.orderMedicalNos.push(addDataItem);
                //计算价格
                $scope.formData.totalPrice += addDataItem.strike_price * addDataItem.quantity;

            }
        });

        return true;
      };

      // 保存  type:save-草稿,submit-提交订单。
      $scope.submitFormAfter = function() {

        $scope.formData.validFlag = false;

        if ($scope.submitForm_type == 'exit') {
          $scope.goTo({tabHref:'#/salesOrder/query.html',tabName:'购需单'});
          return;
        }

        if ($scope.submitForm_type == 'submit') {
          // $scope.goTo('#/salesOrder/confirm-order.html?id='+$scope.formData.id);

          var url='rest/authen/salesOrder/confirmSalesOrder';
          var data= {id:$scope.formData.id,status:'待审批'};
          requestData(url, data, 'POST')
            .then(function (results) {
              var _data = results[1].data;
              // console.log(_data);
              $scope.goTo({tabHref:'#/confirmOrder/edit-from-salesOrder.html?id='+_data.confirmOrder.id,tabName:'销售单'});

            })
            .catch(function (error) {
              // alertError(error || '出错');
            });
        }

        if ($scope.submitForm_type == 'save') {
          var _url = 'rest/authen/salesOrder/isCanClose?id=' + $scope.formData.id;
          requestData(_url, {}, 'get')
          .then(function (results) {
            if (results[1].code === 200) {
              $scope.isShowCancelBtn = true;
            }
          })
          .catch(function (error) {

          });
        }
      };

      // 能否提交验证 type:save-草稿,submit-提交订单。
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

      // 保存 type:save-草稿,submit-提交订单。
      $scope.submitForm = function(fromId, type) {
        $scope.submitForm_type = type;
        if ($scope.submitForm_type == 'submit') {
          $scope.formData.validFlag = true;
        }
        $('#' + fromId).trigger('submit');

      };

      // 取消订单
      $scope.cancelForm = function(fromId, url) {
        alertWarn('cancelForm');
      };

      // 详情页待确认订单处理
      $scope.confirmHospitalOrder = function (id,showData) {
          dialogConfirm("", function (formData) {
            showData.orderDate= formData.orderDate;
            showData.salesDepartmentId=formData.salesDepartmentId;
            showData.saleUserId=formData.saleUserId;

            if (id) {
              var _url = 'rest/authen/salesOrder/confirmPurchasePlanOrder?id=' + id;
              requestData(_url, {}, 'POST')
              .then(function (results) {
                if (results[1].code === 200) {
                    //保存确认后的值
                    var _url2='rest/authen/salesOrder/save';

                    // ...
                    showData.orderStatus = '待处理';

                    requestData(_url2, showData, 'POST','parameterBody').then(function (results) {
                        if (results[1].code === 200) {
                            utils.goTo({tabHref:'#/salesOrder/edit2.html?id='+id,tabName:'购需单'});
                        }
                    }) .catch(function (err) {
                        if (err) {
                            alertWarn(err);
                        }
                    });
                }
              })
              .catch(function (err) {
                if (err) {
                  $scope.showData.onLineOrderStatus = '已关闭';
                }
              });
            }


          }, "sales-order-edit-confirm.html", "接单确认", null, null, null, {},function () {

          });


      };


      //根据资质条件判断时候允许下一步或提交
      $scope.canNextStep=function(){

          var flag=true;

          if($scope.customerInfo){
              if($scope.customerInfo.controllType =='限制交易' && $scope.customerInfo.msg){
                  flag=false;
                  return flag;
              }
          }

          angular.forEach($scope.formData.orderMedicalNos,function (medical,index) {
              if(medical.info){
                  if(medical.info.controllType =='限制交易' && medical.info.msg){
                      flag=false;
                  }
              }
          });
          return flag;
      };


  }

  angular.module('manageApp.project')
  .controller('needToPurchaseEditCtrl', ['$scope',"modal",'alertWarn',"watchFormChange", "requestData", "utils","dialogConfirm", needToPurchaseEditCtrl]);
});
