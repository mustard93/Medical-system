/**
 * 项目自定义指令
 */
define('project-PG16-H/directives', ['project-PG16-H/init'], function () {

  /**
   * [tableItemMultipleBtn 医院信息管理表格多个操作按钮菜单]
   * @param  {[type]} utils [description]
   * @return {[type]}       [description]
   */
  function tableItemMultipleBtn (utils, requestData) {
    'use strict';
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {

        // 操作按钮组
        var _handleBtnGroup = $(element).find('div.table-item-multiple-btn');
        // 删除按钮
        var _delBtn = $(element).find('div.del-details-btn');
        // 其他操作按钮
        var _handleBtn = $(element).find('div.other-handle-btn');
        // 取消删除按钮
        var _cancelDel=$(element).find('.hide-this-area');



        // 绑定点击显示操作删除层
        _delBtn.on('click', function () {
          $('.del-confirm-area').show();
          });

        // 绑定点击显示其他操作层
        _handleBtn.on('click', function () {
          $('.handle-area-show').show();
        });

        // 绑定取消按钮事件
        $(element).find('.hide-this-area').on('click', function (e) {
          e.stopPropagation();
          $(element).find('div.del-confirm-area').hide();
        });

        element.hover(function () {
          // 计算当前tr距离顶部的高度
          var _offsetTop = $(element).offset().top - document.body.scrollTop + 23;
          // 计算当前页面宽度
          var _pageWidth = utils.getMainBodyWidth() - 23;

          _handleBtnGroup.css({'position':'fixed','top':_offsetTop,'left':_pageWidth}).show();

        }, function () {
          _handleBtnGroup.css({'position':'absolute','top':0,'left':0}).hide();
          $('.del-confirm-area').hide();
          $('.handle-area-show').hide();
        });

        // 执行删除操作
        scope.handleDelDetails = function (id, requestUrl, callbackUrl) {
          if (id && requestUrl && callbackUrl) {
            var _url = requestUrl + '?id=' + id;
            requestData(_url, {}, 'POST')
            .then(function (results) {
              if (results[1].code == 200) {
                utils.goTo(callbackUrl);
              }
            })
            .catch(function (error) {
              if (error) { throw new Error(error); }
            });
          }
        };
      }
    };
  }

  /**
   * [tableItemHandlebtnComponent 自定义表格内条目删除按钮]
   * @param  {[type]} utils [注入utils服务]
   * @return {[type]}       [无返回]
   * @template: {请在表格内任意td内写如下列模板代码}
   * <div class="table-item-handle-btn">
       <div class="table-item-confirm-del-area bg-white">
         <p class="bb-line color-red pd-v">确认删除本条数据?</p>
         <p class="pdt">
           <a href="javascript:;" class="cancelHandle" ng-click="cancelHandle()">取消</a>
           <a href="javascript:;" class="confirm-del-this btn btn-primary pr-btn-xsm pr-btn-bg-gold mgl" ng-click="formData.orderMedicalNos.splice($index,1);">确认</a>
         </p>
       </div>
     </div>
   * @modified {2017.2.14 by LiuZhen}
   */
  function tableItemHandlebtnComponent (utils) {
    'use strict';
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {

        // 操作删除按钮
        var _delBtn = $(element).find('div.table-item-handle-btn');
        // 操作删除层
        var _delArea = $(element).find('div.table-item-confirm-del-area');

        //绑定点击显示操作删除层
        _delBtn.on('click', function () {
          _delArea.show();
        });

        element.hover(function () {
          // 当前行序号
          var _index = attrs.tableItemIndex,
              _orderMedicalNos = scope.formData.orderMedicalNos;

          // 计算当前tr距离顶部的高度
          var _offsetTop = $(element).offset().top - document.body.scrollTop;
          // 计算当前页面宽度
          var _pageWidth = utils.getMainBodyWidth() + 65;

          _delBtn.css({'position':'fixed','top':_offsetTop,'left':_pageWidth}).show();

        }, function () {
          _delBtn.css({'position':'absolute','top':0,'left':0}).hide();
          _delArea.hide();
        });

        //取消操作
        scope.cancelHandle = function () {
          _delBtn.hide();
          _delArea.hide();
        };
      }
    };
  }


  angular.module('manageApp.project-PG16-H')
    .directive("tableItemMultipleBtn", ['utils', 'requestData', tableItemMultipleBtn])
    .directive("tableItemHandlebtnComponent", ['utils', tableItemHandlebtnComponent])

});
