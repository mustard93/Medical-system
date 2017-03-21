/**
 * 项目自定义指令
 */
define('project/directives', ['project/init'], function () {

  /**
    json编辑器

  */
  function textareaJson(utils,alertError) {
    return {
      restrict: 'EA',
      scope: {
          ngModel: "="
      },
      templateUrl:  Config.tplPath +'tpl/project/textareaJson.html',
      link: function ($scope, element, $attrs) {

        $scope.jsonFromNgModel= function () {
          try{

            $scope.jsonString=JSON.stringify(  $scope.ngModel, null, "\t");

          }catch(e){
                console.log(e);
                $scope.jsonString=utils.toJson($scope.ngModel);

          }

        };

          $scope.jsonToNgModel= function (str) {
            try{

                utils.replaceObject($scope.ngModel, $.parseJSON(str));
                $scope.jsonString="";
            }catch(e){
              console.log(e);
              alertError("转换错误："+e.message);
            }

          };
      }
    };
  }



    /**
      html-edit编辑器

      <html-edit ng-model="htmlString"  div-id="divId"></html-edit>
    */

    function htmlEdit() {
      return {
        restrict: 'EA',
        scope: {
              ngModel: "=",
              openButtonId:"@?",//绑定开启弹出编辑模式按钮。
              divId: "@"
        },
        templateUrl:  Config.tplPath +'tpl/project/htmlEdit.html',
        link: function ($scope, element, $attrs) {

          $scope.htmlFromDivId= function () {
            $scope._htmlString=$("#"+$scope.divId).html();

          };

          //绑定开启弹出编辑模式按钮。
          if($scope.openButtonId){
            $('#'+$scope.openButtonId).on('click', function (e) {
              $scope.htmlFromDivId();
              $scope.$digest();
            });
          }

          $scope.cancel= function () {
              $scope._htmlString='';
              $scope.ngModel=    $scope._htmlString;


          };
            $scope.htmlToNgModel= function () {

              $scope._htmlString=$scope.umeditor.getContent();
              console.log("$scope._htmlString",$scope._htmlString);
                $scope.ngModel=    $scope._htmlString;
                $scope._htmlString='';

            };
        }
      };
    }

  /**
    附件文件显示
    attachmentsExtend={"edit":true}
    edit：是否可编辑
  */
  function attachmentsItemShow() {
    return {
      restrict: 'EA',
      scope: {
          attachmentsItemExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/attachmentsItemShow.html'
    };
  }
  /**
    附件列表-只读显示
    attachmentsExtend={"title":"审核资料"}
    title：显示标题
  */
  function attachmentsShow() {
    return {
      restrict: 'EA',
      scope: {
          attachmentsExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/attachmentsShow.html'
    };
  }
  /**
    附件列表-编辑
    attachmentsExtend={"title":"审核资料","usege":"首营企业申请","addFlag":true}
    title：显示标题
    usege：上传附件用途说明
    addFlag：是否允许添加额外附件
  */
  function attachmentsEdit() {
    return {
      restrict: 'EA',
      scope: {
          attachmentsExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/attachmentsEdit.html'
    };
  }

/**
  药械订单列表
*/
function orderMedicals() {
  return {
    restrict: 'EA',
    scope: {
        ngModel: "="
    },
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/orderMedicalNos.html'
  };
}
/**
  药械订单列表-采购
*/
function orderMedicalsPurchase() {
  return {
    restrict: 'EA',
    scope: {
        ngModel: "="
    },
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/orderMedicalNosOfPurchaseOrder.html'
  };
}

/**
  药械订单列表-采购
*/
function workflowRejectButton(utils) {
  return {
    restrict: 'EA',
    scope: true,
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/workflowRejectButton.html',

          link: function ($scope, element, $attrs) {
            if ($attrs.customMenu) {
                $scope.customMenu=utils.fromJson($attrs.customMenu);

            }
          }
  };
}


/**
  工作流-通过菜单
*/
function workflowPassButton(utils) {
  return {
    restrict: 'EA',
    // scope: true,
    scope: {
        beforeAjaxParams: "=?",
        beforeIfEval:"=?"
    },
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/workflowPassButton.html',

      link: function ($scope, element, $attrs) {
        if ($attrs.customMenu) {
            $scope.customMenu=utils.fromJson($attrs.customMenu);

        }

      //  $scope.passCallback='$root.utils.goOrRefreshHref(customMenu.callBackUrl)';
        //
        if ($attrs.passCallback) {
            $scope.passCallback=$attrs.passCallback;

        }
        if ($attrs.beforeAjaxParameterBody) {
            $scope.beforeAjaxParameterBody=$attrs.beforeAjaxParameterBody;

        }

        if ($attrs.beforeAjaxUrlSubmit) {
            $scope.beforeAjaxUrlSubmit=$attrs.beforeAjaxUrlSubmit;

        }
      }
  };
}


/**
  工作流-通过菜单
*/
function workflowButtonQueryCard(utils) {
  return {
    restrict: 'EA',
    // scope: true,
    scope: {
        beforeAjaxParams: "=?",
        beforeIfEval:"=?"
    },
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/workflowButtonQueryCard.html',

      link: function ($scope, element, $attrs) {
        if ($attrs.customMenu) {
            $scope.customMenu=utils.fromJson($attrs.customMenu);
        }
        if ($attrs.passCallback) {
            $scope.passCallback=$attrs.passCallback;

        }
        if ($attrs.beforeAjaxParameterBody) {
            $scope.beforeAjaxParameterBody=$attrs.beforeAjaxParameterBody;

        }

        if ($attrs.beforeAjaxUrlSubmit) {
            $scope.beforeAjaxUrlSubmit=$attrs.beforeAjaxUrlSubmit;

        }

      }
  };
}

/**
  工作流菜单列表
*/
function customMenuList(utils) {
  return {
    restrict: 'EA',
    scope: {
        beforeAjaxParams: "=?",
        beforeIfEval:"=?"
    },
    // replace: true,
      // scope: true,
    templateUrl:  Config.tplPath +'tpl/project/customMenuList.html',

      link: function ($scope, element, $attrs) {

        if ($attrs.customMenuArr) {
            $scope.customMenuArr= utils.fromJson($attrs.customMenuArr);

        }else{
              $scope.customMenuArr=$attrs.customMenuArr;
        }

        if ($attrs.passCallback) {
            $scope.passCallback=$attrs.passCallback;

        }
        if ($attrs.beforeAjaxUrlSubmit) {
            $scope.beforeAjaxUrlSubmit=$attrs.beforeAjaxUrlSubmit;

        }
        // if ($attrs.beforeAjaxParams) {
        //     $scope.beforeAjaxParams=$attrs.beforeAjaxParams;
        //
        // }
        // console.log(  $scope.customMenuArr);

      }
  };
}



/**
  药械订单列表-采购
*/
function workflowTaskRunWithAttchments(utils) {
  return {
    restrict: 'EA',
    // scope: {
    //     ngModel: "="
    // },
    // replace: true,
      scope: {
        workflowBottomButton:"=?"
      },
    templateUrl:  Config.tplPath +'tpl/project/workflowTaskRunWithAttchments.html',

      link: function ($scope, element, $attrs) {

        if ($attrs.customMenuArr) {
            $scope.customMenuArr=utils.fromJson($attrs.customMenuArr);

        }else{
              $scope.customMenuArr=$attrs.customMenuArr;
        }

        //返回按钮
        if ($attrs.returnButton) {
            $scope.returnButton= utils.fromJson($attrs.returnButton);
        }
        //附件上传用途
          $scope.attchmentUsege=$attrs.attchmentUsege;

          $scope.passButton=utils.getcustomMenuByKeyOfArr($scope.customMenuArr,'通过');
          $scope.rejectButton=utils.getcustomMenuByKeyOfArr($scope.customMenuArr,'驳回');

          //按钮名字优先去passButton
              $scope.showButton=$scope.passButton||$scope.rejectButton;
              if($scope.showButton)
                  $scope.formData=  $scope.showButton.params;
                  if(!  $scope.formData)  $scope.formData={};
                $scope.formData.attachments=[];

              $scope.scopeExtend={};
              console.log(  $scope.customMenuArr);

      }
  };
}


/**
 * [滚动条美化]
 */
function niceScroll () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      require(['nicescroll'], function () {
        // 主页面右侧滚动条
        $('html').niceScroll({styler:"fb", cursorcolor:"#65cea7", cursorwidth: '6', cursorborderradius: '0px',
          background: '#424f63', spacebarenabled:false, cursorborder: '0', zindex: '1000'
        });
        // 侧边栏滚动条
        $("#page-side").niceScroll({styler:"fb", cursorcolor:"#65cea7", cursorwidth: '3', cursorborderradius: '0px',
          background: '#424f63', spacebarenabled:false, cursorborder: '0'
        });
        //
        // $('.data-table').niceScroll({styler:"fb", cursorcolor:"#65cea7", cursorwidth: '6', cursorborderradius: '0px',
        //   background: '#424f63', spacebarenabled:false, cursorborder: '0', zindex: '1'
        // });
        // 如果侧边栏被收起
        $("#page-side").getNiceScroll();
        if ($('body').hasClass('left-side-collapsed')) {
            $("#page-side").getNiceScroll().hide();
        }
      });
    }
  };
}
/**
 * [左边栏子菜单点击事件]
 */
function leftMenuChange ($location) {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      //获取当前Url模块名
      var _moduleName = $location.path().split('/')[1];

      if ($attrs.leftMenuChange) {
        if ($attrs.leftMenuChange === _moduleName) {
          changeStyle(element);
        }
      }

      element.on('click', function (e) {
        e.stopPropagation();  // 阻止事件冒泡
        changeStyle(element);
      });

      function changeStyle (ele) {
        var _this = $(ele);
        _this.addClass('active').parent().siblings().each(function () {
          $(this).children().removeClass('active');
        });
      }
    }
  };
}
/**
 *  左边栏一级菜单伸缩
 */
function leftMenuToggle ($location) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      //保持状态
      if ($(element).next('.sub-menu-list').length === 0) {   //没有下拉子菜单
        if ($location.absUrl().indexOf(attrs.href) !== -1) {
          $(element).parent().addClass('active').siblings().each(function () {
            $(this).removeClass('active');
          });
        }
      }

      // 一级子菜单点击事件效果
      $(element).on('click', function (event) {
        //阻止冒泡
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }

        var _parent = $(this).parent(); //当前绑定点击事件的父元素

        if ($(this).next('.sub-menu-list').length !== 0) {
          //如果有二级菜单
          var _secondMenuList = $(this).next('.sub-menu-list');
          if (!_secondMenuList.is(':visible')) {  //收起状态
            _secondMenuList.slideDown(200, function () {
              // ...
              _parent.siblings().each(function () {
                // if ($(this).hasClass('active')) {
                //   $(this).removeClass('active');
                // }
                if ($(this).children('.sub-menu-list').is(':visible')) {
                  $(this).children('.sub-menu-list').hide(200).prev().find('span.pr-arrow-up').removeClass('pr-arrow-up').addClass('pr-arrow-down');
                }
              });
              // 右侧箭头指示改变
              $(this).prev().find('span.pr-arrow-down').removeClass('pr-arrow-down').addClass('pr-arrow-up');
            });
          } else {
            _secondMenuList.slideUp(200, function () {
              // 这里是一级菜单收起后的回调函数...
              $(this).prev().find('span.pr-arrow-up').removeClass('pr-arrow-up').addClass('pr-arrow-down');
            });
          }
        } else {
          //如果没有二级菜单
          _parent.addClass('active').siblings().each(function () {
            $(this).removeClass('active').find('.sub-menu-list > li').each(function () {
              $(this).removeClass('active');
            });
            if ($(this).children('.sub-menu-list').is(':visible')) {
              $(this).children('.sub-menu-list').hide(200);
            }
          });
        }
      });
    }
  };
}
/**
 * 订单列表首页订单状态按钮切换样式
 */
