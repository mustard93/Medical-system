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
    baseUrl: require.dir + 'modules',
    paths: {
        'jQuery': '../libs/jquery.min',                       //jQuery
        'underscore': '../libs/underscore/underscore-1.5.2.min',
        'moment': '../libs/moment.min',                       //日历插件
        'echarts': '../libs/echarts.min',                     //图表插件
        'chosen': '../libs/chosen.jquery.min',                //下拉筛选插件
        'angular': '../libs/angular.min',                     //Angular
        'bootstrap': '../libs/bootstrap.min',                 //bootstrap
        'jquery-ui': '../libs/jquery-ui.min',
        'nicescroll': '../libs/jquery-nicescroll.min',        //滚动条美化
        'migrate': '../libs/jquery-migrate.min',              //jQuery版本兼容
        'modernizr': '../libs/modernizr.min',                 //检测当前浏览器对HTML5和CSS3的支持
        'easypiechart': '../libs/easypiechart/jquery.easypiechart',    //jQuery饼图
        'sparkline': '../libs/jquery.sparkline.min',          //jQuery线状图
        'icheck': '../libs/jquery.icheck.min',                //checkbox美化
        'flot': '../libs/flot-chart/jquery.flot.min',                     //jQuery图表
        'flot-tooltip': '../libs/flot-chart/jquery.flot.tooltip.min',     //jQuery图表
        'flot-resize': '../libs/flot-chart/jquery.flot.resize.min',       //jQuery图表
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
        'flot': {
            deps: ['jQuery'],
            exports: 'flot'
        },
        'flot-tooltip': {
            deps: ['jQuery'],
            exports: 'flot-tooltip'
        },
        'flot-resize': {
            deps: ['jQuery'],
            exports: 'flot-resize'
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
         'flot',
         'flot-tooltip',
         'flot-resize',
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

require(['manageApp'], function (app) {
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
