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
          var parent = jQuery(this).parent();
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

        searchform_reposition();

        $(window).resize(function(){
           if($('body').css('position') == 'relative') {
              $('body').removeClass('left-side-collapsed');
           } else {
              $('body').css({left: '', marginRight: ''});
           }
           searchform_reposition();
        });

        function searchform_reposition() {
           if($('.searchform').css('position') == 'relative') {
              $('.searchform').insertBefore('.left-side-inner .logged-user');
           } else {
              $('.searchform').insertBefore('.menu-right');
           }
        }
      }
    };
  }])
  /**
   * [面板点击收起、展开与关闭]
   */
  .directive('togglePanel', function () {
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
  });
});