function orderStatusChoise () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      element.on('click', function () {
        $(this).addClass('pr-btn-bg-gold').siblings().each(function () {
          $(this).removeClass('pr-btn-bg-gold');
        });
        $(this).parent().siblings().each(function () {
          $(this).children().each(function () {
            $(this).removeClass('pr-btn-bg-gold');
          });
        });
      });
    }
  };
}


/**
  药械订单列表-采购
*/
function queryOrderStatusButton() {
  return {
    restrict: 'EA',
    scope: {
        ngModel:"=",
        countMap: "="
    },
      require: 'ngModel',
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/queryOrderStatusButton.html',
    link: function ($scope, element, $attrs,ngModel) {
      $scope.key=$attrs.key;
      $scope.showName=$scope.key;
      if($attrs.showName){
        $scope.showName=$attrs.showName;
      }
      element.on('click', function () {
        $(this).addClass('pr-btn-bg-gold').siblings().each(function () {
          $(this).removeClass('pr-btn-bg-gold');
        });
        $(this).parent().siblings().each(function () {
          $(this).children().each(function () {
            $(this).removeClass('pr-btn-bg-gold');
          });
        });
      });
    }
  };
}

/**
 *  订单页头导航按钮点击事件处理
 */
function orderListTips () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      element.on('click', function () {
        $(this).hide();
        $(this).siblings().show().on('click',function () {
          $(this).hide();
          $(element).show();
        });
      });
    }
  };
}
/**
 * 点击展开隐藏左边栏
 */
function toggleLeftMenu () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
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
    }
  };
}
/**
 * 面板点击收起、展开与关闭
 */
function togglePanel () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      $(element).on('click', function (e) {
        e.stopPropagation();

        if (!$(this).hasClass('fa-times')) {    //展开与收起
          var el = $(this).parents(".panel").children(".panel-body");
          if ($(this).hasClass("fa-chevron-up")) {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideUp(200);
          } else {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideDown(200);
          }
        } else {                                //关闭
          $(this).parents(".panel").parent().remove();
        }
      });
    }
  };
}
/**
 *  morris图表展示
 */
function morris () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      require(['morris'], function () {
        //定义参数
        var _id = $attrs.id;
        //构建data参数
        var _data = [];
        if (angular.isDefined($attrs.datavalue) && angular.isDefined($attrs.datalabel) && angular.isDefined($attrs.dataformatted)) {
          var _tempObj = {}, i = 0;
          var _value = $attrs.datavalue.split(','),
              _label = $attrs.datalabel.split(','),
              _formatted = $attrs.dataformatted.split(',');
          while (i < _value.length) {
            _tempObj.value = _value[i];
            _tempObj.label = _label[i];
            _tempObj.formatted = _formatted[i];
            _data.push(_tempObj);
            _tempObj = {};
            i++;
          }
        }
        //构建backgroundColor参数,布尔值
        var _backgroundColor = angular.isDefined($attrs.backgroundColor) ? $attrs.backgroundColor : false;
        //构建labelColor参数，字符串十六进制
        var _labelColor = angular.isDefined($attrs.labelColor) ? $attrs.labelColor : '#666';
        //构建区块颜色参数，数组
        var _colors = angular.isDefined($attrs.colors) ? $attrs.colors.split(',') : ['#ff5f39','#fe9302','#e39a27'];

        //初始化
        Morris.Donut({
          element: _id,
          data: _data,
          backgroundColor: _backgroundColor,
          labelColor: _labelColor,
          colors: _colors,
          formatter: function (x, data) { return data.formatted; }
        });
      });
    }
  };
}
/**
 *  iCheck
 */
function icheck () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      require(['icheck'], function () {

        $(element).children().iCheck({
          checkboxClass: 'icheckbox_square',
          radioClass: 'iradio_square',
          increaseArea: '20%'
        });


        // // 获取元素样式字符
        // var _currenStyleStr = $attrs.class,
        //     i = 0,
        //     _styleNameArr = ['minimal',
        //                      'minimal-red',
        //                      'minimal-green',
        //                      'minimal-blue',
        //                      'minimal-yellow',
        //                      'minimal-purple',
        //                      'square',
        //                      'square-red',
        //                      'square-green',
        //                      'square-blue',
        //                      'square-yellow',
        //                      'square-purple',
        //                      'flat-red',
        //                      'flat-grey',
        //                      'flat-green',
        //                      'flat-blue',
        //                      'flat-yellow',
        //                      'flat-purple'],
        //     _len = _styleNameArr.length;
        //
        // for (i; i < _len; i++) {
        //   if (_currenStyleStr.split(' ')[0] === _styleNameArr[i]) {
        //     run_iCheck(_styleNameArr[i]);
        //     break;
        //   }
        // }
        //
        // function run_iCheck (cName) {
        //   switch (cName) {
        //     case 'minimal': $('.minimal input').iCheck({checkboxClass: 'icheckbox_minimal', radioClass: 'iradio_minimal', increaseArea: '20%'}); break;
        //     case 'minimal-red': $('.minimal-red input').iCheck({checkboxClass: 'icheckbox_minimal-red', radioClass: 'iradio_minimal-red', increaseArea: '20%'}); break;
        //     case 'minimal-green': $('.minimal-green input').iCheck({checkboxClass: 'icheckbox_minimal-green', radioClass: 'iradio_minimal-green', increaseArea: '20%'}); break;
        //     case 'minimal-blue': $('.minimal-blue input').iCheck({checkboxClass: 'icheckbox_minimal-blue', radioClass: 'iradio_minimal-blue', increaseArea: '20%'}); break;
        //     case 'minimal-yellow': $('.minimal-yellow input').iCheck({checkboxClass: 'icheckbox_minimal-yellow', radioClass: 'iradio_minimal-yellow', increaseArea: '20%'}); break;
        //     case 'minimal-purple': $('.minimal-purple input').iCheck({checkboxClass: 'icheckbox_minimal-purple', radioClass: 'iradio_minimal-purple', increaseArea: '20%'}); break;
        //     case 'square': $('.square input').iCheck({checkboxClass: 'icheckbox_square', radioClass: 'iradio_square', increaseArea: '20%'}); break;
        //     case 'square-red': $('.square-red input').iCheck({checkboxClass: 'icheckbox_square-red', radioClass: 'iradio_square-red', increaseArea: '20%'}); break;
        //     case 'square-green': $('.square-green input').iCheck({checkboxClass: 'icheckbox_square-green', radioClass: 'iradio_square-green', increaseArea: '20%'}); break;
        //     case 'square-blue': $('.square-blue input').iCheck({checkboxClass: 'icheckbox_square-blue', radioClass: 'iradio_square-blue', increaseArea: '20%'}); break;
        //     case 'square-yellow': $('.square-yellow input').iCheck({checkboxClass: 'icheckbox_square-yellow', radioClass: 'iradio_square-yellow', increaseArea: '20%'}); break;
        //     case 'square-purple': $('.square-purple input').iCheck({checkboxClass: 'icheckbox_square-purple', radioClass: 'iradio_square-purple', increaseArea: '20%'}); break;
        //     case 'flat-red': $('.flat-red input').iCheck({checkboxClass: 'icheckbox_flat-red', radioClass: 'iradio_flat-red'}); break;
        //     case 'flat-grey': $('.flat-grey input').iCheck({checkboxClass: 'icheckbox_flat-grey', radioClass: 'iradio_flat-grey'}); break;
        //     case 'flat-green': $('.flat-green input').iCheck({checkboxClass: 'icheckbox_flat-green', radioClass: 'iradio_flat-green'}); break;
        //     case 'flat-blue': $('.flat-blue input').iCheck({checkboxClass: 'icheckbox_flat-blue', radioClass: 'iradio_flat-blue'}); break;
        //     case 'flat-yellow': $('.flat-yellow input').iCheck({checkboxClass: 'icheckbox_flat-yellow', radioClass: 'iradio_flat-yellow'}); break;
        //     case 'flat-purple': $('.flat-purple input').iCheck({checkboxClass: 'icheckbox_flat-purple', radioClass: 'iradio_flat-purple'}); break;
        //   }
        // }
      });
    }
  };
}
/**
 *  sparkline 柱状图
 */
function sparkline () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {
      require(['sparkline'], function () {
        $(".sparkline").each(function(){
            var $data = $(this).data();

            $data.valueSpots = {'0:': $data.spotColor};

            $(this).sparkline( $data.data || "html", $data,
                {
                    tooltipFormat: '<span style="display:block; padding:0px 10px 12px 0px;">' +
                        '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{percent.1}}%)</span>'
                });
        });
        $("#income").sparkline([5,6,7,5,9,6,4,9,8,5,6,7], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#fc8675'
        });

        $("#expense").sparkline([3,2,5,8,4,7,5,8,4,6], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#65cea7'
        });


        $("#expense2").sparkline([3,2,5,8,4,7,5,8,4,6], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#65cea7'
        });

        $("#pro-refund").sparkline([3,2,5,8,4,7,5,8,4,6], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#ffffff'
        });

        $("#p-lead-1").sparkline([7,5,9,6,4,9,8,5,6,7], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#65cea7'
        });

        $("#p-lead-2").sparkline([3,2,5,8,4,7,5,8,4,6], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#fc8675'
        });

        $("#p-lead-3").sparkline([3,2,5,8,4,7,5,8,4,6], {
            type: 'bar',
            height: '35',
            barWidth: 5,
            barSpacing: 2,
            barColor: '#5ab5de'
        });


        $("#visit-1").sparkline([5,6,7,9,9,5,3,2,4,6,7,5,6,8,7,9,5 ], {
            type: 'line',
            width: '100',
            height: '25',
            lineColor: '#55accc',
            fillColor: '#edf7f9'
        });

        $("#visit-2").sparkline([5,6,7,7,9,5,8,5,4,6,7,8,6,8,7,9,5 ], {
            type: 'line',
            width: '100',
            height: '25',
            lineColor: '#55accc',
            fillColor: '#edf7f9'
        });
      });
    }
  };
}
/**
 *  tooltips
 */
function runTooltips () {
  'use strcit';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        $("[data-toggle='tooltip']").tooltip();
    }
  };
}
/**
 *	popover
 */
function runPopovers ($timeout) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      //获取当前元素的下一个兄弟元素
      var _modal = $(element).next();
      //..
      $(element).hover(function() {
        _modal.show();
      }, function() {
        _modal.hide();
      });
      //...
      _modal.hover(function() {
        $(this).show();
      }, function() {
        $(this).hide();
      });
    }
  };
}
/**
 * 带确认对话框的按钮点击事件
 */
