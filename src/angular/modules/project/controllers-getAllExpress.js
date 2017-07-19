define('project/controllers-getAllExpress', ['project/init'], function() {
  /**
   * [getAllExpressController 获取当前单据的所有物流信息]
   * @method getAllExpressController
   * @param  {[type]}                $scope      [description]
   * @param  {[type]}                requestData [description]
   * @return {[type]}                            [description]
   */
  function getAllExpressController ($scope, requestData) {

    var _kuaidiSet = $scope.dialogData.kuaidiSet;
    var _url = 'rest/index/kuaidi/query2.json';
    $scope.expressInfoArray = [];

    angular.forEach(_kuaidiSet, function (data, index) {

        //46 经销商平台，销售出库单，只有第三个快递有数据，点击查看物流信息时，切换快递，变成第一个快递有物流信息
        //由于异步请求，返回数据，没有按照顺序返回导致数据有错位的bug
      var _tmpObj ={};
      _tmpObj.index = index;
      _tmpObj.type = data.type;
      _tmpObj.nu = data.nu;
      //加载中,加载成功，加载失败
      _tmpObj.status="加载中";
      _tmpObj.msg="加载中";
      $scope.expressInfoArray.push(_tmpObj);

      requestData(_url + '?type=' + data.type + '&nu=' + data.nu, {}, 'get')
      .then(function (results) {
        // console.log(results[1]);
        var _tmpObj = results[1];
        _tmpObj.index = index;
        _tmpObj.type = data.type;
        _tmpObj.nu = data.nu;
        _tmpObj.status="完成";
        $scope.expressInfoArray[index]=_tmpObj;

      }).catch(function (error) {
        // alertError(error || '出错');
        $scope.expressInfoArray[index].status="加载失败";
        $scope.expressInfoArray[index].msg=error || '出错';
      });
    });
  }

  angular.module('manageApp.project')
  .controller('getAllExpressController', ['$scope', 'requestData', getAllExpressController]);
});
