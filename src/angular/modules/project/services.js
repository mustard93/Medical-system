/**
 * Created by hao on 15/11/18.
 */
define('project/services', ['project/init'], function () {
  /**
   *  获取当前Url详细信息
   */
  function getUrlInfo ($location) {
    return function () {
      var urlInfo = {};
      urlInfo.absUrl = $location.absUrl();  //完整的Url
      urlInfo.host = $location.host();  //主机名称
      urlInfo.port = $location.prot();  //端口
    };
  }
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

  angular.module('manageApp.project')
    .factory('proMessageTips', [proMessageTips])
    .factory('getUrlInfo', ['$location', getUrlInfo]);
});
