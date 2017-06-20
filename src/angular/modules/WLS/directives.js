/**
 *  物流平台模块自定义指令
 */
define('WLS/directives', ['WLS/init'], function () {

  function sortCriteria () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

        element.on('click', function () {
          if ($(this).children('span').hasClass('sort-active')) {
            $(this).children('span').removeClass('sort-active');
          }else {
          $(this).children('span').addClass('sort-active');
          }
        });
      }
    };
  }

  angular.module('manageApp.WLS')

  .directive("sortCriteria", [sortCriteria]);
});
