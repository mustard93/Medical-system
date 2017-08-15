define('project/controllers-notice', ['project/init'], function() {
  /**
   * [noticeCtrl 站内消息]
   * @method noticeCtrl
   * @param  {[type]}   $scope      [description]
   * @param  {[type]}   modal       [description]
   * @param  {[type]}   alertWarn   [description]
   * @param  {[type]}   requestData [description]
   * @param  {[type]}   alertOk     [description]
   * @param  {[type]}   alertError  [description]
   * @param  {[type]}   $rootScope  [description]
   * @param  {[type]}   $interval   [description]
   * @return {[type]}               [description]
   */
  function noticeCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,$interval) {

    $scope.noticeClick = function(notice) {

        requestRead(notice.id,notice);

        notice.readFlag=true;
      if($scope.scopeResponse&&$scope.scopeResponse.totalCount)$scope.scopeResponse.totalCount--;
        if (!(notice.moduleType&&notice.relId)){
            alertOk(notice.subject);
            return;
        }
            //相应跳转
          // window.location.assign('#/'+notice.moduleType+'/get.html?id='+notice.relId);
        $rootScope.goTo('#/'+notice.moduleType+'/get.html?id='+notice.relId);

     };//noticeClick



     //刷新未读消息通知
     function refreshNotice(){
         $rootScope.noticeRefreshTime=new Date().getTime();
     }

     //启动消息定时获取未读消息通知
     $rootScope.startGetMsg = function(){
         if(Config.stopIntervalNotice===true){
            return;
         }
         if($rootScope.startGetMsgObj)return;
           $rootScope.startGetMsgObj=$interval(function(){
             refreshNotice();
           }, 10000);
       };
        $rootScope.startGetMsg();

     //标记已经阅读。
     requestRead = function(id,notice) {
       var url='rest/authen/notice/read';
       var data= {id:id};
       requestData(url,data, 'POST')
         .then(function (results) {
             refreshNotice();
         })
         .catch(function (error) {

         });
     };//end $scope.requestRead

    // 标记所有信息为已读
    $scope.flagAllInfoReaded = function (event) {
      event.stopPropagation();

      var _url = 'rest/authen/notice/readAll';
      requestData(_url, {}, 'POST')
      .then(function (results) {
        if (results[1].code === 200) { alertOk('操作成功'); $scope.scopeResponse.data=[];}
      })
      .catch(function (error) {
        if (error) { throw new Error(error); }
      });
    }

  }

  angular.module('manageApp.project')
  .controller('noticeCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "$rootScope", "$interval", noticeCtrl]);
});
