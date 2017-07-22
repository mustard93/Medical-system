define('project/controllers-medicalFlashCheck', ['project/init'], function() {

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
        if (!_productionBatch) {
          _productionBatch=null;
        }
        if (_id) {
          var _url = 'rest/authen/medicalStock/queryStockBatch?relMedicalStockId=' + _id + '&q='+_productionBatch,
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



    }


  angular.module('manageApp.project')
  .controller('medicalFlashCheckEditCtrl', ['$scope',"modal",'alertWarn',"alertError", "requestData", "watchFormChange", medicalFlashCheckEditCtrl]);
});
