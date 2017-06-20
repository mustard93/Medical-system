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
          $('.sort-criteria').css('display','block');
          console.log('HH1');
          // $(this).addClass('rect-status-active').siblings().each(function () {
          //   $(this).removeClass('rect-status-active');
          // });
        });
      }
    };
  }

  angular.module('manageApp.WLS')

  .directive("sortCriteria", [sortCriteria]);
});
