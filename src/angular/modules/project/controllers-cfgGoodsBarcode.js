define('project/controllers-cfgGoodsBarcode', ['project/init'], function() {
  /**
   * [cfgGoodsBarcodeCtroller 品种管理中GS1条码打印控制器]
   * @method cfgGoodsBarcodeCtroller
   * @param  {[type]}                $scope      [description]
   * @param  {[type]}                requestData [description]
   * @param  {[type]}                utils       [description]
   * @param  {[type]}                OPrinter    [description]
   * @param  {[type]}                $timeout    [description]
   * @return {[type]}                            [description]
   */
  function cfgGoodsBarcodeCtroller ($scope, requestData, utils, OPrinter, $timeout) {

    var _url = 'rest/authen/gs1Barcode/get';

    // 获取商品条码
    $scope.getGoodsBarcode = function (barcode) {

      if (barcode) {
        var _data = {
              "barcode": barcode,
              "barcodeType": "一段式"
            };

        requestData(_url, _data, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.goodsBarcode = results[1].data;   // 商品条码
            $scope.goodsFullBarcode = results[1].data;   // 完整的商品条码，包含批号、数量
            $scope.scopeData.medicalType = '一段式';   // 设置默认的条码选择样式
          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        });
      }
    };

    // 请求包含批号和数量的完整的条码
    $scope.getFullGoodsBarcode = function (scopeData) {
      if (scopeData) {
        var _data = {
          "barcode": scopeData.barcode,
          "quantity": scopeData.quantity,
          "productionBatch": scopeData.productionBatch,
          "validTill": scopeData.validTill,
          "barcodeType": scopeData.medicalType
        };
        requestData(_url, _data, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            $scope.goodsFullBarcode = results[1].data;   // 完整的商品条码，包含批号、数量
          }
        })
        .catch(function (error) {
          if (error) { throw new Error(error || '出错'); }
        });
      }
    };

    $scope.loadCLodop = function () {
      $timeout(function () {
        if (!OPrinter.chkOPrinter()) {
          $scope.notInstallPlusin = true;
        }
      }, 1000);
    };
  }

  angular.module('manageApp.project')
  .controller('cfgGoodsBarcodeCtroller', ['$scope',"requestData",'utils',"OPrinter", "$timeout", cfgGoodsBarcodeCtroller]);
});
