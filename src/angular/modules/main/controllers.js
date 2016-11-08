/**
 * Created by hao on 15/11/5.
 */

define('main/controllers', ['main/init'], function () {
    /**
     * 主控
     */
    function mainCtrl($scope,$rootScope,$http,store) {
        $scope.mainStatus = {
            navFold: document.body.clientWidth < 1500,
            navigation: "",
            msgBubble: 0 //消息气泡
        };
        //当前用户
        $scope.curUser={};

        //当前日期
        var getCurrentDate = function () {
          var _t = new Date();
          return _t.getFullYear() + '-' + (_t.getMonth() + 1) + '-' + _t.getDate();
        };
        $scope.currentDate = getCurrentDate();

        $scope.mainConfig = window.Config || {};

        //页面跳转
        $scope.pageTo = function (_url) {
            window.location.assign(_url);
        };


        // 调转页面
        $scope.goTo = function (url,confirmMsg) {

            if(confirmMsg){
              dialogConfirm(confirmMsg, function () {
                window.location.assign(url);
              }, null);
            }else{
                window.location.assign(url);
            }
        };
        $rootScope.goTo=$scope.goTo;


        //遍历数组，返回满足属性值等于val的。
        $rootScope.getObjectByKeyOfArr = function (arr,key,val) {

            if(!angular.isArray(arr))return null;
            for(var i=0;i<arr.length;i++){
              if(arr[i][key]==val)return arr[i];
            }
            return null;
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
          var _url = '';

          if (!Config.logoutUrl) {
            alert("请设置注销接口");
            return;
          }

          if (!method) {
            method = 'POST';
          }

          if (Config.serverPath) {
            _url = Config.logoutUrl;
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
            // var arr=TestAuthor["A_"+$scope.curUser.phone];
            if(!$scope.curUser||!$scope.curUser.additional||!$scope.curUser.additional.Authoritys)return false;
            var arr=$scope.curUser.additional.Authoritys;

            if ($.inArray(author, arr) == -1) {
                return false;
            } else {
                return true;
            }
        };

        $rootScope.hasAuthor = $scope.hasAuthor;


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

                    //未绑定用户，跳转到绑定用户绑定
                    if(Config.applyBindUrl){
                      if(!$scope.curUser.additional.OrganizationIds||$scope.curUser.additional.OrganizationIds.length==0){
                          window.location.href = Config.applyBindUrl;
                          return;
                      }
                    }

                  $scope.habbit={mainRole:$scope.getMainRole()};

                  if(window.location.href.indexOf('#'+Config.indexPage)>-1){
                          $scope.goToMainRole($scope.habbit.mainRole);
                  }

                  angular.extend($scope.mainStatus, _data.data);
                  $scope.$digest();
                  // 角色跳转主页面

                } else if (_data.code == 802){
                    alert(_data.msg || '登录失败');
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
        //根据角色跳转对应页面
        $scope.goToMainRole = function (mainRole) {



            if(!mainRole)mainRole='客服';
            if(!$scope.habbit)   $scope.habbit={};
            $scope.habbit.mainRole=mainRole;

            store.set('habbit.mainRole',mainRole);
            switch (mainRole) {
              case '客服':$scope.goTo('#/main.html');break;
              case '销售':$scope.goTo('#/authorIndex/main-salemanager.html');break;
              case '总经理':$scope.goTo('#/authorIndex/main-generalmanager.html');break;
              case '采购':$scope.goTo('#/authorIndex/main-purchasemanager.html');break;
              case '库管':$scope.goTo('#/authorIndex/main-repertorymanager.html');break;
              case '验收':$scope.goTo('#/authorIndex/main-checkmanager.html');break;

              default: $scope.goTo('#/main.html');
            }
          }
          //获取主页角色
          $scope.getMainRole = function () {
              var mainRole=store.get('habbit.mainRole');

              var tmp='';
               if($rootScope.hasAuthor('总经理')){
                tmp='总经理';
                if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('销售单查询')){
                tmp='销售';
                  if(mainRole==tmp)return tmp;
              }
              else if($rootScope.hasAuthor('采购单查询')){
                tmp='采购';
                  if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('出入库单中心')){
                tmp='库管';
                  if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('验单中心')){
                tmp='验收';
                  if(mainRole==tmp)return tmp;
              } else if($rootScope.hasAuthor('购需单查询')){
                tmp='客服';
                  if(mainRole==tmp)return tmp;
              }
            return tmp;
        }




    }//end mainCtrl

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

        // 取消返回
        $scope.cancelThis = function (_text, _mode, _title) {
          dialogConfirm(_text, function () {
            window.history.go(-1);
          }, _mode, _title);
        };

        //..
        $scope.handleThisSubmit = function (_text, _mode, _title, _url) {
          dialogConfirm(_text, function () {
            $scope.pageTo(_url);
          }, _mode, _title, _url);
        };

        // easypiechart 全局样式定义
        $scope.easypiechart_options = {
          animate:{
            duration:1000,
            enabled:true
          },
          barColor: '#f30',
          trackColor: '#ffe8ce',
          scaleColor: false,
          lineWidth: 8,
          lineCap: 'round',
          size: 125
        };
    }

    /**
     *用于编辑
     */
    function editCtrl($scope, modal) {
        modal.closeAll();
    }

    angular.module('manageApp.main')
        .controller('mainCtrl',  ["$scope","$rootScope","$http","store", mainCtrl])
        .controller('sideNav',  ["$scope",sideNav])
        .controller('editCtrl',  ["$scope","modal",editCtrl])
        .controller('pageCtrl',  ["$scope","modal", "dialogConfirm", "$timeout", pageCtrl]);
});
