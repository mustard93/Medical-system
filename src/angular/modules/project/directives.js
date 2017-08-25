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

  angular.module('manageApp.project')
  .directive("htmlEdit", [ htmlEdit])
  .directive("textareaJson", ['utils', 'alertError', textareaJson]);
});
