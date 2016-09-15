/**
 *  注册模块入口文件
 */

angular.module('registrationApp', ['ngRoute'])
/**
 *  路由
 */
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/verify_phone', {
      templateUrl: 'angular/tpl/registration/verify_phone.html',
      controller: 'registrationCtrl'
    })
    .when('/send_info', {
      templateUrl: 'angular/tpl/registration/send_info.html',
      controller: 'registrationCtrl'
    })
    .when('/apply_bind', {
      templateUrl: 'angular/tpl/registration/apply_bind.html',
      controller: 'registrationCtrl'
    })
    .otherwise({redirectTo: '/verify_phone'});
}])


/**
 *  注册模块控制器 - 点击发送验证码
 */
.controller('registrationCtrl', ['$scope', 'requestData', function ($scope, requestData) {
  $scope.regData = {
    phone: ''
  };
  // 发送验证码
  $scope.sendRegVerifyCode = function () {
    if ($scope.regData.phone) {
      var _url = 'http://192.168.0.107:8080/dt/rest/sms/sendVerificationCode',
          _param = {tel : $scope.regData.phone},
          _method = 'POST';
      requestData(_url, _param, _method)
        .then(function (results) {
          console.log(results);
        });
    }
  };
}])
/**
 *  注册模块过滤器
 */
.filter('registrationFilter', [function () {
  // 这里定义多个过滤器
}])
/**
 *  注册模块服务 - 发送数据请求
 */
.service('requestData', ['$q', '$http', '$httpParamSerializer', function ($q, $http, $httpParamSerializer) {
  'use strict';
  return function (_url, _params, method) {
      var defer = $q.defer();
      //GET|POST
      if(!method)method='GET';
      $http({
          method: method,
          url: _url,
          data: _params || {},
          transformRequest: function (data) {
              return $httpParamSerializer(data);
          },
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
 *  注册模块静态值服务
 */
.value('registrationValue', [function () {
  // 这里定义多个静态值
}])
/**
 *  注册模块自定义指令
 */
.directive('registrationDirective', [function () {

}]);
