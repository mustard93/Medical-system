/**
 * Created by hao on 15/11/18.
 */
define('project-PG16-H/services', ['project-PG16-H/init'], function () {

  function bottomButtonList ($rootScope) {

      var tmpUtils=  {
          //业务逻辑判断，是否显示菜单
          canShowButton:function(bottomButton){

            if(bottomButton.authority){//当前用户有权限才添加
              if($rootScope.hasAuthor(bottomButton.authority)){
                   return true;
              }else{  //没有权限不添加
                return false;
              }
            }
            return true;
          },

          //前台自定义按钮 样例
          get_ButtonListDemo:function(showData){
            var arr=[];
            //aclass ：样式，ahref：连接，showName：显示名
            var bottomButton={"aclass":"","ahref":"#/firstEnterpriseApplication/query.html","showName":"返回申请单列表"};
            if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

            //权限控制
            bottomButton={"authority":"采购单新建权限","aclass":"color-orange add-return-order","ahref":"#/firstEnterpriseApplication/query.html","showName":"新建权限"};
            if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

             bottomButton={"type":"modalRight","modalWidth":"1000","aclass":"color-orange add-return-order","ahref":"#/firstEnterpriseApplication/query.html","showName":"右侧弹出层"};
          if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

             bottomButton={"type":"modalCenter","modalWidth":"1000","aclass":"color-orange add-return-order","ahref":"#/firstEnterpriseApplication/query.html","showName":"中间弹出层"};
          if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

            bottomButton={"type":"ngClick","modalWidth":"1000","aclass":"color-orange add-return-order","ngClick":"$root.goTo('#/hospitalApplication/query.html?tt='+showData.id)","showName":"自定义方法"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

           bottomButton={"showName":"自定义ctr方法","type":"ngClick","modalWidth":"1000","aclass":"color-orange add-return-order","ngClick":"openIm('123','fff')"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

         //button
         bottomButton={"ngDisabled":"!!ngDisabled", "showName":"ngDisabled_button","type":"button","modalWidth":"1000","ngClick":"openIm('123','fff')"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

         bottomButton={"ngShow":"!!ngShow", "showName":"ngShow","type":"ngClick","modalWidth":"1000","aclass":"color-orange add-return-order","ngClick":"openIm('123','fff')"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

         //button
         bottomButton={"ngDisabled":"!!ngDisabled", "showName":"handleThisClick","type":"handleThisClick","alertTemplate":"pr-dialog-return.html","ngClick":"openIm('123','fff')"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}


         bottomButton={"ngShow":"editForm.$valid", "showName":"保存","type":"ngClick","modalWidth":"1000","aclass":"color-orange add-return-order","ngClick":"openIm('123','fff')"};
         if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}



            if(showData){
              bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                "ahref":Config.serverPath+"rest/authen/firstEnterpriseApplication/exportWord?id="+showData.id,
                "showName":"打印"};
              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
            }
            console.log(arr);
            return arr;
          },
          //获取销售单详细页面菜单定义
          get_confirmOrder:function(showData){
              var arr=[];
              var bottomButton={"aclass":"mgr-l","ahref":"#/confirmOrder/query.html","showName":"返回销售单列表"};
              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}


              bottomButton={"ngShow":"formData.orderStatus=='待处理' && formData.inputUserId==mainStatus.id", "showName":"删除",
              "type":"handleThisClick",
              "alertTemplate":"dialog-confirm.html",
              "requestUrl":"rest/authen/salesOrder/delete?id="+showData.id,
              "aclass":"pr-color-red mgr",
              "alertTitle":"确认删除?",
              "alertMsg":"您确认删除这条销售单吗?",
              "ngClick":"$root.goTo('#/confirmOrder/query.html')"};

              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}


              bottomButton={"aclass":"pr-btn-save-glodbg mgr color-white",
              "ahref":"indexOfPrint.html#/print/confirmOrderPrint.html?id="+showData.id,
              "target":"_blank",
              "showName":"打印预览"};
              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}


              return arr;
            },//get_firstEnterpriseApplication
          //获取首营企业菜单定义
          get_firstEnterpriseApplication:function(showData){
              var arr=[];
              //aclass ：样式，ahref：连接，showName：显示名
              var bottomButton={"aclass":"","ahref":"#/firstEnterpriseApplication/query.html","showName":"返回申请单列表"};
            if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
          //     bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
          //     "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
          //     "httpMethod":"GET",
          //     "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
          //     "showName":"查看操作记录"};
           //
          //  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
              // if(showData){
              //   bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
              //     "ahref":Config.serverPath+"rest/authen/firstEnterpriseApplication/exportWord?id="+showData.id,
              //     "showName":"打印"};
              //   if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
              // }

              return arr;
            }//get_firstEnterpriseApplication
            //获取首营药械菜单定义
              ,get_firstMedicalApplication:function(showData){

                var arr=[];
                //aclass ：样式，ahref：连接，showName：显示名
                var bottomButton={"aclass":"","ahref":"#/firstMedicalApplication/query.html","showName":"返回申请单列表"};
              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

            //     bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
            //     "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
            //     "httpMethod":"GET",
            //     "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
            //     "showName":"查看操作记录"};
             //
            //  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                // if(showData){
                //   bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                //     "ahref":Config.serverPath+"rest/authen/firstMedicalApplication/exportWord?id="+showData.id,
                //     "showName":"打印"};
                //   if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                // }

                return arr;
              }//get_firstEnterpriseApplication

            //获取品种信息管理菜单定义
              ,get_medicalStock:function(showData){

                var arr=[];
                //aclass ：样式，ahref：连接，showName：显示名
                var bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
                "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
                "httpMethod":"GET",
                "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
                "showName":"查看操作记录"};

             if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                return arr;
              }
              // 客户管理模块
              ,get_customerAddress:function(showData){

                var arr=[];
                //aclass ：样式，ahref：连接，showName：显示名
                var bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
                "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
                "httpMethod":"GET",
                "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
                "showName":"查看操作记录"};

             if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                return arr;
              }


              //获取医院资格声请菜单定义
                ,get_hospitalApplication:function(showData){
                  var arr=[];
                  //aclass ：样式，ahref：连接，showName：显示名
                  var bottomButton={"aclass":"","ahref":"#/hospitalApplication/query.html","showName":"返回申请单列表"};
                if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                  return arr;
                }//get_hospitalApplication

              //获取医院采购目录菜单定义
                ,get_hospitalPurchaseContents:function(showData){
                  var arr=[];
                  //aclass ：样式，ahref：连接，showName：显示名
                  var bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
                "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
                "httpMethod":"GET",
                "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
                "showName":"查看操作记录"};

                if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                  return arr;
                }//get_hospitalApplication

                //获取医院资格声请菜单定义
                  ,get_otherCustomerApplication:function(showData){
                    var arr=[];
                    //aclass ：样式，ahref：连接，showName：显示名
                    var bottomButton={"aclass":"","ahref":"#/otherCustomerApplication/query.html","showName":"返回申请单列表"};
                  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    return arr;
                  }//get_otherCustomerApplication
        };//end return
      return tmpUtils;
    }

      angular.module('manageApp.project')
        .factory('bottomButtonList', ["$rootScope",bottomButtonList]);

});
