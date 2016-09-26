/**
 * Created by hao on 15/11/5.
 */

define('main/controllers', ['main/init'], function () {

    /**
     * 主控
     */
    function mainCtrl($scope) {
        $scope.mainStatus = {
            navFold: document.body.clientWidth < 1500,
            navigation: "",
            msgBubble: 0 //消息气泡
        };
        //当前用户
        $scope.curUser={};

        $scope.mainConfig = window.Config || {};
        //页面跳转
        $scope.pageTo = function (_url) {
            window.location.assign(_url);
        };

        $scope.httpGet = function(url) {
          return $http.get(url);
        };


        //获取主要信息
        if ($scope.mainConfig.getMainInfo) {
            var _url = $scope.mainConfig.getMainInfo;

            if (Config.serverPath) {
              if (_url.indexOf("http://") !== 0 && _url.indexOf("https://") !== 0) {
                _url = $scope.mainConfig.serverPath + _url;
              }
              // 定义服务器请求路径
              $scope.mainStatus.requestPath = Config.serverPath;
            }

            $.ajax({
              url: _url,
              type: 'get',
              xhrFields:{withCredentials: true},
              crossDomain:true,
              dataType: 'json',
              success: function (_data) {
                if (_data.code == 200) {
                  $scope.curUser=_data.data;
                  angular.extend($scope.mainStatus, _data.data);
                  $scope.$digest();
                  console.log('abc');
                } else if (_data.code == 802){
                  console.log('aa');
                  window.location.href = "login.html";
                } else {
                  alert(_data.msg || '登录失败');
                }
              }
            });

            $.getJSON(_url, function (_data) {
                    if (_data.code == 200) {
                        angular.extend($scope.mainStatus, _data.data);
                    }
                })
                .complete(function () {

                });
        }

        //后退
        $(document).on("click", ".top-nav-wrap .backBtn", function () {
            window.history.back();
        });
    }

    /**
     * 侧边菜单
     */
    function sideNav($scope) {
    }


    /**
     *
     */
    function pageCtrl($scope, modal) {
        modal.closeAll();
    }

    /**
     *用于编辑
     */
    function editCtrl($scope, modal) {
        modal.closeAll();
    }

    angular.module('manageApp.main')
        .controller('mainCtrl',  ["$scope", mainCtrl])
        .controller('sideNav',  ["$scope",sideNav])
        .controller('editCtrl',  ["$scope","modal",editCtrl])
        .controller('pageCtrl',  ["$scope","modal",pageCtrl]);
});
