/**
 * 项目自定义指令
 */

define('project/directives', ['project/init'], function () {
  angular.module('manageApp.project')
  /**
   * [滚动条美化]
   */
  .directive('niceScroll', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['nicescroll'], function () {
          // 主页面右侧滚动条
          $('html').niceScroll({styler:"fb", cursorcolor:"#65cea7", cursorwidth: '6', cursorborderradius: '0px',
            background: '#424f63', spacebarenabled:false, cursorborder: '0', zindex: '1000'
          });
          // 侧边栏滚动条
          $("#page-side").niceScroll({styler:"fb", cursorcolor:"#65cea7", cursorwidth: '3', cursorborderradius: '0px',
            background: '#424f63', spacebarenabled:false, cursorborder: '0'
          });
          // 如果侧边栏被收起
          $("#page-side").getNiceScroll();
          if ($('body').hasClass('left-side-collapsed')) {
              $("#page-side").getNiceScroll().hide();
          }
        });
      }
    };
  }])
  /**
   * [左边栏子菜单点击事件]
   */
  .directive('leftMenuChange', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).addClass('active').parent().siblings().each(function () {
            $(this).children().removeClass('active');
          });
        });
      }
    };
  }])
  /**
   * 订单列表首页订单状态按钮切换样式
   */
  .directive('orderStatusChoise', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).addClass('pr-btn-bg-gold').siblings().each(function () {
            $(this).removeClass('pr-btn-bg-gold');
          });
          $(this).parent().siblings().each(function () {
            $(this).children().each(function () {
              $(this).removeClass('pr-btn-bg-gold');
            });
          });
        });
      }
    };
  }])
  /**
   *  订单页头导航按钮点击事件处理
   */
  .directive('orderListTips', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).hide();
          $(this).siblings().show().on('click',function () {
            $(this).hide();
            $(element).show();
          });
        });
      }
    };
  }])
  /**
   * [点击展开隐藏左边栏]
   */
  .directive('toggleLeftMenu', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $('.toggle-btn').on('click', function () {
          $(".left-side").getNiceScroll().hide();

          if ($('body').hasClass('left-side-collapsed')) {
              $(".left-side").getNiceScroll().hide();
          }

          var body = $('body');
          var bodyposition = body.css('position');

          if (bodyposition != 'relative') {
            if (!body.hasClass('left-side-collapsed')) {
               body.addClass('left-side-collapsed');
               $('.custom-nav ul').attr('style','');
               $(this).addClass('menu-collapsed');
            } else {
               body.removeClass('left-side-collapsed chat-view');
               $('.custom-nav li.active ul').css({display: 'block'});
               $(this).removeClass('menu-collapsed');
            }
          } else {
            if (body.hasClass('left-side-show')) {
              body.removeClass('left-side-show');
            } else {
              body.addClass('left-side-show');
              mainContentHeightAdjust();
            }
          }
        });
      }
    };
  }])
  /**
   * [面板点击收起、展开与关闭]
   */
  .directive('togglePanel', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $('.panel .tools .fa').on('click', function () {
          if (!$(this).hasClass('fa-times')) {    //展开与收起
            var el = $(this).parents(".panel").children(".panel-body");
            if ($(this).hasClass("fa-chevron-down")) {
              $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
              el.slideUp(200);
            } else {
              $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
              el.slideDown(200);
            }
          } else {                                //关闭
            $(this).parents(".panel").parent().remove();
          }
        });
      }
    };
  }])
  /**
   *  morris图表展示
   */
  .directive('morris', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['morris'], function () {
          //定义参数
          var _id = attrs.id;
          //构建data参数
          var _data = [];
          if (angular.isDefined(attrs.datavalue) && angular.isDefined(attrs.datalabel) && angular.isDefined(attrs.dataformatted)) {
            var _tempObj = {}, i = 0;
            var _value = attrs.datavalue.split(','),
                _label = attrs.datalabel.split(','),
                _formatted = attrs.dataformatted.split(',');
            while (i < _value.length) {
              _tempObj.value = _value[i];
              _tempObj.label = _label[i];
              _tempObj.formatted = _formatted[i];
              _data.push(_tempObj);
              _tempObj = {};
              i++;
            }
          }
          //构建backgroundColor参数,布尔值
          var _backgroundColor = angular.isDefined(attrs.backgroundColor) ? attrs.backgroundColor : false;
          //构建labelColor参数，字符串十六进制
          var _labelColor = angular.isDefined(attrs.labelColor) ? attrs.labelColor : '#666';
          //构建区块颜色参数，数组
          var _colors = angular.isDefined(attrs.colors) ? attrs.colors.split(',') : ['#ff5f39','#fe9302','#e39a27'];

          //初始化
          Morris.Donut({
            element: _id,
            data: _data,
            backgroundColor: _backgroundColor,
            labelColor: _labelColor,
            colors: _colors,
            formatter: function (x, data) { return data.formatted; }
          });
        });
      }
    };
  }])
  /**
   *  iCheck
   */
  .directive('icheck', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['icheck'], function () {
          // 获取元素样式字符
          var _currenStyleStr = attrs.class,
              i = 0,
              _styleNameArr = ['minimal',
                               'minimal-red',
                               'minimal-green',
                               'minimal-blue',
                               'minimal-yellow',
                               'minimal-purple',
                               'square',
                               'square-red',
                               'square-green',
                               'square-blue',
                               'square-yellow',
                               'square-purple',
                               'flat-red',
                               'flat-grey',
                               'flat-green',
                               'flat-blue',
                               'flat-yellow',
                               'flat-purple'],
              _len = _styleNameArr.length;

          for (i; i < _len; i++) {
            if (_currenStyleStr.split(' ')[0] === _styleNameArr[i]) {
              run_iCheck(_styleNameArr[i]);
              break;
            }
          }

          function run_iCheck (cName) {
            switch (cName) {
              case 'minimal': $('.minimal input').iCheck({checkboxClass: 'icheckbox_minimal', radioClass: 'iradio_minimal', increaseArea: '20%'}); break;
              case 'minimal-red': $('.minimal-red input').iCheck({checkboxClass: 'icheckbox_minimal-red', radioClass: 'iradio_minimal-red', increaseArea: '20%'}); break;
              case 'minimal-green': $('.minimal-green input').iCheck({checkboxClass: 'icheckbox_minimal-green', radioClass: 'iradio_minimal-green', increaseArea: '20%'}); break;
              case 'minimal-blue': $('.minimal-blue input').iCheck({checkboxClass: 'icheckbox_minimal-blue', radioClass: 'iradio_minimal-blue', increaseArea: '20%'}); break;
              case 'minimal-yellow': $('.minimal-yellow input').iCheck({checkboxClass: 'icheckbox_minimal-yellow', radioClass: 'iradio_minimal-yellow', increaseArea: '20%'}); break;
              case 'minimal-purple': $('.minimal-purple input').iCheck({checkboxClass: 'icheckbox_minimal-purple', radioClass: 'iradio_minimal-purple', increaseArea: '20%'}); break;
              case 'square': $('.square input').iCheck({checkboxClass: 'icheckbox_square', radioClass: 'iradio_square', increaseArea: '20%'}); break;
              case 'square-red': $('.square-red input').iCheck({checkboxClass: 'icheckbox_square-red', radioClass: 'iradio_square-red', increaseArea: '20%'}); break;
              case 'square-green': $('.square-green input').iCheck({checkboxClass: 'icheckbox_square-green', radioClass: 'iradio_square-green', increaseArea: '20%'}); break;
              case 'square-blue': $('.square-blue input').iCheck({checkboxClass: 'icheckbox_square-blue', radioClass: 'iradio_square-blue', increaseArea: '20%'}); break;
              case 'square-yellow': $('.square-yellow input').iCheck({checkboxClass: 'icheckbox_square-yellow', radioClass: 'iradio_square-yellow', increaseArea: '20%'}); break;
              case 'square-purple': $('.square-purple input').iCheck({checkboxClass: 'icheckbox_square-purple', radioClass: 'iradio_square-purple', increaseArea: '20%'}); break;
              case 'flat-red': $('.flat-red input').iCheck({checkboxClass: 'icheckbox_flat-red', radioClass: 'iradio_flat-red'}); break;
              case 'flat-grey': $('.flat-grey input').iCheck({checkboxClass: 'icheckbox_flat-grey', radioClass: 'iradio_flat-grey'}); break;
              case 'flat-green': $('.flat-green input').iCheck({checkboxClass: 'icheckbox_flat-green', radioClass: 'iradio_flat-green'}); break;
              case 'flat-blue': $('.flat-blue input').iCheck({checkboxClass: 'icheckbox_flat-blue', radioClass: 'iradio_flat-blue'}); break;
              case 'flat-yellow': $('.flat-yellow input').iCheck({checkboxClass: 'icheckbox_flat-yellow', radioClass: 'iradio_flat-yellow'}); break;
              case 'flat-purple': $('.flat-purple input').iCheck({checkboxClass: 'icheckbox_flat-purple', radioClass: 'iradio_flat-purple'}); break;
            }
          }
        });
      }
    };
  }])
  /**
   *  sparkline 柱状图
   */
  .directive('sparkline', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['sparkline'], function () {
          $(".sparkline").each(function(){
              var $data = $(this).data();

              $data.valueSpots = {'0:': $data.spotColor};

              $(this).sparkline( $data.data || "html", $data,
                  {
                      tooltipFormat: '<span style="display:block; padding:0px 10px 12px 0px;">' +
                          '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{percent.1}}%)</span>'
                  });
          });
          $("#income").sparkline([5,6,7,5,9,6,4,9,8,5,6,7], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#fc8675'
          });

          $("#expense").sparkline([3,2,5,8,4,7,5,8,4,6], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#65cea7'
          });


          $("#expense2").sparkline([3,2,5,8,4,7,5,8,4,6], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#65cea7'
          });

          $("#pro-refund").sparkline([3,2,5,8,4,7,5,8,4,6], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#ffffff'
          });

          $("#p-lead-1").sparkline([7,5,9,6,4,9,8,5,6,7], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#65cea7'
          });

          $("#p-lead-2").sparkline([3,2,5,8,4,7,5,8,4,6], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#fc8675'
          });

          $("#p-lead-3").sparkline([3,2,5,8,4,7,5,8,4,6], {
              type: 'bar',
              height: '35',
              barWidth: 5,
              barSpacing: 2,
              barColor: '#5ab5de'
          });


          $("#visit-1").sparkline([5,6,7,9,9,5,3,2,4,6,7,5,6,8,7,9,5 ], {
              type: 'line',
              width: '100',
              height: '25',
              lineColor: '#55accc',
              fillColor: '#edf7f9'
          });

          $("#visit-2").sparkline([5,6,7,7,9,5,8,5,4,6,7,8,6,8,7,9,5 ], {
              type: 'line',
              width: '100',
              height: '25',
              lineColor: '#55accc',
              fillColor: '#edf7f9'
          });
        });
      }
    };
  }])
  /**
   *  tooltips
   */
  .directive('runTooltips', [function () {
    'use strcit';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          $("[data-toggle='tooltip']").tooltip();
      }
    };
  }])
  /**
   *	popover
   */
  .directive('runPopovers', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (element.hasClass('popovers')) {
          $(element).popover({});
        }
      }
    };
  }])
  /**
   *	按钮点击发送ajax
   */
  .directive('clickSendRequest', ['requestData', 'alertOk', 'alertError', function (requestData, alertOk, alertError) {
    'use strict';
    return {
      restrict: 'A',
      // require: 'ngModel',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          if (Config.serverPath) {
            if (attrs.clickSendRequest) {
              var _rUrl = Config.serverPath + attrs.clickSendRequest;
              requestData(_rUrl, scope.formData, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  if (_data.code === 200) {
                    alertOk('操作成功');

                    if (attrs.callBack) {
                      scope.$eval(attrs.callBack);
                    }

                  } else {
                    alertError('Error');
                  }
                });
            } else {
              throw('Request Url Error!');
            }
          } else {
            throw('Server Path Info Error!');
          }
        });
      }
    };
  }])
  /**
   * 带确认对话框的按钮点击事件
   */
  .directive('handleThisClick', ['$window', 'dialogConfirm', 'requestData', 'alertOk', 'alertError', function ($window, dialogConfirm, requestData, alertOk, alertError) {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          //对话框标题
          var _dialogTitle = angular.isDefined(attrs.dialogTitle) ? attrs.dialogTitle : '询问对话框';
          //对话框内容
          var _dialogContent = angular.isDefined(attrs.dialogContent) ? attrs.dialogContent : '';
          //对话框引用的模板
          var _dialogTemplate = angular.isDefined(attrs.dialogTemplate) ? attrs.dialogTemplate : 'tpl/dialog-confirm.html';
          //如果需要跳转地址
          var _jumpUrl = angular.isDefined(attrs.jumpUrl) ? attrs.jumpUrl : '';
          //如果发送请求的地址
          var _requestUrl = angular.isDefined(attrs.requestUrl) ? attrs.requestUrl : '';

          dialogConfirm(_dialogContent, function () {
            //如果操作为点击后回退
            if (!angular.isDefined(attrs.jumpUrl) && !angular.isDefined(attrs.requestUrl)) {
              $window.history.go(-1);
            }
            //如果操作为点击后跳转地址
            if (angular.isDefined(attrs.jumpUrl)) {
              $window.location.assign(_jumpUrl);
            }
            //如果操作为点击后发送请求
            if (angular.isDefined(attrs.requestUrl)) {
              requestData(_requestUrl, {}, 'POST')
                .then(function (results) {
                  var _data = results[1];
                  if (_data.code === 200) {
                    alertOk(_data.message || '操作成功');
                  }
                  //执行回调
                  if (attrs.callBack) {
                    scope.$eval(attrs.callBack);
                  }
                })
                .catch(function (error) {
                  alertError(error || '出错');
                });
            }
          }, _dialogTemplate, _dialogTitle, _jumpUrl);
        });
      }
    };
  }]);
});
