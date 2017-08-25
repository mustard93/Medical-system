define('project-dt/controllers-otherCustomerApplication', ['project-dt/init'], function() {
  /**
   * [otherCustomerApplicationCtrl description]
   * @method otherCustomerApplicationCtrl
   * @param  {[type]}                     $scope          [description]
   * @param  {[type]}                     watchFormChange [description]
   * @param  {[type]}                     requestData     [description]
   * @param  {[type]}                     utils           [description]
   * @param  {[type]}                     alertError      [description]
   * @param  {[type]}                     alertWarn       [description]
   * @return {[type]}                                     [description]
   */
  function otherCustomerApplicationCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

    $scope.watchFormChange = function(watchName){
      watchFormChange(watchName,$scope);
    };

    $scope.$watch('initFlag', function (newVal) {
       var operationFlowSetMessage=[];
       var operationFlowSetKey=[];
       var i;
       if (newVal && $scope.tr) {
         // 选择出当前状态相同的驳回理由，并放入一个数组中
         if ($scope.tr.operationFlowSet) {
           for (i=0; i<$scope.tr.operationFlowSet.length; i++) {
             if ($scope.tr.operationFlowSet[i].status==$scope.tr.orderStatus) {
               operationFlowSetMessage.push($scope.tr.operationFlowSet[i].message);
               operationFlowSetKey.push($scope.tr.operationFlowSet[i].key);
             }
           }
           //选择当前状态最近的一个驳回理由用于显示
           $scope.tr.operationFlowSet.message=operationFlowSetMessage[operationFlowSetMessage.length-1];
           $scope.tr.operationFlowSet.key=operationFlowSetKey[operationFlowSetKey.length-1];
         }
       }

       if ($scope.formData) {
         if (newVal && $scope.formData.orderMedicalNos) {
          for (i=0; i<$scope.formData.orderMedicalNos.length; i++) {
            if ($scope.formData.orderMedicalNos[i].handleFlag) {
              $scope.choisedMedicals = true;
            }
            if (!$scope.formData.orderMedicalNos[i].handleFlag) {
              $scope.isChoiseAll = false;
            }
          }
         }
       }

       if ($scope.formData) {
         for(var tr in $scope.formData.attachments){
           // 首先把Jason对象转化成数组，然后再把每条的证书编号字段取出来，如果有值，则把idAdmin字段设为false，相反设为true。该字段控制是否可以对证书编号进行编辑
           var attachments=[];
           attachments.push($scope.formData.attachments[tr]);
             attachments[0].isAdmin=true;
         }
       }
      //  默认选择生产企业
      // if (initType) {
      //   $scope.formData.type='生产企业';
      // }
     });
     $scope.$watch('formData.customerAttribute.code',function(newVal){
       $scope.formData.attributeCode=$scope.formData.customerAttribute.code;
          $scope.formData.attributeId=$scope.formData.customerAttribute.id;
     });
     $scope.$watch('formData.object.customerAttribute.code',function(newVal){
       $scope.formData.object.attributeCode=$scope.formData.object.customerAttribute.code;
        $scope.formData.attributeId=$scope.formData.customerAttribute.id;
     });

    //  如果第一步的时候选择的是生产企业，那第二步就默认选中生产，如果选的经营企业，就默认选中批发
    $scope.canSubmitMedical=function(type){
       if(type){

         if (type=='生产企业') {
           $scope.formData.businessLicense.businessWay='生产';
         }else if (type=='经营企业') {
           $scope.formData.businessLicense.businessWay='批发';
         }
       }
     }

    // 改变默认设置的生产企业和经营方式的对应关系给提示，并且阻止提交，只有和系统对应的匹配一样才允许提交。
    $scope.changeType=function(type,businessWay){
       if (type=='生产企业'&businessWay=='生产') {
         $scope.showProductionFlag=false;
          $scope.canSubmit=false;
       }else if (type=='经营企业'&businessWay=='批发') {
         $scope.showManageFlag=false;
         $scope.canSubmit=false;
       }else {
         $scope.canSubmit=true;
         if (type=='生产企业') {
           $scope.showProductionFlag=true;
         }else {
           $scope.showManageFlag=true;
         }
       }
     };

    $scope.submitForm = function(fromId, type) {
       $scope.submitForm_type = type;
       if ($scope.submitForm_type == 'submit-enterprise') {
         requestData('rest/authen/firstEnterpriseApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             var url='rest/authen/firstEnterpriseApplication/startProcessInstance';
             var data= {businessKey:$scope.formData.id};
             requestData(url,data, 'POST')
              .then(function (results) {
                var _data = results[1];
                $scope.goTo('#/firstEnterpriseApplication/get.html?id='+$scope.formData.id);
              })
              .catch(function (error) {
                alertError(error || '出错');
              });
           }
         })
         .catch(function (error) {
         });
       }
       if ($scope.submitForm_type == 'submit-medical') {
         $scope.formData.validFlag = true;
         requestData('rest/authen/firstMedicalApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             var url='rest/authen/firstMedicalApplication/startProcessInstance';
             var data= {businessKey:results[1].data.id};
             requestData(url,data, 'POST')
              .then(function (results) {
                if (results[1].code === 200) {
                  $scope.goTo('#/firstMedicalApplication/get.html?id='+$scope.formData.id);
                }

              })
              .catch(function (error) {
                alertError(error || '出错');
              });

           }else{
                   alertError(results[1].msg);
           }
         })
         .catch(function (error) {
             alertError(error || '出错');
         });
       }
       if ($scope.submitForm_type == 'submit-hospital') {
         requestData('rest/authen/hospitalApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             var url='rest/authen/hospitalApplication/startProcessInstance';
             var data= {businessKey:$scope.formData.id};
             requestData(url,data, 'POST')
              .then(function (results) {
                if (results[1].code === 200) {
                $scope.goTo('#/hospitalApplication/get.html?id='+$scope.formData.id);
               }
              })
              .catch(function (error) {
                alertError(error || '出错');
              });
           }
         })
         .catch(function (error) {
         });
       }
       if ($scope.submitForm_type == 'submit-otherCustomer') {
         requestData('rest/authen/customerAddress/save', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             console.log(results[1]);
              $scope.goTo('#/otherCustomerManagement/get.html?id='+$scope.formData.id);
           }
         })
         .catch(function (error) {
         });
       }

       if ($scope.submitForm_type == 'submit') {
         $scope.formData.validFlag = true;
       }
      $scope.submitFormValidator(fromId);
    };

    $scope.submitFormAfter = function (_url) {

      if ($scope.submitForm_type === 'submit') {
        $scope.goTo(_url + '?id=' + $scope.formData.id);
      }

    };

    // 解决新建时保存并返回的问题。返回query页面后要刷新当前数据。
    $scope.submitSaveCallBack=function(){
        requestData('rest/authen/otherCustomerApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
            .then(function (results) {
                if (results[1].code === 200) {
                  $scope.formData.validFlag = true;
                  $scope.goTo('#/otherCustomerApplication/query.html?id='+$scope.formData.id);
                }
            })
            .catch(function (error) {
              alertError('出错！')
            });

    }

    // 选中相应药品类别，放入数组中传到后台
    $scope.choiceCommodityType=function(item){
      if(item.value){
        if($scope.formData.type === null){
          $scope.formData.type=[];
        }
      $scope.formData.type.push(item.text);

      }
    };

    //判断当前审核意见是否可见
    $scope.showAuditOpinion = function (returnArr, pipeKey) {
      if (angular.isArray(returnArr)) {
        var i, len;
        len = returnArr.length;
        for (i = 0; i < len; i++) {
          if (returnArr[i].event.status !== pipeKey) {
            return true;
          }
        }
        return false;
      }
    };

    //医院采购目录医院添加单条药品信息
    $scope.addMedicinalDataItem = function (hospitalId) {

      // $scope.responseBody = {};

      // if (id) {
      //   $scope.responseBody.hospitalPurchaseContentsId = id;
      // }

          if (!$scope.medical||!$scope.medical.id) {
              alertWarn("请选择药械");
              return;

          }

        var formData = $.extend(true,{},$scope.medical);

        //处理药品内信息id和copyId，以区分新建和编辑
        formData.hospitalId = hospitalId;
        formData.relId = $scope.medical.id;
        formData.id = null;
        formData.purchasePrice = formData.price;

      requestData('rest/authen/hospitalPurchaseMedical/save', formData, 'POST', 'parameterBody')
      .then(function (results) {
        if (results[1].code === 200) {
          // utils.goTo('#/hospitalPurchaseContents/get.html?id='+hospitalId);
          $scope.$broadcast('reloadList');
        } else {
          alertError('出错!');
        }
      })
      .catch(function (error) {
         alertError('此药械已添加');
      });
    };


    //医院采购目录增加采购目录有效期设置
    $scope.$watch('listParams.guaranteePeriod', function (newVal) {
      if (newVal === undefined) {
        return;
      }

      $scope.showData.guaranteePeriod = newVal;

      requestData('rest/authen/customerAddress/save', $scope.showData, 'POST', 'parameter-body')
      .then(function (results) {
        // console.log(results);
      })
      .catch(function (error) {
        if (error) {
          alertError(error || '出错');
        }
      });
    });

    // 监视用户是否更改是否基药选项，如果更改为非基药，将非基药价格重置为0
    $scope.$watch('formData.firstMedical.isBasicMedicine', function (newVal) {
      if (newVal === '否') {
        $scope.formData.firstMedical.quoteprice = 0;
      }
    });
  }

  angular.module('manageApp.project-dt')
  .controller('otherCustomerApplicationCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", otherCustomerApplicationCtrl]);
});
