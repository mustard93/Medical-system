/**
 *  盘谷医疗前端框架主入口文件
 */

//get root url
(function () {
    var loaderScript=  document.getElementById('requirejs_baseUrlId');
    if(!loaderScript){
      var scripts = document.getElementsByTagName("script");
      loaderScript = scripts[scripts.length - 1];
    }
    require.dir = loaderScript.src.match(/[^?#]*\//)[0];

    if (!Config.tplPath) {
      Config.tplPath = "";
    }
}());

require.config({
    waitSeconds: 0,
    baseUrl: require.dir + 'modules',
    paths: {
        'jQuery': '../libs/jquery.min',                       //jQuery
        'underscore': '../libs/underscore/underscore-1.5.2.min',
        'moment': '../libs/moment.min',                       //日历插件
        // 'echarts': '../libs/echarts.min',                     //图表插件
        'echarts': '../libs/echarts/echarts-3.2.3',
        'chosen': '../libs/chosen.jquery.min',                //下拉筛选插件
        'angular': '../libs/angular',                           //Angular
        'ngRoute': '../libs/angular-route',                     //路由
         'autocomplete': '../libs/jquery.autocomplete',    //自动补齐
        'bootstrap': '../libs/bootstrap.min',                 //bootstrap
        'jquery-ui': '../libs/jquery-ui.min',
        'nicescroll': '../libs/jquery-nicescroll.min',        //滚动条美化
        'migrate': '../libs/jquery-migrate.min',              //jQuery版本兼容
        'modernizr': '../libs/modernizr.min',                 //检测当前浏览器对HTML5和CSS3的支持
        'easypiechart': '../libs/easypiechart/jquery.easypiechart.min',    //jQuery饼图
        'sparkline': '../libs/jquery.sparkline.min',          //jQuery线状图
        'icheck': '../libs/jquery.icheck.min',                //checkbox美化
        'morris': '../libs/morris-chart/morris.min',                      //时序图
        'raphael': '../libs/morris-chart/raphael.min',                    //时序图
        'clndr': '../libs/calendar/clndr.min'                             //日历插件
    },
    shim: {
        'jQuery': {
            exports: 'jQuery'
        },
        'underscore': {
            exports: '_'
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
                deps: ['angular'],   //依赖什么模块
                exports: 'ngRoute'
        },
        // 'ngTagsInput': {
        //         deps: ['angular'],   //依赖什么模块
        //         exports: 'ngTagsInput'
        // },
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
        'migrate': {
            deps: ['jQuery'],
            exports: 'migrate'
        },
        'modernizr': {
            deps: ['jQuery'],
            exports: 'modernizr'
        },
        'easypiechart': {
            deps: ['jQuery'],
            exports: 'easypiechart'
        },
        'sparkline': {
            deps: ['jQuery'],
            exports: 'sparkline'
        },
        'icheck': {
            deps: ['jQuery'],
            exports: 'icheck'
        },
        'morris': {
            deps: ['jQuery'],
            exports: 'morris'
        },
        'raphael': {
            exports: 'raphael'
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
         'migrate',
         'modernizr',
         'easypiechart',
         'sparkline',
         'icheck',
         'morris',
         'raphael',
         'clndr'], function() {});

//@ifdef !production
define('manageApp.template', ['angular'], function () {
    angular.module('manageApp.template', []);
});
//@endif

define('manageApp.main', ['main/init', 'main/services', 'main/controllers', 'main/directives', 'main/filters']);
define('manageApp.project', ['project/init', 'project/services', 'project/controllers', 'project/directives', 'project/filters']);
define('manageApp.modal', ['modal/init', 'modal/services', 'modal/directives']);
define('manageApp.upload', ['upload/init', 'upload/directives']);
define('datePicker', ['datepicker/datepicker']);

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
        'datePicker'
    ]);
});

require(['manageApp','ngRoute'], function (app) {
    app.config(['$routeProvider', '$templateRequestProvider',
       function ($routeProvider, $templateRequestProvider) {
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
            headers: {
                'template': '1'
            }
        });
    }]);

    angular.bootstrap(document, ['manageApp']);
});
