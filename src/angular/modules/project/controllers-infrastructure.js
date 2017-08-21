define('project/controllers-infrastructure', ['project/init'], function() {
  /**
   * [infrastructureController manage模块wms实例管理]
   * @method infrastructureController
   * @param  {[type]}                 $scope [description]
   * @return {[type]}                        [description]
   */
  function infrastructureController ($scope, requestData) {

    $scope.buildMapping = function (objName, keyName, valName) {

      if ($scope.formData[keyName] && $scope.formData[valName]) {
        if ($scope.formData[objName]) {
          // 检查key
          var _keys = Object.keys($scope.formData[objName]);
          if (_keys.indexOf($scope.formData[keyName]) != -1) {
            alert('选择的属性已存在'); return;
          }

          // 检查value
          for (var i in $scope.formData[objName]) {
            if ($scope.formData[objName][i] == $scope.formData[valName]) {
              alert('选择的值已存在'); return;
            }
          }
        }

        $scope.formData[objName][$scope.formData[keyName]] = $scope.formData[valName];

        if ($scope.formData[objName]) {
          $scope.formData[keyName] = '';
          $scope.formData[valName] = '';
        }
      }
    };

    // 初始化扩展属性
    $scope.initExtendedAttribute = function (extendedAttrObj) {

      if (angular.isObject(extendedAttrObj)) {
        $scope.extendedAttrList = [];
        for (var i in extendedAttrObj) {
          var _tmp = {name:i, val:extendedAttrObj[i]};
          $scope.extendedAttrList.push(_tmp);
        }

        // console.log($scope.extendedAttrList);
      }
    };

    // 扩展属性选择后操作
    $scope.handleChoiseEvent = function (extendedAttrList, key) {
      angular.forEach(extendedAttrList, function (item, index) {
        if (key == item.name) { $scope.formData.extendedAttributeValue = item.val; }
      });
    };

    // 保存扩展属性更改
    $scope.saveExtendedAttribute = function () {
      // console.log($scope.formData.extendedAttributeValue);
      for (var i in $scope.formData.extendedAttribute) {
        // console.log(i+' => '+$scope.formData.extendedAttributeKey.name);
        if (i == $scope.formData.extendedAttributeKey.name) {
          $scope.formData.extendedAttribute[i] = $scope.formData.extendedAttributeValue;
        }
      }
      // console.log($scope.formData);
    };

    // 生成key
    $scope.createKey = function (keyName) {
      if (keyName) {
        var _reqUrl = 'rest/index/generateUUID';

        requestData(_reqUrl, {}, 'GET')
        .then(function (results) {
          $scope[keyName] = results.data;
        })
        .catch(function (error) {
          throw new Error(error || '出错');
        });

      }
    }
  }

  angular.module('manageApp.project')
  .controller('infrastructureController', ['$scope', 'requestData', infrastructureController]);
});
