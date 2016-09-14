/**
 * 项目自定义指令
 */

define('project/directives', ['project/init'], function () {
  angular.module('manageApp.project', [])
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
  .directive('leftMenuCollapse', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $('.menu-list > a').on('click', function () {
          var parent = $(this).parent();
          var sub = parent.find('> ul');

          if(!$('body').hasClass('left-side-collapsed')) {
             if(sub.is(':visible')) {
                sub.slideUp(200, function(){
                   parent.removeClass('nav-active');
                   $('.main-content').css({height: ''});
                   //mainContentHeightAdjust();
                });
             } else {
                visibleSubMenuClose();
                parent.addClass('nav-active');
                sub.slideDown(200, function(){
                    //mainContentHeightAdjust();
                });
             }
          }
          return false;
        });

        $('.menu-list > ul > li > a').on('click', function () {
          $.each($(this).parent().siblings(), function () {
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            }
          });
          $(this).parent().addClass('active');
        });

        function visibleSubMenuClose() {
           $('.menu-list').each(function() {
              var t = $(this);
              if(t.hasClass('nav-active')) {
                 t.find('> ul').slideUp(200, function(){
                    t.removeClass('nav-active');
                 });
              }
           });
        }

        function mainContentHeightAdjust() {
           var docHeight = $(document).height();
           if(docHeight > $('.main-content').height())
              $('.main-content').height(docHeight);
        }

        $('.custom-nav > li').hover(function(){
           $(this).addClass('nav-hover');
        }, function(){
           $(this).removeClass('nav-hover');
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
          Morris.Donut({
            element: 'graph-donut',
            data: [
                {value: 40, label: '最新访问', formatted: 'at least 70%' },
                {value: 30, label: '异常访问', formatted: 'approx. 15%' },
                {value: 20, label: '跳出率', formatted: 'approx. 10%' },
                {value: 10, label: '时间', formatted: 'at most 99.99%' }
            ],
            backgroundColor: false,
            labelColor: '#fff',
            colors: [
                '#4acacb','#6a8bc0','#5ab6df','#fe8676'
            ],
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
   *  flot 线型图
   */
  .directive('flot', function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['flot', 'flot-tooltip', 'flot-resize'], function () {
          var d1 = [
              [0, 501],
              [1, 620],
              [2, 437],
              [3, 361],
              [4, 549],
              [5, 618],
              [6, 570],
              [7, 758],
              [8, 658],
              [9, 538],
              [10, 488]
          ];
          var d2 = [
              [0, 401],
              [1, 520],
              [2, 337],
              [3, 261],
              [4, 449],
              [5, 518],
              [6, 470],
              [7, 658],
              [8, 558],
              [9, 438],
              [10, 388]
          ];
          var data = ([{
              label: "最新访问",
              data: d1,
              lines: {
                  show: true,
                  fill: true,
                  fillColor: {
                      colors: ["rgba(255,255,255,.4)", "rgba(183,236,240,.4)"]
                  }
              }
          },
              {
                  label: "异常访问",
                  data: d2,
                  lines: {
                      show: true,
                      fill: true,
                      fillColor: {
                          colors: ["rgba(255,255,255,.0)", "rgba(253,96,91,.7)"]
                      }
                  }
              }
          ]);
          var options = {
              grid: {
                  backgroundColor:
                  {
                      colors: ["#ffffff", "#f4f4f6"]
                  },
                  hoverable: true,
                  clickable: true,
                  tickColor: "#eeeeee",
                  borderWidth: 1,
                  borderColor: "#eeeeee"
              },
              // Tooltip
              tooltip: true,
              tooltipOpts: {
                  content: "%s X: %x Y: %y",
                  shifts: {
                      x: -60,
                      y: 25
                  },
                  defaultTheme: false
              },
              legend: {
                  labelBoxBorderColor: "#000000",
                  container: $("#main-chart-legend"), //remove to show in the chart
                  noColumns: 0
              },
              series: {
                  stack: true,
                  shadowSize: 0,
                  highlightColor: 'rgba(000,000,000,.2)'
              },
      //        lines: {
      //            show: true,
      //            fill: true
      //
      //        },
              points: {
                  show: true,
                  radius: 3,
                  symbol: "circle"
              },
              colors: ["#5abcdf", "#ff8673"]
          };

          var plot = $.plot($("#main-chart #main-chart-container"), data, options);
        });
      }
    };
  })
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
   *  easyPieChart 饼图
   */
  .directive('easypeichart', [function () {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['easypiechart'], function () {
          $('.chart').easyPieChart({
            // 这里写配置信息
          });
        });
      }
    };
  }]);
});
