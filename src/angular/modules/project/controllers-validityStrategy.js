define('project/controllers-validityStrategy', ['project/init'], function() {
  /**
   * [validityStrategyController 效期策略模块控制器]
   * @method validityStrategyController
   * @param  {[type]}                   $scope      [description]
   * @param  {[type]}                   modal       [description]
   * @param  {[type]}                   alertWarn   [description]
   * @param  {[type]}                   alertOk     [description]
   * @param  {[type]}                   alertError  [description]
   * @param  {[type]}                   requestData [description]
   * @return {[type]}                               [description]
   */
  function validityStrategyController ($scope, modal, alertWarn, alertOk, alertError, requestData) {
    // 定义选中数组
    $scope.choisedMedicalList = [];

    // 每个药品单选操作
    $scope.handleItemClickEvent = function (item) {
        if (item.handleFlag) {    // 选中
            if (item) {
                $scope.choisedMedicalList.push(item.id);
            }
        } else {
            for (var i=0; i<$scope.choisedMedicalList.length; i++) {
                if (item.id === $scope.choisedMedicalList[i]) {
                    $scope.choisedMedicalList.splice(i,1);
                }
            }
        }
    };

    // 全选全不选
    $scope.handleChoiseAllEvent = function (isChoiseAll) {
        if (isChoiseAll) {      // 全部选中
            if ($scope.tbodyList) {
                $scope.choisedMedicalList = [];
                angular.forEach($scope.tbodyList, function (data, index) {
                    $scope.choisedMedicalList.push(data.id);
                });
            }
        } else {        // 取消全部选中
            $scope.choisedMedicalList = [];
        }
    };

    // 处理批量操作
    $scope.handleDelEvent = function (ids, requestUrl, returnUrl, dataType) {

      var _data = null;

      // 获取发送的数据类型，如果没有设置则默认为object
      var _dataType = dataType || 'object';

      if (ids) {      // 如果传入了id列表
        _data = angular.isArray(ids) ? {ids:ids} : {ids: [ids]};
      } else {        // 如果没有传入id列表
        if ($scope.choisedMedicalList && $scope.choisedMedicalList.length) {
          _data = (_dataType === 'object') ? {ids : $scope.choisedMedicalList} : $scope.choisedMedicalList;
        }
      }

      requestData(requestUrl, _data, 'POST', 'parameter-body')
        .then(function (results) {
          if (results[1].code === 200) {
            _reloadListData(returnUrl);
            $scope.isChoiseAll = false;
            $scope.choisedMedicalList=[];
          }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    };

    // 重新请求数据
    var _reloadListData = function (_url) {
        // console.log(_url);
        if (_url) {
            requestData(_url)
                .then(function (results) {
                    if (results[1].data) {
                        $scope.tbodyList = results[1].data;
                    }
                });
        }
    };

    $scope.$on('selected',function (e,data) {
        console.log("e",e,data);
        _reloadListData();
    });

    $scope.selected=function () {
        $scope.$emit('selected','update')
    }

  }

  angular.module('manageApp.project')
  .controller('validityStrategyController', ['$scope', 'modal', 'alertWarn', 'alertOk', 'alertError', 'requestData', validityStrategyController]);
});
