
//扩展配置
var require_config_project={
  //扩展引用组件
  paths:{
    //     'moment': '../libs/moment.min',                         //日历插件
  },
  shim:{

  }
};
//追加项目配置
appendOjectProperty(require_config_project.paths,require_config.paths);
appendOjectProperty(require_config_project.shim,require_config.shim);

  // console.log("require_config",require_config);

  require.config(require_config);


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

define('manageApp.project-PG16-H', ['project-PG16-H/init', 'project-PG16-H/services', 'project-PG16-H/controllers', 'project-PG16-H/directives', 'project-PG16-H/filters']);


define('manageApp', [
       'angular',
       'manageApp.template',
       'manageApp.modal',
       'manageApp.main',
       'manageApp.project',
       'manageApp.upload',
       'manageApp.project-PG16-H',
       'datePicker'
], function () {
    return angular.module('manageApp', [
        'ngRoute',
        'manageApp.template',
        'manageApp.modal',
        'manageApp.main',
        'manageApp.project',
        'manageApp.project-PG16-H',
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
                .otherwise({redirectTo: Config.indexPage||'main.html'});
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
