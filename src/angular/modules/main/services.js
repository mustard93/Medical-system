/**
 * Created by hao on 15/11/18.
 */
define('main/services', ['toastr','main/init'], function (toastr) {
  //请求拦截 用于登录超时
  function redirectInterceptor($q, $location) {
      return {
          response: function (response) {
              if (typeof response.data === 'string' && /^<!DOCTYPE html>/.test(response.data)) {
                  window.location.assign(response.config.url);
                  return response;
              } else {
                  return response;
              }
          }
      };
  }
  redirectInterceptor.$inject = ['$q', '$location'];

  //数据请求
  function requestData($q, $http, $httpParamSerializer,utils) {
      return function (_url, _params, method, parameterBody) {
        var defer = $q.defer();
        if (!method) {
          method = 'GET';
        }

        var transformRequest=function (data) {
            return $httpParamSerializer(data);
        };

      if(Config.serverPath){
        if (_url.indexOf("http://") !==0 && _url.indexOf("https://") !== 0) {
          _url=Config.serverPath+_url;
        }
      }

      //解决 IE 参数中文乱码bug：
      //http://192.168.0.203:8080/dt/rest/authen/lossOverOrder/countByOrderStatus.json?type=æ¥æ&

      if(_url.indexOf("?")>-1){
         var queryStringObj=utils.parseQueryString(_url);
         _url=_url.split("?")[0];

         if(!_params)_params={};
         _params=$.extend( true,_params, queryStringObj);
      }

      if(_params&&(method == 'GET'||method == 'get')){
        _url+=(_url.indexOf("?")==-1?"?":"&")+$httpParamSerializer(_params);

      }
      var config={
          method: method,
          url: _url,
          cache:false,//屏蔽angluar 请求数据的 的缓存，避免脏数据
          data: _params || {},
          withCredentials: true,
          headers: {
              // 'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Type' : 'application/json;charset=utf-8',
              'X-Requested-With': 'XMLHttpRequest'
          }
      };
        if(!parameterBody){
          config.transformRequest=function (data) {
                  return $httpParamSerializer(data);
              };

              config.headers= {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  // 'Content-Type' : 'application/json;charset=utf-8',
                  'X-Requested-With': 'XMLHttpRequest'
              };
        }

          $http(config)
              .success(function (_data, status, headers, config) {

                  // if(angular.isString(_data)){  //返回非json字符串方式
                  //     defer.resolve([_data, _data]);
                  //     return;
                  // }
                  if (status == 200 && _data.code == 200) {
                    defer.resolve([_data.data, _data]);
                  } else {
                    msg=_data.msg;
                    if(!msg){
                          msg=_url+"\n错误信息："+angular.toJson(_data);
                    }

                    defer.reject(msg);
                  }
              })
              .error(function (msg,code) {
                if(!msg)msg="提交失败!";
                msg="错误码："+code+"，"+msg;
                  defer.reject(msg);
              });


          return defer.promise;
      };
  }

  //弹窗确认
  function dialogConfirm($rootScope, modal) {
      return function (_text, _callBack, _template, _title, _confirmBtnTxt, _cancelBtnTxt, _textColor, extendOpt,_closeCallBack) {
          var _$scope = $rootScope.$new(false);
          var _templateUrl = _template ? 'tpl/' + _template : 'tpl/dialog-confirm.html';
          // if (_template && _template === 'pr') {
          //   _templateUrl = 'tpl/pr-dialog-confirm.html';
          // } else {
          //   _templateUrl = 'tpl/dialog-confirm.html';
          // }

          _$scope.confirmText = _text || '确定删除?';
          _$scope.confirmTitle = _title || '确认操作?';
          _$scope.confirmBtnTxt = _confirmBtnTxt || '确定';
          _$scope.cancelBtnTxt = _cancelBtnTxt || '取消';
          _$scope.contextColor = _textColor || '';
          _$scope.extendOpt = extendOpt;
        var dialog=  modal.openConfirm({
              template: Config.tplPath + _templateUrl,
              scope: _$scope
          });
          dialog.then(_callBack,_closeCallBack);

      };
  }
  dialogConfirm.$inject = ['$rootScope', 'modal'];

  //弹窗提示
  function dialogAlert($rootScope, modal) {
      return function (_text, _callBack) {
          var _$scope = $rootScope.$new(false);
          _$scope.confirmText = _text || '确定';
          modal.openConfirm({
              template: Config.tplPath+'tpl/dialog-alert.html',
              scope: _$scope
          }).then(_callBack);
      };
  }
  dialogAlert.$inject = ['$rootScope', 'modal'];

  //弹窗提示
  function alertOk($rootScope, modal) {
      return function (_text, _callBack) {


        toastr.success(_text,"",  {timeOut: 3000,positionClass: 'toast-top-center'});

      };
  }

  //弹窗提示
  function alertError($rootScope, modal) {
      return function (_text, _callBack) {
          var _$scope = $rootScope.$new(false);
          _$scope.confirmText = _text || '确定';
          modal.openConfirm({
              template: Config.tplPath+'tpl/dialog-alert.html',
              scope: _$scope
          }).then(_callBack);
      };
  }

  //弹窗提示
  function alertWarn($rootScope, modal) {
    return function (_text, _callBack) {


      toastr.warning(_text,"",  {timeOut: 3000,positionClass: 'toast-top-center'});

    };
      // return function (_text, _callBack) {
      //     var _$scope = $rootScope.$new(false);
      //     _$scope.confirmText = _text || '确定';
      //     modal.openConfirm({
      //         template: Config.tplPath+'tpl/dialog-alert.html',
      //         scope: _$scope
      //     }).then(_callBack);
      // };
  }

  //普通弹窗
  function dialog($rootScope, modal) {
      return function (_content, _callBack) {
          var _$scope = $rootScope.$new(false);
          _$scope.content = _content;
          modal.openConfirm({
              template: Config.tplPath+'tpl/dialog-center.html',
              scope: _$scope
          }).then(_callBack);
      };
  }
  dialog.$inject = ['$rootScope', 'modal'];

  //图表弹窗
  function dialogChart($rootScope, modal, $http) {
      return function (_url) {
          var _$scope = $rootScope.$new(false);
          var _params = {};
          var _urlObj = _url.split("?");
          if (_urlObj[1]) {
              angular.forEach(_urlObj[1].split("&"), function (_row) {
                  var _arr = _row.split("=");
                  _params[_arr[0]] = _arr[1];
              });
          }
          _$scope.url = _url;
          _$scope.urlParams = _params;
          modal.open({
              template: Config.tplPath+'tpl/dialog-center.html',
              scope: _$scope
          });
      };
  }
  dialogChart.$inject = ['$rootScope', 'modal', '$http'];

  /**
  列表数据转换为tree数据
  list<Data{id,name,pid}> =>treeNode{id,name,nodes：[]}
  */
  function buildTree(){
     return function (data,pidKey){
       if(!data||data.length===0)return [];
       var pos = {};//Map<id,obj>
       var tree = [];//
       var i = 0;
       if(!pidKey)pidKey="pid";

        //组装map
       for(i=0;i<data.length;i++){
         var obj=data[i];
          obj.nodes = [];
          pos[obj.id]=obj;

       }

      //设置父子关系
      for(var i=0;i<data.length;i++){
           var obj=data[i];
         if(obj==null)continue;
         if (!obj[pidKey]||obj[pidKey] == "0") {
             tree.push(obj);
         }else{
            var objParent = pos[obj[pidKey]];
            if(objParent==null)tree.push(obj);   //无效父子关系的放到根节点
            else {
              objParent.nodes.push(obj);
            }
         }

       }

       return tree;
     }
  }

  //Loading
  function proLoading () {
    return function (element, type, params) {
      //定义参数对象
      // if(!params)params={};
      // var _params = {
      //   _style: params.style ? params.style : 'circular-rota',
      //   _masklayer: params.masklayer ? params.masklayer : false,
      //   _message: params.message ? params.message : ''
      // };

      var maskObj={
        maskId:"MaskId_"+new Date().getTime(),
        hide:function(){

            //TODO 临时添加 定时器处理 ； 存在BUG. 后续跟进....
            var that=this;
            window.setTimeout(function(){
                // console.log("maskObj.maskId.hide",that.maskId,type);
                $('#'+that.maskId).remove();
            },100);

        }
      };
        // console.log("maskObj.maskId.show",maskObj.maskId,type);
      if(!element)element=$("body");

      //定义Loading的HTML
      var _loadHtml = '<div id="'+maskObj.maskId+'" class="pr-spinner" style="position:absolute;top:20%;left:102%;" >' +
      '<div class="bar1 cblack"></div><div class="bar2 cblack"></div>' +
      '<div class="bar3 cblack"></div><div class="bar4 cblack"></div><div class="bar5 cblack"></div>' +
      '<div class="bar6 cblack"></div><div class="bar7 cblack"></div><div class="bar8 cblack"></div>' +
      '<div class="bar9 cblack"></div><div class="bar10 cblack"></div><div class="bar11 cblack"></div>' +
      '<div class="bar12 cblack"></div>'+
                      '</div>';


      var _loadHtml2 = '<div id="'+maskObj.maskId+'"  title="'+type+'" class="pr-full-loading" style="width:80px;height:80px;position:fixed;_position:absolute;' +
                       'top:50%;left:50%;z-index:100;border-radius:5px;opacity:0.4;filter:alpha(opacity=30);background-color:#000;transform:translateX(-50%) translateY(-50%);">' +
                       '<div style="position:absolute;top:50%;left:50%;transform:translateX(-40%) translateY(-40%);" class="pr-spinner">' +
                       '<div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div>' +
                       '<div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div>' +
                       '<div class="bar9"></div><div class="bar10"></div><div class="bar11"></div>' +
                       '<div class="bar12"></div></div></div>';

      if(type=="chosen"){//select 下啦

        element.parent().append(_loadHtml);


      }else{
          element.append(_loadHtml2);
          // var _mask=$('#'+maskObj.maskId);
          // _mask.css("height",element.height());
          // _mask.css("width",element.width());
          //
          //
          // _mask.css("top",element.position().top);
          // _mask.css("left",element.position().left);

      }

      return maskObj;

    };
  }

  //Loading
  function store () {
    return  {
            get:function(key){
                if(!window.localStorage)return;
                return window.localStorage.getItem(key);
            },
          remove : function(key){
             if(!window.localStorage) return;
             localStorage.removeItem(key);
           },
            set : function(key, value){
                if(!  window.localStorage)return;
                  localStorage.setItem(key, value);
              },
          clear : function(){
             if(!window.localStorage)return;
              localStorage.clear();
           }
        };
  }

  //工具类
  function utils ($timeout,$rootScope) {
    // 递归获取：data.data.data 获取子属性值
    function getObjectValByKeyArr(obj,keyArr,index){
      if (!keyArr) { return null; }

      var key = null;
      if (keyArr.length - index == 1) {   //直到取最后一个节点
        key = keyArr[index];
        if (!key) { return null; }
        return obj[key];
      }

      key = keyArr[index];
      if (!key) { return null; }
      if (!obj[key]) { return null; }
      return getObjectValByKeyArr(obj[key],keyArr,(1+index));
    }

    var utilsObj = {
        /**
         *
         * @param interval 日期单位
         * @param number　　数量　　　　
         * @param date　　　要计算的时间戳
         * @param add　　　　加或减　　
         * @returns {*}
         */
      dateAdd:function(interval,number,date,add)  {//如果add为true则加否则减
            switch(interval) {
                case   "年"   :   {
                    if(add) date.setFullYear(date.getFullYear()+number);
                    else date.setFullYear(date.getFullYear()-number);
                    return   date;
                    break;
                }
                case   "月"   :   {
                    if(add) date.setMonth(date.getMonth()+number);
                    else date.setMonth(date.getMonth()-number);
                    return   date;
                    break;
                }
                case   "日"   :   {
                    if(add) date.setDate(date.getDate()+number);
                    else date.setDate(date.getDate()-number);
                    return   date;
                    break;
                }
                default   :   {
                    date.setDate(d.getDate()+number);
                    return   date;
                    break;
                }
            }

        },




        //判断是否为图片
      isImage:function(fileName){
            if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
                return false;
            }
            return true;
        },
      //获取当前时间戳
      getTimestamp:function () {
            return new Date().getTime();
        },
      //获取一个唯一ID
      getUUID:function() {
            return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
      //计算一个list 中对想的 attr 属性 和；
      countAttrVal:function (list,attr) {
          var sum=0;
          angular.forEach(list,function (item,index) {
              sum+= (1*item[attr]);
          });
          return sum;
      },
      // 获取一个月的最大天数
      getNumberArrayByMaxNum : function(startNumber,endNumber){
        var returnArr=[];
          if( typeof startNumber === 'number'&& typeof endNumber === 'number') {
            for(var i=startNumber;i<=endNumber;i++){
              returnArr.push(i);
            }
          }

        return returnArr;
      },
      // URL参数转换对象
      parseQueryString : function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
            arr_url = reg_url.exec(url),
            ret = {};

        if (arr_url && arr_url[1]) {
          var str_para = arr_url[1], result;
          while ((result = reg_para.exec(str_para)) !== null) {
              ret[result[1]] = result[2];
          }
        }

        return ret;
      },
      /**
      *
      * @Description: 切换数组中2个条目顺序
      * @method switchArrayOrder
      * @param sourceIndex  切换顺序的位置1
      * @param sourceIndex  切换顺序的位置2
      * @return 输出html格式
      * @author liumingquan
      */
      switchArrayOrder:function(arr,sourceIndex,destIndex){
        var tmp=arr[sourceIndex];
        arr[sourceIndex]=arr[destIndex];
        arr[destIndex]=tmp;
      },
      // 获取当前服务器的路径，用于异步请求当前数据的
      getCurServerPath: function(){
        //例：http://localhost:8086/topic/index?topicId=361
        // alert(window.location.pathname); 则输出：/topic/index

          // 例：http://localhost:8086/topic/index?topicId=361
          // alert(window.location.host); 则输出：http:localhost:8086
            var context=  window.location.pathname.split("/")[1];
            var path=window.location.protocol+"//"+window.location.host+"/"+context+"/";
          // console.log(path);

          return path;
      },
      // 获取当前时间
      getNowTime: function (inputId) {
        return new Date().getTime();
      },
      // 设置输入框获取焦点
      focusByInputId: function (inputId) {
        //  $timeout 保障不受其他干扰，最后一个执行。
        $timeout(function(){
            $('#'+inputId).trigger('focus');
        },0);

      },
      // 获取window窗口的高度
      getwindowHeight: function(){
          var t=$(window).height();
          return t;
      },
      // 获取window窗口的宽度
      getwindowWidth: function(){
        var t=$(window).width();
        return t;
      },
      // 获取内容区的宽度。
      getMainBodyWidth: function(){
        var t=$("#main_body").width();
        return t;
      },
      // json字符串=>为js 对象。
      fromJson: function (jsonString) {
        var firstLetter = jsonString.replace(/^\s*/, '')[0];
        return (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(jsonString) : new String(jsonString);
      },
      // json字符串<=为js 对象。
      toJson: function (obj) {
        return angular.toJson(obj);
      },
      // 获取有指定key的scope作用域。
      getAppointScope: function ($scope,scopeKey) {
        if($scope[scopeKey]){
          return $scope;
        }
        if(!$scope.$parent)return null;
        return utilsObj.getAppointScope($scope.$parent,scopeKey);
      },
      // 在scope的父亲链上，获取最靠近的扩展作用域的。utils.getScopeExtend($scope,scopeExtendName);
      getScopeExtend: function ($scope,scopeExtendName) {
        if(  angular.isObject($scope[scopeExtendName])){
          return $scope[scopeExtendName];
        }
        if(!$scope.$parent)return null;
        return utilsObj.getScopeExtend($scope.$parent,scopeExtendName);
      },
      // url存在则跳转，否则刷新。
      goOrRefreshHref: function (url,confirmMsg) {
        if(url){

          //tab情况下，先刷新当前页面，在跳转
          if(conf.useTab){


              var tabName= $rootScope.TabNameMatchByUrl.getTabNameByUrl(url);

              var   currentName =$rootScope.getCurrentTab().name;

              if(currentName != tabName){
                  $rootScope.refreshTab();
              }
          }

           utilsObj.goTo(url,confirmMsg);
           return;
        }
        utilsObj.refreshHref(confirmMsg);
      },
      // 跳转到对应页面 utils.goTo(url,confirmMsg);
      refreshHref: function (confirmMsg) {

          if(conf.useTab){
              $rootScope.refreshTab();
              return;
          }

          var url=window.location.href;
          //避免参数越来越多
          if (url.indexOf('refreshTime=') > -1) {
            url = url.split('refreshTime=')[0];
          }

          url+=(url.indexOf("?")>-1?"&":"?")+"refreshTime="+new Date().getTime();

          if(confirmMsg){
            dialogConfirm(confirmMsg, function () {
              window.location.assign(url);
            }, null);
          }else{
              window.location.assign(url);
          }
      },
      // 跳转到对应页面 utils.goTo(url,confirmMsg);
      goTo: function (url,confirmMsg) {

          console.log("URL",url,typeof  url == 'object');

          //  //配置启动也方式 tab方式
          if(conf.useTab){
            var tabPara=url;

              if(typeof  url == 'string'){

                //根据配置表获取标题，如果没有则取当前tab的标题。
                  var tabName= $rootScope.TabNameMatchByUrl.getTabNameByUrl(url);
                  if(!tabName)tabName=$rootScope.getCurrentTab().name;
                  if(confirmMsg){
                      dialogConfirm(confirmMsg, function () {
                          $rootScope.addTab({
                              tabName:tabName,
                              tabHref:url
                          });
                      }, null);
                  }else{
                      $rootScope.addTab({
                          tabName:tabName,
                          tabHref:url
                      });
                  }
                  return;
              }

              if(confirmMsg){
                dialogConfirm(confirmMsg, function () {
                  $rootScope.addTab(tabPara);
                }, null);
              }else{
                  $rootScope.addTab(tabPara);
              }


              return;
          }

          //兼容模式，支持非tab方式
          if(typeof  url == 'object'){
              url=url.tabHref
          }

            url+=(url.indexOf("?")>-1?"&":"?")+"t="+new Date().getTime();
            if(confirmMsg){
              dialogConfirm(confirmMsg, function () {
                window.location.assign(url);
              }, null);
            }else{
                window.location.assign(url);
            }
      },
      //递归 获取：data.data.data 获取子属性值
      getObjectVal:function (obj,key){
        if(!key)return null;
        var arr=key.split(".");
        return getObjectValByKeyArr(obj,arr,0);
      },
      // 对象的所有属性转换为数组。 data={ "拒收数量": "0.0000",  "收货数量": "1.0000"}==>["拒收数量","收货数量"]
      getPropertysArrayOfObject:function (obj){
        var arr=[];
        if(!obj)return arr;
        for (var key in obj) {
          arr.push(key);
        }
       return arr;
      },
      /**
      * @Description: 遍历数组，返回满足属性值等于val的。数据位置。 utils.getObjectIndexByKeyOfArr(arr,key,val) ;
      * @method sumTotalByArray
      * @param arr ：数组
      * @param keyArr：累加的属性名的数组。
      * @param conditionEqualPropertyKey 条件属性名，不为空，表示需要判断满足条件的值（conditionEqualVal）才生效
      * @return
      * @author liumingquan
      * @date 2016年12月28日 下午5:16:02
      */
      sumTotalByArray : function (arr,keyArr,conditionEqualPropertyKey, conditionEqualVal) {
        var total={};
        if(!angular.isArray(arr))return -1;
        for(var i=0;i<arr.length;i++){
            var tmp=arr[i];
            if(!tmp)continue;

            //属性值满足条件的，才允许相加。
            if(conditionEqualPropertyKey){
              var tmpval=utilsObj.getObjectVal(tmp,conditionEqualPropertyKey);
              if(tmpval!=conditionEqualVal){
                continue;
              }
            }
          for(var j=0;j<keyArr.length;j++){
              var keyName=keyArr[j];
              if(!total[keyName])total[keyName]=0;
              var val=utilsObj.getObjectVal(tmp,keyName);
              if(!val)continue;

                  total[keyName]=utilsObj.numberAdd(total[keyName],val);

          }

        }
        return total;
      },
      /**
        * @Description: 遍历数组，返回满足属性值等于val的。进行相乘法后在相加。 utils.getObjectIndexByKeyOfArr(arr,key,val) ;
      	* @method sumTotalByArrayMul
      	* @param arr ：数组
      	* @param keyArr：乘的属性名的数组。
      	* @param conditionEqualPropertyKey 条件属性名，不为空，表示需要判断满足条件的值（conditionEqualVal）才生效
      	* @return
      	* @author liumingquan
      	* @date 2016年12月28日 下午5:16:02
        */
      sumTotalByArrayMul : function (arr,keyArr,conditionEqualPropertyKey, conditionEqualVal) {
          var total=0;
          if(!angular.isArray(arr))return 0;
          for(var i=0;i<arr.length;i++){
              var tmp=arr[i];
              if(!tmp)continue;
              var sum=0;
              var chengji=1;
            for(var j=0;j<keyArr.length;j++){
                //属性值满足条件的，才允许相加。
                if(conditionEqualPropertyKey){
                  var tmpval=utilsObj.getObjectVal(tmp,conditionEqualPropertyKey);
                  if(tmpval!=conditionEqualVal){
                    continue;
                  }
                }
                var keyName=keyArr[j];
                var val=utilsObj.getObjectVal(tmp,keyName);
                if(!val)val=0;
                sum=utilsObj.numberMul(chengji,val);
                chengji=sum;

            }
            total=  utilsObj.numberAdd(total,sum);
          }
          return total;
        },
      //遍历菜单数组，返回满足属性值type等于val的。数据位置。 utils.getcustomMenuByKeyOfArr(arr,val) ;
      getcustomMenuByKeyOfArr : function (arr,val) {
        return utilsObj.getObjectByKeyOfArr(arr,"type",val) ;
      },
      //遍历数组，返回满足属性值等于val的。数据位置。 utils.getObjectIndexByKeyOfArr(arr,key,val) ;
      getObjectIndexByKeyOfArr : function (arr,key,val) {
        if(!angular.isArray(arr))return -1;
        for(var i=0;i<arr.length;i++){
          var tmpVal=utilsObj.getObjectVal(arr[i],key);
          if(tmpVal==val)return i;
        }
        return -1;
      },
      //遍历数组，返回满足属性值等于val的。 utils.getObjectByKeyOfArr(arr,key,val) ;
      getObjectByKeyOfArr : function (arr,key,val) {
        var index=utilsObj.getObjectIndexByKeyOfArr(arr,key,val);
        if(index<0)     return null;
        return arr[index];
      },
      /**
        遍历数组，满足属性值等于val，分组返回。 utils.getGroupArrayByKeyOfArr(arr,key) ;
        参数：
        arr=[{"id","1","pid":"0"},{"id","2","pid":"0"}],]
        key="id"
        执行结果输出=>：
        retrun  groupMap={
              keyArr:["0","1"],//分组的key数组
              map:{"0",[{"id","1","pid":"0"},{"id","2","pid":"0"}],"11":[{"id","2","pid":"11"}]}//分组map<key（分组key）,dataArray（分组key相同的数据集合）>
          };
      */
      getGroupArrayByKeyOfArr : function (arr,key) {
        // console.log("getGroupArrayByKeyOfArr",arr,key);
        var groupMap={
            keyArr:[],//分组的key数组
            map:{}//分组map<key（分组key）,dataArray（分组key相同的数据集合）>
        };

        if(!angular.isArray(arr))return groupMap;

        for(var i=0;i<arr.length;i++){

          var tmpkey=utilsObj.getObjectVal(arr[i],key);
          tmpkey+="";//转换为字符串类型
          if(tmpkey===undefined||tmpkey===""){
              tmpkey="null";
          }
          //根据key获取分组数组，放在该元素
          tmpMapArray=groupMap.map[tmpkey];
          if(!tmpMapArray){
            tmpMapArray=[];
            groupMap.map[tmpkey]=tmpMapArray;
          }

          tmpMapArray.push(arr[i]);
        }

        //分组的key生成数组，返回，用于遍历。
        for (var tmpKey in groupMap.map)
          {
            groupMap.keyArr.push(tmpKey);
          }
        return groupMap;
      },
      //遍历数组，删除满足属性值等于val的。utils.removeObjectByKeyOfArr(arr,key,val)
      removeObjectByKeyOfArr : function (arr,key,val) {
        var index=utilsObj.getObjectIndexByKeyOfArr(arr,key,val);
        if(index>-1){
            arr.splice(index,1);
        }
        return index;
      },
      //加法
      numberAdd: function (arg1, arg2) {
        if (!arg1) { arg1 = 0; }
        if (!arg2) { arg2 = 0; }
        var r1, r2, m;

        try {
          r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
          r1=0;
        }
        try {
          r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
          r2=0;
        }

        m = Math.pow(10, Math.max(r1,r2));

        var arg1Mul = utilsObj.numberMul(arg1, m);
        var arg2Mul = utilsObj.numberMul(arg2, m);

        return (arg1Mul + arg2Mul) / m ;
      },
      //减法
      numberSub: function (arg1,arg2) {
        if (!arg1) { arg1 = 0; }
        if (!arg2) { arg2 = 0; }

        try {
          r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
          r1=0;
        }
        try {
          r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
          r2=0;
        }

        m = Math.pow(10, Math.max(r1,r2));
        n = (r1 >= r2) ? r1 : r2;

        var arg1Mul = utilsObj.numberMul(arg1, m);
        var arg2Mul = utilsObj.numberMul(arg2, m);

        return ((arg1Mul - arg2Mul) / m).toFixed(n);
      },
      //乘法
      numberMul: function (arg1, arg2) {
        if (!arg1) { arg1 = 0; }
        if (!arg2) { arg2 = 0; }

        var m = 0,
            s1 = arg1.toString(),
            s2=arg2.toString();

        try{
          m += s1.split(".")[1].length;
        } catch (e) {}
        try{
          m += s2.split(".")[1].length;
        } catch (e) {}

        var tmp = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

        return tmp;
       },
      //除法
      numberDiv: function (arg1, arg2){
        if(!arg1 || !arg2) { return 0; }

        var t1 = 0, t2 = 0, r1, r2;

        try{
          t1 = arg1.toString().split(".")[1].length;
        } catch(e){}
        try{
          t2=arg2.toString().split(".")[1].length;
        }catch(e){}

        r1 = Number(arg1.toString().replace(".",""));
        r2 = Number(arg2.toString().replace(".",""));

        return utilsObj.numberMul((r1/r2), Math.pow(10,t2-t1));

        // with(Math){
        //   r1=Number(arg1.toString().replace(".",""));
        //   r2=Number(arg2.toString().replace(".",""));
        //   var tmp= utilsObj.numberMul((r1/r2),pow(10,t2-t1));
        //
        //   return tmp;
        // }
      },
      // 对文件名后缀进行判断以区分用户上传的文件类型
      isPicture : function (fileName) {
        if(!fileName)return false;
        //http://pangu16.aliyuncs.com/d0a2dcabd56e418ebb001ff137e3ea00.PNG@108w
        var re = new RegExp("(\.png)|(\.jpg)|(\.jpeg)|(\.gif)",["i"]);
        if (!re.exec(fileName)) return false;

        return true;

        if (angular.isString(fileName) && fileName.indexOf('.') !== -1) {
          //img.png@100h
          var _suffix = fileName.split('.')[1];
             _suffix = fileName.split('?')[0];//解决缩略图情况
            return (_suffix === 'png' || _suffix === 'jpg' || _suffix === 'jpeg' || _suffix === 'gif') ? true : false;
          // if (_suffix !== 'png' || _suffix !== 'jpg' || _suffix !== 'jpeg' || _suffix !== 'gif') {
          //   return false;
          // } else {
          //   return true;
          // }
        } else {
          throw new Error('params fileName is must type of String');
        }
      },
      // 将对象数据清空。
      clearObject : function (object) {
         for (var variable in object) {
           delete object[variable];
         }
      },
      // 将对象数据清空。
      replaceObject : function (dest,source) {


        if(angular.isArray(source)){

          if(!angular.isArray(dest))dest=[];
          //清空
          dest.splice(0,dest.length);

            for(var i=0;i<source.length;i++){
              dest.push(source[i]);
            }
            return dest;
        }


          if(!dest)dest={};
          utilsObj.clearObject(dest);
          if(!source)return;

           $.extend( true,dest,  source);//解决监听fromdata失败bug。

        return dest;
      },
      // 深拷贝数据。
      deepCopy : function (source) {
        return utilsObj.replaceObject(null,source);

      },

      /**
       *
        * @Description: 将模版变量字符串转化为具体数据。模版变量定义为：{{id}}
        * @method to_trusted
        * @param variableString html格式
        * @param obj html格式
        * @return 输出html格式
        * @author liumingquan

        样例：
        variableString="#/uICustomMenu/edit.html?id={{id}}"
        obj={"id":"1234"}
        =>
        #/uICustomMenu/edit.html?id=1234
        * @date 2017年2月8日
      */
      parseVariableString : function (variableString,obj) {
        var returnString="";
        if(!variableString)return returnString;
          returnString=variableString;
          if(typeof variableString.match!='function')return returnString;
        var arr = variableString.match(/(\{\{){1}[^\{\}]+(\}\}){1}/);
        if(!arr)return returnString; //无匹配直接返回

        if(!obj)obj={};
         for (var i=0;i<arr.length;i++) {
           var tmp=arr[i];//{{id}}
           if(tmp.length<5)continue;//去掉不满足条件的。"{{","}}"
           var key=tmp.substring(2,tmp.length-2);//id
           var keyValue=obj[key];//obj[id]
           if(!keyValue)keyValue="";
           returnString=returnString.replace(tmp,keyValue);
         }
        return returnString;
      },

      // 将字符串类型数字转换为number类型
      transformToNumber : function (str) {
        return angular.isString(str) ? Number(str) : str;
      },

      // 判断参数类型，支持从字符串转换为数字类型，或者从数字类型转换为字符串类型
      transformNumOrStr: function (param) {
        // 判断参数是否存在
        if (!param) { throw new TypeError('param is not definition'); }
        // 判断参数是否为数字，如果是则转换为字符串
        if (angular.isNumber(param)) {
          return String(param);
        }
        // 判断参数是否为字符串，如果是则转换为数字
        if (angular.isString(param)) {
          return Number(param);
        }
      }

    };

    return utilsObj;
  }

  //监听内容修改标志
  function watchFormChange($timeout) {
    return function (watchName, $scope) {

      if(!$scope)return;
      //延迟初始化修改标志
       $timeout(function () {
          $scope.changeFlag=false;
        },500);

        if($scope._watchFn){
          // console.log("$scope._watchFn="+watchName);
            return;
        }

        $scope._watchFn=$scope.$watch(watchName,function(newValue,oldValue, scope){
          // console.log("changeFlag=true,"+watchName);
          $scope.changeFlag=true;
        },true);
    };
  }//watchFormChange

  /**
   *
  * @Description: 打印工具
  * @method OPrinter

  * @return
  * @author liumingquan

  * @author ecolouds-01
  * @date 2016年12月15日 下午5:16:02
    使用帮助使用前，必须先初始化 打印组件：ng-init="$root.OPrinter.init()"
      关键步骤：
      1.初始化打印组件。
      2.调用打印，预览等功能。

   */
  function OPrinter() {
    var LodopFuncs=null;
    var LODOP=null;

    function getOPrinter(){

      if(!LODOP&&LodopFuncs){
        LODOP=LodopFuncs.getLodop(document.getElementById("LODOP_OB_Id"),document.getElementById("LODOP_EM_Id"));
        LODOP.SET_LICENSES("四川盘谷智慧医疗科技有限公司","160CB03308929656138B8125A87D070B","","");
      }
      return LODOP;
    }

    /**
     *
    * @Description: 打印工具 初始化
    * @method OPrinter

    * @return
    * @author liumingquan

    * @author ecolouds-01
    * @date 2016年12月15日 下午5:16:02
    打印页边距设定为 0mm 时，网页内最大元素的分辨率：794×1123
    <div style="width:794px;height:1123px;border:1px solid #000000;"> </div>

    打印页边距设定为 5mm 时，网页内最大元素的分辨率：756×1086
    <div style="width:756px;height:1086px;border:1px solid #000000;"> </div>

    打印页边距设定为 19.05mm 时，网页内最大元素的分辨率：649×978
    <div style="width:649px;height:978px;border:1px solid #000000;"> </div>

    */
    var  OPrinter={

      LODOP:null,//返回具体打印的实现累，用于特殊需求打印。

      print_param_defualt:{
        print_orient:0,//打印方向及纸张类型，数字型.1---纵(正)向打印，固定纸张；
        paper_top: 0,//整页上边距，整数或字符型
        paper_left: 0,//整页左边距
        paper_width:2100,//可视编辑区域的宽度.A4 21*29.7cm（210mm×297mm）
        paper_height:2970,//可视编辑区域的高度
        html_top: 0,//html上边距，整数或字符型
        html_left: 0,//html上边距，整数或字符型
        html_width: "100%",//html的宽度
        html_height: "100%"//html上边距，整数或字符型
      },

      print_param:null,

       //设定纸张大小
      _pageSize:{
        intOrient:1,
        intPageWidth:2160,
        intPageHeight:1400
      },

      /**
       *
      * @Description: 打印工具 初始化
      * @method OPrinter

      * @return
      * @author liumingquan

      * @author ecolouds-01
      * @date 2016年12月15日 下午5:16:02
        使用帮助使用前，必须先初始化 打印组件：ng-init="$root.OPrinter.init()"
          关键步骤：
          1.初始化打印组件。
          2.调用打印，预览等功能。

          PRINT_INIT(strPrintTaskName)打印初始化
          ●	SET_PRINT_PAGESIZE(intOrient,intPageWidth,intPageHeight,strPageName)设定纸张大小
          ●	ADD_PRINT_HTM(intTop,intLeft,intWidth,intHeight,strHtml)增加超文本项
          ●	ADD_PRINT_TEXT(intTop,intLeft,intWidth,intHeight,strContent)增加纯文本项
          ●	ADD_PRINT_TABLE(intTop,intLeft,intWidth,intHeight,strHtml)增加表格项
          ●	ADD_PRINT_SHAPE(intShapeType,intTop,intLeft,intWidth,intHeight,intLineStyle,intLineWidth,intColor)画图形
          ●	SET_PRINT_STYLE(strStyleName, varStyleValue)设置对象风格
          ●	PREVIEW打印预览
          ●	PRINT直接打印
          ●	PRINT_SETUP打印维护
        */
        init:function(){
          //如果init和setPrint_paramByUICustomHtml 调用顺序不确定时，修复如果init和setPrint_paramByUICustomHtml 设置失败bug。
          if(!this.print_param){//只初始化一次
            this.print_param=$.extend({},this.print_param_defualt);
          }
          if (!LODOP) {
            require(['LodopFuncs'], function(LodopFuncs1) {
              LodopFuncs=LodopFuncs1;
              //异步加载js
              LodopFuncs1.loadCLodop();
            });
          }
        },

        chkOPrinter: function () {
          return window.getCLodop ? true : false;
        },

        // 页面方法，检测是否注册，若没有注册则运行注册流程
        regLicenses: function () {
          if (!LODOP) {
            LODOP = getOPrinter();
            this.LODOP = LODOP;
          } else {
            LODOP.SET_LICENSES("四川盘谷智慧医疗科技有限公司","160CB03308929656138B8125A87D070B","","");
          }
        },

        //设置打印参数,根据接口返回html模版数据
        setPrint_paramByUICustomHtml:function(uICustomHtml){

          //  console.log("setPrint_paramByUICustomHtml",uICustomHtml);
          if(!uICustomHtml)return;
          var p=$.extend({},this.print_param_defualt);
          for(var key in p){
            if (uICustomHtml[key]) {
              p[key] = uICustomHtml[key];
              console.log("key",key,uICustomHtml[key]);
            }
          }

          // console.log(p);
          this.print_param=p;
        },

        //设置打印尺寸
        setRect:function(intTop,intLeft,intWidth,intHeight){
          this.print_param.html_top=intTop;
          this.print_param.html_left=intLeft;
          this.print_param.html_width=intWidth;
          this.print_param.html_height=intHeight;
        },

        _PrintDivId:null,
        //设置打印的内容是htmlid绑定的innerHTML。优先级高于_PrintHtml
        setPrintDivId:function(divId){
          this._PrintDivId=divId;
        },
        _PrintHtml:null,
        //设置打印的内容innerHTML
        setPrintHtmlContent:function(content){
          this._PrintHtml=content;

        },
        //返回要打印的内容
        getPrintHtmlContent:function(content){
            if(this._PrintDivId)this._PrintHtml= document.getElementById(this._PrintDivId).innerHTML;
            return this._PrintHtml;
        },

        //打印前的准备工作。设置打印参数，及打印内容
        _printBeforePrint:function(content,taskName){
          if(!LODOP){
            LODOP = getOPrinter();
            this.LODOP=LODOP;
            if(!LODOP)console.log("need exe:$root.OPrinter.init()");
          }
          // 若strTaskName空，控件则不保存本地化信息，打印全部由页面程序控制。

          if(!taskName)taskName="";
            // (扩展型)打印初始化
            // 格式：PRINT_INITA(Top,Left,Width,Height,strPrintName)
            // 功能：打印初始化、设定纸张整体偏移量、设定可视编辑区域大小
            var p=this.print_param;

            LODOP.PRINT_INITA(p.paper_top,p.paper_left,p.paper_width,p.paper_height,taskName);
            //必须在格式：PRINT_INITA 后面才生效。
            LODOP.SET_PRINT_PAGESIZE(p.print_orient,p.paper_width,p.paper_height,taskName);

            if(!content) content = this.getPrintHtmlContent();

            //设定纸张大小
            // LODOP.SET_PRINT_PAGESIZE(intOrient,intPageWidth,intPageHeight,strPageName)
            //●	ADD_PRINT_HTM(intTop,intLeft,intWidth,intHeight,strHtml)增加超文本项

            // 如果只有一个table，默认表示是支持分页，就用ADD_PRINT_TABLE，否则用ADD_PRINT_HTM解决只用ADD_PRINT_TABLE会导致有多个table时只显示第一个查找到的table的内容的bug。
          if ($('#Print_Div_id').find('table').length==1) {
            // 为满足分页打印而加的。
            LODOP.ADD_PRINT_TABLE(p.html_top,p.html_left,p.html_width,p.html_height,content);
          }else {
            LODOP.ADD_PRINT_HTM(p.html_top,p.html_left,p.html_width,p.html_height,content);
          }
            // LODOP.ADD_PRINT_HTM(this._rect.top,this._rect.left,this._rect.width,this._rect.height,content);

            return LODOP;
        },
        preview:function(content,taskName) {
            LODOP=this._printBeforePrint(content,taskName);
            LODOP.PREVIEW();
        },//preview

        //打印
        print:function(num, content, taskName) {
          LODOP=this._printBeforePrint(content,taskName);
          LODOP.SET_PRINT_COPIES(num);   // 设置打印份数
          LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);   // 设置可继续修改打印份数
          LODOP.PRINT();
        },//print

        //打印设置。整体位置调整。
        printSetup:function(content,taskName) {
            LODOP=this._printBeforePrint(content,taskName);
            LODOP.PRINT_SETUP();
        },//print

        //打印设置。详细调整，可以到每个字
        printDesign:function(content,taskName) {
            LODOP=this._printBeforePrint(content,taskName);
            LODOP.PRINT_DESIGN();
        },//print

        //设置基本打印风格
        setPrintStyle:function(key,val) {
            LODOP=getOPrinter();
            // LODOP.SET_PRINT_STYLE("FontSize",11);
            LODOP.SET_PRINT_STYLE(key,val);

        },//preview

        // 设置打印份数
        setPrintNum: function (num,content,taskName) {
          LODOP=this._printBeforePrint(content,taskName);
          LODOP.SET_PRINT_COPIES(num);   // 设置打印份数
          LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);   // 设置可继续修改打印份数
        }
    };

    return OPrinter;
  }

  /**
  自定义的table工具类
  public class UICustomTableHeaderVO implements Serializable{
  	@DataValidate(description = "排序")
  	private Integer index;
  	@DataValidate(description = "属性名",nullable=false)
  	private String propertyKey;//$index 特殊属性，表示显示序号
  	@DataValidate(description = "属性类型")
  	private String propertyType;//
  	@DataValidate(description = "属性显示名",nullable=false)
  	private String propertyName;//
  	@DataValidate(description = "显示格式转换",nullable=false)
  	private String format;//yyyy-MM-dd HH:mm
  	@DataValidate(description = "标题样式名")
  	private String thCss;//
  	@DataValidate(description = "标题样式")
  	private String thStyle;//
  	@DataValidate(description = "内容样式名")
  	private String tdCss;//
  	@DataValidate(description = "内容样式")
  	private String tdStyle;//
  */
  function UICustomTable ($filter,utils) {

      var dateFilter = $filter('date');
      var  UICustomTableObj = {
        //设置输入框获取焦点

        /**
          过滤掉不显示的字段，返回需要显示的字段。
        */
        getShowItemArray:function(arr){
            if(!arr)return arr;
            var showItemArray=[];
            for(var i=0;i<arr.length;i++){
              if(arr[i].showFlag)showItemArray.push(arr[i]);
            }
            return showItemArray;
        },
        getShowValue: function (obj,uICustomTableHeaderVO,$index) {
          if(!uICustomTableHeaderVO)return "";
          if(uICustomTableHeaderVO.propertyKey=="$index")return $index+1;
          var val=utils.getObjectVal(obj,uICustomTableHeaderVO.propertyKey);

           //number,date
           //  val=  $filter('date')(val, uICustomTableHeaderVO.format);
             if(uICustomTableHeaderVO.filterName){
                var fn=$filter(uICustomTableHeaderVO.filterName);
                if(!fn){
                  console.log("filterName is null.filterName="+uICustomTableHeaderVO.filterName);
                }else{
                      val=fn(val, uICustomTableHeaderVO.format);
                }

             }


           return val;
        }
      };

      return UICustomTableObj;
  }//UICustomTable

  function AjaxUtils (requestData,alertOk,alertError) {

      var  AjaxUtils = {

                /**
                异步请求：
                url:
                data:object 对象
                canSubmit 为true时才触发请求
                parameterBody：是否json方式。
                */
                ajaxSubmit : function (url,data,canSubmit,parameterBody) {

                  if(!canSubmit)return false;

                  requestData(url, data, 'POST', parameterBody)
                  .then(function (results) {
                     var data = results[1];
                     alertOk(data.message || '操作成功');
                  })
                  .catch(function (error) {
                     alertError(error);
                  });
                }
      };

      return AjaxUtils;
  }//AjaxUtils

  /**
  *
  根据url或者模块名获取对应的tab标题（对应关系后台配置表配置。key=优联-模块在UITab的标题定义）
  * @Description: 记录菜单名与菜单模块名字直接的关系
  * @author liumingquan
  * @date 2017年8月23日
  用法：
  步骤1：加载配置表。
  <div
    ajax-url="rest/authen/configurationTable/getByKey.json?key=优联-模块在UITab的标题定义"
     scope-data="configurationTable",
     callback="$root.TabNameMatchByUrl.addByConfigurationTable(configurationTable)"
  ></div>
  步骤2：获取tab标题
    $rootScope.TabNameMatchByUrl.getTabNameByKey(moduleType);
    $rootScope.TabNameMatchByUrl.getTabNameByUrl(url);
  */
  function TabNameMatchByUrl() {
    var   routeMap={};
    var TabNameMatchByUrlObj={
      //
      /**
      * @Description:添加 优联-模块在UITab的标题定义
      需要在提前加载
      * @author liumingquan
      * @date 2017年8月23日
      用法：
      */
        addByConfigurationTable:function(data){
            if(!data||!data.items||data.items.length==0)return;
            for(var i=0;i<data.items.length;i++){
                var itemVO=data.items[i];
                if(itemVO.key)  routeMap[itemVO.key]=itemVO.value;
            }

        },
        /**
        * @Description: 根据url获取tab标题
        根据模块名查找合适的标题
        * @author liumingquan
        * @date 2017年8月23日
        用法：
        */
        getTabNameByUrl:function(url){
            // #/purchaseOrder/query.html?t=123=>#/purchaseOrder/query.html
             url=url.split('?')[0];
          // #/purchaseOrder/query.html=>['#','purchaseOrder','query.html']
             urlSplitArr=url.split('/');
             var index=0;
             do {
                  var key=urlSplitArr[index];
                  if(key&&key!=='#'){
                    var name=routeMap[key];
                    if(name)return name;
                  }
                  index++;
             } while (urlSplitArr.length>=index);
          return null;
        },
        /**
        * @Description: 根据key获取tab标题
        * @author liumingquan
        * @date 2017年8月23日
        用法：
        */
        getTabNameByKey:function(key){
          return routeMap[key];
        }
      }//TabNameMatchByUrlObj


      return TabNameMatchByUrlObj;
  }//TabNameMatchByUrl

  /**
   * [AmountCalculationService 金额计算服务Serviece]
   * @method      AmountCalculationService
   * @param       {[type]}          utils [description]
   * @constructor
   * @author liuzhen
   * @date 2017-08-31
   *
   * 与U8系统对应的金额相关计算规则：
   *
   *     含税单价(duty_price) = 报价 * (折扣率 / 100)
   *     价税合计(totalPrice) = 含税单价 * 数量
   *     税额(totalTaxPrice) = 价税合计 * 税率 / (100 + 税率)
   *     无税金额(total_duty_free_price) = 价税合计 - 税额
   *     无税单价(duty_free_price) = 无税金额 / 数量
   *     折扣额(discountPrice) = (报价-含税单价) * 数量
   */
  function AmountCalculationService (utils) {
    /**
     * [Service AmountCalculationService 返回一个构造函数类]
     * @method
     * @param  {[type]} strikePrice   [报价]
     * @param  {[type]} tax           [税率]
     * @param  {[type]} discountPrice [折扣额]
     * @param  {[type]} discountRate  [折扣率]
     * @param  {[type]} num           [数量]
     * @return {[type]}               [Function]
     */
    function AmountCalculation () {
      // 初始化参数属性
      // this.strikePrice = utils.transformToNumber(strikePrice);    // 报价
      // this.tax = utils.transformToNumber(tax);     // 税率
      // this.discountPrice = utils.transformToNumber(discountPrice);   // 折扣额
      // this.discountPrice = utils.transformToNumber(discountRate);    // 折扣率
      // this.num = utils.transformToNumber(num);    // 数量
    }

    AmountCalculation.prototype = {
      // 初始化父类原型指针
      constructor: AmountCalculation,

      // 计算含税单价
      getDutyPrice: function (strikePrice, discountRate) {
        this.strikePrice = utils.transformToNumber(strikePrice);    // 报价
        this.discountRate = utils.transformToNumber(discountRate);     // 税率
        return utils.numberMul(this.strikePrice, utils.numberDiv(this.discountRate, 100));
      },

      // 价税合计(totalPrice) = 含税单价 * 数量
      getTotalPrice: function (strikePrice, discountRate, num) {
        this.num = utils.transformToNumber(num);
        return utils.numberMul(this.getDutyPrice(strikePrice, discountRate), this.num);
      },

      // 税额(totalTaxPrice) = 价税合计 * 税率 / (100 + 税率)
      getTotalTaxPrice: function (strikePrice, tax, discountRate, num) {
        // 获取价税合计
        var _tmp = this.getTotalPrice(strikePrice, discountRate, num);
        // 进一步计算
        _tmp = utils.numberMul(_tmp, utils.transformToNumber(tax));
        // 返回结果
        return utils.numberDiv(_tmp, (100 + utils.transformToNumber(tax)));
      },

      // 无税金额(total_duty_free_price) = 价税合计 - 税额
      getTotalDutyFreePrice: function (strikePrice, tax, discountRate, num) {
        // 获取价税合计
        var _tmpTotalPrice = this.getTotalPrice(strikePrice, discountRate, num);
        // 获取税额
        var _tmpTotalTaxPrice = this.getTotalTaxPrice(strikePrice, tax, discountRate, num);
        // 返回无税金额
        return _tmpTotalPrice - _tmpTotalTaxPrice;
      },

      // 无税单价(duty_free_price) = 无税金额 / 数量
      getDutyFreePrice: function (strikePrice, tax, discountRate, num) {
        return utils.numberDiv(this.getTotalDutyFreePrice(strikePrice, tax, discountRate, num), num);
      },

      // 折扣额(discountPrice) = (报价-含税单价) * 数量
      getDiscountPrice: function (strikePrice, tax, discountRate, num) {
        var _tmp = utils.numberSub(strikePrice, this.getDutyPrice(strikePrice, discountRate));
        return utils.numberMul(_tmp, num);
      },

      // 调用上面的各方法计算出各个金额并返回对象
      getAllAmountObject: function (strikePrice, tax, discountRate, num, orderMedicalNos) {
        return {
          duty_price: this.getDutyPrice(strikePrice, discountRate),
          totalPrice: this.getTotalPrice(strikePrice, discountRate, num),
          totalTaxPrice: this.getTotalTaxPrice(strikePrice, tax, discountRate, num),
          total_duty_free_price: this.getTotalDutyFreePrice(strikePrice, tax, discountRate, num),
          duty_free_price: this.getDutyFreePrice(strikePrice, tax, discountRate, num),
          discountPrice: this.getDiscountPrice(strikePrice, tax, discountRate, num)
        };
      },

      /**
       * [获取当前单据的所有商品价格总和]
       * @method
       * @param  {[type]} orderMedicalNos [当前单据的商品列表集合]
       * @param  {[type]} fieldName       [当前订单类型的字段对象]
       * @param  {[type]} numFieldName    [存放计划销售数量的字段名]
       * @param  {[type]} strikePrice     [价格字段名]
       * @param  {[type]} discountRate    [折扣率字段名]
       * @return {[type]}                 [当前单据所有商品的价格和]
       */
      getAllItemTotalPrice: function (formData, fieldName, numFieldName, strikePrice, discountRate) {
        if (!formData) {
          throw new TypeError('param object is not defined!');
        }

        var _total = 0;

        // 根据字段对象判断订单类型
        if (formData.orderMedicalNos.length && formData[fieldName]) {
          if (formData[fieldName].indexOf('直发') > -1) {    // 直发销售
            for (var i = 0; i < formData.orderMedicalNos.length; i++) {
              _total += this.getTotalPrice(formData.orderMedicalNos[i][strikePrice], formData.orderMedicalNos[i][discountRate], formData.orderMedicalNos[i][numFieldName]);
            }
          } else if (formData[fieldName].indexOf('普通') > -1) {      // 普通销售
            for (var i = 0; i < formData.orderMedicalNos.length; i++) {
              var _num = 0;
              angular.forEach(formData.orderMedicalNos[i]['stockBatchs'], function (item, index) {
                _num += item.quantity;
              });
              // 计算累加数量
              _total += this.getTotalPrice(formData.orderMedicalNos[i][strikePrice], formData.orderMedicalNos[i][discountRate], _num);
            }
          }
        }
        
        return _total;
      }

    }

    return AmountCalculation;
  }


    /**
     * 查询参数类
     * @param requestData
     * @param alertOk
     * @param alertError
     * @param utils
     * @constructor
     */
  function QueryParamsService(requestData,alertOk,alertError,utils) {







  }



  angular.module('manageApp.main')
  .factory('OPrinter', OPrinter)
  .service('watchFormChange', ["$timeout",watchFormChange])
  .factory('redirectInterceptor', redirectInterceptor)
  .service('alertOk', ['$rootScope', 'modal',alertOk])
  .service('alertError', ['$rootScope', 'modal',alertError])
  .service('alertWarn', ['$rootScope', 'modal',alertWarn])
  .service('requestData', ['$q', '$http', '$httpParamSerializer','utils',requestData])
  .service('dialogConfirm', dialogConfirm)
  .service('dialogAlert', dialogAlert)
  .service('dialog', dialog)
  .service('dialogChart', dialogChart)
  .service('buildTree', buildTree)
  .factory('store', store)
  .factory('OPrinter', OPrinter)
  .factory('TabNameMatchByUrl', TabNameMatchByUrl)
  .factory('utils', ["$timeout","$rootScope",utils])
  .factory('AjaxUtils', ["requestData","alertOk","alertError",AjaxUtils])
  .factory('UICustomTable', ["$filter","utils",UICustomTable])
  .factory('proLoading', proLoading)
  .service('AmountCalculationService',['utils', AmountCalculationService])
  .config(['$httpProvider', function ($httpProvider) {$httpProvider.interceptors.push('redirectInterceptor');}]);
});