function handleThisClick ($window, dialogConfirm, requestData, alertOk, alertError,utils) {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, element, $attrs) {

      element.on('click', function () {
        //对话框标题
        var _dialogTitle = angular.isDefined($attrs.dialogTitle) ? $attrs.dialogTitle : '询问对话框';
        //对话框内容
        var _dialogContent = angular.isDefined($attrs.dialogContent) ? $attrs.dialogContent : '';
        //对话框引用的模板
        var _dialogTemplate = angular.isDefined($attrs.dialogTemplate) ? $attrs.dialogTemplate : 'tpl/dialog-confirm.html';
        //如果需要跳转地址
        var _jumpUrl = angular.isDefined($attrs.jumpUrl) ? $attrs.jumpUrl : '';
        //如果发送请求的地址
        var _requestUrl = angular.isDefined($attrs.requestUrl) ? $attrs.requestUrl : '';
        //按钮名称
        var _confirmBtnTxt = angular.isDefined($attrs.confirmBtnTxt) ? $attrs.confirmBtnTxt : '确定';
        var _cancelBtnTxt = angular.isDefined($attrs.cancelBtnTxt) ? $attrs.cancelBtnTxt : '取消';

        if(_dialogTemplate=="pr-dialog-return.html"){//编辑页面，取消操作
          if( !angular.isDefined($attrs.dialogTitle)) _dialogTitle = '取消修改?';
          if( !angular.isDefined($attrs.dialogContent)) _dialogContent = '有修改还未保存,是否保存?';
        }



        //回调方法
        function callback(){

          //指定作用域
          if($attrs.callbackScopeKey){
              var appointScope=  utils.getAppointScope($scope,$attrs.callbackScopeKey);
              if(appointScope!==null){
                if ($attrs.callback) {
                    appointScope.$eval($attrs.callback);
                }
                if ($attrs.callBack) {
                    appointScope.$eval($attrs.callBack);
                }

              }

          }

          if ($attrs.callback) {
              $scope.$eval($attrs.callback);
          }

          if ($attrs.parentCallback) {
            $scope.$parent.$eval($attrs.parentCallback);
          }


        }//end callback

        function ajax_submit(){
          //如果操作为点击后发送请求
          var parameterBody = false;
          if (angular.isDefined($attrs.parameterBody)) {
            parameterBody = true;
            if($attrs.parameterBody=="false"){
              parameterBody=false;
            }
          }

          var httpMethod="POST";
          if($attrs.httpMethod){
            httpMethod=$attrs.httpMethod;
          }

            if (!$attrs.requestUrl) {
                callback();
                return;
            }
            var _requestUrl=$attrs.requestUrl;

        {

            var _params={};
            if ($attrs.params) {
                if ($attrs.params.indexOf("{") === 0) {
                      _params = $scope.$eval($attrs.params);
                }
            }


            function requestData_then(results) {
              var _data = results[1];
              if (_data.code === 200) {
                alertOk(_data.msg || '操作成功');
              }
              if ($attrs.$scopeData) $scope[$attrs.$scopeData] = data;
              //执行回调

              callback();

              //操作成功完成向上传播事件
              if ($attrs.emitted) {
                if ($attrs.emitted.indexOf(',') !== -1) {   //多个事件
                  var _arr = $attrs.emitted.split(',');
                  var _len = _arr.length,
                      i = 0;
                  for (i=0; i<_len; i++) {
                    $scope.$emit(_arr[i]);
                  }
                } else {    //单个事件
                  $scope.$emit($attrs.emitted);
                }
              }
            }

            requestData(_requestUrl, _params, httpMethod,parameterBody)
              .then(requestData_then)
              .catch(function (error) {
                alertError(error || '出错');
              });
            return;
          }


        }//ajax_submit



          //ajax_submit_before
                function ajax_submit_before(){
                  //如果操作为点击后发送请求
                  var parameterBody = false;
                  if (angular.isDefined($attrs.beforeAjaxParameterBody)) {
                    parameterBody = true;
                    if($attrs.parameterBody=="false"){
                      parameterBody=false;
                    }
                  }

                  var httpMethod="POST";
                  if($attrs.beforeAjaxHttpMethod){
                    httpMethod=$attrs.beforeAjaxHttpMethod;
                  }
                  var _requestUrl=$attrs.beforeAjaxUrlSubmit;

                {

                    var _params={};
                    if ($attrs.beforeAjaxParams) {

                      if ($attrs.beforeAjaxParams.indexOf("{") === 0) {
                          _params = $scope.$eval($attrs.beforeAjaxParams);
                      } else {
                        _params=$scope[$attrs.beforeAjaxParams];
                      }

                    }


                    function requestData_then(results) {
                      var _data = results[1];
                      ajax_submit();

                    };

                    requestData(_requestUrl, _params, httpMethod,parameterBody)
                      .then(requestData_then)
                      .catch(function (error) {
                        alertError(error || '出错');
                      });
                    return;
                  }


                }//ajax_submit_before



                if($attrs.alertConfirm=="false"){

                  //执行前需要执行
                  if (angular.isDefined($attrs.beforeIfEval) && $attrs.beforeAjaxUrlSubmit) {
                      var tmp=$scope.$eval($attrs.beforeIfEval);
                    if (tmp){
                        ajax_submit_before();
                        return;
                    }

                  }

                    ajax_submit();
                    return;
                }


        //默认弹出窗口
        dialogConfirm(_dialogContent, function (type,dialgForm) {

          //取消对话框操作
          if(type=="cancel"){
            //执行回调
            if ($attrs.cancelCallback) {
              $scope.$eval($attrs.cancelCallback);
            }
            return;
          }

          //type:nosave,save
          //取消对话框操作
          if(type=="nosave"){
            //执行回调
            if ($attrs.nosaveCallback) {
              $scope.$eval($attrs.nosaveCallback);
            }
            if ($attrs.parentNosaveCallback) {
              $scope.$parent.$eval($attrs.parentNosaveCallback);
            }
            return;
          }

          if(type=="save"){
            //执行回调
            if ($attrs.saveCallback) {
              $scope.$eval($attrs.saveCallback);
            }

            if ($attrs.parentSaveCallback) {
              $scope.$parent.$eval($attrs.parentSaveCallback);
            }
            return;
          }
          //如果操作为点击后回退
          // if (!angular.isDefined($attrs.jumpUrl) && !angular.isDefined($attrs.requestUrl)) {
          //   $window.history.go(-1);
          //   return;
          // }
          //如果操作为点击后跳转地址
          if (angular.isDefined($attrs.jumpUrl)) {
            $window.location.assign(_jumpUrl);
              return;
          }




          //执行前需要执行
          if (angular.isDefined($attrs.beforeIfEval) && $attrs.beforeAjaxUrlSubmit) {
              var tmp=$scope.$eval($attrs.beforeIfEval);
            if (tmp){
                ajax_submit_before();
                return;
            }

          }

            ajax_submit();
          //执行回调
          // callback();

        }, _dialogTemplate, _dialogTitle, _confirmBtnTxt, _cancelBtnTxt, _jumpUrl);
      });
    }
  };
}

/**
 *	左侧二级菜单切换效果（临时解决方案，无法与一级菜单点击事件指令集成在一起）
 */
function leftMenuSecondToggle ($location) {

  /**
  *菜单根据网页地址，选中对应菜单
  */
  var LeftMenuObj={
      isStart:false,//监听只启动一个标志。
      routeMap:{},
      last1MenuShowObj:null,
      //执行样式选中
      eleChangeEvent:function(element){
        if(!element||element.length===0){
          // console.log("error:LeftMenuObj.element=null");
        }
        //ul(p5)>li(p4)>ul(p3)>li(p2)>a(p1) left-menu-second-toggle
        var _parent = $(element).parent();
          //p2
        _parent.addClass('active').siblings().each(function () {
          $(this).removeClass('active');
        });
        //p4

        // console.log(_parent.parent().parent());

        _parent.parent().parent().removeClass('active').siblings().each(function () {
          $(this).removeClass('active');

          $(this).find('ul.sub-menu-list').slideUp(200);

          $(this).find('.sub-menu-list > li').each(function () {
              $(this).removeClass('active');
          });
        });
        //隐藏其他的
        if(LeftMenuObj.last1MenuShowObj){
            LeftMenuObj.last1MenuShowObj.hide();
        }
        //p3
        if (!_parent.parent().is(':visible')) {
          _parent.parent().show();
            LeftMenuObj.last1MenuShowObj=_parent.parent();
        }
        //
        $(element).parents('ul.sub-menu-list').prev().children().eq(2).removeClass('pr-arrow-down').addClass('pr-arrow-up');
      },
      //LeftMenuObj.doRoute();
      //根据优先级路由定位菜单
      doRoute:function(newUrl){
        // console.log("getElementMenu1="+url);
        var url=newUrl;// #/purchaseOrder/query.html?t=123
        url=url.split('#')[1];// /purchaseOrder/query.html?t=123
        if(!url)return;

        //全匹配优先级最高
        elementMenu=this.routeMap[url];
        //去掉参数匹配优先级最高
        if(!elementMenu||elementMenu.length===0){
             url=url.split('?')[0];// /purchaseOrder/query.html
            elementMenu=this.routeMap[url];
        }
        //取模块名
        if(!elementMenu||elementMenu.length===0){
             url=url.split('/')[1];  // purchaseOrder
            elementMenu=this.routeMap[url];
        }
        // console.log("getElementMenu2="+url);
        if(!elementMenu||elementMenu.length===0){
          return;
        }
        // console.log("doRoute="+url);
        this.eleChangeEvent(elementMenu);
      },
        //启动监听定义监视器，监控Url变化 LeftMenuObj.startListen($scope)
      startListen:function($scope){
        if(this.isStart)return;
        this.isStart=true;
        $scope.$on('$locationChangeSuccess', function (event, newUrl, currentUrl) {
          // console.log("locationChangeSuccess="+newUrl);
          LeftMenuObj.doRoute(newUrl);
        });
      },//startListen
      //添加路由，支持自定义key
      add:function(keyArr,elementMenu ){
        if(keyArr&&keyArr.length>0){//  自定义key
          for(var i=0;i<keyArr.length;i++){
              this.routeMap[keyArr[i]]=elementMenu;
          }
        }
        // #/purchaseOrder/query.html?t=123
        var url=  elementMenu.attr("href");
        if(!url)return;

        url=url.split('#')[1];  // /purchaseOrder/query.html?t=123

        if(url)this.routeMap[url]=elementMenu;
        url=url.split('?')[0];  // /purchaseOrder/query.html
        if(url)this.routeMap[url]=elementMenu;
        url=url.split('/')[1]; // purchaseOrder
        if(url)this.routeMap[url]=elementMenu;

      }//end key

  };


  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var keyArr=null;
      if($attrs.keyArr){
          keyArr=$scope.$eval($attrs.keyArr);
      }
      LeftMenuObj.add(keyArr,$element);
      LeftMenuObj.startListen($scope);
      LeftMenuObj.doRoute("#"+$location.path());


      //绑定点击事件
      $element.on('click', function (event) {
        //阻止冒泡
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }

        //执行事件
          LeftMenuObj.eleChangeEvent($element);
      });

    }
  };
}//leftMenuSecondToggle
/**
  弃用
 *	左侧二级菜单切换效果（临时解决方案，无法与一级菜单点击事件指令集成在一起）
 */
// function leftMenuSecondToggle_bak ($location) {
//   return {
//     restrict: 'A',
//     link: function (scope, element, attrs) {
//       //刷新页面保持边栏状态
//       if (attrs.href.indexOf($location.path().split('/')[1]) !== -1) {
//         var _par = $(element).parent();
//         _par.addClass('active').siblings().each(function () {
//           $(this).removeClass('active');
//         });
//         $(element).parent().parent().show();
//         //保持图标状态
//         $(element).parents('ul.sub-menu-list').prev().children().eq(2).removeClass('pr-arrow-down').addClass('pr-arrow-up');
//       }
//
//       //绑定点击事件
//       $(element).on('click', function (event) {
//         //阻止冒泡
//         if (event && event.stopPropagation) {
//           event.stopPropagation();
//         }
//
//         //执行事件
//         eleChangeEvent();
//       });
//
//       //定义监视器，监控Url变化
//       scope.$on('$locationChangeSuccess', function (event, newUrl, currentUrl) {
//         console.log("locationChangeSuccess="+attrs.href);
//         if (attrs.href.indexOf(newUrl.split('#')[1].split('/')[1]) !== -1) {
//           eleChangeEvent();
//         }
//       });
//
//       function eleChangeEvent () {
//         var _parent = $(element).parent();
//
//         _parent.addClass('active').siblings().each(function () {
//           $(this).removeClass('active');
//         });
//
//         _parent.parent().parent().removeClass('active').siblings().each(function () {
//           $(this).removeClass('active');
//           $(this).find('.sub-menu-list > li').each(function () {
//               $(this).removeClass('active');
//           });
//         });
//
//         if (!_parent.parent().is(':visible')) {
//           _parent.parent().show();
//         }
//       }
//     }
//   };
// }
/**
 *  个人中心导航切换
 */
function styleToggle ($location) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      if (attrs.href.indexOf($location.path().split('/')[2]) !== -1) {
        $(element).addClass('active').parent().siblings().each(function () {
          $(this).children().removeClass('active');
        });
        // $(element).parent().parent().show();
      }

      // $(element).addClass('active');

      // scope.$on('$locationChangeStart', function (event, newUrl, currentUrl) {
      //
      //   if (attrs.href.indexOf(newUrl.split('#')[1].split('/')[2]) !== -1) {
      //     $(element).addClass('active');
      //   }
      // });

      $(element).on('click', function (e) {
        if (!$(this).hasClass('active')) {
          $(this).addClass('active').parent().siblings().each(function () {
            $(this).children().removeClass('active');
          });
        }
      });
    }
  };
}
/**
 * [左边栏子菜单点击事件]
 */
