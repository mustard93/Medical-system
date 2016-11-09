/**
 * Created by hao on 15/11/18.
 */
define('project/services', ['project/init'], function () {
  /**
   *  项目自定义顶部fixed消息提示tips
   *  Mode: 1.success 2.error 3.prompt(提示)
   */
  function proMessageTips () {
    return function (mode, text, clearTime) {
      var _mode = mode ? mode : 'prompt',
          _text = text ? text : '';
      var _html = '<div class="pr-top-dialog-tips" style="position:fixed;left:50%;top:0;opacity:0;height:42px;line-height:42px;padding:0 15px;color:#fff;background-color:#64c213;animation:topIn 1s;">'+ test +'</div>';
      $(html).append(_html);
    };
  }



  //弹窗提示
  function watchFormChange($timeout) {
      var watchFormChangeObj=null;
      return function (watchName, $scope) {

           $timeout(function () {
                    $scope.changeFlag=false;
                },500);

              if(watchFormChangeObj){
                try{
                    watchFormChangeObj();
                }catch(e){}

              }
              watchFormChangeObj = $scope.$watch(watchName,function(newValue,oldValue, scope){
                    $scope.changeFlag=true;
             },true);




      };


  }

  angular.module('manageApp.project')
      .service('watchFormChange', ["$timeout",watchFormChange])
    .factory('proMessageTips', [proMessageTips]);
});
