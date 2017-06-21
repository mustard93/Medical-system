/**
 *  物流平台模块自定义指令
 */
define('WLS/directives', ['WLS/init'], function () {

  function sortCriteria () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

        element.off("click").on('click', function () {
          if ($(this).children('span').hasClass('sort-active')) {
              $('.sort-criteria').removeClass('sort-active');
          }else {
          $('.sort-criteria').removeClass('sort-active');
          $(this).children('span').addClass('sort-active');
          }
        });

        $('.sort-criteria').children('em').off("click").on('click',function(e){
          e.stopPropagation();
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          }else {
            $('.sort-criteria').children('em').removeClass('active');
            $(this).addClass('active');
          }
        })
      }
    };
  }

  angular.module('manageApp.WLS')

  .directive("sortCriteria", [sortCriteria]);
});