function intervalCountdown ($interval) {
  'use strict';
  return {
      restrict: 'AE',
         scope: false,
    link: function ($scope, element, $attrs) {
      $scope.countdown = function (scopeKey,num) {
        $scope[scopeKey] = num;
          var timeout_upd=$interval(function () {
            if ( $scope[scopeKey] > 0) {
              $scope[scopeKey] -= 1;
            } else {
               $interval.cancel(timeout_upd);
            }
          }, 1000);
      };
      $scope.$on('$destroy',function(){
        try{

             $interval.cancel(timeout_upd);
        }catch(e){}

      });
    }
  };
}

/**
 * []
 canvas-workflow
 */
function canvasWorkflow (modal,utils) {
  'use strict';
  return {
      restrict: 'AE',
      // scope: false,
      scope: {
          workflowTaskData:"=?",
          ngModel:"=?"
      },
    link: function ($scope, element, $attrs) {
      var workflow=null;

      // $scope.ngModel;
      // var data=$scope[$attrs.ngModel];

      $scope.$watch("ngModel", function(value) {
        console.log("watch.workflow.ngModel",value);
        if(workflow)workflow.reload(value);
      }, true);

          var data= $scope.ngModel;
          console.log(data);
          require(['WorkflowProcess'], function(WorkflowProcess) {
            function clickCallback(event,that){

                if(!angular.isDefined($attrs.modalUrl)){
                    return;
                }

                 modal.closeAll();

                // alert(that.currentNode.text);
                  $scope.$parent.currentEvent=that.currentNode.data;
                  modal.open({
                    template: $attrs.modalUrl,
                    className: 'ngdialog-theme-right',
                    cache: false,
                    trapFocus: true,
                    overlay: ($attrs.modalOverlay == "true"),
                    data: that.currentNode.data,
                    scope: $scope.$parent,
                    controller: ["$scope", "$element", function ($scope, $element) {
                        $(".ngdialog-content", $element).width("50%");
                    }]
                });
            }//end clickCallback


            var option={
                showStatus:$attrs.showStatus=="true",
                node:{
                  clickCallback:clickCallback
                }
            };

             workflow=new WorkflowProcess($attrs.id,option);



            if ($attrs.scopeExtend){
                var scopeExtend=utils.getScopeExtend($scope,$attrs.scopeExtend);
                if(scopeExtend){
                  if ($attrs.scopeExtendAttr)scopeExtend[$attrs.scopeExtendAttr]=workflow;
                }

            }

            workflow.addWorkflowProcess(data);


            if($scope.workflowTaskData){
              workflow.addWorkflowTaskData($scope.workflowTaskData);

            }
              //编辑节点回掉函数 新建保存，作用域调用不到该函数
              // $scope.workflowCallback=$scope.$parent.workflowCallback=function(){
              //   modal.closeAll();
              //   workflow.reload();
              //
              // }
              //编辑节点回掉函数 新建保存，作用域调用不到该函数,采用监听标志位

              // if(angular.isDefined($attrs.updateWorkflowFlag)){
              //   $scope.$parent.$watch($attrs.updateWorkflowFlag, function(value) {
              //     modal.closeAll();
              //     workflow.reload();
              //   }, true);
              // }


          });//WorkflowProcess

    }//end link
  };
}//canvasWorkflow




/**
  药械订单列表-采购
*/
function businessFlowShow() {
  return {
    restrict: 'EA',
    scope: {
        businessKey:"@",
        businessType: "@"
    },
    templateUrl:  Config.tplPath +'tpl/project/businessFlowShow.html',
    link: function ($scope, element, $attrs,ngModel) {

    }//link
  };
}
 /**
  * 业务单流程展示
  */
 function canvasBusinessFlow (modal,utils) {
   'use strict';
   return {
       restrict: 'AE',
       // scope: false,
       scope: {
           ngModel:"=?"
       },
     link: function ($scope, element, $attrs) {

       // $scope.ngModel;
       // var data=$scope[$attrs.ngModel];
           var data= $scope.ngModel;
          //  console.log(data);
           var curRelId=$attrs.curRelId;//当前页面业务单id
          //  console.log(data);

           require(['CanvasBusinessFlow'], function(CanvasBusinessFlow) {

             //点击回调方法
             function clickCallback(event,that){
                 if(angular.isDefined($attrs.disableClick)){
                     return;
                 }
               var moduleType=that.currentNode.data.moduleType;
               var relId= that.currentNode.data.relId;
                var subModuleAttribute= that.currentNode.data.subModuleAttribute;
               if(!moduleType||!relId){
                 console.log("moduleType="+moduleType+",relId="+relId);
                 return;
               }

               if(curRelId==relId){//当前页面节点点击不做跳转
                 return;
               }
               var url="#/"+moduleType+"/get.html?id="+relId;

               if(moduleType=='lossOrder'){
                   url="#/lossOverOrder/get-reimburse.html?id="+relId;
               }
               else if(moduleType=='overOrder'){
                   url="#/lossOverOrder/get-overflow.html?id="+relId;
               }

               else if(moduleType=="outstockOrder"){
                    if(subModuleAttribute=="销售出库单"||subModuleAttribute=="销售出库单_红字"){
                           url="#/saleOutstockOrder/get.html?id="+relId;
                    }
                    else{
                         url="#/otherOutstockOrder/get.html?id="+relId;
                    }
               }

               else if(moduleType=="instockOrder"){
                    if(subModuleAttribute=="采购入库单"||subModuleAttribute=="采购入库单_红字"){
                        url="#/purchaseInstockOrder/get.html?id="+relId;
                    }
                    else{
                         url="#/otherInstockOrder/get.html?id="+relId;
                    }
               }

               utils.goTo(url);
             }//end clickCallback

             //参数定义
             var option={

                 node:{
                   clickCallback:clickCallback
                 }
             };
             if($attrs.baseImageUrl){
               option.baseImageUrl=$attrs.baseImageUrl;
             }
             if($attrs.spacingWidth){
               option.spacingWidth=parseInt($attrs.spacingWidth);
             }
             if($attrs.spacingHeight){
               option.spacingWidth=parseInt($attrs.spacingHeight);
             }


             var workflow=new CanvasBusinessFlow($attrs.id,option);
             if ($attrs.scopeExtend){
                 var scopeExtend=utils.getScopeExtend($scope,$attrs.scopeExtend);
                 if(scopeExtend){
                   if ($attrs.scopeExtendAttr)scopeExtend[$attrs.scopeExtendAttr]=workflow;
                 }
             }

             workflow.addCanvasBusinessFlow(data,curRelId);

           });//WorkflowProcess

     }//end link
   };
 }//canvasWorkflow

/**
    打印组件
  */
function lodopFuncs(modal,utils) {
    return {
      restrict: 'EA',
      scope: true,
      replace: true,
      templateUrl:  Config.tplPath +'tpl/lodopFuncs.html',
      link: function ($scope, element, $attrs) {
            var LODOP=null;
            require(['LodopFuncs'], function(LodopFuncs) {

              $scope.LODOP_OB_Id="LODOP_OB_"+new Date().getTime();
              $scope.LODOP_EM_Id="LODOP_EM"+new Date().getTime();
                $scope.Print_Div_id="Print_Div_"+new Date().getTime();


                  function getLODOP(){

                    if(!LODOP){
                      LODOP=LodopFuncs.getLodop(document.getElementById(  $scope.LODOP_OB_Id),document.getElementById($scope.LODOP_EM_Id));
                    }
                    return LODOP;
                  }
                  function CreateOneFormPage(){
                      getLODOP();
                  		LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
                  		LODOP.SET_PRINT_STYLE("FontSize",18);
                  		LODOP.SET_PRINT_STYLE("Bold",1);
                  		LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
                  		LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById($scope.Print_Div_id).innerHTML);
                  	}
                  //打印预览
                  $scope.prn1_preview=function() {
                      getLODOP();
                  		CreateOneFormPage();
                  		LODOP.PREVIEW();
                  	};

                    $scope.$digest();
            });//require
      }//link
    };//return
  }

/**
 *  医院采购目录点击进入编辑模式事件处理
 */
function hospitalPurchaseComeinEdit () {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {
      $(element).find('a.edit-link-icon').on('click', function () {
        $(this).hide().next().show();
        $(element).find('span.notEdit').hide();
        $(element).find('span.comeInEdit').show();
      });
    }
  };
}
// 销售出库单物流信息过长处理
function saleOutStockKuaDi () {
  return {
    restrict: 'A',
    scope: {},
    link: function ($scope, $element, $attrs) {
    var lilength=0;
    var modalLength=parseInt($attrs.modalLength);
    var leftShift=modalLength;        // 一次向左移动的长度
    // $('.kuaidiul').animate({'margin-left':'-'+leftShift+'px'});
      $($element).mouseenter(function (e) {
      lilength=$(this).children('ul').children('li').length;
      liWidth=$(this).children('ul').children('li').width()+42;
      console.log(liWidth);
      console.log();
        // 大于一行显示的个数，才出现按钮
        if(lilength>parseInt(modalLength/liWidth)){
          $(this).children('span').css("display", "block");
          // 点击左移按钮后
          $('.button-left').off("click").on('click',function(){
            $('.button-right').removeAttr('disabled','disabled');
            if(leftShift<modalLength*Math.ceil(lilength/parseInt(modalLength/liWidth)))
            {
              $('.kuaidiul').animate({'margin-left':'-'+leftShift+'px'});
              leftShift+=modalLength;
            }
          })
          $('.button-right').off("click").on('click',function(){
            $('.button-left').removeAttr('disabled','disabled');
            if(leftShift>=modalLength)
            {
              leftShift-=modalLength;
              $('.kuaidiul').animate({'margin-left':'-'+leftShift+'px'});
            }
          })
        }
        // 判断是否左右按钮是否可点击
        if(leftShift<modalLength){
          $('.button-right').attr('disabled','disabled');
          $('.button-right:before').css('color','#e5e5e5');
        }
        if(leftShift>=modalLength*Math.ceil(lilength/parseInt(modalLength/liWidth))){
          $('.button-left').attr('disabled','disabled');
          $('.button-left:before').css('color','#e5e5e5');
        }
      });
      $($element).mouseleave(function (e) {
        $(this).children('span').css({
           "display": "none"
         });
      });
    }
  };
}

// 库存明细模块，鼠标移入高亮并显示两个按钮
/**
   *
  	* @Description: 鼠标移入高亮并显示两个按钮
  	* @author liumingquan
  	* @date 2016年12月19日 下午4:32:59
   */

   	   //  关键步骤：
   	    //1.传入参数:url(跳转路径)，className(控制样式的class)
   		//2.mouseenter:表示鼠标移入之后要执行的步骤。
   		//3.mouseleave:表示鼠标移出后执行的步骤。
