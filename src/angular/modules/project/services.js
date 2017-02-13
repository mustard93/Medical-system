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

          //Loading  bottomButtonList
          //  <a class="{{tr.aclass}}" href="{{tr.ahref}}">{{tr.showName}}</a>
          /**
          bottomButton ={
          aclass ："",//样式，
          ahref："",//连接，
          ngClick:"",//执行函数
          "target":"_blank" //_blank|_self|_parent|_top
          showName："",必填。显示名
          type:"",modalRight(右侧弹出框)，modalCenter（中间弹出框），button（button按钮标签）不填写则为跳转类型。handleThisClick(确认操作框),ngClick(执行函数)
          authority:""，不为空，当前用户有该权限，才能显示。
          ngShow:"",//根据计算脚本布尔值是否显示按钮，angluarjs 模版语法脚本。不填写默认显示
          ngDisabled:""//根据计算脚本布尔值是否可点击按钮,angluarjs 模版语法脚本。不填写默认 可操作。仅type=button
              alertTemplate：type=handleThisClick,填写弹出框的模版地址。
          requestUrl:type=handleThisClick,填写确认后调用请求。
          httpMethod:POST|GET，type=handleThisClick,填写确认后调用请求的请求方式，默认POST
          alertTitle:'确认',type=handleThisClick,标题，默认POST
          alertMsg:"确定该操作",type=handleThisClick,内容，默认POST



        } 属性说明：
          */
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
                      bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
                      "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
                      "httpMethod":"GET",
                      "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
                      "showName":"查看操作记录"};

                   if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                      if(showData){
                        bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                          "ahref":Config.serverPath+"rest/authen/firstEnterpriseApplication/exportWord?id="+showData.id,
                          "showName":"打印"};
                        if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                      }

                      return arr;
                    }//get_firstEnterpriseApplication
                    //获取首营药械菜单定义
                      ,get_firstMedicalApplication:function(showData){

                        var arr=[];
                        //aclass ：样式，ahref：连接，showName：显示名
                        var bottomButton={"aclass":"","ahref":"#/firstMedicalApplication/query.html","showName":"返回申请单列表"};
                      if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                        bottomButton={"type":"modalRight","modalWidth":"800","aclass":"color-orange add-return-order mgl-s",
                        "requestUrl":"rest/authen/versionFlow/query?businessKey="+showData.id,
                        "httpMethod":"GET",
                        "ahref":"views/versionFlow/get-right-side.html?businessKey="+showData.id,
                        "showName":"查看操作记录"};

                     if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                        if(showData){
                          bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                            "ahref":Config.serverPath+"rest/authen/firstMedicalApplication/exportWord?id="+showData.id,
                            "showName":"打印"};
                          if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                        }

                        return arr;
                      }//get_firstEnterpriseApplication


                      //获取医院资格声请菜单定义
                        ,get_hospitalApplication:function(showData){
                          var arr=[];
                          //aclass ：样式，ahref：连接，showName：显示名
                          var bottomButton={"aclass":"","ahref":"#/hospitalApplication/query.html","showName":"返回申请单列表"};
                        if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                          if(showData){
                            bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                              "ahref":Config.serverPath+"rest/authen/hospitalApplication/exportWord?id="+showData.id,
                              "showName":"打印"};
                            if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                          }

                          return arr;
                        }//get_hospitalApplication
                        //获取医院资格声请菜单定义
                          ,get_otherCustomerApplication:function(showData){
                            var arr=[];
                            //aclass ：样式，ahref：连接，showName：显示名
                            var bottomButton={"aclass":"","ahref":"#/otherCustomerApplication/query.html","showName":"返回申请单列表"};
                          if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                            if(showData){
                              bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                                "ahref":Config.serverPath+"rest/authen/otherCustomerApplication/exportWord?id="+showData.id,
                                "showName":"打印"};
                              if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                            }

                            return arr;
                          }//get_otherCustomerApplication
                };//end return
              return tmpUtils;
        }




        //Loading  bottomButtonList
        //  <a class="{{tr.aclass}}" href="{{tr.ahref}}">{{tr.showName}}</a>
        /**
        bottomButton ={
        aclass ："",//样式，
        ahref："",//连接，
        "target":"_blank" //_blank|_self|_parent|_top
        showName："",必填。显示名
        type:"",modalRight(右侧弹出框)，modalCenter（中间弹出框），button（button按钮标签）不填写则为跳转类型。handleThisClick(确认操作框)
        authority:""，不为空，当前用户有该权限，才能显示。
        ngShow:"",//根据计算脚本布尔值是否显示按钮，angluarjs 模版语法脚本。不填写默认显示
        ngDisabled:""//根据计算脚本布尔值是否可点击按钮,angluarjs 模版语法脚本。不填写默认 可操作。仅type=button
            alertTemplate：type=handleThisClick,填写弹出框的模版地址。
        requestUrl:type=handleThisClick,填写确认后调用请求。
        httpMethod:POST|GET，type=handleThisClick,填写确认后调用请求的请求方式，默认POST
        alertTitle:'确认',type=handleThisClick,标题，默认POST
        alertMsg:"确定该操作",type=handleThisClick,内容，默认POST



      } 属性说明：
        */
        function queryItemCardButtonList ($rootScope) {

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
                //购需单列表页
                getQuery_salesOrder:function(showData){

                  var arr=[];

                  var bottomButton = {
                      "iconClass":"View-Logistics-icon","showName":"查看物流",
                      "ngShow":"tr.orderStatus=='已发货'",
                      "aclass":"btn-link pd-m rect-s mr--4",
                      "ahref":"#/salesOrder/get.html?openWuliu=true&id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}


                    bottomButton = {
                      "iconClass":"edit-link-icon",
                      "showName":"编辑",
                      "ngShow":"tr.orderStatus!='已处理' && $root.hasAuthor('购需单编辑')",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/salesOrder/edit2.html?id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton = {
                      "iconClass":"watch-detail-icon",
                      "showName":"查看详情",
                      "ngShow":"tr.orderStatus=='已处理' || !$root.hasAuthor('购需单编辑')",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/salesOrder/get.html?id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton = {
                      "ngShow":"tr.orderStatus=='待处理' && tr.inputUserId==mainStatus.id",
                      "showName":"删除",
                      "iconClass":"delete-link-icon",
                      "type":"handleThisClick",
                      "alertTemplate":"pr-dialog-submit.html",
                      "requestUrl":"rest/authen/salesOrder/delete?id="+showData.id,
                      "aclass":"btn-link pd-m rect-s mr--4",
                      "alertTitle":"确认删除?",
                      "alertMsg":"删除后将无法恢复,确认删除?",
                      "ngClick":"$root.goTo('#/salesOrder/query.html')"
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                    return arr;
                  },
                //获取销售单详细页面菜单定义
                getQuery_confirmOrder:function(showData){
                  var arr=[];
                  var   bottomButton = {
                      "iconClass":"View-Logistics-icon","showName":"查看物流",
                      "ngShow":"tr.orderStatus=='已发货'",
                      "aclass":"btn-link pd-m rect-s mr--4",
                      "ahref":"#/confirmOrder/get.html?openWuliu=true&id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton = {
                      "iconClass":"edit-link-icon","showName":"编辑",
                      "ngShow":"tr.orderStatus=='待审核'||tr.orderStatus=='未提交'",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/confirmOrder/edit.html?id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton = {
                      "iconClass":"watch-detail-icon","showName":"查看详情",
                      "ngShow":"tr.orderStatus!='待审核'",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/confirmOrder/get.html?id="+showData.id};
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton={
                     "ngShow":"tr.orderStatus=='待审核' || tr.orderStatus=='未提交'", "showName":"删除",
                     "iconClass":"delete-link-icon",
                     "type":"handleThisClick",
                     "alertTemplate":"pr-dialog-submit.html",
                     "requestUrl":"rest/authen/confirmOrder/delete?id="+showData.id,
                     "aclass":"btn-link pd-m rect-s mr--4",
                     "alertTitle":"确认删除?",
                     "alertMsg":"删除后将无法恢复,确认删除?",
                     "ngClick":"$root.goTo('#/confirmOrder/query.html')"};
                     if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);
                     }
                    return arr;
                  },
                getQuery_invoicesOrder:function(showData){
                  var arr=[];
                  var  bottomButton = {
                      "iconClass":"edit-link-icon","showName":"编辑",
                      "ngShow":"tr.orderStatus=='未提交'",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/invoicesOrder/edit.html?id="+showData.id
                    };
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton = {
                      "iconClass":"watch-detail-icon","showName":"查看详情",
                      "ngShow":"tr.orderStatus!='未提交'",
                      "aclass":"btn-link pd-m rect-s",
                      "ahref":"#/invoicesOrder/get.html?id="+showData.id};
                    if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    bottomButton={"ngShow":"tr.orderStatus=='未提交'", "showName":"删除",
                     "iconClass":"delete-link-icon",
                     "type":"handleThisClick",
                     "alertTemplate":"pr-dialog-submit.html",
                     "requestUrl":"rest/authen/invoicesOrder/delete?id="+showData.id,
                     "aclass":"btn-link pd-m rect-s mr--4",
                     "alertTitle":"确认删除?",
                     "alertMsg":"删除后将无法恢复,确认删除?",
                     "ngClick":"$root.goTo('#/invoicesOrder/query.html')"};
                     if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}
                    return arr;
                  },
                //销售退货单列表页
                getQuery_saleReturnOrder:function(showData){
                  var arr=[];
                  var  bottomButton = {
                    "ngShow":"tr.orderStatus=='待出库'",
                    "showName":"生成出库",
                    "iconClass":"outStork-icon",
                    "type":"handleThisClick",
                    "alertTemplate":"pr-dialog-submit.html",
                    "requestUrl":"rest/authen/saleReturnOrder/updateStatus?id="+showData.id+"&status=已出库",
                    "aclass":"btn-link pd-m rect-s",
                    "alertTitle":"确认生成出库单?",
                    "alertMsg":"生成出库单(红字)后,将完成销退出库?",
                    "ngClick":"$root.utils.goTo('#/saleReturnOrder/query.html')"
                  };
                  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                  bottomButton = {
                    "iconClass":"edit-link-icon",
                    "showName":"编辑",
                    "ngShow":"tr.orderStatus=='待审核'",
                    "aclass":"btn-link pd-m rect-s",
                    "ahref":"#/saleReturnOrder/edit.html?id="+showData.id
                  };
                  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                  bottomButton = {
                    "iconClass":"watch-detail-icon",
                    "showName":"查看详情",
                    "ngShow":"tr.orderStatus=='待出库' || tr.orderStatus=='已出库'",
                    "aclass":"btn-link pd-m rect-s",
                    "ahref":"#/saleReturnOrder/get.html?id="+showData.id
                  };
                  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                  bottomButton={
                    "ngShow":"tr.orderStatus=='待审核'",
                    "showName":"删除",
                    "iconClass":"delete-link-icon",
                    "type":"handleThisClick",
                    "alertTemplate":"pr-dialog-submit.html",
                    "requestUrl":"rest/authen/saleReturnOrder/delete?id="+showData.id,
                    "aclass":"btn-link pd-m rect-s mr--4",
                    "alertTitle":"确认删除?",
                    "alertMsg":"删除后将无法恢复,确认删除?",
                    "ngClick":"$root.goTo('#/saleReturnOrder/query.html')"
                  };
                  if(tmpUtils.canShowButton(bottomButton)){arr.push(bottomButton);}

                    return arr;
                  }

              };//end return
            return tmpUtils;
      }

        /**
         *  项目自定义顶部fixed消息提示tips
         *  Mode: 1.success 2.error 3.prompt(提示)
         */
        function saleOrderUtils (utils) {
          var  tmpObj = {
            // 含税单价：tr.price*tr.discountRate/100
            getHanShuiDanJian : function (item) {
              // if(!item.discountRate)return 0;
              var tmp;
              tmp = utils.numberDiv(item.discountRate, 100);
              tmp = utils.numberMul(item.price, tmp);
              return tmp;
            },
            //无税单价  //tr.price*tr.quantity/(100+tr.taxRate)/100/tr.quantity
            getWuSuiDanJian:function(item){
                //item.price*(100-item.taxRate)/100-item.discountPrice;
                //tr.price/(100+tr.taxRate)/100

                // var tmp=utils.numberAdd(100,item.taxRate);
                // tmp=utils.numberDiv(tmp,100);
                // tmp=utils.numberDiv(item.taxPrice,tmp);

              var tmp;
              tmp = utils.numberDiv(item.taxRate,100);
              tmp = 1 + tmp;
              tmp = utils.numberDiv(tmpObj.getHanShuiDanJian(item),tmp);
              return tmp;
            },
            //无税金额 item.price*(1-item.taxRate)*item.quantity
            getWuSuiJinE:function(item, orderBusinessType){
              //item.price*(100-item.taxRate)/100*item.quantity
              //100-item.taxRate
              var tmp;
              tmp = tmpObj.getWuSuiDanJian(item);

              if (!orderBusinessType) {
                tmp = utils.numberMul(tmp,item.quantity);
                return tmp;
              } else {
                // 如果用户选择直运直销
                tmp = utils.numberMul(tmp,item.planQuantity);
                return tmp;
              }
            },
            //税额 tr.price*tr.quantity-(tr.price*tr.quantity/(1+tr.taxRate/100)
            getSuiE:function(item, orderBusinessType){
                //100-item.taxRate
                var tmp = tmpObj.getWuSuiDanJian(item),
                    total;


                if (!orderBusinessType) {
                  tmp=utils.numberMul(tmp,item.quantity);
                  total = tmpObj.getJiaSuiHeJi(item);
                  tmp=utils.numberSub(total,tmp);
                  return tmp;
                } else {
                  tmp=utils.numberMul(tmp,item.planQuantity);
                  total = tmpObj.getJiaSuiHeJi(item, orderBusinessType);
                  tmp=utils.numberSub(total,tmp);
                  return tmp;
                }

            },
            //价税合计 item.price*item.quantity
            getJiaSuiHeJi:function(item, orderBusinessType){
              //item.price*item.quantity
              // var tmp=utils.numberMul(item.taxPrice,item.quantity);
              var tmp;
              tmp = tmpObj.getHanShuiDanJian(item);

              if (!orderBusinessType) {
                tmp = utils.numberMul(tmp, item.quantity);
                return tmp;
              } else {
                tmp = utils.numberMul(tmp, item.planQuantity);
                return tmp;
              }

            }

          };//tmpObj

          return tmpObj;
        }//SaleOrderUtils


        // 采购单编辑页面计算原币单价，原币金额，原币价税合计字段
        function purchaseOrderUtils (utils) {
          var  tmpObj = {
            //原币单价(无税单价)  //tr.price*tr.quantity/(100+tr.taxRate)/100/tr.quantity
            getWuSuiDanJian:function(item){
              var tmp;
              tmp = utils.numberDiv(item.taxRate,100);
              tmp = 1 + tmp;
              tmp = utils.numberDiv(item.price,tmp);
              return tmp;
            },
            //原币金额（无税金额） item.price*(1-item.taxRate)*item.quantity
            getWuSuiJinE:function(item){
              //item.price*(100-item.taxRate)/100*item.quantity
              //100-item.taxRate
              var tmp;
              tmp = tmpObj.getWuSuiDanJian(item);
              tmp = utils.numberMul(tmp,item.quantity);
              return tmp;
            },
            //价税合计 item.price*item.quantity
            getJiaSuiHeJi:function(item){
              //item.purchasePrice*item.quantity
              // var tmp=utils.numberMul(item.taxPrice,item.quantity);
              var tmp;
              tmp = utils.numberMul(item.price, item.quantity);
              return tmp;
            }
          };//tmpObj
          return tmpObj;
        }


        // 自定义菜单服务



        function customMenuUtils (utils) {
          var  tmpObj = {
            /**
                 *
                * @Description: 将模版变量字符串转化为具体数据。模版变量定义为：{{id}}
                * @method parseVariableMenuList
                * @param buttonList 菜单定义列表
                * @param obj 业务对象
                * @return 输出html格式
                * @author liumingquan
                样例：
              buttonList=[{
                "type":"" ,
                  "aclass":"",
                  "ahref":"#/uICustomMenu/edit.html?id={{id}}",
                  "showName":"编辑",
                  "authority":"",
                  "ngShow":"",
                  "ngDisabled":"",
                  "alertTemplate":"",
                  "requestUrl":"",
                  "httpMethod":"",
                  "alertTitle":"",
                  "alertMsg":"",
                  "target":"_blank"
                }]
                obj={"id":"1234"}

                =>

                [{
                  "type":"" ,
                    "aclass":"",
                    "ahref":"#/uICustomMenu/edit.html?id=1234",
                    "showName":"编辑",
                    "authority":"",
                    "ngShow":"",
                    "ngDisabled":"",
                    "alertTemplate":"",
                    "requestUrl":"",
                    "httpMethod":"",
                    "alertTitle":"",
                    "alertMsg":"",
                    "target":"_blank"
                  }]
                * @date 2017年2月8日
                 */
            parseVariableMenuList:function(buttonList,obj){
              if(!buttonList)return buttonList;
                var returnArr=[];
               for(var i=0;i<buttonList.length;i++){
                 var tmpMenu=$.extend( true,{},  buttonList[i]);
                 for(var propterty in tmpMenu){
                  var tmp=utils.parseVariableString(tmpMenu[propterty],obj);
                  // if(tmp)  console.log(tmpMenu[propterty],"=>",tmp);
                  tmpMenu[propterty]=tmp;
                 }
                 returnArr.push(tmpMenu);
               }
               return returnArr;
            }
          };//tmpObj
          return tmpObj;
        }

  angular.module('manageApp.project')
  .factory('customMenuUtils', ["utils",customMenuUtils])

    .factory('saleOrderUtils', ["utils",saleOrderUtils])
    .factory('purchaseOrderUtils', ["utils",purchaseOrderUtils])
    .factory('bottomButtonList', ["$rootScope",bottomButtonList])
    .factory('queryItemCardButtonList', ["$rootScope",queryItemCardButtonList])

    .factory('proMessageTips', [proMessageTips]);
});
