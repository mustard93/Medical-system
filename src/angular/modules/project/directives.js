/**
 * 项目自定义指令
 */
define('project/directives', ['project/init'], function () {
  /**
   * [textareaJson json编辑器]
   * @method textareaJson
   * @param  {[type]}     utils      [description]
   * @param  {[type]}     alertError [description]
   * @return {[type]}                [description]
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
   * [htmlEdit html-edit编辑器  使用方式：<html-edit ng-model="htmlString"  div-id="divId"></html-edit>]
   * @method htmlEdit
   * @return {[type]} [description]
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
   * [attachmentsItemShow 附件文件显示]
   * attachmentsExtend={"edit":true}
   * edit：是否可编辑
   * 资质证照
   * @method attachmentsItemShow
   * @return {[type]}            [description]
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
    附件文件显示
    attachmentsExtend={"edit":true}
    edit：是否可编辑
    电子档案
  */
  function eAttachmentsItemShow() {
    return {
      restrict: 'EA',
      scope: {
          eAttachmentsItemExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/eAttachmentsItemShow.html'
    };
  }

  /**
    附件列表-只读显示
    attachmentsExtend={"title":"审核资料"}
    title：显示标题
    资质证照
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
    附件列表-只读显示
    attachmentsExtend={"title":"审核资料"}
    title：显示标题
    电子档案
  */
  function eAttachmentsShow() {
    return {
      restrict: 'EA',
      scope: {
          eAttachmentsExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/eAttachmentsShow.html'
    };
  }

  /**
    附件列表-编辑
    attachmentsExtend={"title":"审核资料","usege":"首营企业申请","addFlag":true}
    title：显示标题
    usege：上传附件用途说明
    addFlag：是否允许添加额外附件
    资质证照
  */
  function attachmentsEdit() {
    return {
      restrict: 'EA',
      scope: {
          attachmentsExtend:"=",
          enterpriseType:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/attachmentsEdit.html'
    };
  }
  /**
    录入审核人-编辑
    auditContactsExtend={"title":"首营企业审核人","usege":"首营企业申请","addFlag":true}
    title：显示标题
    usege：上传附件用途说明
    addFlag：是否允许添加额外附件
  */
  function auditContactsEdit() {
    return {
      restrict: 'EA',
      scope: {
          auditContactsExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/auditContactsEdit.html'
    };
  }

  /**录入审核人显示
    录入审核人-只读显示
    auditContactsExtend={"title":"审核资料"}
    title：显示标题
    资质证照
  */
  function auditContactsShow() {
    return {
      restrict: 'EA',
      scope: {
          auditContactsExtend:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/auditContactsShow.html'
    };
  }

  /**
    附件列表-编辑
    attachmentsExtend={"title":"审核资料","usege":"首营企业申请","addFlag":true}
    title：显示标题
    usege：上传附件用途说明
    addFlag：是否允许添加额外附件
    电子档案
  */
  function eAttachmentsEdit() {
    return {
      restrict: 'EA',
      scope: {
          eAttachmentsExtend:"=",
          enterpriseType:"=",
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/eAttachmentsEdit.html'
    };
  }

  /**
    添加联系人模板-编辑
  */
  function addContactsEdit() {
    return {
      restrict: 'EA',
      scope: {
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/addContactsEdit.html'
    };
  }
  /**
    添加联系人模板-显示
  */
  function addContactsShow() {
    return {
      restrict: 'EA',
      scope: {
          ngModel: "="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/addContactsShow.html'
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

        // 扩展用于盘点模块：按货位盘点，已选的货位，打开侧边框后会打开相应货位的panel
        if ($attrs.toggleChecked) {

          var toggleChecked=$attrs.toggleChecked;

          if (toggleChecked=="true") {
              // $(element).parents(".panel").children(".panel-body").slideDown(200);
              $(element).click();

          }
        }

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
          // 对话框内容颜色
          var _dialogContentColor = angular.isDefined($attrs.dialogContentColor) ? $attrs.dialogContentColor : '#333';
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
  左侧二级菜
    leftNavigationMenu={"edit":true}
    <div left-navigation-menu="menu" no-author-filter="true"></div>
    edit：是否可编辑
  */
  function leftNavigationMenu(uiTabs,$rootScope) {
    return {
      restrict: 'EA',
      scope: {
          noAuthorFilter:"@?",//不验证权限，全部显示用于 预览菜单
          leftNavigationMenu:"="
      },
      replace: true,
      templateUrl:  Config.tplPath +'tpl/project/leftNavigationMenu.html',
      link:function($scope,elment,attrs) {

          // console.log("uiTabs",uiTabs);




      }
    };
  }
  /**
   *	左侧二级菜单切换效果（临时解决方案，无法与一级菜单点击事件指令集成在一起）
   */
  function leftMenuSecondToggle ($location,$rootScope) {

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
            //"http://localhost:3000/src/manage/index.html#/manageDepartment/query.html?type=%E5%8C%BB%E7%96%97%E6%9C%BA%E6%9E%84"
              var newUrl=decodeURI(newUrl);
            LeftMenuObj.doRoute(newUrl);
          });
        },//startListen
        //添加路由，支持自定义key
        add:function(keyArr,elementMenu,routeData ){


          if(keyArr&&keyArr.length>0){//  自定义key
            for(var i=0;i<keyArr.length;i++){
                this.routeMap[keyArr[i]]=elementMenu;
            }
          }
          // #/purchaseOrder/query.html?t=123
          var url=  elementMenu.attr("href");
          if(routeData){
            url=routeData;
          }
          if(!url)return;

          url=url.split('#')[1];  // /purchaseOrder/query.html?t=123

          if(url)this.routeMap[url]=elementMenu;
          if(url)url=url.split('?')[0];  // /purchaseOrder/query.html
          if(url)this.routeMap[url]=elementMenu;
          if(url)url=url.split('/')[1]; // purchaseOrder
          if(url)this.routeMap[url]=elementMenu;

        }//end key

    };

    return {
      restrict: 'A',
      scope: {
        leftMenuSecondToggle:"=?",//不验证权限，全部显示用于 预览菜单
        leftNavigationMenu:"="
      },

      link: function ($scope, $element, $attrs) {
        var keyArr=null;
        if($attrs.keyArr){
            keyArr=$scope.$eval($attrs.keyArr);
        }
        LeftMenuObj.add(keyArr,$element,$scope.leftMenuSecondToggle);
        LeftMenuObj.startListen($rootScope);

        //$location.path()="/manageDepartment/query.html"
        //$location.url()="/manageDepartment/query.html?type=%E5%8C%BB%E8%8D%AF"

        // "#/manageDepartment/query.html?type=%E5%8C%BB%E8%8D%AF  "
        //=>
        //"#/manageDepartment/query.html?type=医药"
        var tmpUrl=decodeURI("#"+$location.url());
        LeftMenuObj.doRoute(tmpUrl);

        //$location.path()="/manageDepartment/query.html"
        //$location.url()="/manageDepartment/query.html?type=%E5%8C%BB%E8%8D%AF"
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
   *
   * @Description: 点击发起请求,进行排序  表格排序，根据点击不同的标题，对相应列进行按该字段排序。
   * @author 宋娟
   * @date 2017年07月13日 上午11:04:59
   */

  function tableToggleSort (modal,utils,requestData) {
    'use strict';
    return {
        restrict: 'AE',
      link: function ($scope, element, $attrs) {
        // 表格数据传入Jason格式
        var tbodyList=$scope.$eval($attrs.tBodyList);
        // 请求重新排序接口
        var sortRequestUrl=$attrs.sortRequestUrl;
        // 每一个标题的集合，按照顺序
        var thList=element.children('th');
        // 可以进行排序的表头，增加鼠标移入样式。
        var tableData=$scope.$eval($attrs.tableData);
        // 把需要排序的标题加上排序箭头
        thList.addClass('cur-pot');
        for (var i = 0; i < tbodyList.length; i++) {
          // 根据传入的索引，选中对应的字段，然后加上相应的箭头样式。
          thList.eq(tbodyList[i].index).append('<i class="arrow-sort"></i>');
        }
          // 当点击一个标题字段时，触发方法
        thList.on('click',function(e){
          // 阻止冒泡
          e.stopPropagation();
          // 把当前样式进行改变.
          if ($(this).children('i').hasClass('arrow-sort')||$(this).children('i').hasClass('sort-desc')) {
            $(this).children('i').removeClass('arrow-sort');
            $(this).children('i').removeClass('sort-desc');
            $(this).children('i').addClass('sort-asc');
          }else {
            $(this).children('i').removeClass('arrow-sort');
            $(this).children('i').removeClass('sort-asc');
            $(this).children('i').addClass('sort-desc');
          }

          // 获取当前点击的标题是数组中的第几个th,用于后续判断与之对应的后台字段是哪一个.
          var ind = thList.index(this);
          // 循环遍历传入的对象,找到与当前点击的标题索引对应的该字段.

          for (var i = 0; i < tbodyList.length; i++) {
            // 判断切换排降序还是升序
            if(ind==tbodyList[i].index || tbodyList[i].canSort){

              if (tbodyList[i].sortCriteria=='desc') {
                tbodyList[i].sortCriteria='asc';
              }else if (tbodyList[i].sortCriteria=='asc') {
                tbodyList[i].sortCriteria='desc';
              }
              // 重新请求数据，然后刷新表格排序
              var _url = sortRequestUrl+'?sortBy='+tbodyList[i].propertyKey+'&sortWay='+tbodyList[i].sortCriteria;
              requestData(_url, {}, 'get')
              .then(function (results) {
                if (results[1].code === 200) {
                  console.log('sucess');
                  if (tableData) {
                    tableData=results[1].data;
                  }else {
                    $scope.tbodyList=results[1].data;
                  }
                }
              })
              .catch(function (error) {
              });
            }
          }
        });
      }//end link
    };
  }

  // 自定义表格排序，根据点击不同的标题，对相应列进行按该字段排序。
  /**
     *
    	* @Description: 点击发起请求,进行排序
    	* @author 宋娟
    	* @date 2017年07月18日 上午09:42:59
     */

     	   //  关键步骤：

  function customTableToggleSort (modal,utils,requestData) {
    'use strict';
    return {
        restrict: 'AE',
      link: function ($scope, element, $attrs) {
        // 表格数据传入Jason格式
        var sortItemCanSort=$scope.$eval($attrs.sortItemCanSort);
        // 请求重新排序接口
        var sortRequestUrl=$attrs.sortRequestUrl;
        // 传入相关查询条件
        var sortParamsWay=$scope.$eval($attrs.sortParamsWay);
        var count=1;
        // 把需要排序的标题加上排序箭头
        // 判断是否可以点击排序，如果是，则给改字段加上可以排序的样式。
        if (!sortParamsWay&&sortItemCanSort) {
          sortParamsWay='desc';
        }

          // 当点击一个标题字段时，触发方法
        element.on('click',function(e){
          // 阻止冒泡
          e.stopPropagation();
          if (sortParamsWay=='desc') {
            $(this).children('i').removeClass('arrow-sort');
            $(this).children('i').removeClass('sort-asc');
            $(this).children('i').addClass('sort-desc');
            sortParamsWay='asc';
          }else if (sortParamsWay=='asc') {
            $(this).children('i').removeClass('arrow-sort');
            $(this).children('i').removeClass('sort-desc');
            $(this).children('i').addClass('sort-asc');
            sortParamsWay='desc';
          }
        });

      }//end link
    };
  }

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
  // leftShift,modalLength   一次向左移动的长度
  // lilength   LI的总个数
  // liWidth   一个LI占宽度

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

          // 大于一行显示的个数，才出现按钮
          if(lilength>parseInt(modalLength/liWidth)){
            $(this).children('span').css("display", "block");
            // 点击左移按钮后
            $('.button-left').off("click").on('click',function(){
              // modalLength*Math.ceil(lilength/parseInt(modalLength/liWidth))
              if(leftShift<Math.ceil(lilength*liWidth))
              {
                $('.kuaidiul').animate({'margin-left':'-'+leftShift+'px'});
                leftShift+=modalLength;
              }
            })
            $('.button-right').off("click").on('click',function(){
              // $('.button-left').removeAttr('disabled','disabled');
              if(leftShift>=modalLength)
              {
                leftShift-=modalLength;
                $('.kuaidiul').animate({'margin-left':'-'+leftShift+'px'});
              }
            })
          }
          // 判断是否左右按钮是否可点击
          // if(leftShift<modalLength){
          //   $('.button-right').attr('disabled','disabled');
          //   $('.triggle-right').css('border-left','10px solid #e5e5e5');
          // }
          // if(leftShift>=modalLength*Math.ceil(lilength/parseInt(modalLength/liWidth))){
          //   $('.button-left').attr('disabled','disabled');
          //   $('.triggle-left').css('border-right','10px solid #e5e5e5');
          // }
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
  function medicalStockMouseOver(utils,$compile){
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
              console.log(bt);
              if (bt.progress=='0') {
                return;
              }else{
                var tmp="<a style='width:32px;height:32px;display:inline-block;margin-top:8px;' tab-nav tab-name=库存查询 tab-href='"+bt.url+"' title='"+bt.title+"'><span class='"+bt.className+"'></span></a>";

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
             $compile($(this).contents())($scope);

          });//mouseenter
          // 鼠标移出按钮消失
          $($element).mouseleave(function(){
            $(this).removeClass("bg-c");
            moveBtnDiv.remove();
          });//mouseleave;

          // // 监听页码变化，如果改变则重新执行方法，获取最新的当前页面上的数据。
          // $scope.$watch('status.currentPage',function(newVal,oldVal){
          //   if (newVal&&newVal!==oldVal) {
          //
          //   }
          // })
        }//link
    };
  }

  function medicalStockMouseOverSee(utils,$compile){
        return{
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                // var btnArray=[];

                //按钮数量，用于计算弹出菜单的div宽度
                var btnCount=0;
                //弹出菜单的div(装两个按钮的div)
                var moveBtnDivSee=null;
                //按钮基础数据(mouse-over-buttons-json传入的相关参数，以Jason的数据格式传入)
                // 把按钮基础数据转化为数组类型
                var mouseOverButtons=  $scope.$eval($attrs.mouseOverButtonsJsonSee);
                if(mouseOverButtons && mouseOverButtons.length>0){
                    moveBtnDivSee=$("<div id='moveBtnDivSee'></div>");
                    btnCount=mouseOverButtons.length;
                }

                for(var i=0;i<mouseOverButtons.length;i++){
                    var bt=mouseOverButtons[i];
                    if (bt.progress=='0') {
                        return;
                    }else{
                        var tmp="<a style='width:32px;height:32px;display:inline-block;margin-top:8px;' tab-nav tab-name='"+bt.title+"' tab-href='"+bt.url+"' title='"+bt.title+"'><span class='"+bt.className+"'>查看入库明细</span></a>";

                        var btn1=$(tmp);
                        // btn1.appendto(moveBtnDivSee);
                        moveBtnDivSee.append(btn1);

                    }
                }


                // 鼠标移入显示按钮
                $($element).mouseenter(function(e){
                    $element.addClass("bg-c");
                    if(!moveBtnDivSee)return;
                    //+document.body.scrollLeft+
                    moveBtnDivSeeWidth=34*btnCount;
                    var y =$element.offset().top -document.body.scrollTop;
                    // var x= utils.getMainBodyWidth();
                    var x= utils.getwindowWidth()-160-moveBtnDivSeeWidth-document.body.scrollLeft; //有bug，table没有全拼暂满时，弹出按钮不能点击bug。 要求table 宽度 100%

                    //
                    moveBtnDivSee.css({
                        "position": "fixed",
                        "width":moveBtnDivSeeWidth,
                        "height":$element.height(),
                        "top": y,
                        "left": x
                    });

                    $(this).append(moveBtnDivSee);
                    $compile($(this).contents())($scope);

                });//mouseenter
                // 鼠标移出按钮消失
                $($element).mouseleave(function(){
                    $(this).removeClass("bg-c");
                    moveBtnDivSee.remove();
                });//mouseleave;
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

        // 定义一个类，用于css对样式的控制
        $($element).addClass('first-medical-nav');

        //箭头数量，用于计算箭头的个数。
        var arrowCount=0;
        //(step-flow-arrow-json传入的相关参数，以Jason的数据格式传入)
        //基础数据转化为数组类型
        var stepFlowArrow= $scope.$eval($attrs.stepFlowArrowJson);
        arrowCount=stepFlowArrow.length;

        var lossWidht=4; //丢弃宽度（兼容计算精度造成的折行显示, by venray 2017年6月16日 16:04:10）;

        window.setTimeout(function () {

            // 当每个箭头创建好之后，定义每个的宽度
            var divWidth=($($element).width()-((arrowCount-1)*30))/arrowCount;

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
                $($($element).children('div')).css({"width":divWidth-lossWidht});
                // 开始箭头的形状定义
                $($element).children('div').first().append("<div></div><div></div>");
                // 最后一个箭头的形状定义
                $($element).children('div').last().prepend("<div></div>");
            }
        },300);

          $(window).resize(function () {
            //当浏览器大小变化时,触发方法，重新给箭头计算宽度，并重新设置宽度，达到自适应宽度的目的。
              $($($element).children('div')).css({"width":($($element).width()-((arrowCount-1)*30))/arrowCount });
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
        var toT=$attrs.top;

        $scope.$watch('initFlag',function(){
          // 最开始加载后，显示字数限制提示
          if (toT) {
              strResult = '<span class="strResult" style="top:'+toT+'px;">(<em class="remainWords">0</em>/'+maxLen+')</span>';
          }else {
            strResult = '<span class="strResult">(<em class="remainWords">0</em>/'+maxLen+')</span>';
          }
              // $('.strResult').css('top',toT);
              $($element).after(strResult);
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

        if ($(element).find('div').hasClass('table-item-handle-remove-btn')) {
          var _delBtn = $(element).find('div.table-item-handle-remove-btn');

        }else {
          var _delBtn = $(element).find('div.table-item-handle-btn');
        }
        // 操作删除层
        var _delArea = $(element).find('div.table-item-confirm-del-area');
        //查看入库明细

        //绑定点击显示操作删除层
        _delBtn.on('click', function () {
          _delArea.show();
        });

        element.hover(function () {
          // 当前行序号
          // var _index = attrs.tableItemIndex,
          //     _orderMedicalNos = scope.formData.orderMedicalNos;
          // 特殊处理，移除时需要显示title的问题
          if ($(element).find('div').hasClass('table-item-handle-remove-btn')) {

            $('.table-item-handle-btn').removeAttr('title');
            $('.table-item-handle-btn').attr('title','移除');
          }
          // 计算当前tr距离顶部的高度
          var _offsetTop = $(element).offset().top - document.body.scrollTop;
          // 计算当前页面宽度
          // var _pageWidth = utils.getMainBodyWidth() + 65;
          // 计算当前页面宽度
          var _pageWidth = null;
          if (window.innerWidth) {
            _pageWidth = window.innerWidth - 80;
          } else if ((document.body) && (document.body.clientWidth)) {
            _pageWidth = document.body.clientWidth - 80;
          }

          // console.log(_pageWidth);

          _delBtn.css({'position':'fixed','top':_offsetTop,'left':_pageWidth}).show();

        }, function () {
          _delBtn.css({'position':'absolute','top':0,'left':0}).hide();
          _delArea.hide();
        });
          //取消操作
        $('.cancelHandle').on('click',function(e){
          e.stopPropagation();
          _delBtn.hide();
          _delArea.hide();
        });
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

                // url=url.split("@")[0];
                // var modalData='{"url":"'+url+'"}';
                // console.log(modalData);

                //现在以 '?' 分割
                url=url.split("?")[0];
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
            "ngModelData": "=?",//绑定返回对象的业务对象
            "ngModel": "=",
            "searchFields": "@",
            "matchClass": "@",
            "ngDisabled": "=?",
            "searchStyle": "@",
            "addSupplier": "&?"
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

            //绑定返回对象的某个属性值。
            if($attrs.ngModelId||$attrs.ngModelData||$attrs.callback){
              $scope.$watch("ngModel", function(value) {

                if(value){
                  $scope.ngModelId=value.id;
                  $scope.searchStr=value.data.name;
                  $scope.ngModelData=value.data;
                };

                if ($attrs.callback) {
                  $scope.$eval($attrs.callback);
                }
              }, true);
            }

            // 如果定义autofocus则给input加入autofocus属性
            if (angular.isDefined($attrs.autoFocus)) {
              // console.log($('#autocomplete-supplier_searchInputId').attr('autofocus', 'autofocus'));
              // $('#autocomplete-supplier_searchInputId').attr('autofocus','autofocus');
            }

            $scope.$watchCollection('selectedItem', function (newVal, oldVal) {
              if (newVal && newVal !== oldVal) {
                // 如果数据添加成功
                if (newVal.addSucess) {
                  $scope.searchStr = '';  // 清空已选择
                  $('#autocomplete-supplier_searchInputId').focus();
                }
              }
            });

            require(['project/angucomplete'], function(angucomplete) {
              $scope.angucomplete1=new angucomplete($scope,elem,$parse, requestData, $sce, $timeout,ngModel);
            });

        }
    };
}
    /**
     * 自动补全-证照类型
     */

    function angucompleteLicense($parse, requestData, $sce, $timeout) {
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
            templateUrl: Config.tplPath + 'tpl/project/autocomplete-license.html',
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
                // console.log($scope.searchStr);
                //绑定返回对象的某个属性值。
                if($attrs.ngModelId){
                    $scope.$watch("ngModel", function(value) {
                        if(!value)return;
                        $scope.ngModelId=value.id;
                        $scope.searchStr=value.data.name;

                        //  $scope.listObject.name = value.data.name;
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
            "id":"@?",
            "placeholder": "@",
            "selectedItem": "=?",
            "url": "@",
            "titleField": "@",
            "descriptionField": "@",
            //"localData": "=?",
            "searchFields": "@",
            "matchClass": "@",
            "ngDisabled": "=?",
            "searchStr": "@",
            "customStyle": "@",   // 自定义样式
            "frozenGoodsDisabled": "@"

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
            // $scope.searchStr = null;



            require(['project/angucomplete'], function(angucomplete) {
              //是否验证合法，允许输入
              var canSelectResult=function(result){
                try{
                  if (attrs.frozenGoodsDisabled) {

                    if (result.data.businessApplication.businessStatus == '已冻结') {
                      return false;
                    }
                  }
                }catch(e){  }

                return true;
              };

              $scope.angucomplete1=new angucomplete($scope, elem, $parse, requestData, $sce, $timeout, ngModel, canSelectResult);

            });//angucomplete

        }
    };
}

/**


<div class="pd-c-l pdt-m"
     flash-add-medical
     ng-model="data1"
     hide-quantity
     hide-import
     ajax-url="rest/authen/medicalStock/query.json?warehouseStocksCode={{formData.warehouseCode}}"
     add-data-callback-fn="flashAddDataCallbackFn(data1)">
</div>
参数说明：
  hide-quantity ：隐藏输入数量控件
  hide-import  :隐藏导入按钮

 * 闪加药械
 ngModel={
 data:{},//药械基本信息
 count：10 //输入数量
}
 */
function flashAddMedical(utils,$timeout) {
    return {
        restrict: 'EA',
        scope: {
            "id":"@?",
            "ngModel": "=",
            "addDataCallbackFn":"&?",
            "formData": "=?"
        },
        require: "?^ngModel",
        templateUrl: Config.tplPath + 'tpl/project/flashAddMedical.html',
        link: function($scope, elem, $attrs, ngModel) {

          $scope.id='_'+new Date().getTime();

          // 隐藏标题
          if (angular.isDefined($attrs.hideTitle)) {
            $scope.hideTitle = true;
          }

          // 隐藏添加按钮
          if (angular.isDefined($attrs.hideAddButton)) {
            $scope.hideAddButton = true;
          }

          //隐藏输入数量控件
          if (angular.isDefined($attrs.hideQuantity)){
            $scope.hideQuantity=true;
          }

          //隐藏导入按钮
          if (angular.isDefined($attrs.hideImport)){
            $scope.hideImport=true;
          }

          //药械输入框提示语
          if ($attrs.placeholder){
            $scope.showPlaceholder=$attrs.placeholder;
          }

          // 被冻结商品是否允许选择
          if ($attrs.frozenGoodsDisabled) {
            $scope.frozenGoodsDisabled = true;
          }

          //监听变化
          $attrs.$observe("ajaxUrl", function(newVal, oldVal) {
            $scope.ajaxUrl = newVal;
          });

          // 如果属性isDisabledThis未定义，则不开启条件限制查询药械
          if (!angular.isDefined($attrs.isDisabledThis)) { $scope.isCustomerId = true;}

          // 监控用户是否已选择客户或供应商
          $attrs.$observe('isDisabledThis', function (newVal, oldVal) {

            // console.log("isDisabledThis",newVal);
            if (newVal) {
              $scope.isCustomerId = true;
            }else{
                $scope.isCustomerId = false;
            }

          });

          //监听自动补全选中事件。
          $scope.angucompleteMedicalOnChange = function () {
            //隐藏数量输入字段情况下，选择药械，触发添加事件。
            if($scope.hideQuantity){
              $('#addMedicalList'+$scope.id).focus();
              $scope.addDataFn();
            }else{//隐藏字段情况下，选择药械，触发添加事件。
              var inputId='flashAddMedical_input_count';
                if($scope.id)inputId+=$scope.id;
              //  $timeout 保障不受其他干扰，最后一个执行。
              utils.focusByInputId(inputId);
            }
          };

          //添加业务数据
          $scope.addDataFn = function () {
            if($scope.addDataCallbackFn){
              var data = utils.replaceObject({},$scope.ngModel);
              var flag = $scope.addDataCallbackFn(data);
              if(typeof flag=='function')flag=flag(data);
              if(!flag){//业务逻辑判断添加失败，则不清空数据。
                return false;
              }

            }else{

              console.log("scope.addDataCallback function is null!");

            }

            //清空输入数据
          $scope.ngModel={};

          //自动补全查询输入框获得焦点
          var searchInputId='#angucompleteMedical_searchInputId';
          if($scope.id)searchInputId+=$scope.id;

          //  $timeout 保障不受其他干扰，最后一个执行。
          $timeout(function(){
            $(searchInputId).val("");
            $(searchInputId).trigger('focus');


          },0);

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
  'use strict';
  return {
    restrict: 'EA',
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/customTable.html',
    link: function ($scope, $element, $attrs,$ctrl,$transclude) {
      if ($attrs.checkboxShow) {
          $scope._checkboxShow=$attrs.checkboxShow;
      }

      // 根据点击表头可排序，扩展一个属性，用于传入排序请求的接口
      if ($attrs.customTableUrl) {
          $scope._customTableUrl=$attrs.customTableUrl;
      }

      // 解决表格没有用table-list，添加一个属性，用于传入表格数据所要显示的对象。
      if ($attrs.customTableRepeatData) {
          $scope._customTableRepeatData=$scope.$eval($attrs.customTableRepeatData);
      }

      if ($attrs.customListParams) {
          $scope._customListParams=$scope.$eval($attrs.customListParams);
      }

      if ($attrs.customTable) {
          $scope._customTableName=$attrs.customTable;
          $scope._customKey=$attrs.customKey;
      }

      if ($attrs.customTrMenus) {
          $scope._customTrMenus=$attrs.customTrMenus;
      }
    }
  };
}

/**
  用户自定义表结构显示,固定表头。
*/
function customTableFixedMeter() {
  'use strict';
  return {
    restrict: 'EA',
    replace: true,
    templateUrl:  Config.tplPath +'tpl/project/customTableFixedMeter.html',
    link: function ($scope, $element, $attrs,$ctrl,$transclude) {
      if ($attrs.checkboxShow) {
          $scope._checkboxShow=$attrs.checkboxShow;
      }

      // 根据点击表头可排序，扩展一个属性，用于传入排序请求的接口
      if ($attrs.customTableFixedMeterUrl) {
          $scope._customTableFixedMeterUrl=$attrs.customTableFixedMeterUrl;
      }

      // 解决表格没有用table-list，添加一个属性，用于传入表格数据所要显示的对象。
      if ($attrs.customTableFixedMeterRepeatData) {
          $scope._customTableFixedMeterRepeatData=$scope.$eval($attrs.customTableFixedMeterRepeatData);
      }

      if ($attrs.customListParams) {
          $scope._customListParams=$scope.$eval($attrs.customListParams);
      }

      if ($attrs.customTableFixedMeter) {
          $scope._customTableFixedMeterName=$attrs.customTableFixedMeter;
          $scope._customKey=$attrs.customKey;
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

        //弹出菜单的div()
        var  moveBtnDiv=$("<div style='z-index:10'></div>");

        // 鼠标移入显示按钮
        $($element).mouseenter(function(e){

          var bottomButtonList=$scope[$attrs.tableTrMouseOverMenu];
          // 如果没有配置菜单，就直接返回，不执行下面的操作。
          if (!bottomButtonList.length) {
            return;
          }
          var dataObj=$scope[$attrs.businessData];

          $scope._tableTrMouseOverMenus=customMenuUtils.parseVariableMenuList(bottomButtonList,dataObj);
          //创建菜单按钮。
          var tmp_template='<span query-item-table-button-list="_tableTrMouseOverMenus" tr-id="'+$attrs.trId+'"></span>';
          moveBtnDiv.html(tmp_template);
          $compile(moveBtnDiv.contents())($scope);

          // console.log("moveBtnDiv.contents()",moveBtnDiv);
          // var btnArray=[];
          //按钮数量，用于计算弹出菜单的div宽度
          var btnCount=0;
          if($scope._tableTrMouseOverMenus){
            btnCount=$scope._tableTrMouseOverMenus.length;
          }
          $element.addClass("bg-c");
          if(!moveBtnDiv)return;
          //+document.body.scrollLeft+
          moveBtnDivWidth=45*btnCount;
          // console.log("document.body.scrollLeft",document.body.scrollLeft);
          var y =$element.offset().top -document.body.scrollTop+8;
          var x= utils.getwindowWidth()-60-moveBtnDivWidth; //有bug，table没有全拼暂满时，弹出按钮不能点击bug。 要求table 宽度 100%

          // var x=e.clientX+10; //根据鼠标位置定位，解决上面bug。
          if(x<0)x=0;
          //
          moveBtnDiv.css({
             "position": "fixed",
             "width":moveBtnDivWidth,
            //  "backgroundColor":"red",
              // "zIndex:":"2000",//设置不生效，
              // "z-index:":"2001",
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

// tableFixedMeter table标签，固定表头。
/**
   *
  	* @Description: 固定表头组件
  	* @author songjuan
  	* @date 2017年9月8日 下午4:32:59
   */

   	   //  关键步骤：

function tableFixedMeter(utils,$compile,customMenuUtils){
  return{

    restrict: 'A',
      link: function ($scope, $element, $attrs) {

        // div宽度=可视区域的宽度-侧边导航的宽度-误差值
        var _divWidth=$(window).width()-$('.sticky-left-side').width()-85;
        // div高度=可视区域的高度-页头显示的高度-每个页面的顶部面包屑-底部分页的高度-显示分页的高度-误差值
        var _divHeight=$(window).height()-$('.header-section').height()-$('.content-wrapper-heading').height()-$('.fr').height()-150;

        // 计算出高度和宽度以后，定义改div的大小
        $($element).css({
           'width':_divWidth,
          //  最外层div有一个45的padding-bottom，和40的padding-top所以要减去
           'height':_divHeight-85
         })

        // 判断如果可以出现滚动条的div出现了滚动条
          window.setTimeout(function(){
            // 执行设置表格的方法
            setFixedMeterTable();
          },100)
          //
          // $(window).resize(function () {
          //   //当浏览器大小变化时,触发方法，重新设置表格的大小
          //       setFixedMeterTable();
          // });

          // 设置表格的方法
        function setFixedMeterTable(){
          $('.outside-table-fixed-meter').css({
            'height':_divHeight-135
          })
          // 设置两个表头fixed之后的top值
          $('.th-div-scoller').css({
            'top':$('.outside-table-fixed-meter').offset().top-50
          })
          $('.th-div-noScoller').css({
            'top':$('.outside-table-fixed-meter').offset().top-50
          })
          // 滚动字段显示区域的宽度
          $('.fixed-meter-scoller').css({
            'width':_divWidth-$('.fixed-meter-hidden').width()
          })
          // 底部显示合计和横向滚动条的容器
          $('.bottom-div').css({
            'width':_divWidth
          })
          // 合计的宽度
          $('.total-text-p').css({
            'width':$('.fixed-meter-hidden').width()
          })
          // 滚动的区域表头的宽度
          $('.th-div-scoller').css({
            // 抛出1px的误差值
             'width':$('.fixed-meter-scoller').width()+1
           })
          //  滚动表头，没有数据时的表格表头显示宽度
          $('.no-table-data-scoller').css({
             'width':_divWidth-$('.th-div-noScoller').width()
           })
          //  固定区域表头的样式设置
          $('.th-div-noScoller').css({
             'width':_divWidth-$('.th-div-scoller').width(),
             'left':$('.th-div-scoller').width()+$('.th-div-scoller').offset().left+1,// 抛出1px的误差值
             'overflow-x':'hidden'
           })
           // 滚动表格的表头
           var thScollerArr=$('.th-div-inScoller').children('div');
           // 滚动表格的内容
           var thContentScollerArr=$('.tr-content:first').children('td');
          //  支持滚动的表头设置宽度
           setThWidth(thScollerArr,thContentScollerArr,'.tr-content');

          //  固定表格的表头th数组
           var thNoScollerArr=$('.th-div-noScoller').children('div');
          //  固定表格内第一行每个单元格的数组
           var thnoContentScollerArr=$('.tr-no-content:first').children('td');
          //  固定的表头设置宽度
          setThWidth(thNoScollerArr,thnoContentScollerArr,'.tr-no-content');

          // 显示合计字段的单元格
          var totalSpanArr=$('.show-total-text').children('div');
          // 调用方法，设置底部合计字段的单元格宽度
          setThWidth(totalSpanArr,thNoScollerArr,'.show-total-text');

          // 注意：设置横向滚动条的宽度一定要在表格表头和表内容中的单元格设置完宽度之后，不然有可能导致拿到的表格的总宽度不是最后的宽度
            // 横向滚动条出现的div。宽度与要出现滚动条的div同宽
            $('.analog-scroll-bar').css({
              'width':$('.th-div-scoller').width()
            })

            // 横向滚动条出现的div。模拟横向滚动条表格内容的宽度
            $('.analog-scroll-content-bar').css({
              'width':$('.th-div-inScoller').width()
            })
            // 监听竖向滚动条，模拟左边表格的竖向滚动
            $('.analog-scroll-bar').on('scroll',function(){
              // 模拟的横向滚动条滚动时，需要滚动的表格就要根据滚动条的距离滚动
              $('.can-scoller-table').css({
                'margin-left':'-'+$('.analog-scroll-bar').scrollLeft()+'px'
              })
                // 模拟的横向滚动条滚动时，需要滚动的表格的表头也要根据滚动条的距离滚动
              $('.th-div-inScoller').css({
                'margin-left':'-'+$('.analog-scroll-bar').scrollLeft()+'px'
              })
             });
        }

      //  设置表头宽度的方法
      // 传入两个参数，thArr（表头每个标题的数组集合），tdArr（表格内容每个单元格的数组集合）,trClass(表格中用于选中tr的类名)。
       function setThWidth(thArr,tdArr,trClass){

          for (var i = 0; i < tdArr.length; i++) {
              // 判断表头的单元格和表内容的单元格的宽度哪个更大，宽度更大的用宽度大的
              if ($(tdArr[i]).outerWidth()>$(thArr[i]).width()) {
                $(thArr[i]).css({
                  'width':$(tdArr[i]).outerWidth()
                })
              }else{
                // 如果表头大于表内容就要给表头设置padding
                $(thArr[i]).css({
                  'padding':'0px 10px'
                })
                $(trClass+'>td>span').eq(i).css({
                  'display':'inline-block',
                  'width':$(thArr[i]).width()
                })
              }
          }
       }
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

// query-item-table-button-list
function queryItemTableButtonList() {
  return {
    restrict: 'EA',
    scope: {
       spanClass:"=?",
        queryItemTableButtonList:"=?"
      },
    // replace: true,// true时 导致$scope作用域下，属性添加失效。
    templateUrl:  Config.tplPath +'tpl/project/queryItemTableButtonList.html',
    link: function ($scope, $element, $attrs) {
      if ($attrs.trId) {
        $scope.trId = $attrs.trId;
      }

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

      // 监视物流中心id变化
      attrs.$observe('logisticsCenterId', function (newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          scope.logisticsCenterId = newVal;
        }
      });

      // 监视用户修改后的数据返回，若已修改，则将修改后的信息替换到发送数据体中。
      // scope.$watchCollection('returnAddressObj', function (newVal, oldVal) {
      //   if (newVal && newVal !== oldVal) {
      //     // console.log(newVal);
      //     var _contacts = newVal['contacts'] || [];
      //
      //     for (var i=0; i<_contacts.length; i++) {
      //       if (scope.returnAddressObj.defaultContactId === _contacts[i].id) {
      //         scope.formData[scope.scopeDataContacts] = _contacts[i];
      //       }
      //     }
      //
      //   }
      // });

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
      $scope.chkDefaultChoise = function (tr) {
        if (!$scope.formData.id) {      // 如果是新建，将该参数id与默认返回地址做比较
          if ($scope.returnAddressObj.defaultContactId === tr.id) { return true; }
        } else {        // 如果是编辑
          var _moduleName = $scope.scopeDataPrefix + 'Contacts';
          if ($scope.formData[_moduleName]) {
            if ($scope.formData[_moduleName]['id'] === tr.id) {
              return true;
            }
          } else {
            if ($scope.returnAddressObj.defaultContactId === tr.id) {     // 选中默认地址
              $scope.formData[$scope.scopeDataContacts] = tr;
              return true;
            }
          }
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
        // var _contacts = $scope.returnAddressObj.contacts;

        // if (_contacts && !$scope.choisedItemId) {
        //   for (var i=0; i<_contacts.length; i++) {
        //     if ($scope.returnAddressObj.defaultContactId === _contacts[i].id) {
        //       $scope.formData[$scope.scopeDataContacts] = _contacts[i];
        //     }
        //   }
        // }

        // 如果是新建单据
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
          // console.log($scope.choisedItemId);
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

        // 存入物流中心id
        _tmpObj.logisticsCenterId = $scope.logisticsCenterId;

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

        // 存入物流中心id
        _tmpObj.logisticsCenterId = $scope.logisticsCenterId;

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
        var _data = {
          id: $scope.returnAddressObj.id,    // 新版多仓库改动，将原Id名更改为id
          contactId: contactId
        };
        // _data[_moduleAddressId] = $scope.returnAddressObj.id;
        // _data.id = $scope.returnAddressObj.id;     // 新版多仓库改动，将原Id名更改为id
        // _data.contactId = contactId;

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

      // 用户若修改信息后的回调，用于将新的信息更新到formData中，主要用于编辑时的更新
      $scope.modifiedCallBack = function (id) {
        // 当为编辑时
        if ($scope.formData.id) {
          var _moduleName = $scope.scopeDataPrefix + 'Contacts';    // 获取当前选中的地址信息

          //修复null报错bug。
          if(!$scope.formData[_moduleName]){
            $scope.formData[_moduleName]={};
          }
          // 如果当前修改的地址条目是选中的地址
          if ($scope.formData[_moduleName]['id'] === id) {    // 重新请求修改后的地址信息
            var _requestDataId = $scope.requestDataId ? $scope.requestDataId : '';
            var _reqUrl = $scope.requestUrl + '?id=' + _requestDataId + '&type=' + $scope.createAddressType + '&logisticsCenterId=' + $scope.logisticsCenterId;
            requestData(_reqUrl)
            .then(function (results) {
              var _data = results[1].data.contacts;
              angular.forEach(_data, function (item, index) {
                if ($scope.formData[_moduleName]['id'] === item.id) {
                  $scope.formData[_moduleName] = item;
                  // console.log($scope.formData);
                }
              });
            });
            // console.log($scope.requestUrl+'?id='+$scope.requestDataId);
          }
        }
      }
    }]
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
function pageMainHeaderComponent ($rootScope,$sce) {
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      listParams: '=?',             // 请求查询的参数对象
      crumbsNav: '@',               // 面包屑导航
      componentTitle: '@',          // 头部标题
      componentOtherTitle: '@',          // 头部标题,处理特殊情况下，如首营品种和品种管理新建开同一窗口的问题。
      createNewUrl: '@',            // 新建URL
      enterNewUrl: '@',            // 其他URL
      getSourceUrl: '@',            // 单据来源URL
      getStatusNumUrl: '@',         // 获取所有单据状态数量URL
      statusGroupData: '@',         // 状态显示数据对象
      getBusinessTypeUrl: '@',      // 获取业务类型查询字段Url
      getLogisticsCenterUrl: '@',      // 获取物流中心字段Url
      getInvoiceTypeUrl: '@',      // 获取发票类型查询字段Url
      getSourceOrderTypeUrl: '@',      // 获取来源单据类型查询字段Url
      isShowSelectItem: '@',
      searchPlaceholderInfo: '@',
      getWarehouseListUrl: '@',
      getStorageConditionUrl: '@',
      getDepartmentListUrl: '@',
      getUserListUrl: '@',
      getApplyUserListUrl: '@',
      createBtnAuthor:'@',
      enterBtnAuthor:'@',
      getInventoryTypeUrl: '@',
      tabName:'@',
      isShowSourceModel:'@' // 模型名称
    },
    replace: true,
    transclude: true,
    templateUrl: Config.tplPath + 'tpl/project/pageMainHeaderComponent.html',
    link: function (scope, element, attrs) {


      if(angular.isDefined(attrs.isShowSourceModel)){
        scope.isShowSourceModel=attrs.isShowSourceModel;
      }else{
        scope.isShowSourceModel='orderSource';
      }






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
          scope.crumbsCode= $sce.trustAsHtml(scope.crumbsCode);
        });
        //将代码插入id为crumbsNav的父容器中
        // $('#crumbsNav').append(scope.crumbsCode);

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
        scope.itemElseChooise = scope.selectObj[1].link;
        scope.itemElseChooiseName = scope.selectObj[1].name;
      }
      if(attrs.showDateName){
        scope._showDateName=attrs.showDateName;
      }
      if(attrs.isShowSourceName){
        scope.isShowSourceName=attrs.isShowSourceName;
      }

      //是否显示新建按钮
      //   console.log("attrs.createBtnAuthor",attrs.createBtnAuthor);
        scope.createBtnAuthor= angular.isDefined(attrs.createBtnAuthor)  ?  attrs.createBtnAuthor :  '';
        // console.log("scope.createBtnAuthor",scope.createBtnAuthor);
        scope.isShowCreateBtn = angular.isDefined(attrs.isShowCreateBtn) ? attrs.isShowCreateBtn : false;
        // 扩展，首营模块多加一个入口，录入审核人入口菜单。
        scope.isShowEnterBtn = angular.isDefined(attrs.isShowEnterBtn) ? attrs.isShowEnterBtn : false;
        //是否显示新增按钮
        scope.enterBtnAuthor= angular.isDefined(attrs.enterBtnAuthor)  ?  attrs.enterBtnAuthor :  '';



        // 是否显示部门过滤
      scope.isShowDepartmentFilter = angular.isDefined(attrs.isShowDepartmentFilter) ? attrs.isShowDepartmentFilter : false;
      // 增加购需单单据来源
      scope.isShowSourceFilter = angular.isDefined(attrs.isShowSourceFilter) ? attrs.isShowSourceFilter : false;
      // 是否显示制单人过滤
      scope.isShowUserFilter = angular.isDefined(attrs.isShowUserFilter) ? attrs.isShowUserFilter : false;
      // 是否显示申请人过滤
      scope.isShowApplyUserFilter = angular.isDefined(attrs.isShowApplyUserFilter) ? attrs.isShowApplyUserFilter : false;
      //是否显示类型过滤
      scope.isShowTypeFilter = angular.isDefined(attrs.isShowTypeFilter) ? attrs.isShowTypeFilter : false;
      //是否物流中心过滤
      scope.isShowLogisticsCenterFilter = angular.isDefined(attrs.isShowLogisticsCenterFilter) ? attrs.isShowLogisticsCenterFilter : false;
      //是否显示发票类型过滤
      scope.isShowInvoiceTypeFilter = angular.isDefined(attrs.isShowInvoiceTypeFilter) ? attrs.isShowInvoiceTypeFilter : false;
      //是否显示来源单据类型过滤
      scope.isShowSourceOrderTypeFilter = angular.isDefined(attrs.isShowSourceOrderTypeFilter) ? attrs.isShowSourceOrderTypeFilter : false;
      //是否显示仓库过滤
      scope.isShowWarehouseFilter = angular.isDefined(attrs.isShowWarehouseFilter) ? attrs.isShowWarehouseFilter : false;
      //是否储存条件
      scope.isShowStorageConditionFilter = angular.isDefined(attrs.isShowStorageConditionFilter) ? attrs.isShowStorageConditionFilter : false;
      //是否显示日期过滤
      scope.isShowDateFilter = angular.isDefined(attrs.isShowDateFilter) ? attrs.isShowDateFilter : false;
      //是否显示盘点方式过滤
      scope.isShowInventoryTypeFilter = angular.isDefined(attrs.isShowInventoryTypeFilter) ? attrs.isShowInventoryTypeFilter : false;
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
 * [tableItemMultipleBtn 医院信息管理表格多个操作按钮菜单]
 * @param  {[type]} utils [description]
 * @return {[type]}       [description]
 */
function tableItemMultipleBtn (utils, requestData, alertError) {
  'use strict';
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, element, attrs) {

      $(element).css({
          position: 'relative'
      });


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

        // 解决bug：1013 品种管理中 选择一个商品的菜单默认显示不完整，需要用户手动下拉展开菜单。用户使用不方便。$('.content-wrapper-main')以该容器的高度来作为判断依据，而不是document。
        var _offsetTop = $(element).offset().top-$(element).parents('.content-wrapper-main').offset().top - document.body.scrollTop + 23;
        $(this).find('.handle-area-show').show(0,function () {
            var handleAreaHeight=$(this).height();
            //如果显示不下 就向上显示菜单
            // console.log($('.content-wrapper-main'));
            if((_offsetTop+handleAreaHeight) > $(element).parents('.content-wrapper-main').height()){
                $('.handle-area-show').removeClass('handle-area-down').addClass('handle-area-up');
            }else{
                $('.handle-area-show').removeClass('handle-area-up').addClass('handle-area-down');
            }
        });

      });

      // 绑定取消按钮事件
      $(element).find('.hide-this-area').on('click', function (e) {
        e.stopPropagation();
        $(element).find('div.del-confirm-area').hide();
      });

      element.hover(function () {
        // //兼容处理 如果用 tab 就查找父元素，否者 就全局查找
        var el= conf.useTab ?   $(element).parent('table').parent('.outside-table-d'): $('div.outside-table-d');

        // 不用兼容处理，直接查找，一样可以实现不全局查找。
          if($(element).parents('div').hasClass('outside-table-d')){

          // 如果有横向滚动条出现的表格，就重新计算偏移量。偏移量=出现滚动条的div的宽度+横向滚动条的滚动长度-自身按钮组的宽度-15；
          var _leftShif=$('.outside-table-d').width()+$('.outside-table-d').scrollLeft()-_handleBtnGroup.width()-15;
          // 竖向偏移量=当前元素距离顶部的高度-出现横向滚动条的div距离顶部的高度+自身按钮组的高度-10
          var _offsetTop=$(element).offset().top-$('div.outside-table-d').offset().top+_handleBtnGroup.height()-10;

        _handleBtnGroup.css({'position':'absolute','top':_offsetTop,'left':_leftShif}).show();
        }else {
          // 没有横向滚动条的情况下
          // 向左的偏移量=当前元素的宽度-本身按钮的宽度
          var _leftShif=$(element).offset().left+$(element).width()-_handleBtnGroup.width();
          var _offsetTop=$(element).offset().top-$(document).scrollTop()+_handleBtnGroup.height()/2+10;
            _handleBtnGroup.css({'position':'fixed','top':_offsetTop,'left':_leftShif-10}).show();
        }

      }, function () {
        _handleBtnGroup.css({'position':'absolute','top':0,'left':0}).hide();

        $('.del-confirm-area').hide();
        $('.handle-area-show').removeClass('handle-area-up').removeClass('handle-area-down').hide();
      });

      // 执行删除操作
      // 扩展删除方法，使id值支持单值和数组两种方式
      // 增加第4个参数dataType，若不传入则表示单个id值传入，若设置且值为array,则将传入的id字符串包装成数组
      scope.handleDelDetails = function (id, requestUrl, callbackUrl, parameterType, dataType) {
        // 如果dataType参数为空,传入单个值
        try {
          if (id && requestUrl && callbackUrl) {
            // 定义数据对象
            var _data = null;

            // 定义发送数据
            if (!dataType || dataType !== 'array') {
              _data = {
                'id': id
              }
            } else if (dataType && dataType === 'array') {   // 如果传入dataType参数且值为array,则将传入的参数包装成数组传入
              _data = id.split(',');
            }
            //提交数据类型，默认为json, 如果传值就用表单key-value
            var _parameterType = null;
            if(!parameterType){
                _parameterType ='parameter-body';
            }

            // 发送请求
            requestData(requestUrl, _data, 'POST', _parameterType)
            .then(function (results) {
              if (results[1].code == 200) {
                utils.goTo(callbackUrl);
              }
            })
            .catch(function (error) {
              if (error) { alertError(error); }
            });
          }
        }
        catch (err) {
          if (err) { throw new Error(err); }
        }



        // if (!dataType || dataType !== 'array') {
        //   if (id && requestUrl && callbackUrl) {
        //     var _url = requestUrl + '?id=' + id;
        //     requestData(_url, {}, 'POST')
        //     .then(function (results) {
        //       if (results[1].code == 200) {
        //         utils.goTo(callbackUrl);
        //       }
        //     })
        //     .catch(function (error) {
        //       if (error) { alertError(error); }
        //     });
        //   }
        // } else if (dataType && dataType === 'array') {   // 如果传入dataType参数且值为array,则将传入的参数包装成数组传入
        //   var _dataArr = id.split(',');
        //   requestData(_url, _dataArr, 'POST')
        //   .then(function (results) {
        //     utils.goTo(callbackUrl);
        //   })
        //   .catch(function (error) {
        //     if (error) { alertEorr(error || '出错'); }
        //   });
        // }

      };

    }
  };
}


    function tableItemMultipleBtnTop (utils, requestData, alertError) {
        'use strict';
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {

                $(element).css({
                    position: 'relative'
                });


                // 操作按钮组
                var _handleBtnGroup = $(element).find('div.table-item-multiple-btn-top');
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

                    // 解决bug：1013 品种管理中 选择一个商品的菜单默认显示不完整，需要用户手动下拉展开菜单。用户使用不方便。$('.content-wrapper-main')以该容器的高度来作为判断依据，而不是document。
                    var _offsetTop = $(element).offset().top-$('.content-wrapper-main').offset().top - document.body.scrollTop + 23;
                    $(this).find('.handle-area-show').show(0,function () {
                        var handleAreaHeight=$(this).height();
                        //如果显示不下 就向上显示菜单
                        // console.log($('.content-wrapper-main'));
                        if((_offsetTop+handleAreaHeight) > $('.content-wrapper-main').height()){
                            $('.handle-area-show').removeClass('handle-area-down').addClass('handle-area-up');
                        }else{
                            $('.handle-area-show').removeClass('handle-area-up').addClass('handle-area-down');
                        }
                    });

                });

                // 绑定取消按钮事件
                $(element).find('.hide-this-area').on('click', function (e) {
                    e.stopPropagation();
                    $(element).find('div.del-confirm-area').hide();
                });

                element.hover(function () {



                    //兼容处理 如果用 tab 就查找父元素，否者 就全局查找
                    var el= conf.useTab ?   $(element).parent('table').parent('.outside-table-d'): $('div.outside-table-d');

                    if(el.hasClass('outside-table-d')){

                        // 如果有横向滚动条出现的表格，就重新计算偏移量。偏移量=出现滚动条的div的宽度+横向滚动条的滚动长度-自身按钮组的宽度-15；
                        var leftShift=$('.outside-table-d').width()+$('.outside-table-d').scrollLeft()-_handleBtnGroup.width()-15;
                        // 竖向偏移量=当前元素距离顶部的高度-出现横向滚动条的div距离顶部的高度+自身按钮组的高度-10
                        var _offsetTop=$(element).offset().top-$('div.outside-table-d').offset().top+_handleBtnGroup.height()-10;
                    }else {
                        // 没有横向滚动条的情况下
                        // 向左的偏移量=当前元素的宽度-本身按钮的宽度
                        var leftShift=$(element).width()-_handleBtnGroup.width();
                        // 计算当前tr距离顶部的高度
                        var _offsetTop = $(element).offset().top - document.body.scrollTop -15;
                    }





                    // _handleBtnGroup.css({'position':'fixed','top':_offsetTop,'left':145+'rem'}).show();

                    _handleBtnGroup.css({'position':'fixed','top':_offsetTop+31,'left':leftShift+124}).show();

                }, function () {
                    _handleBtnGroup.css({'position':'absolute','top':0,'left':0}).hide();

                    $('.del-confirm-area').hide();
                    $('.handle-area-show').removeClass('handle-area-up').removeClass('handle-area-down').hide();
                });

                // 执行删除操作
                // 扩展删除方法，使id值支持单值和数组两种方式
                // 增加第4个参数dataType，若不传入则表示单个id值传入，若设置且值为array,则将传入的id字符串包装成数组
                scope.handleDelDetails = function (id, requestUrl, callbackUrl, parameterType, dataType) {
                    // 如果dataType参数为空,传入单个值
                    try {
                        if (id && requestUrl && callbackUrl) {
                            // 定义数据对象
                            var _data = null;

                            // 定义发送数据
                            if (!dataType || dataType !== 'array') {
                                _data = {
                                    'id': id
                                }
                            } else if (dataType && dataType === 'array') {   // 如果传入dataType参数且值为array,则将传入的参数包装成数组传入
                                _data = id.split(',');
                            }
                            //提交数据类型，默认为json, 如果传值就用表单key-value
                            var _parameterType = null;
                            if(!parameterType){
                                _parameterType ='parameter-body';
                            }

                            // 发送请求
                            requestData(requestUrl, _data, 'POST', _parameterType)
                                .then(function (results) {
                                    if (results[1].code == 200) {
                                        utils.goTo(callbackUrl);
                                    }
                                })
                                .catch(function (error) {
                                    if (error) { alertError(error); }
                                });
                        }
                    }
                    catch (err) {
                        if (err) { throw new Error(err); }
                    }



                    // if (!dataType || dataType !== 'array') {
                    //   if (id && requestUrl && callbackUrl) {
                    //     var _url = requestUrl + '?id=' + id;
                    //     requestData(_url, {}, 'POST')
                    //     .then(function (results) {
                    //       if (results[1].code == 200) {
                    //         utils.goTo(callbackUrl);
                    //       }
                    //     })
                    //     .catch(function (error) {
                    //       if (error) { alertError(error); }
                    //     });
                    //   }
                    // } else if (dataType && dataType === 'array') {   // 如果传入dataType参数且值为array,则将传入的参数包装成数组传入
                    //   var _dataArr = id.split(',');
                    //   requestData(_url, _dataArr, 'POST')
                    //   .then(function (results) {
                    //     utils.goTo(callbackUrl);
                    //   })
                    //   .catch(function (error) {
                    //     if (error) { alertEorr(error || '出错'); }
                    //   });
                    // }

                };

            }
        };
    }
function changeImg () {
  'use strict';
  return {
    restrict: 'EA',
    link: function (scope, element, attrs) {

      var value=attrs.changeValue;

        if(value){
          element.removeClass('addImg');
          element.addClass('editImg');
        }else{
          element.removeClass('editImg');
          element.addClass('addImg');
        }
    }
  };
}
  // ul模拟select
// function ulSelect () {
//   'use strict';
//   return {
//     restrict: 'A',
//     link: function ($scope, element, $attrs) {
//       element.off("click").on('click',function(){
//         element.children('li').css('display','block');
//       });
//     }
//   };
// }



  function  dtRightSide(utils) {
    'use strict';
    return {
      restrict: 'EA',
      scope:{
        sideWidth:'@',
        tabData:'@',
      },
      templateUrl:Config.tplPath +'tpl/project/dtRightSide.html',

      link: function ($scope, element, $attrs) {
        $scope.currentTab=-1;
        $scope.tplUrl=null;
        $scope.tabDatas= angular.fromJson($scope.tabData);

        //显示
        $scope.show=function (tplUrl,index) {
            // $scope.tplUrl=tplUrl+'?t='+new Date().getTime();
            $scope.tplUrl=tplUrl;
            $scope.currentTab=index;
            element.find('.dt-right-side').animate({
                'right':0+'px'
            },300)
        };

        //关闭
        $scope.close=function () {
           var _width=element.find('.dt-right-side').width();
           var _navWidth=element.find('.dt-right-side').find('.dt-right-side-nav').width();
           element.find('.dt-right-side').animate({
                   'right':-1*(_width-_navWidth)+'px'
           },300);
           // 重置选中状态
           $scope.currentTab=-1;
        };

        if($scope.sideWidth){
            element.find('.dt-right-side').css('width',$scope.sideWidth);
        }

        if($attrs.autoOpen){
            $scope.show($scope.tabDatas[0].tplUrl,0);
        }else{
            var _width=element.find('.dt-right-side').width();
            var _navWidth=element.find('.dt-right-side').find('.dt-right-side-nav').width();
            element.find('.dt-right-side').css({
                'right':-1*(_width-_navWidth)+'px'
            })
        }

      }
    };

}

  // 实现文字向上跑马灯效果，目前用于首页显示通知公告用。
  function autoScrollUp () {
    'use strict';
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {
        window.setTimeout(function(){

          if ($(element).children().length>0) {
            setInterval(function(){
              $(element).animate({
                  marginTop : "-20px"
              },500,function(){
                $(this).css({
                  marginTop : "0px"
                }).find("p:first").appendTo(this)
              })
            },2000)
          }
        },300)
      }
    };
  }


  function date (utils,$parse) {
      'use strict';
      return {
          restrict: 'EA',
          scope:{
              "ngModel": "="
          },
          templateUrl: Config.tplPath + 'tpl/project/date.html',
          link: function ($scope, element, $attrs) {

            if($attrs.styles){
                $scope.styles=  JSON.parse( $attrs.styles)||{'z-index':1};

                console.log("$scope.styles",$scope.styles);
            }


            try{
                $scope.zIndex= $scope.styles['z-index']*1+1;
            }catch (e){
                $scope.zIndex= 2;
            }



            $scope.clearVal=function () {
                $scope.ngModel='';
            }

          }
      }
  }

  angular.module('manageApp.project')
  .directive("htmlEdit", [ htmlEdit])
  .directive("textareaJson", ['utils', 'alertError', textareaJson])
  .directive("tableItemMultipleBtn", ['utils', 'requestData', 'alertError', tableItemMultipleBtn])   // 医院信息管理表格多个操作按钮菜单
  .directive("tableItemMultipleBtnTop", ['utils', 'requestData', 'alertError', tableItemMultipleBtnTop])   // 医院信息管理表格多个操作按钮菜单
  .directive("pageMainHeaderComponent", ['$rootScope','$sce',pageMainHeaderComponent])
  .directive("changeImg", [changeImg])
  .directive("expressManageComponent", ['requestData', 'utils', expressManageComponent])
  .directive("tableItemHandlebtnComponent", ['utils', tableItemHandlebtnComponent])
  .directive("requestExpressInfoTab", ['requestData', 'alertError', requestExpressInfoTab])
  .directive("expressBtnToggle", [expressBtnToggle])
  .directive("autoScrollUp", [autoScrollUp])
  .directive("addressManageComponent", ['requestData', 'utils', addressManageComponent])  //地址管理组件，包含待选、已选地址列表
  .directive("attachmentsItemShow", [attachmentsItemShow])//附件文件显示（资质证照）
  .directive("eAttachmentsItemShow", [eAttachmentsItemShow])//附件文件显示（电子档案）
  .directive("attachmentsShow", [attachmentsShow])//附件只读显示（资质证照）
  .directive("eAttachmentsShow", [eAttachmentsShow])//附件只读显示（电子档案）
  .directive("attachmentsEdit", [attachmentsEdit])//附件上传编辑（资质证照）
  .directive("addContactsEdit", [addContactsEdit])//首营模块，增加联系人（编辑）
  .directive("addContactsShow", [addContactsShow])//首营模块，增加联系人（显示）
  .directive("auditContactsEdit", [auditContactsEdit])//首营模块，录入审核人模块编辑。
  .directive("auditContactsShow", [auditContactsShow])//首营模块，录入审核人模块显示。
  .directive("eAttachmentsEdit", [eAttachmentsEdit])//附件上传编辑（电子档案）
  .directive("bottomButtonList", [bottomButtonList])//底部自定义菜单
  .directive("queryItemCardButtonList", [queryItemCardButtonList])//查询页面卡片式菜单
  .directive("queryItemTableButtonList", [queryItemTableButtonList])//查询页面table菜单
  .directive("customTablePrint", [customTablePrint])
  .directive("resizableColumns", [resizableColumns])//  用户自定义表 可以调整宽度指令
  .directive("customTable", [customTable])
  .directive("customTableFixedMeter", [customTableFixedMeter])//自定义表格，固定表头
  .directive("flashAddMedical", ["utils","$timeout",flashAddMedical])
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
  .directive("tableToggleSort", ["modal","utils","requestData",tableToggleSort])//普通表格点击排序
  .directive("customTableToggleSort", ["modal","utils","requestData",customTableToggleSort])//自定义表格点击排序
  .directive("queryOrderStatusButton", [queryOrderStatusButton])//查询页面，查询条件：状态按钮
  .directive("intervalCountdown", ["$interval",intervalCountdown])//倒计时标签
  .directive("workflowRejectButton",  ['utils', workflowRejectButton])//工作流配置自定义菜单 驳回
  .directive("workflowPassButton",  ['utils', workflowPassButton])//工作流配置自定义菜单 通过
  .directive("workflowButtonQueryCard",  ['utils', workflowButtonQueryCard])//工作流配置菜单 查询列表使用
  .directive("customMenuList",  ['utils', customMenuList])//自定义菜单。列表显示
  .directive("workflowTaskRunWithAttchments",  ['utils', workflowTaskRunWithAttchments])//待附件审查
  .directive("orderMedicalsPurchase", [orderMedicalsPurchase])//药械订单列表-采购
  .directive("orderMedicals", [orderMedicals])//药械订单列表
  .directive("niceScroll", [niceScroll]) //滚动条美化
  .directive("leftMenuChange", ['$location', leftMenuChange]) //左边栏子菜单点击事件
  .directive("leftMenuToggle", ['$location', leftMenuToggle])  //左边栏一级菜单伸缩
  .directive("orderStatusChoise", [orderStatusChoise]) //订单列表首页订单状态按钮切换样式
  .directive("orderListTips", [orderListTips]) //订单页头导航按钮点击事件处理
  .directive("toggleLeftMenu", [toggleLeftMenu]) //点击展开隐藏左边栏
  .directive("togglePanel", [togglePanel]) //面板点击收起、展开与关闭
  .directive("morris", [morris]) //morris图表展示
  .directive("icheck", [icheck]) //iCheck
  .directive("sparkline", [sparkline]) //sparkline 柱状图
  .directive("runTooltips", [runTooltips]) //tooltips
  .directive("runPopovers", ['$timeout', runPopovers]) //popover
  .directive("handleThisClick", ['$window', 'dialogConfirm', 'requestData', 'alertOk', 'alertError','utils', handleThisClick]) //带确认对话框的按钮点击事件
  .directive("leftMenuSecondToggle", ['$location',"$rootScope", leftMenuSecondToggle]) //左侧二级菜单切换效果
  .directive("leftNavigationMenu", ['uiTabs','$rootScope',leftNavigationMenu]) //html-edit
  .directive("styleToggle", ['$location', styleToggle])
  .directive("leftSideActive",[leftSideActive])//库存页面侧边导航样式
  .directive("tableTrMouseOverMenu",["utils","$compile","customMenuUtils",tableTrMouseOverMenu])  // tableTrMouseOverMenu table标签，移动上去显示菜单按钮。
  .directive("tableFixedMeter",["utils","$compile","customMenuUtils",tableFixedMeter])  // tableFixedMeter table标签，固定表头的表格组件。
  .directive("medicalStockMouseOver",["utils","$compile",medicalStockMouseOver])// 库存明细模块，鼠标移入高亮并显示两个按钮
  .directive("medicalStockMouseOverSee",["utils","$compile",medicalStockMouseOverSee])
  .directive("stepFlowArrowShow",["utils",stepFlowArrowShow])//医院、经销商/零售商资格申请，首营品种、企业管理模块流程箭头样式。
  .directive("limitWordShow",["utils",limitWordShow])//弹出框显示限制剩余字数.directive("dtRightSide",["utils",dtRightSide]);//弹出框显示限制剩余字数
  .directive("dtRightSide",["utils",dtRightSide])
  .directive("date",["utils","$parse",date]);
});
