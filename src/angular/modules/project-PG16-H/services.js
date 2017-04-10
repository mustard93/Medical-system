/**
 * Created by hao on 15/11/18.
 */
define('project-PG16-H/services', ['project-PG16-H/init'], function() {
    function bottomButtonList($rootScope) {
      var tmpUtils = {
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

          //前台自定义按钮 样例
          get_ButtonListDemo: function(showData) {
              var arr = [];
              //aclass ：样式，ahref：连接，showName：显示名
              var bottomButton = {
                  "aclass": "",
                  "ahref": "#/firstEnterpriseApplication/query.html",
                  "showName": "返回申请单列表"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              //权限控制
              bottomButton = {
                  "authority": "采购单新建权限",
                  "aclass": "color-orange add-return-order",
                  "ahref": "#/firstEnterpriseApplication/query.html",
                  "showName": "新建权限"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              bottomButton = {
                  "type": "modalRight",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ahref": "#/firstEnterpriseApplication/query.html",
                  "showName": "右侧弹出层"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              bottomButton = {
                  "type": "modalCenter",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ahref": "#/firstEnterpriseApplication/query.html",
                  "showName": "中间弹出层"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              bottomButton = {
                  "type": "ngClick",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ngClick": "$root.goTo('#/hospitalApplication/query.html?tt='+showData.id)",
                  "showName": "自定义方法"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              bottomButton = {
                  "showName": "自定义ctr方法",
                  "type": "ngClick",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ngClick": "openIm('123','fff')"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              //button
              bottomButton = {
                  "ngDisabled": "!!ngDisabled",
                  "showName": "ngDisabled_button",
                  "type": "button",
                  "modalWidth": "1000",
                  "ngClick": "openIm('123','fff')"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              bottomButton = {
                  "ngShow": "!!ngShow",
                  "showName": "ngShow",
                  "type": "ngClick",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ngClick": "openIm('123','fff')"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }

              //button
              bottomButton = {
                  "ngDisabled": "!!ngDisabled",
                  "showName": "handleThisClick",
                  "type": "handleThisClick",
                  "alertTemplate": "pr-dialog-return.html",
                  "ngClick": "openIm('123','fff')"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }


              bottomButton = {
                  "ngShow": "editForm.$valid",
                  "showName": "保存",
                  "type": "ngClick",
                  "modalWidth": "1000",
                  "aclass": "color-orange add-return-order",
                  "ngClick": "openIm('123','fff')"
              };
              if (tmpUtils.canShowButton(bottomButton)) {
                  arr.push(bottomButton);
              }



              if (showData) {
                  bottomButton = {
                      "aclass": "btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                      "ahref": Config.serverPath + "rest/authen/firstEnterpriseApplication/exportWord?id=" + showData.id,
                      "showName": "打印"
                  };
                  if (tmpUtils.canShowButton(bottomButton)) {
                      arr.push(bottomButton);
                  }
              }
              console.log(arr);
              return arr;
          },

          // SPD采购目录模块列表页菜单定义
          getQuery_purchaseContent: function(showData) {
            var arr = [];

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
          }

        };

      return tmpUtils;
    }
    angular.module('manageApp.project-PG16-H')
    .factory('bottomButtonList', ["$rootScope", bottomButtonList]);
});
