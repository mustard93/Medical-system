/**
 * 主模块main Serviece服务
 */

define('main/servieces', ['main/init'], function () {
  angular.module('manageApp/main', [])
  /**
   *
   */
  .config('$httpProvider', ['$httpProvider', function ($httpProvider) {
    'use strict';
    $httpProvider.interceptors.push('redirectInterceptor');
  }])
  /**
   * 请求拦截 用于登录超时
   */
  .factory('redirectInterceptor', ['$q', '$location', function ($q, $location) {
    'use strict';
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
  }])
  /**
   * 弹窗提示
   */
  .service('alertOk', ['$rootScope', 'modal', function ($rootScope, modal) {
    'use strict';
    return function (_text, _callBack) {
        var _$scope = $rootScope.$new(false);
        _$scope.confirmText = _text || '确定';
        modal.openConfirm({
            template: Config.tplPath+'tpl/dialog-alert.html',
            scope: _$scope
        }).then(_callBack);
    };
  }])
  /**
   * 错误提示
   */
  .service('alertError', ['$rootScope', 'modal', function ($rootScope, modal) {
    'use strict';
    return function (_text, _callBack) {
        var _$scope = $rootScope.$new(false);
        _$scope.confirmText = _text || '确定';
        modal.openConfirm({
            template: Config.tplPath+'tpl/dialog-alert.html',
            scope: _$scope
        }).then(_callBack);
    };
  }])
  /**
   * 数据请求
   */
  .service('requestData', [function () {
    'use strict';
    return function (_url, _params,method,parameterBody) {
        var defer = $q.defer();
        //GET|POST
        if(!method)method='GET';

        var transformRequest=function (data) {
            return $httpParamSerializer(data);
        };


        if(parameterBody){
          transformRequest=function (data) {
              return data;
          };
        }

        $http({
            method: method,
            url: _url,
            data: _params || {},
            transformRequest: transformRequest,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
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
  }])
  /**
   * 弹窗确认
   */
  .service('dialogConfirm', [function () {
    'use strict';
    return function (_text, _callBack) {
        var _$scope = $rootScope.$new(false);
        _$scope.confirmText = _text || '确定删除?';
        modal.openConfirm({
            template: Config.tplPath+'tpl/dialog-confirm.html',
            scope: _$scope
        }).then(_callBack);
    };
  }])
  /**
   * 弹窗确认
   */
  .service('dialogAlert', [function () {
    'use strict';
    return function (_text, _callBack) {
        var _$scope = $rootScope.$new(false);
        _$scope.confirmText = _text || '确定';
        modal.openConfirm({
            template: Config.tplPath+'tpl/dialog-alert.html',
            scope: _$scope
        }).then(_callBack);
    };
  }])
  /**
   * 普通弹窗
   */
  .service('dialog', [function () {
    'use strict';
    return function (_content, _callBack) {
        var _$scope = $rootScope.$new(false);
        _$scope.content = _content;
        modal.openConfirm({
            template: Config.tplPath+'tpl/dialog-center.html',
            scope: _$scope
        }).then(_callBack);
    };
  }])
  /**
   * 图表弹窗
   */
  .service('dialogChart', [function () {
    'use strict';
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
  }]);
});