function medicalStockMouseOver(utils){
  return{
    restrict: 'A',
      link: function ($scope, $element, $attrs) {
        // var btnArray=[];
        //按钮数量，用于计算弹出菜单的div宽度
        var btnCount=0;
        //弹出菜单的div(装两个按钮的div)
        var moveBtnDiv=null;
        //按钮基础数据(mouse-over-buttons-json传入的相关参数，以Jason的数据格式传入)
        // 把按钮基础数据转化为数组类型
        var mouseOverButtons=  $scope.$eval($attrs.mouseOverButtonsJson);
        if(mouseOverButtons && mouseOverButtons.length>0){
          moveBtnDiv=$("<div id='moveBtnDiv'></div>");
          btnCount=mouseOverButtons.length;
        }

        for(var i=0;i<mouseOverButtons.length;i++){
            var bt=mouseOverButtons[i];
            if (bt.progress=='0') {
              return;
            }else{
              var tmp="<a style='width:32px;height:32px;display:inline-block;margin-top:8px;' href='"+bt.url+"' title='"+bt.title+"'><span class='"+bt.className+"'></span></a>";
              var btn1=$(tmp);
              // btn1.appendto(moveBtnDiv);
              moveBtnDiv.append(btn1);
            }
        }

        // 鼠标移入显示按钮
        $($element).mouseenter(function(e){
          $element.addClass("bg-c");
          if(!moveBtnDiv)return;
          //+document.body.scrollLeft+
          moveBtnDivWidth=34*btnCount;
          var y =$element.offset().top -document.body.scrollTop;
          // var x= utils.getMainBodyWidth();
          var x= utils.getwindowWidth()-60-moveBtnDivWidth-document.body.scrollLeft; //有bug，table没有全拼暂满时，弹出按钮不能点击bug。 要求table 宽度 100%

          //
          moveBtnDiv.css({
             "position": "fixed",
             "width":moveBtnDivWidth,
             "height":$element.height(),
             "top": y,
             "left": x
           });

           $(this).append(moveBtnDiv);

        });//mouseenter
        // 鼠标移出按钮消失
        $($element).mouseleave(function(){
          $(this).removeClass("bg-c");
          moveBtnDiv.remove();
        });//mouseleave
      }//link
  };
}


// 医院、经销商/零售商资格申请，首营品种、企业管理模块流程箭头样式。
/**
   *
  	* @Description: 根据走到不同步骤箭头样式发生变化
  	* @author 宋娟
  	* @date 2017年3月7日 上午11:32
   */

   	   //  关键步骤：
   	    //1.传入参数:arrows(箭头的个数)，className(根据状态不同显示样式的class),arrowText(箭头中显示文字的内容)
        //2.divWidth 计算出每个箭头的宽度后，用于后续定义。
        //3.$(window) 监听浏览器窗口大小改变，重新计算每个箭头的宽度，达到箭头宽度自适应的目的。
function stepFlowArrowShow(utils){
  return{
    scope:{},
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      // 定义一个类，用于长css对样式的控制
      $($element).addClass('first-medical-nav');
      //箭头数量，用于计算箭头的个数。
      var arrowCount=0;
      //(step-flow-arrow-json传入的相关参数，以Jason的数据格式传入)
      //基础数据转化为数组类型
      var stepFlowArrow=  $scope.$eval($attrs.stepFlowArrowJson);
      arrowCount=stepFlowArrow.length;
      // 当每个箭头创建好之后，定义每个的宽度
      var divWidth=($($element).width()-((arrowCount-1)*30))/arrowCount

            if(stepFlowArrow && stepFlowArrow.length>0){
              // 计算得到每个div的宽度
              for(var i=0;i<stepFlowArrow.length;i++){
                  var step=stepFlowArrow[i];
                  var tmp="<div class='"+step.className+"'><span><em class='circle-step mgr-m'>"+(i+1)+"</em>"+step.arrowText+"</span></div>";
                  $($element).append($(tmp));
                  // 中间箭头的形状定义
                  if(i>0&&i<stepFlowArrow.length-1){
                    if($($element).children('div').eq(i).hasClass('visited')){
                      // 如果有visited这个类，说明是已完成的状态，所以形状要改变。
                      $($element).children('div').eq(i).append("<div class='triangle1'></div><div class='triangle2'></div>");
                      $($element).children('div').eq(i).prepend("<div></div><div></div>");
                    }else{
                      $($element).children('div').eq(i).append("<div></div>");
                      $($element).children('div').eq(i).prepend("<div></div>");
                    }
                  }
              }
              // 箭头创建完成之后，设置宽度
              $('.first-medical-nav>div').css({"width":divWidth});
              // 开始箭头的形状定义
              $($element).children('div').first().append("<div></div><div></div>");
              // 最后一个箭头的形状定义
              $($element).children('div').last().prepend("<div></div>");
          }

        $(window).resize(function () {
          //当浏览器大小变化时,触发方法，重新给箭头计算宽度，并重新设置宽度，达到自适应宽度的目的。
            $('.first-medical-nav>div').css({"width":($($element).width()-((arrowCount-1)*30))/arrowCount});
        });
      }//link
  };
}

// 弹出框文本域内容实时剩余字数提醒
/**
   *
  	* @Description: 显示用户当前输入字数的个数，并限制不能超过规定的字数。
  	* @author 宋娟
  	* @date 2017年3月7日 下午17:20
   */
	   //  关键步骤：
	    //1.传入参数:maxLength输入字数最大限制
      // 2.strResult：用于显示限制字数的变量
  function limitWordShow(utils){
    return{
      scope:{},
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        var strResult;
        var maxLen=$attrs.maxlength;

        // 最开始加载后，显示字数限制提示
          $scope.$watch($scope.initFlag, function() {
            strResult = '<span class="strResult">(<em class="remainWords">0</em>/'+maxLen+')</span>';
            $($element).after(strResult);
            // 字数限制显示样式定义
            if($attrs.top){
              $('.strResult').css({
                'position':'absolute',
                'top':$attrs.top+'px',
                'right':'35px',
                'z-index':'100',
                'color':'#999'
              });
            }else{
              $('.strResult').css({
                'position':'absolute',
                'top':'63px',
                'right':'35px',
                'z-index':'100',
                'color':'#999'
              });
            }
          });
          // 输入框发生改变触发事件
          $($element).bind("input propertychange change",function(event){
            // 显示当前输入的字数的个数
              $('.remainWords').html($($element).val().length);
            });
        }//link
    };
  }


/**
 * 点击左侧侧边栏选项，改变其样式
 * @return {[type]} [description]
 */
function leftSideActive(){
  return{
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      //1、点击库存查询页面的侧边子菜单后触发
      $($element).on('click', 'li a', function(e){
        //2、如果含有actived样式，就先去掉样式
        if($('li').hasClass('actived')||$('a').hasClass('actived')||$('span').hasClass('actived')){
          $('li').removeClass('actived');
          $('a').removeClass('actived');
          $('span').removeClass('actived');
        }
        //3、然后把点击的该元素加上actived样式
      $(e.target).addClass('actived');
      });
    }
  };

}

/**
 *  卡片式列表页面内容超出范围的处理(动态宽度)
 */
function handleTextOverflow () {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {
      if (!attrs.type) {
        throw new Error('params type is must defined');
      }

      // 处理动态宽度的一行超出范围
      if (attrs.type === 'line') {      // 行内超出
        var _w = $(element).width() ? $(element).width() : '100%',
            _h = attrs.height;

        $(element).attr('style', 'width:'+_w+';'+'height:'+_h+';').addClass('overhide').addClass('w-space-nowrap');
      }

      // 处理动态宽度的块级元素超出范围
      if (attrs.type === 'block') {      // 块级元素超出
        var _wb = $(element).width(),
            _hb = $(element).height();

        $(element).attr('style', 'width:'+_wb+'px;height:'+_hb+'px;').addClass('text-ellips-block');
      }
    }
  };
}

/**
 * [salesorderEditShowDelbtn 新版购需单页面商品列表hover后的删除功能实现]
 * @return {[type]} [description]
 * @author liuzhen
 */
function salesorderEditShowDelbtn () {
  'use strict';
  return {
    restrict: 'A',
    scope: true,
    link: function ($scope, $element, $attrs) {

      // 获取当前元素的最后一个子元素
      var _lastChild = $element.children().last();

      // 绑定鼠标移入移出事件
      $element.hover(function () {
        $(_lastChild).find('div.sales-order-item-delbtn').each(function () {
          $(this).css('z-index','110').show();
        });
      }, function () {
        $(_lastChild).find('div.sales-order-item-delbtn').each(function () {
          $(this).css('z-index','100').hide();
        });
      });

      //为删除按钮绑定点击事件
      $(_lastChild).find('div.sales-order-item-delbtn').each(function () {
        $(this).on('click', function () {
          $(this).find('div.sales-order-confirm-del-area').show();
        });

        $element.on('mouseleave', function () {
          $(this).find('div.sales-order-confirm-del-area').hide();
        });
      });
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



      // if(scope.formData.relId){
      //   return;
      // }else{
      //
      //
      // }
    }
  };
}

/**
  	 *
  	* @Description: html编辑器
  	* @method sayMsgToOther
  	* @param
  	* @param
  	* @param msg
  	* @return
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:02

  	  修改记录：
  	   @Description: TODO(修改了什么)
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:02

  	    关键步骤：
  	    //1.传如参数：人A，人B
  		//2.如果人B==null，则返回失败标准。
  		//3.A对B说。 该逻辑很复杂，或变化多则单独写成方法
  		//4.返回成功标志。
  	 */
function umeditor ($timeout) {

  var defaultConfig={
          //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
          toolbar: ['source undo redo bold italic underline'],
          //focus时自动清空初始化时的内容
          autoClearinitialContent: true,
          //关闭字数统计
          wordCount: false,
          //关闭elementPath
          elementPathEnabled: false,

          autoHeightEnabled:false,
          //frame高度
          initialFrameHeight: 400
      };

  return {
    restrict: 'A',
    scope: {
      ngModel:"=?",
      config:"=",
      umeditor:"="

  },
    // replace: true,
      // transclude: true,
    require: 'ngModel',
    // templateUrl:  Config.tplPath +'tpl/umeditor.html',
    link: function ($scope, $element, $attrs,ngModel) {
      var _dom = $element[0];
      //默认样式
      $scope.umStyle={"width":'1000px',"height":"440px"};

      if ($attrs.umStyle) {
          if ($attrs.umStyle.indexOf("{") === 0) {
                $scope.umStyle = $scope.$eval($attrs.umStyle);
          }
      }

        $scope.editorId=$attrs.umeditor;

          var _umeditor =null;
          require(['ueditor_lang'], function(ueditor_lang) {

        function initEditor(){
            if(_umeditor)return;
           //获取当前的DOM元素
                   var _id = '_' + Math.floor(Math.random() * 100).toString() + new Date().getTime().toString();
                   var placeholder= $attrs.placeholder;
                   if(!placeholder)placeholder="";
                   var _placeholder = '<p style="font-size:14px;color:#ccc;">' +
                       placeholder +
                       '</p>';

                        var _config=null;

                       if($scope.config){
                          _config=jQuery.extend(true,{},defaultConfig,$scope.config);
                       }else{
                           _config=jQuery.extend(true,{},defaultConfig);
                       }

                   _dom.setAttribute('id', _id);
                   var _umeditor = UE.getEditor(_id, _config);

                    $scope.umeditor=_umeditor;
                   /**
                    * 对于umeditor添加内容改变事件，内容改变触发ngModel改变.
                    */
                   var editorToModel = function () {

                       if (_umeditor.hasContents())
                           ngModel.$setViewValue(_umeditor.getContent());
                       else
                           ngModel.$setViewValue(undefined);
                   };

                   /**
                    * umeditor准备就绪后，执行逻辑
                    * 如果ngModel存在
                    *   则给在编辑器中赋值
                    *   给编辑器添加内容改变的监听事件.
                    * 如果不存在
                    *   则写入提示文案
                    */

                   _umeditor.ready(function () {


                      if($attrs.initHtmlContentId){
                           _umeditor.setContent($("#"+$attrs.initHtmlContentId).html());
                            ngModel.$setViewValue(_umeditor.getContent());
                        return;
                      }else{
                        if (ngModel.$viewValue) {
                            _umeditor.setContent(ngModel.$viewValue);

                        } else {
                            _umeditor.setContent(_placeholder);
                        }
                      }
                      _umeditor.addListener('contentChange', editorToModel);

                       //_umeditor.execCommand('fontsize', '32px');
                       //_umeditor.execCommand('fontfamily', '"Microsoft YaHei","微软雅黑"')
                   });

                   /**
                    * 添加编辑器被选中事件
                    * 如果ngModel没有赋值
                    *   清空content
                    *   给编辑器添加内容改变的监听事件
                    */
                   _umeditor.addListener('focus', function () {
                        //  if($attrs.initHtmlContentId)return;
                       if (!ngModel.$viewValue) {
                          //  _umeditor.setContent('');
                           _umeditor.addListener('contentChange', editorToModel);
                       }
                   });


                   /**
                    * 添加编辑器取消选中事件
                    * 如content值为空
                    *   取消内容改变的监听事件
                    *   添加content为提示文案
                    */
                   _umeditor.addListener('blur', function () {
                       if (!_umeditor.hasContents()) {
                           _umeditor.removeListener('contentChange', editorToModel);
                           _umeditor.setContent(_placeholder);
                       } else {
                       }
                   });
        }//initEditor

        initEditor();

        //  if ($scope.$last === true) {
        //        $timeout(function () {
        //          console.log("$scope.$last $timeout");
        //           initEditor();
        //        });
        //    }
      });//require

    }//end link
  };
}

