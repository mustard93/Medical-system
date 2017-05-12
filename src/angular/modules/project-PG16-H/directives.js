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


  // 根据返回状态显示小圆点样式，鼠标移入显示状态提示。
  /**
     *
    	* @Description: 鼠标移入显示状态提示，
    	* @author 宋娟
    	* @date 2017年5月10日 下午4:32:59
     */

     	   //  关键步骤：
     	    //1.传入参数:showOrderStatus(后台返回的状态值)，style(控制样式)。

  function showStatus(utils){
    return{
      restrict: 'A',
        link: function ($scope, $element, $attrs) {
          $element.css({'position':'relative'});
          $element.addClass('showStatus');
          var orderStatus=$attrs.showOrderStatus;
          var style=$attrs.showOrderStyle;
          // 截取返回状态值得首尾字符，用于后续判断显示颜色
          var orderStartColor=orderStatus.substring(1,0);
          var orderEndColor=orderStatus.substr(orderStatus.length-1,1);
          var bgColor=' pr-bg-grey4';

          // 根据返回状态判断小圆点颜色显示
          if(orderStartColor=='已'){
            bgColor=' bg-pass-green';
          }else if(orderEndColor=='中' || orderStartColor=='部'){
            bgColor=' bg-freeze-orange';
          }
          var circle="<span class='circle-status"+bgColor+"'><span class='purchaseorder-buyer-info' style='"+style+"'><i class='text-normal pd-c-s' style='height:20px;'><em class='inline-block'>"+orderStatus
          +"</em></i></sapn></span>"
          $element.append(circle);
        }
    };
  }

  /**
   * [Description GS1条码打印组件]
   * @param  {[type]} requestData [注入项]
   * @param  {[type]} utils       [注入项]
   * @return {[type]} [description]
   * @author liuzhen
	 * @date 2017年5月12日
   */
  function gs1BarcodeComponent (requestData, utils) {
    'use strict';
    return {
      restrict: 'EA',
      scope: {

      },
      replace: true,
      transclude: true,
      templateUrl: Config.tplPath + 'tpl/project/gs1BarcodeComponent.html',
      link: function (scope, element, attrs) {
        scope.$watch('medical.data.barcode', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            var _url = 'rest/authen/gs1Barcode/get',
                _data = {
                  "barcode": newVal,
                  "quantity": 0,
                  "productionBatch": "",
                  "validTill": 0,
                  "barcodeType": "一段式"
                };
            requestData(_url, _data, 'POST', 'parameter-body')
            .then(function (results) {
              console.log(results);
            })
            .catch(function (error) {
              if (error) { throw new Errow(error || '出错'); }
            });
          }
        });
      },
      controller: ['$scope', '$element', function ($scope, $element) {
        // ...

      }]
    };
  }


  angular.module('manageApp.project-PG16-H')
  .directive("showStatus",["utils",showStatus])
  .directive("statusStyleToggle", [statusStyleToggle])
  .directive("statusStyleToggle", [statusStyleToggle])
  .directive("changeImg", [changeImg])
  .directive("statusStyleToggleNew", [statusStyleToggleNew])
  .directive("gs1BarcodeComponent", ["requestData", "utils", gs1BarcodeComponent]);
});
