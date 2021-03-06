/**
 *  盘谷医疗前端框架主入口文件
 */

//get root url
(function() {
    var loaderScript = document.getElementById('requirejs_baseUrlId');
    if (!loaderScript) {
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
    waitSeconds: 0,
    paths: {
        'jQuery': '../libs/jquery.min', //jQuery
        'underscore': '../libs/underscore/underscore-1.5.2.min',
        'moment': '../libs/moment.min', //日历插件
        'echarts': '../libs/echarts.min', //图表插件
        'chosen': '../libs/chosen.jquery.min', //下拉筛选插件
        'angular': '../libs/angular', //Angular
        'ngRoute': '../libs/angular-route', //路由
        'autocomplete': '../libs/jquery.autocomplete.min',      //自动补齐
          'toastr': '../libs/toastr/toastr.min',   //提示窗口
        'bootstrap': '../libs/bootstrap.min', //bootstrap
    },
    shim: {
        'jQuery': {
            exports: 'jQuery'
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
        }
    },
    urlArgs: ''
});

require(['bootstrap'], function() {});

//@ifdef !production
define('manageApp.template', ['angular'], function() {
    angular.module('manageApp.template', []);
});
//@endif

define('manageApp.main', ['main/init', 'main/services', 'main/controllers', 'main/directives', 'main/filters']);

// define('manageApp.project', ['project/init', 'project/services', 'project/controllers', 'project/directives', 'project/filters']);
define('manageApp.registration', ['project/registration']);
define('manageApp.modal', ['modal/init', 'modal/services', 'modal/directives']);
define('manageApp.upload', ['upload/init', 'upload/directives']);
define('datePicker', ['datepicker/datepicker']);

define('manageApp', [
    'angular',
    'manageApp.template',
    'manageApp.modal',
    'manageApp.main',
    // 'manageApp.project',
    'manageApp.registration',
    'manageApp.upload',
    'datePicker'
], function() {
    return angular.module('manageApp', [
        'ngRoute',
        'manageApp.template',
        'manageApp.modal',
        'manageApp.main',
        // 'manageApp.project',
        'manageApp.registration',
        'manageApp.upload',
        'datePicker'
    ]);
});

require(['manageApp', 'ngRoute'], function(app) {
    app.config(['$routeProvider', '$templateRequestProvider',
        function($routeProvider, $templateRequestProvider) {
            if (window.Config) {
                $routeProvider
                    .when("/:page*", {
                        templateUrl: function(param) {
                            var _url = (Config.viewsDir || '') + param.page;
                            delete param.page;
                            var _param = $.param(param);
                            return _param ? _url + "?" + _param : _url;
                        },
                        resolve: {
                            load: function() {}
                        }
                    })
                    .otherwise({
                        redirectTo: Config.indexPage
                    });
            } else {
                $routeProvider
                    .when("/:page*", {
                        templateUrl: function(param) {
                            var _url = param.page;
                            delete param.page;
                            var _param = $.param(param);
                            return _param ? _url + "?" + _param : _url;
                        },
                        resolve: {
                            load: function() {}
                        }
                    });
            }

            $templateRequestProvider.httpOptions({
                headers: {
                    'template': '1'
                }
            });
        }
    ]);

    angular.bootstrap(document, ['manageApp']);
});