/**
	 *
	* @Description: TODO(监听日期下拉选择值，来设置开始时间和结束时间)
	* @method sayMsgToOther
	* @param peopleA
	* @param peopleB
	* @param msg
	* @return
	* @author ecolouds-01
	* @date 2016年12月15日 下午5:16:02

	  修改记录：
	   @Description: TODO(修改了什么)
	* @author ecolouds-01
	* @date 2016年12月15日 下午5:16:02

	    关键步骤：
	    //1.传如参数：人A，人B
		//2.如果人B==null，则返回失败标准。
		//3.A对B说。 该逻辑很复杂，或变化多则单独写成方法
		//4.返回成功标志。
	 */
function datePeriodSelect () {
  return{
    scope:{
      startTime:"=",
      endTime:"=",
      ngModel:"="
    },
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      /**
       * 开始结束时间设置方法
       * @param {[type]} val [description]
       */
      function  setStartAndEndTime (val){
        // 运用第三方插件moment
            var moment = require('moment');
            var startTime=moment().format("x");
            var endTime=moment().format("x");
            switch (val) {
              case "最近7天":
              startTime= moment().subtract(1, "weeks").format("x");
                break;
              case "最近10天":
              startTime= moment().subtract(10, "days").format("x");
                  break;
              case "最近一个月":
              startTime= moment().subtract(1, "months").format("x");
              break;
              default:
            }
          $scope.startTime=startTime;
          $scope.endTime=endTime;
        }

      //1.监听下拉选择的值，触发开始结束时间设置方法setStartAndEndTime。
          $scope.$watch("ngModel", function(val) {
              //2.根据监听的值设置时间。
              // console.log(val);
              setStartAndEndTime(val);

          });
    }
  };

}

//显示原图
function modalImgShow(ngDialog,utils) {
    return {
        restrict: 'A',
        // scope: {
        //     modalScope: '='
        // },
        link: function ($scope, $elem, $attrs) {

            $elem.on('click', function (e) {


                var url=$attrs.ngSrc||$attrs.src;
                if(!url){
                  console.log("url is null");
                  return;
                }
                url=url.split("@")[0];
                  var modalData='{"url":"'+url+'"}';
                  console.log(modalData);

                ngDialog.open({
                    template:  Config.tplPath +"tpl/show-original-image.html",
                    //className: 'ngdialog-theme-right',
                    cache: false,
                    trapFocus: false,
                    //overlay: false,
                    data:modalData,
                    scope: $scope,
                    controller: ["$scope", "$element", function ($scope, $element) {
                        $(".ngdialog-content", $element).width(utils.getMainBodyWidth());
                          $(".ngdialog-content", $element).height(utils.getwindowHeight());
                    }]
                });


              e.preventDefault();
            });
        }
    };
}

/**
 * 自动补全-药械 生产批次/灭菌批次/数量
 */
function angucompleteMedicalStockBatch($parse, requestData, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "placeholder": "@",
            "selectedItem": "=?",
            "url": "@",
            "titleField": "@",
            "descriptionField": "@",
            //"localData": "=?",
            "searchFields": "@",
            "matchClass": "@",
            "ngDisabled": "=?"
        },
        require: "?^ngModel",
        templateUrl: Config.tplPath + 'tpl/project/autocomplete-medicalStockBatch.html',
        link: function($scope, elem, attrs, ngModel) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 300;
            $scope.minLength = 1;
            $scope.searchStr = null;

            require(['project/angucomplete'], function(angucomplete) {
                  $scope.angucomplete1=new angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel);

            });//angucomplete

        }
    };
}//angucompleteMedicalStockBatch

/**
 * 自动补全-供应商
 */
function angucompleteSupplier($parse, requestData, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "placeholder": "@",
            "selectedItem": "=?",
            "url": "@",
            "titleField": "@",
            "descriptionField": "@",
            "ngModelId": "=?",//绑定返回对象id
            "ngModel": "=",
            "searchFields": "@",
            "matchClass": "@",
            "ngDisabled": "=?"
        },
        require: "?^ngModel",
        templateUrl: Config.tplPath + 'tpl/project/autocomplete-supplier.html',
        link: function($scope, elem, $attrs, ngModel) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 300;
            $scope.minLength = 1;
            $scope.searchStr = $scope.searchFields;
            // console.log("$scope.searchFields",$scope.searchFields);
            //绑定返回对象的某个属性值。
            if($attrs.ngModelId){
              $scope.$watch("ngModel", function(value) {
                // console.log("ngModelProperty.watch.ngModel",value);
                if(!value)return;
                $scope.ngModelId=value.id;
                $scope.searchStr=value.data.name;
              }, true);
            }

            require(['project/angucomplete'], function(angucomplete) {
                  $scope.angucomplete1=new angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel);

            });//angucomplete

        }
    };
}

/**
 * 自动补全-药械
 */
function angucompleteMedical($parse, requestData, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "placeholder": "@",
            "selectedItem": "=?",
            "url": "@",
            "titleField": "@",
            "descriptionField": "@",
            //"localData": "=?",
            "searchFields": "@",
            "matchClass": "@",
            "ngDisabled": "=?"
        },
        require: "?^ngModel",
        templateUrl: Config.tplPath + 'tpl/project/autocomplete-medicalStock.html',
        link: function($scope, elem, attrs, ngModel) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 300;
            $scope.minLength = 1;
            $scope.searchStr = null;

            require(['project/angucomplete'], function(angucomplete) {
                  $scope.angucomplete1=new angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel);

            });//angucomplete

        }
    };
}

/**
 * 闪加药械
 ngModel={
 data:{},//药械基本信息
 count：10 //输入数量
}
 */
function flashAddMedical() {
    return {
        restrict: 'EA',
        scope: {
            "ngModel": "=",
            "addDataCallbackFn":"&",
            "formData": "=?"
        },
        require: "?^ngModel",
        templateUrl: Config.tplPath + 'tpl/project/flashAddMedical.html',
        link: function($scope, elem, $attrs, ngModel) {

          $attrs.$observe("ajaxUrl", function(newVal, oldVal) {
            $scope.ajaxUrl = newVal;
          });

          // 如果属性isDisabledThis未定义，则不开启条件限制查询药械
          if (!angular.isDefined($attrs.isDisabledThis)) { $scope.isCustomerId = true; }

          // 监控用户是否已选择客户或供应商
          $attrs.$observe('isDisabledThis', function (newVal, oldVal) {
            if (newVal) {
              $scope.isCustomerId = true;
            }
          });

          //添加业务数据
          $scope.addDataFn = function () {
            if(!$scope.addDataCallbackFn){
              console.log("scope.addDataCallback function is null!");
              return true;
            }

            var  flag=$scope.addDataCallbackFn($scope.ngModel);
            if(!flag){//业务逻辑判断添加失败，则不清空数据。
              return false;
            }
              //清空输入数据
            $scope.ngModel={};
            //自动补全查询输入框获得焦点
            $('#angucompleteMedical_searchInputId').val("");
            $('#angucompleteMedical_searchInputId').trigger('focus');
            return false;

          };

          //input输入框回车事件。
          $scope.handleAddThisItem = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
              $scope.addDataFn();
            }
              return false;
          };

        }
    };
}

/**
  用户自定义表结构显示。
*/
function customTable() {
  return {
    restrict: 'EA',
    replace: true,
    //  transclude: true,
    templateUrl:  Config.tplPath +'tpl/project/customTable.html',
    // compile: function() {
    //            return function (scope, element, attrs,$ctrl,transcludeFn) {
    //                transcludeFn(scope, function(clone) {
    //
    //
    //                  console.log(clone);
    //
    //                    var title= element.find('title');
    //                    var time = clone.find('.time');
    //                    var type = clone.find('.type');
    //                    var text= clone.find('.content');
    //
    //                    title.append(time);
    //                    element.append(type);
    //                    element.append(text)
    //                });
    //            };
    //        },
          link: function ($scope, $element, $attrs,$ctrl,$transclude) {

            //
            //   $transclude($scope,function(clone){
            //     console.log(clone);
            //     $element.append(clone);
            // })

            if ($attrs.checkboxShow) {
                $scope._checkboxShow=$attrs.checkboxShow;
            }
            if ($attrs.customTable) {
                $scope._customTableName=$attrs.customTable;
            }
            if ($attrs.customTrMenus) {
                $scope._customTrMenus=$attrs.customTrMenus;
            }
          }
  };
}



// tableTrMouseOverMenu table标签，移动上去显示菜单按钮。
/**
   *
  	* @Description: 鼠标移入高亮并显示两个按钮
  	* @author liumingquan
  	* @date 2016年12月19日 下午4:32:59
   */

   	   //  关键步骤：
   	    //1.传入参数:url(跳转路径)，className(控制样式的class)
   		//2.mouseenter:表示鼠标移入之后要执行的步骤。
   		//3.mouseleave:表示鼠标移出后执行的步骤。
function tableTrMouseOverMenu(utils,$compile,customMenuUtils){
  return{

    restrict: 'A',
      link: function ($scope, $element, $attrs) {

        //弹出菜单的div(装两个按钮的div)
        var  moveBtnDiv=$("<div></div>");

        // console.log("html"+ moveBtnDiv.html());

        // 鼠标移入显示按钮
        $($element).mouseenter(function(e){
          // console.log(utils.getMainBodyWidth());

          var bottomButtonList=$scope[$attrs.tableTrMouseOverMenu];
          var dataObj=$scope[$attrs.businessData];

          $scope._tableTrMouseOverMenus=customMenuUtils.parseVariableMenuList(bottomButtonList,dataObj);
          //创建菜单按钮。
          var tmp_template='<span query-item-card-button-list="_tableTrMouseOverMenus"></span>';
          moveBtnDiv.html(tmp_template);
          $compile(moveBtnDiv.contents())($scope);

          // var btnArray=[];
          //按钮数量，用于计算弹出菜单的div宽度
          var btnCount=0;
          if($scope._tableTrMouseOverMenus){
            btnCount=$scope._tableTrMouseOverMenus.length;
          }
          $element.addClass("bg-c");
          if(!moveBtnDiv)return;
          //+document.body.scrollLeft+
          moveBtnDivWidth=34*btnCount;
          console.log("document.body.scrollLeft",document.body.scrollLeft);
          var y =$element.offset().top -document.body.scrollTop;
          var x= utils.getwindowWidth()-10-moveBtnDivWidth; //有bug，table没有全拼暂满时，弹出按钮不能点击bug。 要求table 宽度 100%

          // var x=e.clientX+10; //根据鼠标位置定位，解决上面bug。
          if(x<0)x=0;
          //
          moveBtnDiv.css({
             "position": "fixed",
             "width":moveBtnDivWidth,
             "height":$element.height(),
             "top": y,
             "left": x
           });
          //  console.log("moveBtnDivWidth="+moveBtnDivWidth+",x="+x+",y="+y+",utils.getMainBodyWidth()="+utils.getMainBodyWidth());
          //  console.log("e.pageX="+e.pageX+",e.pageY"+e.pageY);

           $(this).append(moveBtnDiv);


        });//mouseenter
        // 鼠标移出按钮消失
        $($element).mouseleave(function(){
          $(this).removeClass("bg-c");
          moveBtnDiv.remove();
          // for(var i=0;i<btnArray.length;i++){
          //     // $(btnArray[i]).remove();
          // }

        });//mouseleave
      }//link
  };
}

