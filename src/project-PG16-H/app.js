/**
 *  盘谷医疗前端框架主入口文件
 */

//get root url
(function () {
  var loaderScript=  document.getElementById('requirejs_baseUrlId');
    if(!loaderScript){
      var scripts = document.getElementsByTagName('srcript');
      loaderScript = scripts[scripts.length - 1];
    }
    require.dir = loaderScript.src.match(/[^?#]*\//)[0];

    console.log("require.dir="+require.dir);

    //ueditor编辑器路径配置
    window.UEDITOR_HOME_URL=require.dir+"libs/ueditor1_4_3_3-utf8-jsp/";


    if (!Config.tplPath) {
      Config.tplPath = "";
    }


}());
    // window.UMEDITOR_HOME_URL=Config.serverPath;//编辑器需要 配置服务器地址
require.config({

  map: {
        "*": {
            "css": "../css.min"
        }
    },
    waitSeconds: 0,
    baseUrl: require.dir + 'modules',
    paths: {

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
        // "project/angucomplete": '../libs/project/angucomplete',                         //自动补全
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
});

require(['bootstrap',
         'jquery-ui',
         'nicescroll',
         'easypiechart',
         'icheck'], function() {});

//@ifdef !production
define('manageApp.template', ['angular'], function () {
    angular.module('manageApp.template', []);
});
//@endif

define('manageApp.main', ['main/init', 'main/services', 'main/controllers', 'main/directives', 'main/filters']);
define('manageApp.project', ['project/init', 'project/services', 'project/controllers', 'project/directives', 'project/filters', 'project/angucomplete']);
define('manageApp.modal', ['modal/init', 'modal/services', 'modal/directives']);
define('manageApp.upload', ['upload/init', 'upload/directives']);
define('datePicker', ['datepicker/datepicker']);

define('manageApp.project-PG16-H', ['project-PG16-H/init', 'project-PG16-H/services', 'project-PG16-H/controllers', 'project-PG16-H/directives', 'project-PG16-H/filters', 'project-PG16-H/angucomplete']);


define('manageApp', [
       'angular',
       'manageApp.template',
       'manageApp.modal',
       'manageApp.main',
       'manageApp.project',
       'manageApp.upload',
       'datePicker'
], function () {
    return angular.module('manageApp', [
        'ngRoute',
        'manageApp.template',
        'manageApp.modal',
        'manageApp.main',
        'manageApp.project',
        'manageApp.upload',
        'datePicker',
        'easypiechart'
    ]);
});

require(['manageApp','ngRoute'], function (app) {



    app.config(['$routeProvider', '$templateRequestProvider','$sceDelegateProvider',
       function ($routeProvider, $templateRequestProvider,$sceDelegateProvider) {

         $sceDelegateProvider.resourceUrlWhitelist([
             // Allow same origin resource loads.
             'self',
             '**',
                'http://192.168.0.211:8080/**',
             // Allow loading from our assets domain.  Notice the difference between * and **.
             'http://localhost:8080/**']);//ng-include $get允许跨越。

        if (window.Config) {
            $routeProvider
                .when("/:page*", {
                    templateUrl: function (param) {
                        var _url = (Config.viewsDir || '') + param.page;
                        delete param.page;
                        var _param = $.param(param);
                        return _param ? _url + "?" + _param : _url;
                    },
                    resolve: {
                        load: function () {
                        }
                    }
                })
                .otherwise({redirectTo: Config.indexPage});
        } else {
            $routeProvider
                .when("/:page*", {
                    templateUrl: function (param) {
                        var _url = param.page;
                        delete param.page;
                        var _param = $.param(param);
                        return _param ? _url + "?" + _param : _url;
                    },
                    resolve: {
                        load: function () {
                        }
                    }
                });
        }

        $templateRequestProvider.httpOptions({
          withCredentials:true
          // ,//ng-include $get允许跨越。
          //   headers: {
          //
          //       'template': '1'
          //   }
        });
    }]);

    angular.bootstrap(document, ['manageApp']);
});
