define('project-dt/controllers-medicalFlashCheck', ['project-dt/init'], function() {
  /**
   * [medicalFlashCheckController 药械闪查模块控制器]
   * @method medicalFlashCheckController
   * @param  {[type]}              $scope          [description]
   * @param  {[type]}              modal           [description]
   * @param  {[type]}              alertWarn       [description]
   * @param  {[type]}              alertError      [description]
   * @param  {[type]}              requestData     [description]
   * @param  {[type]}              watchFormChange [description]
   * @return {[type]}                              [description]
   */
  function medicalFlashCheckEditCtrl($scope, modal, alertWarn, alertError, requestData, watchFormChange) {

    // 点击查询按钮之后触发的方法，请求商品信息。
    $scope.medicalSearch=function(_id,_productionBatch){
      if (!_productionBatch) {
        _productionBatch=null;
      }
      if (_id) {
        var _url = 'rest/authen/medicalFlashCheck/getMedicalInfoAndPrice?id=' + _id + '&productionBatch='+_productionBatch,
            _data = {};
        requestData(_url, _data, 'GET')
        .then(function (results) {
          $scope.scopeData= results[1].data;
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }
    }
    // 点击查询按钮之后触发的方法，请求库存信息。
    $scope.stockSearch=function(_id,_productionBatch){
      var totalQuantity=0;
      if (!_productionBatch) {
        _productionBatch='';
      }
      if (_id) {
        var _url = 'rest/authen/medicalStock/queryStockBatch?relMedicalStockId=' + _id + '&q='+_productionBatch,
            _data = {};
        requestData(_url, _data, 'GET')
        .then(function (results) {
          $scope.stockData= results[1].data;
          for (var i = 0; i < $scope.stockData.length; i++) {
            totalQuantity=totalQuantity+$scope.stockData[i].stockModel.quantity;
          }
          $scope.totalQuantity=totalQuantity;
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }
    }

    // 点击查询按钮之后触发的方法，请求出入库信息。
    $scope.inOutStockSearch=function(_id,_productionBatch){
      if (!_productionBatch) {
        _productionBatch='';
      }
      if (_id) {
        var _url = 'rest/authen/medicalFlashCheck/queryMedicalInoutStockDetail?relMedicalId=' + _id + '&productionBatch='+_productionBatch+'&pageSize=999',
            _data = {};
        requestData(_url, _data, 'GET')
        .then(function (results) {
          $scope.inOutStockData= results[1].data;
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }
    }

    // 为解决日期查询没有点击X清空选项直接重新选择不发请求的bug。
    $scope.$watch('stockData.createAtBeg', function (newVal, oldVal) {

      if (newVal && oldVal && oldVal !== newVal && $scope.medicalData.id) {
        var _url = 'rest/authen/medicalFlashCheck/queryMedicalInoutStockDetail',
            _data = {
              'relMedicalId':$scope.medicalData.id,
              'productionBatch':$scope.medicalData.productionBatch,
              'createAtBeg':newVal,
              'createAtEnd':$scope.stockData.createAtEnd,
              'pageSize':'999'
            };
        requestData(_url, _data, 'GET')
        .then(function (results) {
          $scope.inOutStockData= results[1].data;
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }
    });
    $scope.$watch('stockData.createAtEnd', function (newVal, oldVal) {

      if (newVal && oldVal && oldVal !== newVal && $scope.medicalData.id) {
        var _url = 'rest/authen/medicalFlashCheck/queryMedicalInoutStockDetail',
            _data = {
              'relMedicalId':$scope.medicalData.id,
              'productionBatch':$scope.medicalData.productionBatch,
              'createAtBeg':$scope.stockData.createAtBeg,
              'createAtEnd':newVal,
              'pageSize':'999'
            };
        requestData(_url, _data, 'GET')
        .then(function (results) {
          $scope.inOutStockData= results[1].data;
        })
        .catch(function (error) {
          if (error) { console.log(error || '出错!'); }
        });
      }
    });


    // 出入库记录根据时间段查询
    $scope.handleSearchFilter = function (createAtBeg,createAtEnd, relMedicalStockId) {

      if (!createAtBeg) {
        createAtBeg='';
      }
      if (!createAtEnd) {
        createAtEnd='';
      }
        // 构建完整的查询url
        var _queryUrl = 'rest/authen/medicalFlashCheck/queryMedicalInoutStockDetail?pageSize=999&relMedicalId=' + relMedicalStockId+"&&createAtBeg="+createAtBeg+"&&createAtEnd="+createAtEnd;

        // 更新数据
        requestData(_queryUrl)
            .then(function (results) {
                $scope.inOutStockData= results[1].data;
            })
            .catch(function (error) {
                throw new Error(error || '出错');
            });
    };
  }

  angular.module('manageApp.project-dt')
  .controller('medicalFlashCheckEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", medicalFlashCheckEditCtrl]);
});
