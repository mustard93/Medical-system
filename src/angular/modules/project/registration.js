/**
 * Created by hao on 15/11/5.
 */

define('project/registration',['angular'], function () {

  /**
   *  注册模块入口文件
   */

  angular.module('manageApp.registration',[])
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
      requestUrlHead: ''
    };

    // 发送验证码
    $scope.sendRegVerifyCode = function () {
      if ($scope.regData.phone) {
        var _url = $scope.mainConfig.serverPath + 'rest/sms/sendVerificationCode.json?tel='+ $scope.regData.phone;
        requestData(_url, {})
          .then(function (results) {
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
    $scope.bind_done = function () {
        window.location.assign('#/bind_done');
    };

    // 注册提交
    $scope.regSubmit = function () {
      if ($scope.regData) {
        var _url = $scope.mainConfig.serverPath + 'rest/index/register',
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
  // /**
  //  *  注册模块服务 - 发送数据请求
  //  */
  .service('registrationService', [function () {

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
            var _validUrl = scope.mainConfig.serverPath + 'rest/index/user/isExist?phone=' + ngModel.$viewValue;

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
  .directive('regCheckVerifyCode', ['requestData', '$rootScope', function (requestData, $rootScope) {
    'use strict';
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        element.on('keyup', function () {
          var _val = ngModel.$viewValue.toString();
          if (_val.length === 4) {
            var _rUrl = scope.mainConfig.serverPath + 'rest/sms/verifySmsCodey.json',
                _params = {
                  tel: scope.regData.phone,
                  code: scope.regData.verifyCode
                };
            requestData(_rUrl, _params, 'POST')
              .then(function (results) {
                if (results[1].code === 200) {
                  $rootScope.verifyResult.verifyCode = true;
                  $rootScope.verifyResult.phone = true;
                  if ($('.reg-info-prompt').css('display') !== 'none') {
                    $('.reg-info-prompt').fadeOut(200);
                  }
                }
              })
              .catch(function (msg) {
                $rootScope.verifyResult.verifyCode = false;
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
  }]);
});
