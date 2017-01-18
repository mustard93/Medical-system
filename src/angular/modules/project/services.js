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
          function bottomButtonList () {
              return  {

                  //前台自定义按钮 样例
                  get_ButtonListDemo:function(showData){
                    var arr=[];
                    //aclass ：样式，ahref：连接，showName：显示名
                    var bottomButton={"aclass":"","ahref":"#/firstEnterpriseApplication/query.html","showName":"返回申请单列表"};
                    arr.push(bottomButton);


                     bottomButton={"type":"modalRight","modalWidth":"1000","aclass":"color-orange add-return-order","ahref":"#/firstEnterpriseApplication/query.html","showName":"右侧弹出层"};
                    arr.push(bottomButton);

                     bottomButton={"type":"modalCenter","modalWidth":"1000","aclass":"color-orange add-return-order","ahref":"#/firstEnterpriseApplication/query.html","showName":"中间弹出层"};
                    arr.push(bottomButton);

                    bottomButton={"type":"ngClick","modalWidth":"1000","aclass":"color-orange add-return-order","ngClick":"$root.goTo('#/hospitalApplication/query.html?tt='+showData.id)","showName":"自定义方法"};
                   arr.push(bottomButton);

                    if(showData){
                      bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                        "ahref":Config.serverPath+"rest/authen/firstEnterpriseApplication/exportWord?id="+showData.id,
                        "showName":"打印"};
                        arr.push(bottomButton);
                    }
                    console.log(arr);
                    return arr;
                  }
                  //获取首营企业菜单定义
                    ,get_firstEnterpriseApplication:function(showData){
                      var arr=[];
                      //aclass ：样式，ahref：连接，showName：显示名
                      var bottomButton={"aclass":"","ahref":"#/firstEnterpriseApplication/query.html","showName":"返回申请单列表"};
                      arr.push(bottomButton);

                      if(showData){
                        bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                          "ahref":Config.serverPath+"rest/authen/firstEnterpriseApplication/exportWord?id="+showData.id,
                          "showName":"打印"};
                          arr.push(bottomButton);
                      }

                      return arr;
                    }//get_firstEnterpriseApplication
                    //获取首营药械菜单定义
                      ,get_firstMedicalApplication:function(showData){

                        var arr=[];
                        //aclass ：样式，ahref：连接，showName：显示名
                        var bottomButton={"aclass":"","ahref":"#/firstMedicalApplication/query.html","showName":"返回申请单列表"};
                        arr.push(bottomButton);

                        if(showData){
                          bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                            "ahref":Config.serverPath+"rest/authen/firstMedicalApplication/exportWord?id="+showData.id,
                            "showName":"打印"};
                            arr.push(bottomButton);
                        }

                        return arr;
                      }//get_firstEnterpriseApplication


                      //获取医院资格声请菜单定义
                        ,get_hospitalApplication:function(showData){
                          var arr=[];
                          //aclass ：样式，ahref：连接，showName：显示名
                          var bottomButton={"aclass":"","ahref":"#/hospitalApplication/query.html","showName":"返回申请单列表"};
                          arr.push(bottomButton);

                          if(showData){
                            bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                              "ahref":Config.serverPath+"rest/authen/hospitalApplication/exportWord?id="+showData.id,
                              "showName":"打印"};
                              arr.push(bottomButton);
                          }

                          return arr;
                        }//get_hospitalApplication
                        //获取医院资格声请菜单定义
                          ,get_otherCustomerApplication:function(showData){
                            var arr=[];
                            //aclass ：样式，ahref：连接，showName：显示名
                            var bottomButton={"aclass":"","ahref":"#/otherCustomerApplication/query.html","showName":"返回申请单列表"};
                            arr.push(bottomButton);

                            if(showData){
                              bottomButton={"aclass":"btn btn-primary pr-btn-bg-gold pr-btn-save-glodbg",
                                "ahref":Config.serverPath+"rest/authen/otherCustomerApplication/exportWord?id="+showData.id,
                                "showName":"打印"};
                                arr.push(bottomButton);
                            }

                            return arr;
                          }//get_otherCustomerApplication
                };//end return

        }

        /**
         *  项目自定义顶部fixed消息提示tips
         *  Mode: 1.success 2.error 3.prompt(提示)
         */
        function saleOrderUtils (utils) {
          var  tmpObj = {
            // 含税单价：tr.price*tr.discountRate/100
            getHanShuiDanJian : function (item) {
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
  angular.module('manageApp.project')
    .factory('saleOrderUtils', ["utils",saleOrderUtils])
    .factory('bottomButtonList', [bottomButtonList])
    .factory('proMessageTips', [proMessageTips]);
});
