define('project/controllers-editWorkFlowProcess', ['project/init'], function() {
  /**
   * [editWorkFlowProcessCtrl 编辑工作流]
   * @method editWorkFlowProcessCtrl
   * @param  {[type]}                $scope      [description]
   * @param  {[type]}                modal       [description]
   * @param  {[type]}                alertWarn   [description]
   * @param  {[type]}                requestData [description]
   * @param  {[type]}                alertOk     [description]
   * @param  {[type]}                alertError  [description]
   * @param  {[type]}                $rootScope  [description]
   * @return {[type]}                            [description]
   */
  function editWorkFlowProcessCtrl ($scope, modal, alertWarn, requestData, alertOk, alertError, $rootScope) {
    // 切换button顺序
    $scope.switchButtons = function(buttons,ind,ind2) {
      var tmp=buttons[ind];
      buttons[ind]=buttons[ind2];
      buttons[ind2]=tmp;

    };

    // 保存节点信息（新建or创建）
    $scope.addEventButtons = function(formData1) {
      if(!formData1)formData1={};
      //if(!formData1.didateFilter)formData1.didateFilter={};
      if(!formData1.buttons)formData1.buttons=[];
      var btnForm = {
        type: '通过',
        buttonName: '审核通过',
        requestMethod: 'POST',
        conditionType:'通过',
        requestParam: 'KeyValue',
        requestUrl : 'rest/authen/workflowTask/run.json'
      };
      formData1.buttons.push(btnForm);
    };

    //当一个节点的name改变后，需要更新对应的关联关系。
    function updateEventRelations(events,oldId,newId){

       for(var i=0;i<events.length;i++){
         if(events[i].sourceRef==oldId){
           events[i].sourceRef=newId;
         }
         if(events[i].targetRef==oldId){
           events[i].targetRef=newId;
         }
       }
     }

    // 保存节点信息（新建or创建）
    $scope.saveEvent = function(event1) {
      if(!$scope.formData.events)$scope.formData.events=[];
      var events=$scope.formData.events;
      var isInsert=true;
      //防止'' 保存到后台,枚举报错bug.
      if(!event1.conditionType)event1.conditionType=null;
      if(event1.id){
          var ind=$rootScope.utils.getObjectIndexByKeyOfArr(events,'id',event1.id);
          if(event1.id!=event1.name){
              updateEventRelations(events,event1.id,event1.name);
          }
          event1.id=event1.name;
          if(ind>-1){
              events[ind]=event1;

              isInsert=false;
          }
      }

      if(isInsert){

            event1.id=event1.name;
           events.push(event1);
      }

      console.log(event1);

      modal.closeAll();
    };

    // 删除节点信息（新建or创建）
    $scope.deleteEvent = function(id) {
      if(!$scope.formData.events)$scope.formData.events=[];
        var events=$scope.formData.events;
      var index=$rootScope.utils.removeObjectByKeyOfArr(events,'id',id);
      if(index<0){
          alertError('没有该节点，id='+event1.id);
          return;
      }
      //删除关联关系
      updateEventRelations(events,id,null);

        modal.closeAll();
    };

  }

  angular.module('manageApp.project')
  .controller('editWorkFlowProcessCtrl', ['$scope',"modal",'alertWarn',"requestData", "alertOk", "alertError", "$rootScope", editWorkFlowProcessCtrl]);
});
