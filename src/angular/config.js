
var require_dir=function(){
  var loaderScript=  document.getElementById('requirejs_baseUrlId');
    if(!loaderScript){
      var scripts = document.getElementsByTagName('script');

      for(var i=0;i<scripts.length;i++){
        if(scripts[i].src.indexOf("config.js")>-1){
          loaderScript =scripts[i];
          break;
        }
      }
    }
   return loaderScript.src.match(/[^?#]*\//)[0];
}();

//ueditor编辑器路径配置
window.UEDITOR_HOME_URL=require_dir+"libs/ueditor1_4_3_3-utf8-jsp/";
//引人公共配置
var require_config={
    map: {
          "*": {
              "css": "../css.min"
          }
      },
      waitSeconds: 0,
      baseUrl: require_dir + 'modules',
      paths: {
            'ztree': '../libs/ztree/jquery.ztree.all',     //zTree_v3-3.5.28
            'resizableColumns': '../libs/resizableColumns/jquery.resizableColumns.min',     //jQuery拖动调整表格列宽度
            'store': '../libs/store.min',     //本地存储
            'ZeroClipboard': '../libs/ueditor1_4_3_3-utf8-jsp/third-party/zeroclipboard/ZeroClipboard',//html编辑器
          'ueditor': '../libs/ueditor1_4_3_3-utf8-jsp/ueditor.all.min',//html编辑器
          'ueditor_config': '../libs/ueditor1_4_3_3-utf8-jsp/ueditor.config',//编辑器。require 不支持。
          'ueditor_lang': '../libs/ueditor1_4_3_3-utf8-jsp/lang/zh-cn/zh-cn',//编辑器
          'CanvasBusinessFlow': '../libs/project/CanvasBusinessFlow.min',//业务单图展示
          'WorkflowProcess': '../libs/project/WorkflowProcess.min',//工作流
            'CanvasTreeLayout':"../libs/project/CanvasTreeLayout.min",//流程图布局定义
          'LodopFuncs': '../libs/LodopFuncs_amd',     //打印功能
          'JTopo': '../libs/jtopo-0.4.8.min',
          'jQuery': '../libs/jquery.min',                         //jQuery
          'underscore': '../libs/underscore/underscore-1.5.2.min',
          'moment': '../libs/moment.min',                         //日历插件
          'echarts': '../libs/echarts/echarts-3.2.3.min',         // echars v3.2.3
          'chosen': '../libs/chosen.jquery.pg.min',                  //下拉筛选插件.已修改源码
          'angular': '../libs/angular.min',                           //Angular
          'ngRoute': '../libs/angular-route.min',                     //路由
          'autocomplete': '../libs/jquery.autocomplete.min',      //自动补齐
          'bootstrap': '../libs/bootstrap.min',                   //bootstrap
          'jquery-ui': '../libs/jquery-ui.min',
          'nicescroll': '../libs/jquery-nicescroll.min',          //滚动条美化
          'easypiechart': '../libs/easypiechart/angular.easypiechart',    //jQuery饼图
          'icheck': '../libs/jquery.icheck.min',                  //checkbox美化
          'morris': '../libs/morris-chart/morris.min',                         //日历插件
          'toastr': '../libs/toastr/toastr.min',   //提示窗口
          'raphael': '../libs/morris-chart/raphael.min',                         //日历插件
          'clndr': '../libs/calendar/clndr.min'                             //日历插件
      },
      shim: {
        'ueditor_config': {
            deps: ['jQuery']
        },
        // 'ZeroClipboard': {
        //       deps: ['jQuery'],
        //     exports: 'ZeroClipboard'
        // },
        'ueditor': {
            deps: ['jQuery','ZeroClipboard'],
            init:function(ZeroClipboard){
                 //导出到全局变量，供ueditor使用
                 window.ZeroClipboard = ZeroClipboard;
             }
        },
  //,'css!../libs/umeditor1_2_2/themes/default/css/umeditor.min.css'
        'ueditor_lang': {
            deps: ['ueditor','ueditor_config'],
              exports: 'UM'
        },
          'JTopo': {
              exports: 'JTopo'
          },
          'jQuery': {
              exports: 'jQuery'
          },
          'resizableColumns': {
              deps: ['jQuery','css!../libs/resizableColumns/jquery.resizableColumns.css']
          },
          'ztree': {
              deps: ['jQuery','css!../libs/ztree/zTreeStyle.css']
          },


          'underscore': {
              exports: '_'
          },
          'toastr': {
              deps: ['jQuery']
          },
          'chosen': {
              deps: ['jQuery']
          },
          'echarts': {
              exports: 'echarts'
          },

          'angular': {
              deps: ['jQuery'],
              exports: 'angular'
          },
          'ngRoute': {
            deps: ['angular'],
            exports: 'ngRoute'
          },
          'autocomplete': {
            deps: ['jQuery'],
            exports: 'autocomplete'
          },
          'bootstrap': {
              deps: ['jQuery'],
              exports: 'bootstrap'
          },
          'jquery-ui': {
              deps: ['jQuery'],
              exports: 'jquery-ui'
          },
          'nicescroll': {
              deps: ['jQuery'],
              exports: 'nicescroll'
          },
          'easypiechart': {
              deps: ['jQuery'],
              exports: 'easypiechart'
          },
          'icheck': {
              deps: ['jQuery'],
              exports: 'icheck'
          },
          'morris': {
              deps: ['raphael'],
              exports: 'morris'
          },
          'clndr': {
              deps: ['jQuery'],
              exports: 'clndr'
          }
      },
      urlArgs: ''
  }//require_config

//追加属性到目标对象
function appendOjectProperty(source,dest){
  if(!source||!dest)return;
  for(var o in source){
    dest[o]=source[o];
    console.log("appendOjectProperty",o,source[o]);
  }

}
