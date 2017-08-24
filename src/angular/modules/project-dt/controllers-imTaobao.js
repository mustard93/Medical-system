/**
 * Created by hao on 15/11/5.
 */
define('project-dt/controllers-imTaobao', ['project-dt/init'], function() {

  /**
   * [saleReturnMedicalItemController 新建销退单药品列表tr控制器]
   * @param  {[type]} $scope [description]
   * @return {[type]}        [description]
   */
  function imTaobaoCtr ($scope,requestData,alertError,$rootScope) {
    //弹出与某人聊天.toUserId 聊天 人的userid
    $scope.openIm = function (toUserId, toUserName) {
      var imTaobaoUserInfo=  $rootScope.MyImTaobaoUserInfo;
      if(!imTaobaoUserInfo){//没有帐号就获取帐号
        imTaobaoUserInfo_getMy(function(){$scope.openIm(toUserId)});
        return ;
      }
      if(!toUserId)toUserId="";
      if(!toUserName)toUserName="";
      var param="?uid="+imTaobaoUserInfo.userid+"&to="+toUserId+"&toUserName="+toUserName+"&appkey=23588140&pwd="+imTaobaoUserInfo.password+"&fullscreen";
      console.log("imTaobaoCtr.openIm");
      window.open('../imtaobao/kit.html'+param, 'webcall', 'toolbar=no, status=no,scrollbars=0,resizable=0,menubar＝0,location=0,width=700,height=530');

    };

    //获取我的聊天帐号信息
    function imTaobaoUserInfo_getMy(callback) {
      var url='rest/authen/imTaobaoUserInfo/getMy.json';
      requestData(url)
        .then(function (results) {
          var _data = results[0];
          $rootScope.MyImTaobaoUserInfo= results[0];
          if(callback){
            callback();
          }
        })
        .catch(function (error) {
          alertError(error || '出错');
        });
    }//imTaobaoUserInfo_getMy



  }//imTaobaoCtr

  angular.module('manageApp.project-dt')
  .controller('imTaobaoCtr', ['$scope',"requestData",'alertError',"$rootScope", imTaobaoCtr]);


});
