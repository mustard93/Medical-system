/**
 * Created by hao on 15/11/21.
 */

define('modal/directives', ['modal/init'], function () {


/**
  获取模版路径，支持项目相对路径和angluar框架模版路径
默认取项目路径。
  <button
          type="button"
          modal-center="340"
          modal-scope="this"
          modal-data='{"title":"确认",
                       "content":"冻结后，将无法对该客户销售。确认冻结？",
                       "btnConfirm":"确定",
                       "btnCancel":"取消",
                       "url":"rest/authen/customerAddress/updateStatus",
                       "goUrl":"",
                       "id":"{{showData.id}}",
                       "status":"已冻结"
                      }'
          modal-url="angular/tpl/pr-dialog-submit-message.html"
          >冻结
  </button>

  取angluar模版相对路径。
    <button
            type="button"
            modal-center="340"
            modal-scope="this"
            tpl-url="tpl/pr-dialog-submit-message.html"
            >冻结
    </button>
*/
  function getTemplateUrl($attrs){
      //默认取项目路径。
      var templateUrl=$attrs.modalUrl;

      //取angluar模版相对路径。
      if($attrs.tplUrl){
        templateUrl= Config.tplPath +$attrs.tplUrl;
      }

      return templateUrl;
  }
  //弹窗
  function modal(ngDialog) {
      return {
          restrict: 'A',
          scope: {
              modalScope: '='
          },
          link: function (scope, elem, attrs) {
              elem.on('click', function (e) {
                  e.preventDefault();

                  var ngDialogScope = angular.isDefined(scope.modalScope) ? scope.modalScope : 'noScope';
                  // angular.isDefined(attrs.ngDialogClosePrevious) && ngDialog.close(attrs.ngDialogClosePrevious);
                  if (angular.isDefined(attrs.ngDialogClosePrevious)) {
                    ngDialog.close(attrs.ngDialogClosePrevious);
                  }

                  var defaults = ngDialog.getDefaults();

                  ngDialog.open({
                      template: attrs.ngDialog,
                      className: attrs.ngDialogClass || defaults.className,
                      controller: attrs.ngDialogController,
                      controllerAs: attrs.ngDialogControllerAs,
                      bindToController: attrs.ngDialogBindToController,
                      scope: ngDialogScope,
                      data: attrs.ngDialogData,
                      showClose: attrs.ngDialogShowClose === 'false' ? false : (attrs.ngDialogShowClose === 'true' ? true : defaults.showClose),
                      closeByDocument: attrs.ngDialogCloseByDocument === 'false' ? false : (attrs.ngDialogCloseByDocument === 'true' ? true : defaults.closeByDocument),
                      closeByEscape: attrs.ngDialogCloseByEscape === 'false' ? false : (attrs.ngDialogCloseByEscape === 'true' ? true : defaults.closeByEscape),
                      overlay: attrs.ngDialogOverlay === 'false' ? false : (attrs.ngDialogOverlay === 'true' ? true : defaults.overlay),
                      preCloseCallback: attrs.ngDialogPreCloseCallback || defaults.preCloseCallback
                  });
              });
          }
      };
  }
  modal.$inject = ['modal'];

  //右侧遮罩层
  function modalRight(ngDialog,utils) {
      return {
          restrict: 'A',
          scope: {
              modalScope: '=',
          },
          link: function ($scope, $elem, $attrs) {
              var dialogWidth = $attrs.modalRight || "50%";

              var dialogOpen = function () {


                //获取模版路径，支持项目相对路径和angluar框架模版路径
                var templateUrl=getTemplateUrl($attrs);


                //增加url参数解析，放到  $scope.modalScope.mainStatus.pageParams 中，与 ng-view 保持一致
                //不能使用$scope.modalScope.mainStatus.pageParams，应该该属性在父类已经有了，直接修改会触发 $scope.modalScope 只作用域全部更新到scope状态，导致数据回滚。
                //modalRight 指令使用odalScope.pageParams 传递 url参数。
                if(  $scope.modalScope){
                    $scope.modalScope.pageParams=utils.parseQueryString(templateUrl);
                }


                return ngDialog.open({
                          template: templateUrl,
                          className: 'ngdialog-theme-right',
                          cache: false,
                          trapFocus: false,
                          overlay: ($attrs.modalOverlay == "true"),
                          data: $attrs.modalData || $scope.modalScope.tr,
                          scope: $scope.modalScope,
                          controller: ["$scope", "$element", function ($scope, $element) {
                              $(".ngdialog-content", $element).width(dialogWidth);
                          }]
                      });
              };

              // 增加属性modalOpenAuto,其为一表达式，若返回为字符串true，则自动打开右侧模态框
              if (angular.isDefined($attrs.modalOpenAuto) && $attrs.modalOpenAuto == "true") {
                  dialogOpen();
              }

              $elem.on('click', function (e) {
                  e.preventDefault(); //取消默认事件
                  e.stopPropagation();  //阻止事件冒泡

                  ngDialog.closeAll();

                  dialogOpen();

                  // ngDialog.open({
                  //     template: $attrs.modalUrl,
                  //     className: 'ngdialog-theme-right',
                  //     cache: false,
                  //     trapFocus: false,
                  //     overlay: ($attrs.modalOverlay == "true"),
                  //     data: $attrs.modalData || $scope.modalScope.tr,
                  //     scope: $scope.modalScope,
                  //     controller: ["$scope", "$element", function ($scope, $element) {
                  //         $(".ngdialog-content", $element).width(dialogWidth);
                  //     }]
                  // });
              });
          }
      };
  }


  //中间遮罩层
  function modalCenter(ngDialog,utils) {
      return {
          restrict: 'A',
          scope: {
              modalScope: '='
          },
          link: function ($scope, $elem, $attrs) {
              var dialogWidth = $attrs.modalCenter || "50%";
              $elem.on('click', function (e) {
                  e.preventDefault();

                  //ngDialog.close();
                  //增加url参数解析，放到  $scope.modalScope.mainStatus.pageParams 中，与 ng-view 保持一致

                  //获取模版路径，支持项目相对路径和angluar框架模版路径
                  var templateUrl=getTemplateUrl($attrs);

                  if(  $scope.modalScope){
                      $scope.modalScope.pageParams=utils.parseQueryString(templateUrl);
                  }
                  ngDialog.open({
                      template: templateUrl,
                      //className: 'ngdialog-theme-right',
                      cache: false,
                      trapFocus: false,
                      //overlay: false,
                      data: $attrs.modalData || $scope.modalScope.tr,
                      scope: $scope.modalScope,
                      controller: ["$scope", "$element", function ($scope, $element) {
                          $(".ngdialog-content", $element).width(dialogWidth);
                      }]
                  });
              });
          }
      };
  }


  angular.module('manageApp.modal')
      .directive("modal", modal)
      .directive("modalRight",  ['modal','utils',modalRight])
      .directive("modalCenter", ['modal','utils',modalCenter]);
});
