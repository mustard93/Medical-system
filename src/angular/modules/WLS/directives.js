/**
 *  物流平台模块自定义指令
 */
define('WLS/directives', ['WLS/init'], function () {



// 点击各种筛选条件，形成下拉或恢复默认筛选。
/**
   ** @Description: demo演示版本，筛选条件点击样式。
  	* @author 宋娟
  	* @date 2017年6月20日 下午4:32:59
   */

   	   //  关键步骤：
   	    //1.统一声明要用到的元素。
        // 2.一一书写各个元素点击后触发的事件，以及样式改动。

  function sortCriteria() {
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

      }
    };
  }

  /**
   *
   */
  function createSortCriteria() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        listParams: '=?'
      },
      replace: true,
      templateUrl: Config.tplPath + 'tpl/project/wlsSortCriteria.html',
      link: function (scope, element, attrs) {
        // 创建条件排序btn对象
        scope.sortConditionList = [];

        // 判断配置属性sortList是否定义，否则抛出异常
        if (!attrs.sortList) { throw new Error('排序组件的配置属性sortList未定义!'); }

        // 获取配置属性列表
        var sortList = JSON.parse(attrs.sortList);

        // ...
        if (angular.isArray(sortList)) {
          angular.forEach(sortList, function (item, index) {
            if (item.clearFields) {
              scope.clearFields = item.clearFields;
            } else {
              scope.sortConditionList.push(item);
            }
          });
        }

        // 默认排序点击事件
        scope.handleDefaultSort = function (conditionList) {
          // console.log($scope.clearFields);
          if (scope.clearFields && angular.isArray(scope.clearFields)) {
            angular.forEach(scope.clearFields, function (data, index) {
              scope.listParams[data] = '';
            });
          }
          // 调用方法，恢复默认设置
          rescoverSet(conditionList);
          $('.select-span').eq(0).addClass('bg-active');
        }

        // 点击按钮显示排序规则列表
        scope.showThisRulesList = function (id) {
          if (id) {
            var _btnDOMObj = $('#'+id).find('span.sort-criteria');
            if ($(_btnDOMObj).is(':visible')) {
              $(_btnDOMObj).hide();
            } else {
              $(_btnDOMObj).show();
             $('.select-span').removeClass('bg-active');
              $('#'+id).siblings().each(function (index,data) {
                $(data).find('span.sort-criteria').hide();
              })
            }
          }
        }
        // 选择相应筛选条件下的排序后，按钮显示内容相应改变
        scope.changeSortName=function(_sortConditionList,_sortName,_rule){
          // 先回复默认设置，再对选择的当前条件做相应的改变
            rescoverSet(_sortConditionList);
            angular.forEach(_sortConditionList, function (item, index) {
              if (cutText(item.sortName)==cutText(_sortName)) {
                $('.select-span').eq(index+1).addClass('bg-active');
                item.sortName=cutText(_sortName)+_rule;
              }
            });
        }


        // 点击排序
        scope.handleSortByThisRule = function (rule,sortName) {
          sortName=cutText(sortName);
          if (sortName == '货主等级') {
            if (rule == '由低到高') {
              scope.listParams.rankSort='顺序';
              scope.listParams.createAtSort='';
              scope.listParams.expectDateSort='';
            } else {
              scope.listParams.rankSort='倒序';
              scope.listParams.createAtSort='';
              scope.listParams.expectDateSort='';
            }
          }
          if (sortName == '创建时间') {
            if (rule == '由近到远') {
              scope.listParams.rankSort='';
              scope.listParams.expectDateSort='';
              scope.listParams.createAtSort='顺序';
            } else {
              scope.listParams.rankSort='';
              scope.listParams.expectDateSort='';
              scope.listParams.createAtSort='倒序';
            }
          }
          if (sortName == '计划到货时间') {
            if (rule == '由近到远') {
              scope.listParams.rankSort='';
              scope.listParams.expectDateSort='顺序';
              scope.listParams.createAtSort='';
            } else {
              scope.listParams.rankSort='';
              scope.listParams.expectDateSort='倒序';
              scope.listParams.createAtSort='';
            }
          }
          
        };

          // 截取按钮主要提示语方法
          function cutText(str){
            if (str.length>7&&str.length<=8) {
              str=str.substring(0,4);
            }else if(str.length>8){
              str=str.substring(0,6);
            }
            return str;
          };
          // 恢复默认样式，所有按钮提示语为最开始的提示语。
          function rescoverSet(conditionList){
            if ($('.select-span').hasClass('bg-active')) {
              $('.select-span').removeClass('bg-active');
            }
            angular.forEach(conditionList, function (item, index) {
                item.sortName=cutText(item.sortName);
            });
          };
      }
    };
  }

  angular.module('manageApp.WLS')
  .directive("sortCriteria", [sortCriteria])
  .directive('createSortCriteria', [createSortCriteria]);
});
