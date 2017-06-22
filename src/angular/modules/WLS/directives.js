/**
 *  物流平台模块自定义指令
 */
define('WLS/directives', ['WLS/init'], function () {



// 点击各种筛选条件，形成下拉或恢复默认筛选。
/**
   *
  	* @Description: demo演示版本，筛选条件点击样式。
  	* @author 宋娟
  	* @date 2017年6月20日 下午4:32:59
   */

   	   //  关键步骤：
   	    //1.统一声明要用到的元素。
        // 2.一一书写各个元素点击后触发的事件，以及样式改动。

  function sortCriteria () {
    'use strict';
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        // 默认排序按钮
        var _defaultSort=element.children('span:first-child');

        // 每个筛选条件的按钮
        var _sortButton=element.children('span:not(span:first-child)');

        // 每个排序条件下的弹出层中的项
        var _sortCriteria=element.find('.sort-criteria em');

        // 点击默认按钮后，把所有筛选条件改成默认样式
        _defaultSort.on('click', function (e) {
          e.stopPropagation();
              $(this).addClass('bg-active');
            // 把默认的按钮样式和下拉框样式恢复到初始样式
              $('.sort-criteria').removeClass('sort-active');
              _sortButton.removeClass('bg-active');
              _sortCriteria.removeClass('active');

              // // 把按钮上显示的内容还原到最初的内容
              rescoverSet(this);
        });

        // 点击单个按钮后，展开或收起下拉条件
        _sortButton.on('click', function (e) {
          e.stopPropagation();
          // 判断事前是否选过，如果选过，那样式恢复到未选择之前。
          if ($(this).hasClass('bg-active')) {
              $(this).removeClass('bg-active');
          }
          if ($(this).children('span').hasClass('sort-active')) {
            $('.sort-criteria').removeClass('sort-active');
          }else {
          $('.sort-criteria').removeClass('sort-active');
          $(this).children('span').addClass('sort-active');
          }
        });

        //选中每一个条件的具体排序方式之后
        _sortCriteria.on('click',function(e){
          e.stopPropagation();

          // 先获取每个点击之后的内容。用于之后进行判断是什么筛选类型
          var name=$(this).parent().parent().children('em').text();
          if (cutText(name)=="货主等级") {
            scope.listParams.createAtSort='';
            scope.listParams.expectDateSort='';
            if ($(this).text()=="由低到高") {
              scope.listParams.rankSort='顺序';
            }else {
              scope.listParams.rankSort='倒序';
            }

          }else if (cutText(name)=="创建时间") {

            scope.listParams.rankSort='';
            scope.listParams.expectDateSort='';
            if ($(this).text()=="由近到远") {
              scope.listParams.createAtSort='顺序';
            }else {
              scope.listParams.createAtSort='倒序';
            }

          }else if (cutText(name)=="计划到货时间") {
            scope.listParams.rankSort='';
            scope.listParams.createAtSort='';
            if ($(this).text()=="由近到远") {
              scope.listParams.expectDateSort='顺序';
            }else {
              scope.listParams.expectDateSort='倒序';
            }
          }

          // 先把其他选项恢复到初始状态
          _defaultSort.removeClass('bg-active');
          _sortButton.removeClass('bg-active');
          rescoverSet(_defaultSort);

          // 先把选中的项样式改变
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          }else {
            $('.sort-criteria').children('em').removeClass('active');
            $(this).addClass('active');
          }

          // 改变按钮显示内容
          $(this).parent().parent().children('em').text(cutText(name)+$(this).text());
          // 最后收起下拉框
          $('.sort-criteria').removeClass('sort-active');
          $(this).parent().parent().addClass('bg-active');
        });

        // 截取按钮主要提示语方法
        function cutText(str){
          if (str.length>7&&str.length<=8) {
            str=str.substring(0,4);
          }else if(str.length>8){
            str=str.substring(0,6);
          }
          return str;
        };
        // 恢复默认样式，所有下拉框为收起，所有按钮提示语为最开始的提示语。
        function rescoverSet(_default){
          var emArr=_sortButton.children('em');
          for (var i = 0; i < emArr.length; i++) {
            $(_default).parent().children('span:nth-child('+(i+2)+')').children('em').text(cutText(emArr[i].innerText));
          }
        };

      }
    };
  }

  angular.module('manageApp.WLS')

  .directive("sortCriteria", [sortCriteria]);
});
