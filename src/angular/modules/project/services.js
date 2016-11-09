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



  //监听内容修改标志
  function watchFormChange($timeout) {

      return function (watchName, $scope) {

          //延迟初始化修改标志
           $timeout(function () {
                    $scope.changeFlag=false;
                },500);

            $scope.$watch(watchName,function(newValue,oldValue, scope){
                    $scope.changeFlag=true;
             },true);




      };


  }

  angular.module('manageApp.project')
      .service('watchFormChange', ["$timeout",watchFormChange])
    .factory('proMessageTips', [proMessageTips]);
});
