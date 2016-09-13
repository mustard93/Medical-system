/**
 *  主模块main控制器
 */

define('main/controllers', ['angular'], function () {
  angular.module('manageApp.main', [])
  /**
   * 主控制器
   */
  .controller('mainCtrl', ['$scope', function ($scope) {
    'use strict';
    $scope.mainStatus = {
        navFold: document.body.clientWidth < 1500,
        navigation: "",
        msgBubble: 0 //消息气泡
    };

    $scope.mainConfig = window.Config || {};

    //页面跳转
    $scope.pageTo = function (_url) {
        window.location.assign(_url);
    };

    //获取主要信息
    if ($scope.mainConfig.getMainInfo) {
      // 获取用户主要信息请求地址
      var _url = $scope.mainConfig.getMainInfo;

      if (Config.serverPath) {
        if (_url.indexOf("http://") !== 0 || _url.indexOf("https://") !== 0) {
          _url = $scope.mainConfig.serverPath + _url;
        }
      }

      $.getJSON(_url, function (_data) {
              if (_data.code == 200) {
                  angular.extend($scope.mainStatus, _data.data);
              }
          })
          .complete(function () {
              $scope.$digest();
          });
    }

    //后退
    $(document).on("click", ".top-nav-wrap .backBtn", function () {
        window.history.back();
    });
  }])

  /**
   * 边栏控制器
   */
  .controller('sideNav', ['$scope', function ($scope) {
    'use strict';
    // code is here ...
  }])

  /**
   * 主内容区域控制器
   */
  .controller('pageCtrl', ['$scope', 'modal', function ($scope, modal) {
    'use strict';
    modal.closeAll();
  }]);
});
