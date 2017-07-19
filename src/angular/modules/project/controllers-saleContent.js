define('project/controllers-saleContent', ['project/init'], function() {
  /**
   * [saleContentController 销售目录模块控制器]
   * @method saleContentController
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              watchFormChange [description]
   * @param  {[type]}              requestData     [description]
   * @param  {[type]}              utils           [description]
   * @return {[type]}                              [description]
   */
  function saleContentController ($scope, modal, alertWarn, watchFormChange, requestData, utils) {

    // 定义存放用户选择药品的列表
    $scope.choisedMedicalIdList = [];

    // 向列表添加数据的回调函数
    $scope.flashAddDataCallbackFn = function(flashAddData) {

      if(!flashAddData||!flashAddData.data||!flashAddData.data.data){
        alertWarn("请选择药品");
        return ;
      }
      var medical=flashAddData.data.data;
      var addDataItem = $.extend(true,{},medical);

      // 检查数据是否已被添加
      var _customerAddressId = $scope.mainStatus.pageParams.customerAddressId,     // 医疗机构id
          _medicalId = addDataItem.id;   // 药械id

      requestData('rest/authen/salecontentmedical/isExist?customerAddressId='+_customerAddressId+'&medicalId='+_medicalId)
      .then(function (results) {
        if (results[1].code === 200) {
          // 添加到后台
          var _data = {
            relId: $scope.mainStatus.pageParams.id,
            hospitalId: $scope.formData.hospitalId,
            supplierId: $scope.formData.supplierId,         // 该医疗机构下供应商id
            medical: addDataItem
          };
          requestData('rest/authen/salecontentmedical/save', _data, 'POST', 'parameter-body')
          .then(function (results) {
            if (results[1].code === 200) {
              utils.refreshHref();
              // _reloadListData('rest/authen/salecontentmedical/query?customerAddressId=' + $scope.mainStatus.pageParams.customerAddressId);
            }
          })
          .catch(function (error) {
            alertWarn(error || '添加药品失败');
          });
        }
      })
      .catch(function (error) {
        if (error) {
          alertWarn(error || '出错');
          return false;
        }
      });

      return true;
    };

    // 删除某条信息
    $scope.handleDelThisItem = function (id,hospitalSupplierId) {
      if (id) {
        var _url = 'rest/authen/salecontentmedical/delete?ids=' + id;
        requestData(_url)
        .then(function (results) {
          if (results[1].code === 200) {
            _reloadListData('rest/authen/salecontentmedical/query?customerAddressId=' + $scope.mainStatus.pageParams.customerAddressId);
          }
        })
        .catch(function (error) {
          alertWarn(error || '删除出错');
        });
      }
    };

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
      if (item.handleFlag) {    // 选中
        if (item.id) {
          $scope.choisedMedicalIdList.push(item.id);
        }
      } else {
        for (var i=0; i<$scope.choisedMedicalIdList.length; i++) {
          if (item.id === $scope.choisedMedicalIdList[i]) {
            $scope.choisedMedicalIdList.splice(i,1);
          }
        }
      }
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function () {
      if ($scope.isChoiseAll) {
        if ($scope.tbodyList) {
          $scope.choisedMedicalIdList = [];
          angular.forEach($scope.tbodyList, function (data, index) {
            $scope.choisedMedicalIdList.push(data.id);
          });
        }
      } else {
        $scope.choisedMedicalIdList = [];
      }
    };

    // 批量删除
    $scope.handleBatchDelete = function (distributorId) {
      if ($scope.choisedMedicalIdList.length) {
        var _data = {
          distributorId: distributorId,
          ids: $scope.choisedMedicalIdList
        };
        requestData('rest/authen/salecontentmedical/delete?distributorId='+distributorId+'&ids='+$scope.choisedMedicalIdList)
        .then(function (results) {
          if (results[1].code === 200) {
            _reloadListData('rest/authen/salecontentmedical/query?customerAddressId=' + $scope.mainStatus.pageParams.customerAddressId);
          }
        })
        .catch(function (error) {
          alertWarn(error || '出错');
        });
      }
    };

    // 完成按钮功能，保存备注及跳转页面
    $scope.purchaseConentGetDone = function (formData) {
      if (formData) {
        requestData('rest/authen/salecontent/save', formData, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            utils.goTo('#/salecontent/query.html');
          }
        });
      }
    };

    // 重新请求数据
    var _reloadListData = function (_url) {
      if (_url) {
        requestData(_url)
        .then(function (results) {
          if (results[1].data) {
            $scope.tbodyList = results[1].data;
          }
        });
      }
    };
  }

  angular.module('manageApp.project')
  .controller('saleContentController', ['$scope',"modal",'alertWarn',"watchFormChange", "requestData", "utils", saleContentController]);
});
