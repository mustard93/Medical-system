/**
 * Created by hao on 15/11/5.
 */

define('main/controllers', ['main/init'], function () {


  /**
   * 主控
   */
  function tabCtrl($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,watchFormChange,AjaxUtils,uiTabs) {

        $scope.mainStatus=utils.deepCopy($scope.$parent.mainStatus);
        console.log("tabCtrl",$scope.mainStatus);
        modal.close();
  }
    /**
     * 主控
     */
    function mainCtrl($scope, $rootScope, $http, $location, store,utils,modal,OPrinter,UICustomTable,watchFormChange,AjaxUtils,uiTabs) {

        /**
         * moduleMap 为全局 conf.js 中维护；
         * 根据ModuleType 查找 ModuleName
         * @returns {*}
         */
        $rootScope.findModuleNameByType=function(moduleType){
            var moduleName=null;
            if(moduleMap.length){
                angular.forEach(moduleMap,function (item,index) {
                    if(item.moduleType.toUpperCase() == moduleType.toUpperCase()){
                        moduleName = item.moduleName;
                        return;
                    }
                });
            }
            return moduleName;
        };

        //是否使用 TAB 标签页，读取项目根目录下的conf.js 配置文件
        $rootScope.useTab= conf.useTab;

        console.log("$rootScope.useTab:",$rootScope.useTab);

        //  $http.defaults.withCredentials=true;
        $scope.mainStatus = {
            navFold: document.body.clientWidth < 1500,
            navigation: "",
            msgBubble: 0 //消息气泡
        };

        $rootScope.uiTabs=uiTabs;

        $rootScope.tabs = uiTabs.tabs;

        $rootScope.$on('tabBeforeOnLoad', function (e, tab) {

            if(!$scope.mainStatus.pageParams){
                $scope.mainStatus.pageParams={};
            }
            $scope.mainStatus.pageParams=serializeUrl(obj.tab.templateUrl).param;

        });

        $rootScope.$on('tabChangeStart', function (e, tab) {

            if(!$scope.mainStatus.pageParams){
                $scope.mainStatus.pageParams={};
            }
            $scope.mainStatus.pageParams=serializeUrl(tab.templateUrl).param;

        });

        $rootScope.$on('tabChangeSuccess', function (e, tab) {
            modal.close();

            $rootScope.currentTab = uiTabs.current;
        });

        $rootScope.getCurrentTab=function () {
            return uiTabs.current;
        }

        $rootScope.addTab = function (item) {
            modal.close();
            if(!item.tabHref){
                item.tabHref=item.ahref;
            }

            if(!item.tabName){
                item.tabName=item.showName;
            }



            if(!$scope.mainStatus.pageParams){
                $scope.mainStatus.pageParams={};
            }
            $scope.mainStatus.pageParams=serializeUrl(item.tabHref).param;;

            var obj=$rootScope._findInArray($rootScope.tabs,item,'name','tabName');

            //如果tab 存在 并且 url 不为空；就替换tab
            if(obj.flag && item.tabHref){

                if(item.tabHref.indexOf('#/') != -1){
                    item.tabHref = item.tabHref.replace('#/','views/');
                }

                //如果当前tab 的 templateUrl 与 新的templateUrl 一致 刷新 tab;
                if(obj.tab.templateUrl == item.tabHref){
                    uiTabs.refresh(obj.tab);
                    $rootScope.active(obj.tab);
                   return;
                }

                $rootScope.replaceTab(obj.tab,{'templateUrl':item.tabHref});

                $rootScope.active(obj.tab);
                if(!$scope.mainStatus.pageParams){
                    $scope.mainStatus.pageParams={};
                }
                $scope.mainStatus.pageParams=serializeUrl(item.tabHref).param;
                return;
            }

            //tab 存在  url 为空， 就刷新当前 tab
            if(obj.flag && !item.tabHref){

                if(!$scope.mainStatus.pageParams){
                    $scope.mainStatus.pageParams={};
                }
                $scope.mainStatus.pageParams=serializeUrl(obj.tab.templateUrl).param;

                uiTabs.refresh(obj.tab);
                return;
            }

            //如果链接为空
            if(!item.tabHref){
                $rootScope.replaceTab($rootScope.getCurrentTab(),{templateUrl:$rootScope.getCurrentTab().templateUrl});
                return;
            }


            if(item.tabHref.indexOf('#/') != -1){
                item.tabHref = item.tabHref.replace('#/','views/');
            }
            uiTabs.open({
                name: item.tabName,
                templateUrl: item.tabHref
            });
        };

        $rootScope.closeTab = function (tab) {
            uiTabs.close(tab);
        };

        $rootScope.active = function (tab) {

            uiTabs.active(tab);
        };

        $rootScope.closeAll = function () {
            uiTabs.closeAll();
        };

        $rootScope.replaceTab=function(tab,newTab) {

            if(!tab){
                tab= uiTabs.current;
            }

            uiTabs.replace(tab,newTab);
        };

        $rootScope.refreshTab=function () {
            uiTabs.refresh();
        };

        $rootScope._findInArray=function (list,item,listObjAttr,itemAttr) {

            var flag =false;
            var tab =null;
            angular.forEach(list,function (item2,index) {
                if(item[itemAttr]==item2[listObjAttr]){
                    flag=true;
                    tab=item2;
                    return;
                }
            });

            return {
                tab:tab,
                flag:flag
            };

        }


       var serializeUrl= function(str){

            if(!str){
                return {};
            }

            var param = {}, hash = {}, anchor;
            var url = str;

            var arr = /([^?]*)([^#]*)(.*)/.exec(url);
            var ar1 = /^(http|ftp)/.test(arr[1]) ? /(.*?:)?(?:\/?\/?)([\.\w]*)(:\d*)?(.*?)([^\/]*)$/.exec(arr[1]) : /(.*?)([^\/]*)$/.exec(arr[1]);var ar2 = arr[2].match(/[^?&=]*=[^?&=]*/g);
            var ar3 = arr[3].match(/[^#&=]*=[^#&=]*/g);

            if(ar2){
                for(var i = 0, l = ar2.length; i < l; i++){
                    var ar22 = /([^=]*)(?:=*)(.*)/.exec(ar2[i]);
                    param[ar22[1]] = ar22[2];
                }
            }

            if(ar3){
                for(var i = 0, l = ar3.length; i < l; i++){
                    var ar33 = /([^=]*)(?:=*)(.*)/.exec(ar3[i]);
                    hash[ar33[1]] = ar33[2];
                }
            }

            if(arr[3] && !/[=&]/g.test(arr[3])){
                anchor = arr[3];
            }

            !/^(http|ftp)/.test(arr[1]) && ar1.splice(1, 0, undefined, undefined, undefined);

            function getUrl(){
                var that = this, url = [], param = [], hash = [];

                url.push(that.protocol, that.protocol && '//' || '', that.host, that.port, that.path, that.file);

                for(var p in that.param){
                    param.push(p+ '=' +that.param[p]);
                }

                for(var p in that.hash){
                    hash.push(p+ '=' +that.hash[p]);
                }

                url.push(param.length && '?' + param.join('&') || '');

                if(that.anchor){
                    url.push(that.anchor);
                }else{
                    url.push(hash.length && '#' + hash.join('&') || '');
                }

                return url.join('');
            }

            return {
                href: arr[0],
                protocol: ar1[1],
                host: ar1[2],
                port: (ar1[3] || ''),
                path: ar1[4],
                file: ar1[5],
                param: param,
                hash: hash,
                anchor: anchor,
                getUrl: getUrl
            };
        };



        //当前用户
        $rootScope.curUser={};

        //当前日期
        var getCurrentDate = function () {
          var _t = new Date();
          return _t.getFullYear() + '-' + (_t.getMonth() + 1) + '-' + _t.getDate();
        };
        $scope.currentDate = getCurrentDate();

        // 将Window方法上的Math赋值给当前作用域
        $scope.Math=window.Math;

        // 获取当前Url信息
        var getUrlInfo = function () {
          return {
              absUrl : $location.absUrl(),   // 返回完整url信息
              url : $location.url(),         // 返回#后面的url信息字段
              protocol : $location.protocol(),   // 返回协议
              port : $location.port(),   // 返回端口
              path : $location.path(),   // 返回路径
              hash : $location.hash(),   // 获取哈希
              search : $location.search()  // 获取url的参数的序列化json对象
            };
        };

        $scope.leftSideisShow = true;   //默认显示

        $scope.$on('$locationChangeStart', function (event, newUrl, currentUrl) {
          // 当Url发生变化，则更新Url信息
          $scope.urlInfo = getUrlInfo();

          // 左侧边栏是否隐藏
          if (newUrl.indexOf('personalCenter') !== -1) {
            $scope.leftSideisShow = false;
          } else {
            $scope.leftSideisShow = true;
          }



            // $scope.findMenuByURL($scope.urlInfo.url);



          // 关闭所有已打开的modal窗体
          modal.closeAll();
        });

        $scope.mainConfig = window.Config || {};

        //页面跳转
        $scope.pageTo = function (_url) {
            if(typeof  url == 'object'){
                $rootScope.addTab({
                    tabName: _url.tabName,
                    tabHref: _url.tabHref
                });
                return;
            }

            window.location.assign(_url);
        };


        // 调转页面
        // $scope.goTo = function (url,confirmMsg) {
        //
        //       url+=(url.indexOf("?")>-1?"&":"?")+"t="+new Date().getTime();
        //
        //     if(confirmMsg){
        //       dialogConfirm(confirmMsg, function () {
        //         window.location.assign(url);
        //       }, null);
        //     }else{
        //         window.location.assign(url);
        //     }
        // };

        //@Deprecated 已移动到$rootScope.utils中 建议使用$rootScope.utils
        $scope.goTo=utils.goTo;

        $rootScope.goTo=$scope.goTo;
        //遍历数组，返回满足属性值等于val的。
        $rootScope.getObjectByKeyOfArr = utils.getObjectByKeyOfArr;
        //推荐使用
        $rootScope.utils=utils;
        //异步请求工具类
        $rootScope.AjaxUtils=AjaxUtils;
        //本地存储
        $rootScope.store=store;
        //    $rootScope.modal.closeAll();
        $rootScope.modal=modal;
        //打印工具
        $rootScope.OPrinter=OPrinter;
          //自定义table工具类
        $rootScope.UICustomTable=UICustomTable;

        //自定义table工具类
        $rootScope.watchFormChange=watchFormChange;
        //当前服务器根上下文路径 http://localhost:3000/src/
        $rootScope.curServerPath=utils.getCurServerPath();





        $scope.httpGet = function(url) {
          if (Config.serverPath) {
              if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = Config.serverPath + url;
              }
          }
          return $http.get(url);
        };

        $scope.logout = function(method) {
          var _url = '';

          if (!Config.logoutUrl) {
            alert("请设置注销接口");
            return;
          }

          if (!method) {
            method = 'POST';
          }

          if (Config.serverPath) {
            _url = Config.logoutUrl;
            if (_url.indexOf("http://") !== 0 && _url.indexOf("https://") !== 0) {
              _url = Config.serverPath + _url;
            }
          }

          $.ajax({
            url: _url,
            type: method,
            xhrFields:{withCredentials: true},
            crossDomain:true,
            dataType: 'json',
            success: function (_data) {
              window.location.href = Config.loginHtmlUrl;
            }
          });
        };

        //全局权限控制器
        $scope.hasAuthor = function (author) {
            // var arr=TestAuthor["A_"+$rootScope.curUser.phone];
            if(!author)return true;
            if(!$rootScope.curUser||!$rootScope.curUser.additional||!$rootScope.curUser.additional.Authoritys)return false;
            var arr=$rootScope.curUser.additional.Authoritys;

            // console.log('arr',arr);//
            // console.log("全局权限控制器:",author,$.inArray(author, arr));

            if ($.inArray(author, arr) == -1) {
                return false;
            } else {
                return true;
            }
        };
        //全局权限控制器,满足任意一个及返回成功
        $scope.hasAuthorOr = function (authorList) {
          if(angular.isArray(authorList)){
            if(authorList.length==0)return true;
            for(var i=0;i<authorList.length;i++){
              var obj=authorList[i];
              if($scope.hasAuthor(authorList[i]))return true;
            }
            return false;
          }else{
            return $scope.hasAuthor(authorList);
          }
        };

        //全局权限控制器,满足全部权限返回成功
        $scope.hasAuthorAnd = function (authorList) {
          if(angular.isArray(authorList)){
              if(authorList.length==0)return true;
            for(var i=0;i<authorList.length;i++){
              var obj=authorList[i];
              if(!$scope.hasAuthor(authorList[i]))return false;
            }

            return true;
          }else{
            return $scope.hasAuthor(authorList);
          }
        };

        $rootScope.hasAuthor = $scope.hasAuthor;
        $rootScope.hasAuthorOr = $scope.hasAuthorOr;
        $rootScope.hasAuthorAnd = $scope.hasAuthorAnd;
        $rootScope.countAttrVal = utils.countAttrVal;



        /**
        加载当前用户信息
        */
        function loadMainInfo(){
          //获取主要信息
          if ($scope.mainConfig.getMainInfo) {
              var _url = $scope.mainConfig.getMainInfo;

              if (Config.serverPath) {
                if (_url.indexOf("http://") !== 0 && _url.indexOf("https://") !== 0) {
                  _url = Config.serverPath + _url;
                }
                // 定义服务器请求路径
                  $scope.mainStatus.serverPath = Config.serverPath;
                //解决 配置同服务器请。/dt/。废弃该参数：mainStatus.requestPath
                  $scope.mainStatus.requestPath="";

                    // require.dir = loaderScript.src.match(/[^?#]*\//)[0];
              }

              $.ajax({
                url: _url,
                type: 'get',
                xhrFields:{withCredentials: true},
                crossDomain:true,
                dataType: 'json',
                success: function (_data) {
                  if (_data.code == 200) {
                    $rootScope.curUser=_data.data;
                      //未绑定用户，跳转到绑定用户绑定
                      if(Config.applyBindUrl){
                        //没有关联组织则跳转到申请绑定页面
                        if(!$rootScope.curUser.additional.HabbitOrganizationId){
                            window.location.href = Config.applyBindUrl;
                            return;
                        }
                          //没有关联部门则跳转到申请绑定页面
                        if(!$rootScope.curUser.additional.DepartmentId){
                            window.location.href = Config.applyBindUrl;
                            return;
                        }
                      }

                    $scope.habbit={mainRole:$scope.getMainRole()};

                    if(window.location.href.indexOf('#'+Config.indexPage)>-1){
                            $scope.goToMainRole($scope.habbit.mainRole);
                    }

                    angular.extend($scope.mainStatus, _data.data);
                    $scope.$digest();
                    // 角色跳转主页面

                  } else if (_data.code == 802){
                      alert(_data.msg || '登录失败');
                    if(Config.loginHtmlUrl)window.location.href = Config.loginHtmlUrl;
                  } else {
                    alert(_data.msg || '登录失败');
                  }
                }
              });

          }
        }

        loadMainInfo();
        //接受广播
        $rootScope.$on("loadMainInfo", function() {
          loadMainInfo();
        });


        //后退
        $(document).on("click", ".top-nav-wrap .backBtn", function () {
            window.history.back();
        });
        //根据角色跳转对应页面
        $scope.goToMainRole = function (mainRole) {



            if(!mainRole)mainRole='客服';
            if(!$scope.habbit)   $scope.habbit={};
            $scope.habbit.mainRole=mainRole;

            store.set('habbit.mainRole',mainRole);
            switch (mainRole) {
              case '客服':$scope.goTo('#/main.html');break;
              case '销售':$scope.goTo('#/authorIndex/main-salemanager.html');break;
              case '总经理':$scope.goTo('#/authorIndex/main-generalmanager.html');break;
              case '采购':$scope.goTo('#/authorIndex/main-purchasemanager.html');break;
              case '库管':$scope.goTo('#/authorIndex/main-repertorymanager.html');break;
              case '验收':$scope.goTo('#/authorIndex/main-checkmanager.html');break;

              default: $scope.goTo('#/main.html');
            }
          }
          //获取主页角色
          $scope.getMainRole = function () {
              var mainRole=store.get('habbit.mainRole');

              var tmp='';
               if($rootScope.hasAuthor('总经理')){
                tmp='总经理';
                if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('销售单查询')){
                tmp='销售';
                  if(mainRole==tmp)return tmp;
              }
              else if($rootScope.hasAuthor('采购单查询')){
                tmp='采购';
                  if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('出入库单中心')){
                tmp='库管';
                  if(mainRole==tmp)return tmp;
              }else if($rootScope.hasAuthor('验单中心')){
                tmp='验收';
                  if(mainRole==tmp)return tmp;
              } else if($rootScope.hasAuthor('购需单查询')){
                tmp='客服';
                  if(mainRole==tmp)return tmp;
              }
            return tmp;
        }


        // 获取当前登录人id及其所在部门id，并赋值给参数对象
        // @param: formData 当前的表单对象
        // @param: uId 当前的用户id
        // @param: dId 当前用户所在部门id
        $scope.setCurrentMakeOrderUserInfo = function (formData, dId, uId) {
          return function () {
            var _count = 0;
            while (_count == 0) {
              formData[dId] = $scope.mainStatus.additional.DepartmentId;
              formData[uId] = $scope.mainStatus.id;
            }
          }

          // if ($scope.mainStatus && !formData['id']) {
          //
          // }
        }


    }//end mainCtrl

    /**
     * 侧边菜单
     */
    function sideNav($scope) {
    }

    /**
     *  主页面控制器
     */
    function pageCtrl($scope, modal, dialogConfirm, $timeout, requestData, utils, alertWarn, alertOk) {
        modal.closeAll();

        $scope.choisedMedicalList = [];
        // 取消返回
        $scope.cancelThis = function (_text, _mode, _title) {
          dialogConfirm(_text, function () {
            window.history.go(-1);
          }, _mode, _title);
        };

        //..
        $scope.handleThisSubmit = function (_text, _mode, _title, _url) {
          dialogConfirm(_text, function () {
            $scope.pageTo(_url);
          }, _mode, _title, _url);
        };

        // 重新发送操作
        $scope.resetSend = function (_id) {
          // var _ids=[];
          // if(orderMedical.length!==0){
          //   for(var i= 0;i<orderMedical.length; i++){
          //     _ids.push(orderMedical[i].id);
          //   }
          // }
          // var _url = 'rest/authen/medicalStock/countStockByIds?ids=' + _ids,
          // _data = {};
          //   requestData(_url, _data, 'post')
          //   .then(function (results) {
          //     utils.refreshHref();
          //   })
          //   .catch(function (error) {
          //     if (error) { console.log(error || '出错!'); }
          //   });
          if(_id){
            var _url = 'rest/authen/op/purchasePlanOrder/sendOrder?id=' + _id,
            _data = {};
              requestData(_url, _data, 'post')
              .then(function (results) {
                utils.refreshHref();
              })
              .catch(function (error) {
                if (error) {
                  alertWarn(error || '出错!');
                 }
              });
          }


        };

        // 配送数据发送操作
        $scope.handleSend = function () {
          if ($scope.choisedMedicalList.length) {
            requestData('rest/authen/op/deliveryItem/sendData', $scope.choisedMedicalList, 'POST', 'parameter-body')
            .then(function (results) {
              console.log(1);
              if (results[1].code === 200) {
                utils.refreshHref();
              }
            })
            .catch(function (error) {
              throw new Error(error || '出错');

            });
          }
        };

        // easypiechart 全局样式定义
        $scope.easypiechart_options = {
          animate:{
            duration:1000,
            enabled:true
          },
          barColor: '#f30',
          trackColor: '#ffe8ce',
          scaleColor: false,
          lineWidth: 8,
          lineCap: 'round',
          size: 125
        };

        // wms发送数据操作
        $scope.sendData = function(_id,organizationId,q){
          console.log(organizationId);
          if (!q) {
            q='';
          }
          var _url = 'rest/authen/manageSendTask/resend?id=' + _id,
          _data = {};
            requestData(_url, _data, 'get')
            .then(function (results) {
              alertOk("操作成功！");
              $scope.listParams.organizationId=organizationId;
              $scope.listParams.q=q;
              utils.goTo('#/manageSendTask/query.html?organizationId='+organizationId+"&q="+q);
            })
            .catch(function (error) {
              if (error) { console.log(error || '出错!'); }
            });
        };

        // 每个药品单选操作
        $scope.handleItemClickEvent = function (item) {
          if (item.handleFlag) {    // 选中
            if (item && item.sendStatus!='正常') {
              $scope.choisedMedicalList.push(item.id);
            }
          } else {
            for (var i=0; i<$scope.choisedMedicalList.length; i++) {
              if (item.id === $scope.choisedMedicalList[i]) {
                $scope.choisedMedicalList.splice(i,1);
              }
            }
          }
        };

        $scope.handleChoiseAllEvent = function (isChoiseAll) {
          if (isChoiseAll) {      // 全部选中

            if ($scope.tbodyList) {
              $scope.choisedMedicalList = [];
              angular.forEach($scope.tbodyList, function (data, index) {

                if(data.sendStatus!='正常'){
                  $scope.choisedMedicalList.push(data.id);
                }else{
                  data.handleFlag=false;
                }
              });
            }
          } else {        // 取消全部选中
            $scope.choisedMedicalList = [];
          }
        };

        $scope.changeStatus = function(_id,_selectSendStatus){

          var _url = 'rest/authen/op/purchasePlanOrder/updateStatus?id=' + _id+'&status='+_selectSendStatus,
          _data = {};
            requestData(_url, _data, 'post')
            .then(function (results) {
              modal.closeAll();
              utils.refreshHref();
            })
            .catch(function (error) {
              if (error) { console.log(error || '出错!'); }
            });
        };

        // 通过接口获取当前用户所在机构配置的对于单据编号的设置
        // 如果返回的`data`对象中的`value`值为`auto`，则为自动模式，单据编号不可写，显示由后台返回的系统值
        // 否则显示为用户可自定义配置的
        // =====================弃用 根据需求==========================================
        // $scope.numberingPolicy = null;
        // $scope.getCodeShowMode = function (url) {
        //   var _url = url;
        //   requestData(_url)
        //   .then(function (results) {
        //     $scope.numberingPolicy = results[1].data.value;
        //
        //     if (results && results[1].code === 200) {
        //       if (results[1].data) {
        //         $scope.numberingPolicy = results[1].data.value;
        //       }
        //     }
        //   })
        //   .catch(function (error) {
        //     if (error) { throw new Error(error || '出错'); }
        //   });
        // };
        //
        // $scope.getCodeShowMode('rest/authen/systemSetting/getByParameter?parameter=订单号生成策略');

        // 重定义获取当前模块的单据编号生成策略。
        $scope.getCodeGenerationStrategy = function (moduleName) {
          // 定义请求地址：
          var reqUrl = 'rest/authen/orderCodeStrategy/get?moduleType=DT_' + moduleName;
          requestData(reqUrl)
          .then(function (results) {
            if (results[1].code === 200) {
              if (results[1].data.type === 1) {
                $scope.numberingPolicy = 'auto';
              } else {
                $scope.numberingPolicy = '';
              }
            }
          })
          .catch(function (error) {
            if (error) {throw new Error(error);}
          })
        }

    }

    /**
     *用于编辑
     */
    function editCtrl($scope, modal) {
        modal.closeAll();
        $scope.submitAll = function (departments,departmentAuthoritys){
          var departmentNameAuthoritys=[];
        angular.forEach(departments,function (item,index) {
          for (var i = 0; i < departmentAuthoritys.length; i++) {
            if(departmentAuthoritys[i]==item.id){
              departmentNameAuthoritys.push(item.name);
            }
          }
        });
        $scope.formData.departmentNameAuthoritys=departmentNameAuthoritys;
        }
    }

    /**
     *  个人中心控制器
     */
    function personalCenterController ($scope, utils, requestData) {

      // 切换用户机构
      $scope.toggleOrganization = function (id) {
        if (id) {
          var _url = 'rest/index/switchByOrganizationId?phone='+$scope.mainStatus.phone+'&organizationId='+id;
          requestData(_url, {}, 'POST')
          .then(function (results) {
            if (results[1].code === 200) {
              var _data = results[1].data;
              $scope.showData.departmentName = _data.additional.DepartmentName;
              $scope.formData.roleNames = _data.additional.RoleNames;
              $scope.$emit('loadMainInfo');
            }
          })
          .catch(function (error) {
            if (error) { alertWarn(error || '切换经销商失败'); }
          });
        }
      }
    }
    // 自定义表格
    function customTableDataController ($scope, utils, requestData) {

      // 切换用户机构
      $scope.refreshTable = function (sortRequestUrl,sortItem,customListParams) {
        // console.log(customListParams);
        console.log(sortItem.propertyKey);
        if(sortItem.canSort){

          if (!sortItem.sortCriteria||sortItem.sortCriteria=='asc') {
            sortItem.sortCriteria='desc';
          }else if (sortItem.sortCriteria=='desc') {
            sortItem.sortCriteria='asc';
          }
          customListParams.sortBy=sortItem.propertyKey;
          customListParams.sortWay=sortItem.sortCriteria;
          // 重新请求数据，然后刷新表格排序
          var _url = sortRequestUrl;
          requestData(sortRequestUrl, customListParams, 'get')
          .then(function (results) {
            if (results[1].code === 200) {
                $scope.tbodyList=results[1].data;
            }
          })
          .catch(function (error) {
          });
        }
      };

      // 点击分页请求数据也要带上筛选条件
      $scope.reGetListData=function(){

      }
    }

    angular.module('manageApp.main')
    .controller('mainCtrl',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter", "UICustomTable","watchFormChange","AjaxUtils",'uiTabs', mainCtrl])
    .controller('tabCtrl',  ["$scope","$rootScope","$http", "$location", "store","utils","modal","OPrinter", "UICustomTable","watchFormChange","AjaxUtils",'uiTabs', tabCtrl])
    .controller('sideNav',  ["$scope",sideNav])
    .controller('editCtrl',  ["$scope","modal",editCtrl])
    .controller('pageCtrl',  ["$scope","modal", "dialogConfirm", "$timeout","requestData","utils","alertWarn","alertOk",pageCtrl])
    .controller('personalCenterController', ['$scope', 'utils', 'requestData', personalCenterController])
    .controller('customTableDataController', ['$scope', 'utils', 'requestData', customTableDataController]);
});
