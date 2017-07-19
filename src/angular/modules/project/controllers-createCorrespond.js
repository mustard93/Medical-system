define('project/controllers-createCorrespond', ['project/init'], function() {
  /**
   * [createCorrespondController 创建医院药品与经销商药品关联关系dialog控制器]
   * @method createCorrespondController
   * @param  {[type]}                   $scope      [description]
   * @param  {[type]}                   requestData [description]
   * @param  {[type]}                   modal       [description]
   * @param  {[type]}                   alertWarn   [description]
   * @param  {[type]}                   utils       [description]
   * @return {[type]}                               [description]
   */
  function createCorrespondController ($scope, requestData, modal, alertWarn,utils) {

    // 侧边栏搜索过滤
    $scope.handleSearchFilter = function (key,hospitalId,supplierId) {
      var _url = 'rest/authen/salecontentmedical/queryHospitalMedical?hospitalId='+hospitalId+'&supplierId='+supplierId+'&q='+key;
      requestData(_url)
      .then(function (results) {
        $scope.codesList = results[1].data;
      });
    };

    $scope.handleSearchFilter2 = function (key) {
      var _url = 'rest/authen/medicalStock/query?q=' + key;
      requestData(_url)
      .then(function (results) {
        $scope.codesList = results[1].data;
      });
    };

    // 选择供应商编码与医院药品编码建立对应关系
    $scope.choiseCode = function (code,medicalId,hospitalMedicalId) {
      // 将当前选择的医院编码赋值到数据对象中
      if ($scope.tbodyList) {
        angular.forEach($scope.tbodyList, function (data, index) {
          if (data.id === medicalId) {
            // 添加到后台
            var _data = {
              id: $scope.tbodyList[index].id,
              relId: $scope.mainStatus.pageParams.id,
              hospitalId: $scope.formData.hospitalId,
              supplierId: $scope.formData.supplierId,
              hospitalMedicalCode: code,
              hospitalMedicalId: hospitalMedicalId,
              // saleContentMedicalId: ,
              medical: $scope.tbodyList[index].medical
            };

            requestData('rest/authen/salecontentmedical/save', _data, 'POST', 'parameter-body')
            .then(function (results) {
              if (results[1].code === 200) {
                $scope.tbodyList[index].hospitalMedicalCode = code;
                utils.refreshHref();
                // _reloadListData('rest/authen/purchasecontentmedical/query?distributorId=' + $scope.mainStatus.pageParams.distributorId);
              }
            })
            .catch(function (error) {
              alertWarn(error || '添加药品失败');
            });
          }
        });
      }

      modal.closeAll();
    };

    $scope.choiseCode2 = function (code,medicalId,distributorMedicalId) {
      // 将当前选择的医院编码赋值到数据对象中
      if ($scope.tbodyList) {
        angular.forEach($scope.tbodyList, function (data, index) {
          if (data.id === medicalId) {
            $scope.tbodyList[index].medical.code = code;
            // 添加到后台
            var _data = {
              id: $scope.tbodyList[index].id,
              relId: $scope.mainStatus.pageParams.id,
              distributorId: $scope.mainStatus.pageParams.distributorId,
              distributorMedicalId: distributorMedicalId,
              // saleContentMedicalId: ,
              medical: $scope.tbodyList[index].medical
            };

            requestData('rest/authen/purchasecontentmedical/save', _data, 'POST', 'parameter-body')
            .then(function (results) {
              if (results[1].code === 200) {

                // _reloadListData('rest/authen/purchasecontentmedical/query?distributorId=' + $scope.mainStatus.pageParams.distributorId);
              }
            })
            .catch(function (error) {
              alertWarn(error || '添加药品失败');
            });
          }
        });
      }

      modal.closeAll();
    };

  }

  angular.module('manageApp.project')
  .controller('createCorrespondController', ['$scope',"requestData",'modal',"alertWarn", "utils", createCorrespondController]);
});