/**
  用户自定义表结构显示。
*/
function customTableTd($sce) {
  return {
    restrict: 'EA',
    scope: {
      item:"=",
    },
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/customTableTd.html',

          link: function ($scope, element, $attrs) {
            post.trustedBody = $sce.trustAsHtml(post.html_body);

            if ($attrs.customTable) {
                $scope.customTableName=$attrs.customTable;
            }
          }
  };
}

/**
    用户自定义表 可以调整宽度指令
*/
function customTablePrint() {
  return {
    restrict: 'EA',
    scope: false,
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/customTablePrint.html',
      link: function ($scope, element, $attrs) {
        if ($attrs.customTablePrint) {
            $scope.customTablePrintName=$attrs.customTablePrint;
        }
      }
  };
}

   //添加scope 的公共事件，是否显示，点击事件，等
 function addCommonsEventFnToSope($scope){
   //点击按钮事件，
   $scope.ngClick2=function(ngClick){
        var tmp=$scope.$parent.$eval(ngClick);
          console.log("ngClick2",ngClick,tmp);
    };
       //弹出确认框，取消事件
    $scope.cancelCallback=function(ngClick){
         var tmp=$scope.$parent.$eval(ngClick);
           console.log("cancelCallback",ngClick,tmp);
     };
         //按钮显示执行脚本事件
      $scope.ngShow2=function(ngIf){
         //不填写默认true，允许显示
         if(!ngIf)return true;
         var tmp= $scope.$parent.$eval(ngIf);
        //  console.log("ngShow2",ngIf,tmp);
            return tmp;
      };
                   //按钮是否可操作执行脚本事件
     $scope.ngDisabled2=function(ngIf){
       //不填写默认false，允许操作
          if(!ngIf)return false;
         var tmp= $scope.$parent.$eval(ngIf);
          console.log("ngDisabled2",ngIf,tmp);
          return tmp;
    };
 }
/**
  底部按钮列表
*/
function bottomButtonList() {
  return {
    restrict: 'EA',
    scope: {
      spanClass:"=?",
      bottomButtonList:"=?"
    },
    // replace: true,// true时 导致$scope作用域下，属性添加失效。
    templateUrl:  Config.tplPath +'tpl/project/bottomButtonList.html',
    link: function ($scope, $element, $attrs) {
       //添加scope 的公共事件，是否显示，点击事件，等
      addCommonsEventFnToSope($scope);

      if(!$scope.spanClass) { $scope.spanClass="mgl"; }
      $scope.defalutItemClass="btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg";
    }
  };
}

/**
  查询列表(卡片)条目列表
*/
function queryItemCardButtonList() {
  return {
    restrict: 'EA',
    scope: {
       spanClass:"=?",
        queryItemCardButtonList:"=?"
      },
    // replace: true,// true时 导致$scope作用域下，属性添加失效。
    templateUrl:  Config.tplPath +'tpl/project/queryItemCardButtonList.html',
    link: function ($scope, $element, $attrs) {

          //添加scope 的公共事件，是否显示，点击事件，等
         addCommonsEventFnToSope($scope);
          if(!$scope.spanClass)$scope.spanClass="mgl";
          $scope.defalutItemClass="btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg";
    }
  };
}

/**
    用户自定义表结构-打印显示
*/
function resizableColumns() {
  return {
    restrict: 'EA',

          link: function ($scope, $element, $attrs) {

                        require(['store','resizableColumns'], function(store) {
                              $element.resizableColumns({
                                      store: store
                                    });
                        });
          }//end link
  };
}

/**
 * [addressManageComponent 地址管理组件，包含待选、已选地址列表]
 * @param  {[type]} requestData [注入项]
 * @param  {[type]} utils       [注入项]
 * @return {[type]} [description]
 */
function addressManageComponent (requestData, utils) {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      formData: '=?',
      requestUrl : '@',
      createAddressType: '@',
      requestDataId: '@',
      invoicesGetCallBack: '&',
      reloadTime: '@',
      modifyModalTitle: '@',
      createModalTitle: '@',
      compnentTitle: '@',
      scopeDataPrefix: '@',
      modifyModalUrl: '@',
      createModalUrl: '@',
      setDefaultAddressRequesturl: '@',
      delThisAddressRequesturl: '@',
      contactsNull: '@'
    },
    replace: true,
    transclude: true,
    templateUrl: Config.tplPath + 'tpl/project/addressManageComponent.html',
    link: function (scope, element, attrs) {
      //客户地址列表是否为空的标识
      scope.contactsNull = false;

      // 监控发货方id变化
      scope.$watch('requestDataId', function (newVal, oldVal) {
        if (newVal && newVal!==oldVal) {
          reLoadData(scope);
        }
      });

      // 重新加载数据
      var reLoadData = function (scope) {
        var _reqUrl = scope.requestUrl + '?id=' + scope.requestDataId + '&type=' + scope.createAddressType;
        requestData(_reqUrl, {}, 'get')
        .then(function (results) {
          var _data = results[1];
          if (_data.code === 200 && scope.returnAddressObj) {
            scope.returnAddressObj.contacts = _data.data.contacts;
            if (!_data.data.contacts) {
              scope.formData.contactsNull = true;
            }
          }
        })
        .catch(function (error) {
          console.log(error || '出错');
        });
      };

      //响应重新加载列表数据的操作
      scope.$on('reloadAddressList', function () {
        reLoadData(scope);
      });
    },
    controller: ["$scope", "$element", function ($scope, $element) {

      // 定义已选择地址id，用户选择其他地址后，将选择地址id存入，重新读取地址列表后检测此字符串保持用户已选择的地址
      $scope.choisedItemId = '';

      // 判断默认选中
      $scope.chkDefaultChoise = function (_id) {
        if (!$scope.formData.id) {      // 如果是新建，将该参数id与默认返回地址做比较
          if ($scope.returnAddressObj.choisedItemId && $scope.returnAddressObj.choisedItemId === _id) { return true; }
          if ($scope.returnAddressObj.defaultContactId === _id) { return true; }
        } else {        // 如果是编辑
          // if ($scope.returnAddressObj.choisedItemId && $scope.returnAddressObj.choisedItemId === _id) { return true; }
          if ($scope.formData[$scope.scopeDataContacts].id === _id) { return true;}
        }
      };

      //页面加载数据请求成功后立即执行的回调函数
      $scope.addressGetCallBack = function () {

        if (!$scope.returnAddressObj) return false;

        $scope.scopeDataId = $scope.scopeDataPrefix + 'Id';   // 构建地址id名
        $scope.scopeDataContacts = $scope.scopeDataPrefix + 'Contacts';  // 构建地址对象名

        // 创建发送数据体中的地址id
        if (!$scope.formData[$scope.scopeDataId]) {
          $scope.formData[$scope.scopeDataId] = $scope.returnAddressObj.defaultContactId;
        }

        // 如果为新建则将默认地址信息存入formData数据体，否则将返回数据存入数据体
        if (!$scope.formData.id) {
          var _contacts = $scope.returnAddressObj.contacts;

          if (_contacts && !$scope.choisedItemId) {
            for (var i=0; i<_contacts.length; i++) {
              if ($scope.returnAddressObj.defaultContactId === _contacts[i].id) {
                $scope.formData[$scope.scopeDataContacts] = _contacts[i];
              }
            }
          }
        }

        //如果是新添加的一条地址数据，则默认放入数据体中
        if ($scope.returnAddressObj.contacts && $scope.returnAddressObj.contacts.length === 1) {
          $scope.formData[$scope.scopeDataContacts] = $scope.returnAddressObj.contacts[0];
          $scope.formData.contactsNull = false;
        }

        // 如果choisedItemId存在，则表示用户已选择其他地址
        if ($scope.choisedItemId) {
          $scope.returnAddressObj.choisedItemId = $scope.choisedItemId;
        }

      };

      // 构建方法返回当前循环的地址item，用于修改地址信息
      $scope.getCurrentIndexAddress = function (index) {

        if (!$scope.returnAddressObj) return false;

        var _tmpObj = {},   // 返回的数据对象
            _contact = $scope.returnAddressObj.contacts[index],
            _moduleAddressId = $scope.scopeDataPrefix + 'AddressId';  // 构建模块id名

        _tmpObj[_moduleAddressId] = $scope.returnAddressObj.id;
        _tmpObj.defaultContactId = $scope.returnAddressObj.defaultContactId;
        _tmpObj.contact = _contact;
        _tmpObj.type = $scope.createAddressType;  // 类型
        _tmpObj.title = $scope.modifyModalTitle;  // 标题

        return _tmpObj;
      };

      // 返回新建地址信息数据对象
      $scope.returnCreateNewAddressObj = function () {

        var _tmpObj = {},   // 返回的数据对象
            _moduleAddressId = $scope.scopeDataPrefix + 'AddressId';  // 构建模块id名

        if ($scope.returnAddressObj) {
          _tmpObj[_moduleAddressId] = $scope.returnAddressObj.id;
        }

        _tmpObj.type = $scope.createAddressType;

        // 根据设置存入标题
        _tmpObj.title = $scope.createModalTitle;

        _tmpObj.contact = {};

        return _tmpObj;
      };

      // 用户点击后选择其他地址
      $scope.choiseOtherItem = function (item, _requestDataId) {
        $scope.formData[$scope.scopeDataId] = _requestDataId;
        $scope.formData[$scope.scopeDataContacts] = item;
        $scope.choisedItemId = item.id;
        // console.log($scope.formData);
      };

      // 设置当前地址为默认地址
      $scope.setThisAddressToDefault = function (contactId) {

        // var _moduleAddressId = $scope.scopeDataPrefix + 'AddressId';  // 构建模块id名
        var _moduleAddressId = 'invoicesAddressId';  // 构建模块id名
        var _data = {};
        _data[_moduleAddressId] = $scope.returnAddressObj.id;
        _data.contactId = contactId;

        requestData($scope.setDefaultAddressRequesturl, _data, 'POST')
        .then(function (results) {
          // ....
        })
        .catch(function (error) {
          if (error) {
            console.log(error || '出错!');
          }
        });
      };
    }]//controller
  };
}

/**
 * [expressManageComponent 物流信息组件]
 * @param  {[type]} requestData [注入项]
 * @param  {[type]} utils       [注入项]
 * @return {[type]}             []
 */
function expressManageComponent (requestData, utils) {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      expressData: '=?',  // 请求的物流信息对象
      saveExpressUrl: '@',    // 保存新的物流信息请求Url
      delExpressUrl: '@',    // 删除物流信息请求Url
      orderId: '@'    // 当前单据id
    },
    replace: true,
    transclude: true,
    templateUrl: Config.tplPath + 'tpl/project/expressManageComponent.html',
    link: function (scope, element, attrs) {
      // 如果快递数据未定义
      if (!angular.isDefined(attrs.expressData)) {
        throw new Error('Attr expressData must be defined!');
      }

      //编辑物流信息
      scope.editThisAreaInfo = function (item, id) {
        //获取当前物流信息id名
        var _expressId = 'express-details-' + id;

        $('#'+_expressId).find('div.show-express-info').hide();
        $('#'+_expressId).find('div.edit-express-info').css('top',0);

      };

      //取消编辑物流信息
      scope.cancelEditExpress = function (id) {
        //获取当前物流信息id名
        var _expressId = 'express-details-' + id;

        $('#'+_expressId).find('div.show-express-info').show();
        $('#'+_expressId).find('div.edit-express-info').css('top','-9999px');
      };

    },
    controller: ['$scope', '$element', function ($scope, $element) {

      //保存新的快递信息
      $scope.saveExpressInfo = function (params) {
        var _data = angular.isObject(params) ? params : '';
        var saveUrl = $scope.saveExpressUrl;
        if (_data) {
          requestData(saveUrl, _data, 'POST')
          .then(function (results) {
            if (results[1].code === 200) {
              utils.goOrRefreshHref();
            }
          })
          .catch(function (error) {
            console.log(error || '出错');
          });
        }
      };
    }]
  };
}

/**
 * [pageMainHeaderComponent 模块主内容区域头部通组件]
 * @return {[type]} [description]
 */
