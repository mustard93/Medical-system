/**
 * Created by hao on 16/1/7.
 */
define('project-PG16-H/service', ['project-PG16-H/init'], function () {

  function queryItemCardButtonList2($rootScope) {

    return {
      //业务逻辑判断，是否显示菜单
      canShowButton: function(bottomButton) {
          if (bottomButton.authority) { //当前用户有权限才添加
              if ($rootScope.hasAuthor(bottomButton.authority)) {
                  return true;
              } else { //没有权限不添加
                  return false;
              }
          }
          return true;
      },
      //SPD采购目录模块
      getQuery_purchaseContent: function(showData) {

        var arr = [];
        var bottomButton = null;

        bottomButton = {
          "iconClass": "edit-link-icon",
          "showName": "编辑",
          "aclass": "btn-link pd-m rect-s",
          "ahref": "#/salesOrder/edit2.html?id=" + showData.id
        };
        if (tmpUtils.canShowButton(bottomButton)) {
          arr.push(bottomButton);
        }

        bottomButton = {
          "iconClass": "watch-detail-icon",
          "showName": "查看详情",
          "aclass": "btn-link pd-m rect-s",
          "ahref": "#/salesOrder/get.html?id=" + showData.id
        };
        if (tmpUtils.canShowButton(bottomButton)) {
            arr.push(bottomButton);
        }

        return arr;
      },


        //购需单列表页
        get_purchasePlanOrder: function(showData) {

            var arr = [];




              var bottomButton = {
                "iconClass": "edit-link-icon",
                "showName": "编辑",
                "ngShow": "tr.orderStatus!='已处理'",
                "aclass": "btn-link pd-m rect-s",
                "ahref": "#/purchasePlanOrder/edit.html?id=" + showData.id
            };
            if (tmpUtils.canShowButton(bottomButton)) {
                arr.push(bottomButton);
            }

            bottomButton = {
                "iconClass": "watch-detail-icon",
                "showName": "查看详情",
                "ngShow": "tr.orderStatus=='已处理'",
                "aclass": "btn-link pd-m rect-s",
                "ahref": "#/purchasePlanOrder/get.html?id=" + showData.id
            };
            if (tmpUtils.canShowButton(bottomButton)) {
                arr.push(bottomButton);
            }

            bottomButton = {
                "ngShow": "tr.orderStatus=='待处理' && tr.inputUserId==mainStatus.id",
                "showName": "删除",
                "iconClass": "delete-link-icon",
                "type": "handleThisClick",
                "alertTemplate": "pr-dialog-submit.html",
                "requestUrl": "rest/authen/purchasePlanOrder/delete?id=" + showData.id,
                "aclass": "btn-link pd-m rect-s mr--4",
                "alertTitle": "确认删除?",
                "alertMsg": "删除后将无法恢复,确认删除?",
                "ngClick": "$root.goTo('#/purchasePlanOrder/query.html')"
            };
            if (tmpUtils.canShowButton(bottomButton)) {
                arr.push(bottomButton);
            }
            return arr;
        },

    };
  }

  angular.module('manageApp.project-PG16-H')
  .factory('queryItemCardButtonList2', ["$rootScope", queryItemCardButtonList2]);
});
