/**
 * Created by hao on 15/11/5.
 */

define('main/controllers', ['main/init'], function () {



    /**
     * 主控
     */
    function mainCtrl($scope,$http) {
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


        // 调整页面
        $scope.goTo = function (url,confirmMsg) {

            if(confirmMsg){
              dialogConfirm(confirmMsg, function () {
                window.location.assign(url);
              }, null);
            }else{
                window.location.assign(url);
            }
        };




        $scope.httpGet = function(url) {

          if (Config.serverPath) {

              if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = $scope.mainConfig.serverPath + url;
              }
          }

          return $http.get(url);
        };

        $scope.logout = function(method) {

            if (!Config.logoutUrl) {
               alert("请设置注销接口");
                return;
            }

            if (!method) {
              method = 'POST';
            }
            if (Config.serverPath) {
                var _url =Config.logoutUrl;
                if (_url.indexOf("http://") !== 0 && _url.indexOf("https://") !== 0) {
                  _url = $scope.mainConfig.serverPath + _url;
                }
            }
            $.ajax({
              url: _url,
              type: method,
              xhrFields:{withCredentials: true},
              crossDomain:true,
              dataType: 'json',
              success: function (_data) {
                  window.location.href = Config.loginHtmlUrl;
                }
            });

        };

        //全局权限控制器
        $scope.hasAuthor = function (author) {
            var arr=TestAuthor["A_"+$scope.curUser.phone];
            // if(!$scope.curUser.additional||!$scope.curUser.additional.Authoritys)return false;
            // arr=$scope.curUser.additional.Authoritys;

            if ($.inArray(author, arr) == -1) {
                return false;
            } else {
                return true;
            }
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
                  // 角色跳转主页面
                  switch ($scope.mainStatus.phone) {
                    case '13600000000':$scope.goTo('#/main.html');break;
                    case '13600000100':$scope.goTo('#/authorIndex/main-salemanager.html');break;
                    case '13600000101':$scope.goTo('#/authorIndex/main-servicemanager.html');break;
                    case '13600000102':$scope.goTo('#/authorIndex/main-purchasemanager.html');break;
                    case '13600000103':$scope.goTo('#/authorIndex/main-repertorymanager.html');break;
                    case '13600000104':$scope.goTo('#/authorIndex/main-checkmanager.html');break;
                    case '13600000105':$scope.goTo('#/authorIndex/main-generalmanager.html');break;
                    default: $scope.goTo('#/main.html');
                  }
                } else if (_data.code == 802){
                  window.location.href = Config.loginHtmlUrl;
                } else {
                  alert(_data.msg || '登录失败');
                }
              }
            });
            //
            // $.getJSON(_url, function (_data) {
            //         if (_data.code == 200) {
            //             angular.extend($scope.mainStatus, _data.data);
            //         }
            //     })
            //     .complete(function () {
            //
            //     });
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
     *  主页面控制器
     */
    function pageCtrl($scope, modal, dialogConfirm, $timeout) {
        modal.closeAll();

        $scope.cancelThis = function (_text, _mode) {
          dialogConfirm(_text, function () {
            window.history.go(-1);
          }, _mode);
        };
    }

    /**
     *用于编辑
     */
    function editCtrl($scope, modal) {
        modal.closeAll();
    }

    angular.module('manageApp.main')
        .controller('mainCtrl',  ["$scope","$http", mainCtrl])
        .controller('sideNav',  ["$scope",sideNav])
        .controller('editCtrl',  ["$scope","modal",editCtrl])
        .controller('pageCtrl',  ["$scope","modal", "dialogConfirm", "$timeout", pageCtrl]);
});
