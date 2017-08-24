define('project-dt/controllers-auditUserApplyOrganization', ['project-dt/init'], function() {
  /**
   * [auditUserApplyOrganizationCtrl 用户审核]
   * @method auditUserApplyOrganizationCtrl
   * @param  {[type]}                       $scope      [description]
   * @param  {[type]}                       modal       [description]
   * @param  {[type]}                       alertWarn   [description]
   * @param  {[type]}                       requestData [description]
   * @param  {[type]}                       alertOk     [description]
   * @param  {[type]}                       alertError  [description]
   * @param  {[type]}                       $rootScope  [description]
   * @param  {[type]}                       proLoading  [description]
   * @return {[type]}                                   [description]
   */
  function auditUserApplyOrganizationCtrl($scope, modal,alertWarn,requestData,alertOk,alertError,$rootScope,proLoading) {

    /**
    获取选择的用户对象，用于显示人名
    */
    $scope.getCheckUserApplyArr = function(arr,ids) {

      //
      var data=[];
       if(!ids||ids.length===0){
         return data;
       }
       for(var i=0;i<arr.length;i++){
         if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                   data.push(arr[i]);
         }
       }
         return data;
     };
    /**
    *保存
    type:save-草稿,submit-提交订单。
    */
    $scope.batchAuditUserApplyOrganization = function(arr,ids,status,key,message) {
       if(!ids||ids.length===0){
         alertWarn('请先勾选');
         return;
       }
       //
       var data=[];
       for(var i=0;i<arr.length;i++){

         if(ids.indexOf(arr[i].id)>-1&&arr[i].formData){
                   arr[i].formData.status=status;
                   arr[i].formData.key=key;
                   arr[i].formData.message=message;
                   data.push(arr[i].formData);
         }
       }


       var url='rest/authen/hospital/batchAuditUserApplyOrganization';


       var  maskObj=proLoading();

       requestData(url,data, 'POST',true)
         .then(function (results) {
                  if(maskObj)maskObj.hide();
                   alertOk(results[1].msg);
                 $scope.$broadcast('reloadList');
                   $scope.$emit('reloadList');
                   modal.close();

         })
         .catch(function (error) {
           if(maskObj)maskObj.hide();
             modal.close();
            alertWarn(error);


         });

     };//batchAuditUserApplyOrganization

     //启动消息定时获取
     $rootScope.startGetMsg = function(){
         if($rootScope.startGetMsgObj)return;
           $rootScope.startGetMsgObj=$interval(function(){
              $rootScope.noticeRefreshTime=new Date().getTime();
           }, 10000);
       };
        $rootScope.startGetMsg();

     //标记已经阅读。
     requestRead = function(id,notice) {
       var url='rest/authen/notice/read';
       var data= {id:id};
       requestData(url,data, 'POST')
         .then(function (results) {

         })
         .catch(function (error) {

         });
     };//end $scope.requestRead

   }//auditUserApplyOrganizationCtrl

  angular.module('manageApp.project-dt')
  .controller('auditUserApplyOrganizationCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "$rootScope", "proLoading", auditUserApplyOrganizationCtrl]);
});
