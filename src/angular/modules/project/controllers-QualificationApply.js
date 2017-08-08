define('project/controllers-QualificationApply', ['project/init'], function() {
  /**
   * [QualificationApplyCtrl 首营各模块公用控制器]
   * @method QualificationApplyCtrl
   * @param  {[type]}               $scope          [description]
   * @param  {[type]}               watchFormChange [description]
   * @param  {[type]}               requestData     [description]
   * @param  {[type]}               utils           [description]
   * @param  {[type]}               alertError      [description]
   * @param  {[type]}               alertWarn       [description]
   */
  function QualificationApplyCtrl ($scope, watchFormChange, requestData, utils, alertError, alertWarn) {

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

      //  判断区分是新建还是录入
      if ($scope.mainStatus.pageParams.enterFlag=='false') {
        $scope.formData.enterFlag=false;
      }

     });

     $scope.$watch('formData.medicalAttribute.code',function(newVal){
       $scope.formData.attributeCode=$scope.formData.medicalAttribute.code;
       $scope.formData.attributeId=$scope.formData.medicalAttribute.id;
     });
     $scope.$watch('formData.supplierAttribute.code',function(newVal){
       $scope.formData.attributeCode=$scope.formData.supplierAttribute.code;
       $scope.formData.attributeId=$scope.formData.supplierAttribute.id;
     });
     $scope.$watch('formData.customerAttribute.code',function(newVal){
       $scope.formData.attributeCode=$scope.formData.customerAttribute.code;
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

    $scope.changeStorageCondition=function(storageCondition){
       if (storageCondition=='冷冻') {
         $scope.formData.topTemperature=-25;
         $scope.formData.lowTemperature=-10;
         $scope.formData.topHumidity=75;
         $scope.formData.lowHumidity=45;
       }else if (storageCondition=='冷藏') {
         $scope.formData.topTemperature=10;
         $scope.formData.lowTemperature=2;
         $scope.formData.topHumidity=75;
         $scope.formData.lowHumidity=45;
       }else {
         $scope.formData.topTemperature=null;
         $scope.formData.lowTemperature=null;
         $scope.formData.topHumidity=null;
         $scope.formData.lowHumidity=null;
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
      //  首营企业第三步走第四步的情况下
       if ($scope.submitForm_type == 'save-enterprise') {
         requestData('rest/authen/firstEnterpriseApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
            if (results[1].code === 200){
                 $scope.goTo('#/firstEnterpriseApplication/edit-step-4.html?id='+$scope.formData.id);
            }
         })
         .catch(function (error) {
         });
       }
       //  首营客户第三步走第四步的情况下
       if ($scope.submitForm_type == 'save-customer') {
         requestData('rest/authen/firstCustomerAddressApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200){
             $scope.goTo('#/firstCustomerAddressApplication/edit-step-4.html?id='+$scope.formData.id);
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
       if ($scope.submitForm_type == 'submit-customerAddress') {
         requestData('rest/authen/firstCustomerAddressApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             var url='rest/authen/firstCustomerAddressApplication/startProcessInstance';
             var data= {businessKey:results[1].data.id};
             requestData(url,data, 'POST')
              .then(function (results) {
                if (results[1].code === 200) {
                $scope.goTo('#/firstCustomerAddressApplication/get.html?id='+$scope.formData.id);
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
       if ($scope.submitForm_type == 'submit-firstMedical') {
         $scope.formData.validFlag = true;
         requestData('rest/authen/firstMedicalApplication/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
         .then(function (results) {
           if (results[1].code === 200) {
             $scope.goTo('#/firstMedicalApplication/edit-step-2.html?id='+results[1].data.id);
           } else {
             alertError(results[1].msg);
           }
         })
         .catch(function (error) {
          //  if (error) {throw new Error(error || '错误');}
         });
       }

       if ($scope.submitForm_type == 'submit') {
         $scope.formData.validFlag = true;
       }



      $('#' + fromId).trigger('submit');
    };

    $scope.submitFormAfter = function (_url) {
      if ($scope.submitForm_type === 'submit') {
          $scope.goTo(_url+'?id=' + $scope.formData.id);
      }

    };

    $scope.submitSaveCallBack=function(type){
        requestData('rest/authen/'+type+'/saveBaseInfo', $scope.formData, 'POST', 'parameterBody')
            .then(function (results) {
                if (results[1].code === 200) {
                  $scope.formData.validFlag = true;
                  $scope.goTo('#/'+type+'/query.html?id='+$scope.formData.id);
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
      }else {
        $scope.formData.type.pop(item.text);
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

    // 首营品种新建页面用户输入零售价大于牌价的提示
    $scope.chkQuoteAndRetail = function () {
      if ($scope.formData.firstMedical.quoteprice) {
        $scope.$watch($scope.formData.firstMedical.retailPrice, function () {
          if (parseInt($scope.formData.firstMedical.retailPrice) > parseInt($scope.formData.firstMedical.quoteprice)) {
            alertWarn('当前输入的零售价大于输入的牌价!');
          }
        });
      }
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

    $scope.refreshAttachements=function(type){
      var url='rest/authen/'+type+'/getOfEdit';
      var data= {};
      requestData(url,data,'get')
        .then(function (results) {
          var _data = results[1];
          $scope.formData.attachments=_data.data.attachments;
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    };

      // 点击新增商品单位信息，新增一条商品辅助单位
      $scope.addMedicalUnit = function(){
          // 判断othersPackingAttribute对象是否是空值，如果是，就新建一个为空的数组，不是则直接就把新的一条辅助单位的数据加入数组
          if (!$scope.formData.othersPackingAttribute) {
              $scope.formData.othersPackingAttribute=[];
          }
          var otherPobject={
              type:"辅助单位",
              name:"",
              ratio:"",
              barcode:"",
              bidPrice:"",
              length:"",
              width:"",
              height:"",
              unitWeightKg:""
          };
          if($scope.formData.othersPackingAttribute){
              $scope.formData.othersPackingAttribute.push(otherPobject);
          }else{
              $scope.formData.othersPackingAttribute.push(otherPobject);
          }
      };

      // 经营方式查询调用的方法,根据传入的q查询。
      $scope.filterName=function(q){
        if (q) {

          var url='rest/authen/businessScope/query?pageSize=999&q='+q;
          var data= {};
          requestData(url,data, 'get')
            .then(function (results) {
              $scope.scopeData= results[1].data;
            })
            .catch(function (error) {
              alertError(error || '出错');
            });
        }
      };

      // 选择经营方式以后，调用的方法。
      $scope.submitbusinessScope=function(_data){
        var _businessScope={};
        if (_data) {
          for (var i = 0; i < _data.length; i++) {
            if (_data[i].checked) {
              _businessScope.name=_data[i].name;
              _businessScope.id=_data[i].id;
              $scope.businessScope.push(_businessScope);
            }
          }
        }
      }

      // 设置联系人默认地址,传入联系人jason对象,把默认设置还原到没有默认的时候。
      $scope.setDefault=function(_data){
        if (_data.length) {
          for (var i = 0; i < _data.length; i++) {
            _data[i].isDefault=false;
          }
        }
      }

  }

  angular.module('manageApp.project')
  .controller('QualificationApplyCtrl', ['$scope',"watchFormChange",'requestData',"utils", "alertError", "alertWarn", QualificationApplyCtrl]);
});
