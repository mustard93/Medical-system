/**
 *  注册模块入口文件
 */

angular.module('registrationApp', ['ngRoute'])
/**
 *  路由
 */
.config(['$routeProvider', function ($routeProvider) {
  'use strict';
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
    .when('/bind_done', {
      templateUrl: 'angular/tpl/registration/bind_done.html',
      controller: 'registrationCtrl'
    })
    .otherwise({redirectTo: '/verify_phone'});
}])

/**
 *  注册模块控制器 - 点击发送验证码
 */
.controller('registrationCtrl', ['$scope', 'requestData', function ($scope, requestData) {
  'use strict';
  // 定义全局对象
  $scope.globalData = {
    requestUrlHead: 'http://192.168.0.107:8080/dt/'
  };

  // 发送验证码
  $scope.sendRegVerifyCode = function () {
    if ($scope.regData.phone) {
      var _url = $scope.globalData.requestUrlHead + 'rest/sms/sendVerificationCode.json?tel='+ $scope.regData.phone;
      var _param = {tel : $scope.regData.phone};
      requestData(_url, _param)
        .then(function (results) {
          console.log(results);
          var _data = results[0];
          $scope.validCode = _data.code;
        }).catch(function (msg) {
          $scope.verifyResult.phone = false;
          $scope.verifyResult.msg = msg;
          if ($('.reg-info-prompt').css('display') !== 'none') {
            $scope.verifyResult.msg = msg;
          } else {
            $('.reg-info-prompt').fadeIn(500);

          }
        });
    }
  };

  // 注册提交
  $scope.regSubmit = function () {
    if ($scope.regData) {
      var _url = $scope.globalData.requestUrlHead + 'rest/index/register',
          _params = $scope.regData,
          _method = 'POST';
      requestData(_url, _params, _method)
        .then(function (results) {
          var _data = results[1];
          if (_data.code === 200) {
            $('.reg-success-prompt').fadeIn(500);
            setTimeout(function(){
              window.location.href = '#/apply_bind';
            }, 1500);
          }
        }).catch(function (msg) {
          $scope.verifyResult.phone = false;
          $scope.verifyResult.msg = msg;
          if ($('.reg-info-prompt').css('display') !== 'none') {
            $scope.verifyResult.msg = msg;
          } else {
            $('.reg-info-prompt').fadeIn(500);

          }
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

      return function (_url, _params, method, parameterBody) {
        var defer = $q.defer();
        if (!method) {
          method = 'GET';
        }

        var transformRequest=function (data) {
            return $httpParamSerializer(data);
        };

      if(window.Config&&Config.serverPath){
        if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
          _url=Config.serverPath+_url;
        }
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


}])
/**
 *  注册模块静态值服务
 */
.value('registrationValue', [function () {
  // 这里定义多个静态值
}])
/**
 *  注册模块自定义指令 - 检查用户输入的手机号码
 */
.directive('regCheckPhone', ['$rootScope', 'requestData', function ($rootScope, requestData) {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      if (!$rootScope.verifyResult) {
        $rootScope.verifyResult = {};
      }
      // 绑定失去焦点事件
      element.on('blur', function () {
        // 格式校验
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(ngModel.$viewValue))) {
          $rootScope.verifyResult.phone = false;
          $rootScope.verifyResult.msg = '手机号码不能为空或格式不正确';
          if ($('.reg-info-prompt').css('display') === 'none') {
            $('.reg-info-prompt').fadeIn(500);
            $(element).focus();
          }
        } else {
          // 有效性校验
          var _validUrl = scope.globalData.requestUrlHead + 'rest/index/user/isExist?phone=' + ngModel.$viewValue;

          requestData(_validUrl, {}, 'GET')
            .then(function (results) {
              if (results[1].code === 200) {
                $rootScope.verifyResult.phone = true;
                $rootScope.verifyResult.phoneNumber = ngModel.$viewValue;
                if ($('.reg-info-prompt').css('display') !== 'none') {
                  $('.reg-info-prompt').fadeOut(200);
                }
              }
            })
            .catch(function (msg) {
              $rootScope.verifyResult.phone = false;
              $rootScope.verifyResult.msg = msg;
              if ($('.reg-info-prompt').css('display') !== 'none') {
                $rootScope.verifyResult.msg = msg;
              } else {
                $('.reg-info-prompt').fadeIn(500);
                $(element).focus();
              }
            });
        }
      });
    }
  };
}])
/**
 *  校验验证码
 */
.directive('regCheckVerifyCode', [function () {
  'use strict';
  return {};
}])
/**
 *  校验密码
 */
.directive('regCheckPassword', ['$rootScope', function ($rootScope) {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      // console.log($rootScope.verifyResult.msg);
      if (!$rootScope.verifyResult) {
        $rootScope.verifyResult = {};
      }
      element.on('blur', function () {
        if (attrs.name === 'password') {    // 校验密码
          if (!(/[A-Za-z0-9_]{6,32}/.test(ngModel.$viewValue))) {
            $rootScope.verifyResult.password = false;
            $rootScope.verifyResult.msg = '密码应在6~32位之间或含有特殊字符';
            if ($('.reg-info-prompt').css('display') === 'none') {
              $('.reg-info-prompt').fadeIn(500);
              $(element).focus();
            }
          } else {
            if ($('.reg-info-prompt').css('display') !== 'none') {
              $('.reg-info-prompt').fadeOut(200);
            }
            $rootScope.verifyResult.password = true;
          }
        }

        if (attrs.name === 'repassword') {    // 校验重复密码
          if (scope.regData.password !== scope.regData.repassword) {
            $rootScope.verifyResult.repassword = false;
            $rootScope.verifyResult.msg = '两次输入的密码不一致';
            if ($('.reg-info-prompt').css('display') === 'none') {
              $('.reg-info-prompt').fadeIn(500);
            }
          } else {
            if ($('.reg-info-prompt').css('display') !== 'none') {
              $('.reg-info-prompt').fadeOut(200);
            }
            $rootScope.verifyResult.repassword = true;
          }
        }
      });
    }
  };
}])
/**
 *  查询经销商
 */
