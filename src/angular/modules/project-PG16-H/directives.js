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

  angular.module('manageApp.project-PG16-H')
    .directive("statusStyleToggle", [statusStyleToggle])
    .directive("tableItemMultipleBtn", ['utils', 'requestData', tableItemMultipleBtn]);
});
