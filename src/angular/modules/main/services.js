/**
 * Created by hao on 15/11/18.
 */
define('main/services', ['main/init'], function () {
    //请求拦截 用于登录超时
    function redirectInterceptor($q, $location) {
        return {
            response: function (response) {
                if (typeof response.data === 'string' && /^<!DOCTYPE html>/.test(response.data)) {
                    window.location.assign(response.config.url);
                    return response;
                } else {
                    return response;
                }
            }
        };
    }
    redirectInterceptor.$inject = ['$q', '$location'];

    //数据请求
    function requestData($q, $http, $httpParamSerializer) {
        return function (_url, _params, method, parameterBody) {
          var defer = $q.defer();
          if (!method) {
            method = 'GET';
          }

          var transformRequest=function (data) {
              return $httpParamSerializer(data);
          };

        if(Config.serverPath){
          if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
            _url=Config.serverPath+_url;
          }
        }

        if(_params&&method == 'GET'){
          _url+=(_url.indexOf("?")==-1?"?":"&")+$httpParamSerializer(_params);

        }
        var config={
            method: method,
            url: _url,
            data: _params || {},
            withCredentials: true,
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type' : 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
          if(!parameterBody){
            config.transformRequest=function (data) {
                    return $httpParamSerializer(data);
                };

                config.headers= {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Content-Type' : 'application/json;charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest'
                };
          }

            $http(config)
                .success(function (_data, status, headers, config) {
                    if (status == 200 && _data.code == 200) {
                        defer.resolve([_data.data, _data]);
                    } else {
                        defer.reject(_data.msg || '出错了');
                    }
                })
                .error(function () {
                    defer.reject("提交失败!");
                });

            return defer.promise;
        };
    }
    requestData.$inject = ['$q', '$http', '$httpParamSerializer'];

    //弹窗确认
    function dialogConfirm($rootScope, modal) {
        return function (_text, _template, _callBack) {
            var _$scope = $rootScope.$new(false),
                _templateUrl = _template === 'pr' ? 'tpl/pr-dialog-confirm.html' : 'tpl/dialog-confirm.html';
            _$scope.confirmText = _text || '确定删除?';
            modal.openConfirm({
                template: Config.tplPath + _templateUrl,
                scope: _$scope
            }).then(_callBack);
        };
    }
    dialogConfirm.$inject = ['$rootScope', 'modal'];

    //弹窗提示
    function dialogAlert($rootScope, modal) {
        return function (_text, _callBack) {
            var _$scope = $rootScope.$new(false);
            _$scope.confirmText = _text || '确定';
            modal.openConfirm({
                template: Config.tplPath+'tpl/dialog-alert.html',
                scope: _$scope
            }).then(_callBack);
        };
    }
    dialogAlert.$inject = ['$rootScope', 'modal'];

    //弹窗提示
    function alertOk($rootScope, modal) {
        return function (_text, _callBack) {
            var _$scope = $rootScope.$new(false);
            _$scope.confirmText = _text || '确定';
            modal.openConfirm({
                template: Config.tplPath+'tpl/dialog-alert.html',
                scope: _$scope
            }).then(_callBack);
        };
    }
    //弹窗提示
    function alertError($rootScope, modal) {
        return function (_text, _callBack) {
            var _$scope = $rootScope.$new(false);
            _$scope.confirmText = _text || '确定';
            modal.openConfirm({
                template: Config.tplPath+'tpl/dialog-alert.html',
                scope: _$scope
            }).then(_callBack);
        };
    }

    //普通弹窗
    function dialog($rootScope, modal) {
        return function (_content, _callBack) {
            var _$scope = $rootScope.$new(false);
            _$scope.content = _content;
            modal.openConfirm({
                template: Config.tplPath+'tpl/dialog-center.html',
                scope: _$scope
            }).then(_callBack);
        };
    }
    dialog.$inject = ['$rootScope', 'modal'];

    //图表弹窗
    function dialogChart($rootScope, modal, $http) {
        return function (_url) {
            var _$scope = $rootScope.$new(false);
            var _params = {};
            var _urlObj = _url.split("?");
            if (_urlObj[1]) {
                angular.forEach(_urlObj[1].split("&"), function (_row) {
                    var _arr = _row.split("=");
                    _params[_arr[0]] = _arr[1];
                });
            }
            _$scope.url = _url;
            _$scope.urlParams = _params;
            modal.open({
                template: Config.tplPath+'tpl/dialog-center.html',
                scope: _$scope
            });
        };
    }
    dialogChart.$inject = ['$rootScope', 'modal', '$http'];



/**
列表数据转换为tree数据
list<Data{id,name,pid}> =>treeNode{id,name,nodes：[]}
*/
      function buildTree(){
         return function (data,pidKey){
           if(!data||data.length==0)return [];
           var pos = {};//Map<id,obj>
           var tree = [];//
           var i = 0;
           if(!pidKey)pidKey="pid";

            //组装map
           for(var i=0;i<data.length;i++){
             var obj=data[i];
              obj.nodes = [];
              pos[obj.id]=obj;

           }

          //设置父子关系
          for(var i=0;i<data.length;i++){
               var obj=data[i];
             if(obj==null)continue;
             if (!obj[pidKey]||obj[pidKey] == "0") {
                 tree.push(obj);
             }else{
                var objParent = pos[obj[pidKey]];
                if(objParent==null)tree.push(obj);   //无效父子关系的放到根节点
                else {
                  objParent.nodes.push(obj);
                }
             }

           }

           return tree;
         }
      }

    angular.module('manageApp.main')
        .factory('redirectInterceptor', redirectInterceptor)
        .service('alertOk', ['$rootScope', 'modal',alertOk])
        .service('alertError', ['$rootScope', 'modal',alertError])
        .service('requestData', requestData)
        .service('dialogConfirm', dialogConfirm)
        .service('dialogAlert', dialogAlert)
        .service('dialog', dialog)
        .service('dialogChart', dialogChart)
        .service('buildTree', buildTree)
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('redirectInterceptor');
        }]);
});