.directive('queryDistributorList', ['requestData', function (requestData) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var _queryUrl = scope.globalData.requestUrlHead + 'rest/index/distributor/queryForSelectOption';
      requestData(_queryUrl, {q: ''}, 'GET')
        .then(function (results) {
          if (results[1].code === 200) {
            scope.distributorList = results[1].data;
          }
        })
        .catch(function (msg) {
          //console.log(msg);
        });
    }
  };
}])
/**
 *  级联下拉
 */
.directive('relativeSelect', ['requestData', '$timeout', function (requestData, $timeout) {
  return {
      restrict: 'A',
      scope: {},
      require: "?^ngModel",
      link: function ($scope, $element, $attrs, ngModel) {
          var _relativeTo = $attrs.relativeTo;
          var _relativeSelect = $attrs.relativeSelect;
          var isSelectFirst = angular.isDefined($attrs.selectFirst);
          var relativeInitload = angular.isDefined($attrs.relativeInitload);

          $element.on("change", changeHandle);

          $element.on("update", function (e, _data) {
              getData(_data);
          });

          function changeHandle() {
              var _data = {};
              _data[$element[0].name] = $element.val();
              $(_relativeTo).trigger("update", _data);
          }

          function getData(_data) {
              requestData(_relativeSelect, _data)
                  .then(function (results) {
                      var data = results[0];
                      var _options = isSelectFirst ? '' : '<option value="">请选择</option>';
                          if(!data)data=[];
                      var _length = data.length;
                      var _value = "";
                      for (var i = 0; i < _length; i++) {
                          if (data[i].selected || (isSelectFirst && i === 0)) {
                              _value = data[i].value;
                          }
                          _options += '<option ' + (data[i].enabled === 0 ? ' class="text-muted"' : '') + ' value="' + data[i].value + '">' + data[i].text + '</option>';
                      }
                      $element.html(_options);
                      //$element.trigger("change");
                      $element.val(_value);
                      if (ngModel) {
                        ngModel.$setViewValue(_value);
                      }
                      changeHandle();
                  });
          }

          if (relativeInitload) {
              $timeout(changeHandle);
          }
      }
  };
}]);