function pageMainHeaderComponent () {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      listParams: '=?',             // 请求查询的参数对象
      crumbsNav: '@',               // 面包屑导航
      componentTitle: '@',          // 头部标题
      createNewUrl: '@',            // 新建URL
      getStatusNumUrl: '@',         // 获取所有单据状态数量URL
      statusGroupData: '@',         // 状态显示数据对象
      getBusinessTypeUrl: '@',      // 获取业务类型查询字段Url
      isShowSelectItem: '@',
      searchPlaceholderInfo: '@'
    },
    replace: true,
    transclude: true,
    templateUrl: Config.tplPath + 'tpl/project/pageMainHeaderComponent.html',
    link: function (scope, element, attrs) {

      //处理面包屑导航数据
      if (scope.crumbsNav) {
        //将面包屑字符串转换为JSON对象
        var _crumbObj = angular.fromJson(scope.crumbsNav);
        //构建面包屑html代码
        scope.crumbsCode = '';
        angular.forEach(_crumbObj, function (data, index) {
          if ((index+1) !== _crumbObj.length) {   // 不是最后一个
            scope.crumbsCode += '<span class="mgr-s ' + data.style + '">' + data.name + '</span><span class="fa fa-angle-right mgr-s"></span>';
          } else {    //最后一个
            scope.crumbsCode += '<span class="mgr-s ' + data.style + '">' + data.name + '</span>';
          }
        });
        //将代码插入id为crumbsNav的父容器中
        $('#crumbsNav').append(scope.crumbsCode);
      }

      //状态按钮组格式化数据对象
      if (scope.statusGroupData) {
        scope.statusGroupList = angular.fromJson(scope.statusGroupData);
      }

      //拆分数据显示
      scope.splitStringData = function (str) {
        var _tmp = str.split('-');
        _tmp[1] = Boolean(_tmp[1]);
        return _tmp;
      };

      // 处理显示下拉选择功能
      if (scope.isShowSelectItem) {
        scope.selectObj = angular.fromJson(scope.isShowSelectItem);
        scope.itemChooise = scope.selectObj[0].link;
      }

      //是否显示新建按钮
      scope.isShowCreateBtn = angular.isDefined(attrs.isShowCreateBtn) ? attrs.isShowCreateBtn : false;

      //是否显示类型过滤
      scope.isShowTypeFilter = angular.isDefined(attrs.isShowTypeFilter) ? attrs.isShowTypeFilter : false;

      //是否显示日期过滤
      scope.isShowDateFilter = angular.isDefined(attrs.isShowDateFilter) ? attrs.isShowDateFilter : false;

      // 是否显示关键字过滤
      scope.isShowKeyFilter = angular.isDefined(attrs.isShowKeyFilter) ? attrs.isShowKeyFilter : false;

      // 是否显示单据状态筛选按钮组模块
      scope.isShowBusinessBtnGroup = angular.isDefined(attrs.isShowBusinessBtnGroup) ? attrs.isShowBusinessBtnGroup : false;

      // 关键字搜索中提示信息定义
      scope.searchPlaceholderInfo = angular.isDefined(attrs.searchPlaceholderInfo) ? attrs.searchPlaceholderInfo : '客户名 / 单据编号';

    }
  };
}

/**
 * [expressBtnToggle 销售出库单中快递模块的删除和编辑域响应hover事件]
 * @return {[type]} [description]
 */
function expressBtnToggle () {
  'use strict';
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, element, attrs) {

      $(element).find('a.origin-ele').hover(function () {
        $(this).next().show();
      }, function () {
        $(this).next().hide();
      });

      $(element).find('div.edit-del-btn').hover(function () {
        $(this).show();
      }, function () {
        $(this).hide();
      });

      $(element).find('a.handle-edit-info').on('click', function (event) {
        event.stopPropagation();    // 组织冒泡

        $(element).find('div.show-express-info').hide();
        $(element).find('div.edit-express-info').css('top',0);
      });

      $(element).find('a.cancel-edit-express').on('click', function (event) {
        event.stopPropagation();    // 组织冒泡

        $(element).find('div.show-express-info').show();
        $(element).find('div.edit-express-info').css('top','-9999px');
      });
    }
  };
}

/**
 * [requestExpressInfoTab 销售出库单中物流信息dialog切换快递请求数据]
 * @return {[type]} [description]
 */
function requestExpressInfoTab (requestData, alertError) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      expressInfoList: '='
    },
    link: function (scope, element, attrs) {

      $(element).on('click', function (e) {
        //阻止事件冒泡
        e.stopPropagation();
        //替换样式
        $(this).addClass('active').parent().siblings().each(function () {
          $(this).children().removeClass('active');
        });
        //切换
        var _idArray = [];
        $(element).parent().siblings().each(function () {
          var _childId = $(this).children().attr('id');
          _idArray.push('tabContent' + _childId);
        });

        //隐藏其他页面信息
        angular.forEach(_idArray, function (data, index) {
          $('#'+data).addClass('pr-dpy-none');
        });

        //显示当前列表
        $('#tabContent' + attrs.id).removeClass('pr-dpy-none');
      });
    }
  };
}

/**
 * [MedicalStockMouseoverExtendion 表格行内鼠标移入后显示操作按钮扩展版]
 * @param {[type]} utils [description]
 */
function medicalStockMouseoverExtendion (utils) {
  'use strict';
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, element, attrs) {
      // var _template = '<div class="table-item-handle-btn">'+
      //     '<div class="table-item-confirm-del-area bg-white">'+
      //       '<p class="bb-line color-red pd-v">确认删除本条数据?</p>'+
      //       '<p class="pdt">'+
      //         '<a href="javascript:;" class="cancelHandle" ng-click="cancelHandle()">取消</a>'+
      //         '<a href="javascript:;" class="confirm-del-this btn btn-primary pr-btn-xsm pr-btn-bg-gold mgl" ng-click="formData.orderMedicalNos.splice($index,1);">确认</a>'+
      //       '</p>'+
      //     '</div>'+
      //   '</div>';

      var _template = '<div id="test" style="width:32px;height:32px;background-color:#f60;border-radius:50%;text-align:center;color:#fff;position:absolute;top:0;left:0;">Test</div>';

      element.hover(function () {
        $(this).append(_template);
      }, function () {
        $('#test').remove();
      });



    }
  };
}

angular.module('manageApp.project')
  .directive("pageMainHeaderComponent", pageMainHeaderComponent)
  .directive("expressManageComponent", ['requestData', 'utils', expressManageComponent])
  .directive("tableItemHandlebtnComponent", ['utils', tableItemHandlebtnComponent])
  .directive("requestExpressInfoTab", ['requestData', 'alertError', requestExpressInfoTab])
  .directive("expressBtnToggle", [expressBtnToggle])
  .directive("htmlEdit", [ htmlEdit]) //html-edit
  .directive("textareaJson", ['utils', 'alertError', textareaJson]) //textarea-json
  .directive("addressManageComponent", ['requestData', 'utils', addressManageComponent])  //地址管理组件，包含待选、已选地址列表
  .directive("attachmentsItemShow", [attachmentsItemShow])//附件文件显示
  .directive("attachmentsShow", [attachmentsShow])//附件只读显示
  .directive("attachmentsEdit", [attachmentsEdit])//附件上传编辑
  .directive("bottomButtonList", [bottomButtonList])//底部自定义菜单
  .directive("queryItemCardButtonList", [queryItemCardButtonList])//查询页面菜单
  .directive("customTablePrint", [customTablePrint])
  .directive("resizableColumns", [resizableColumns])//  用户自定义表 可以调整宽度指令
  .directive("customTable", [customTable])
  .directive("flashAddMedical", [flashAddMedical])
  .directive("angucompleteMedicalStockBatch", ["$parse", "requestData", "$sce", "$timeout",angucompleteMedicalStockBatch])
  .directive("angucompleteMedical", ["$parse", "requestData", "$sce", "$timeout",angucompleteMedical])
  .directive("angucompleteSupplier", ["$parse", "requestData", "$sce", "$timeout",angucompleteSupplier])
  .directive("modalImgShow", ["modal","utils",modalImgShow])//显示原图
  .directive("datePeriodSelect", [datePeriodSelect])
  .directive("umeditor", ["$timeout",umeditor])  // html编辑器
  .directive("salesorderEditShowDelbtn", [salesorderEditShowDelbtn])
  .directive("handleTextOverflow", [handleTextOverflow])  // 卡片式列表页面内容超出范围的处理(动态宽度)
  .directive("hospitalPurchaseComeinEdit", [hospitalPurchaseComeinEdit])  //医院采购目录点击进入编辑模式事件处理
  .directive("saleOutStockKuaDi", [saleOutStockKuaDi])  //销售出库单快递侧边栏显示
  .directive("lodopFuncs", ["modal","utils",lodopFuncs])//打印组件
  .directive("canvasBusinessFlow", ["modal","utils",canvasBusinessFlow])//业务单流程图形展示-canvas
  .directive("businessFlowShow", [businessFlowShow])//业务单流程展示
  .directive("canvasWorkflow", ["modal","utils",canvasWorkflow])//工作流编辑
  .directive("queryOrderStatusButton", queryOrderStatusButton)//查询页面，查询条件：状态按钮
  .directive("intervalCountdown", ["$interval",intervalCountdown])//倒计时标签
  .directive("workflowRejectButton",  ['utils', workflowRejectButton])//工作流配置自定义菜单 驳回
  .directive("workflowPassButton",  ['utils', workflowPassButton])//工作流配置自定义菜单 通过
  .directive("workflowButtonQueryCard",  ['utils', workflowButtonQueryCard])//工作流配置菜单 查询列表使用
  .directive("customMenuList",  ['utils', customMenuList])//自定义菜单。列表显示
  .directive("workflowTaskRunWithAttchments",  ['utils', workflowTaskRunWithAttchments])//待附件审查
  .directive("orderMedicalsPurchase", orderMedicalsPurchase)//药械订单列表-采购
  .directive("orderMedicals", orderMedicals)//药械订单列表
  .directive("niceScroll", niceScroll) //滚动条美化
  .directive("leftMenuChange", ['$location', leftMenuChange]) //左边栏子菜单点击事件
  .directive("leftMenuToggle", ['$location', leftMenuToggle])  //左边栏一级菜单伸缩
  .directive("orderStatusChoise", orderStatusChoise) //订单列表首页订单状态按钮切换样式
  .directive("orderListTips", orderListTips) //订单页头导航按钮点击事件处理
  .directive("toggleLeftMenu", toggleLeftMenu) //点击展开隐藏左边栏
  .directive("togglePanel", togglePanel) //面板点击收起、展开与关闭
  .directive("morris", morris) //morris图表展示
  .directive("icheck", icheck) //iCheck
  .directive("sparkline", sparkline) //sparkline 柱状图
  .directive("runTooltips", runTooltips) //tooltips
  .directive("runPopovers", ['$timeout', runPopovers]) //popover
  .directive("handleThisClick", ['$window', 'dialogConfirm', 'requestData', 'alertOk', 'alertError','utils', handleThisClick]) //带确认对话框的按钮点击事件
  .directive("leftMenuSecondToggle", ['$location', leftMenuSecondToggle]) //左侧二级菜单切换效果
  .directive("styleToggle", ['$location', styleToggle])
  .directive("leftSideActive",[leftSideActive])//库存页面侧边导航样式
  .directive("tableTrMouseOverMenu",["utils","$compile","customMenuUtils",tableTrMouseOverMenu])  // tableTrMouseOverMenu table标签，移动上去显示菜单按钮。
  .directive("medicalStockMouseOver",["utils",medicalStockMouseOver])// 库存明细模块，鼠标移入高亮并显示两个按钮
  .directive("stepFlowArrowShow",["utils",stepFlowArrowShow])//医院、经销商/零售商资格申请，首营品种、企业管理模块流程箭头样式。
  .directive("limitWordShow",["utils",limitWordShow])//弹出框显示限制剩余字数
  .directive("medicalStockMouseoverExtendion", ["utils", medicalStockMouseoverExtendion]);  //表格行内鼠标移入后显示操作按钮扩展版
});
