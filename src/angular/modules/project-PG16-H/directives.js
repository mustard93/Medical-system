/**
 * 项目自定义指令
 */
define('project-PG16-H/directives', ['project-PG16-H/init'], function () {

  function statusStyleToggle () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).addClass('rect-status-active').siblings().each(function () {
            $(this).removeClass('rect-status-active');
          });
        });
      }
    };
  }
  function statusStyleToggleNew () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).addClass('rect-status-active-new').siblings().each(function () {
            $(this).removeClass('rect-status-active-new');
          });
        });
      }
    };
  }

  // 点击切换图标。新建图标变为编辑图标

  function changeImg () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          $(this).removeClass('addImg');
          $(this).addClass('editImg').siblings().each(function () {
          });
        });
      }
    };
  }

  // 库存查询模块点击切换选择条件

  function clickLiSelect () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.children('li').children('div').on('click', function () {
          element.children('li').children('div').removeClass('active');
          $(this).addClass('active');
        });
      }
    };
  }

  angular.module('manageApp.project-PG16-H')
    .directive("clickLiSelect", [clickLiSelect])
    .directive("statusStyleToggle", [statusStyleToggle])
    .directive("changeImg", [changeImg])
    .directive("statusStyleToggleNew", [statusStyleToggleNew]);
});
