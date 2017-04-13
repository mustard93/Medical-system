/* 载入模块 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    mincss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    browerify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    replace = require('gulp-str-replace'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    rev = require('gulp-rev'),                          // 为静态资源文件替换带MD5的文件名
    revCollector = require('gulp-rev-collector'),       // 替换静态资源链接
    runSequence = require('run-sequence');         // 顺序执行


var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);
var pg_projects=jsonObj.pg_projects;
var argv = process.argv.pop();
var DEBUGGER = (argv === '-D' || argv === '-d') ? true : false;


// var DEBUGGER = (argv === '-D' || argv === '-d') ? true : false;
/* 基础路径 */
var paths = {
  src       :  'src/',
  build     :  "src/build/",//编译路径
  build_js       :'src/build/js/',//编译后css输出路径；paths.build_js
  build_css     : 'src/build/css/',//编译后js输出路径；paths.build_css
  less      :  'src/less/',
  scripts   :  "src/js/",
  img       :  "src/images/",
  html      :  "src/html/",
   buildTmp :  "../tmp/"
};

/* 部件路径 */

var Component_paths = {
  src_css       :  [paths.src + 'css/block_css/**/*.css'],
  // dest_css_path       :  paths.src+'build/css/',
  // dest_css_fileName:"style.min.css",

  src_js     :   [paths.src + 'angular/modules/datepicker/*.js',
                  paths.src + 'angular/modules/main/*.js',
                  paths.src + 'angular/modules/modal/*.js',
                 paths.src + 'angular/modules/project/*.js',
                 paths.src + 'angular/modules/upload/*.js'],
  less      :  'src/less/',
  scripts   :  "src/js/",
  img       :  "src/images/",
  html      :  "src/html/",
   buildTmp :  "../"
};
/* 基础路径 */


function getProjectPaths(project_name){

   var obj={
    src_css       :   [paths.src + 'css/'+project_name+'/**/*.css'],
    dest_css_fileName:project_name+"_style.css",
    src_js     :   [ paths.src+project_name+"/app.js",paths.src + 'angular/modules/'+project_name+'/*.js'],
    dest_js_fileName:project_name+"_app.js",
    build     :  "src/build/",//编译路径
    build_js       :  paths.build+'js/',
    build_css_min_rev:"src/build/"+project_name+"/css/",
    build_js_min_rev:"src/build/"+project_name+"/js/",
    less      :  'src/less/',
    scripts   :  "src/js/",
    img       :  "src/images/",
    html      :  "src/html/",
     buildTmp :  "../"
  };

  return obj;
};

function getconcatJsPath(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  return tmpProject_paths.src_js.concat(Component_paths.src_js);
}

function getconcatCssPath(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  return Component_paths.src_css.concat(tmpProject_paths.src_css);
}
/* 项目资源文件目录 */
var cssSrc = paths.src + 'css/block_css/*.css',
    jsSrc = paths.src + 'angular/modules/**/*.js';

if(DEBUGGER) {
    resProxy = "http://localhost:3000/build";
    prefix = "http://localhost:3000/build";
}



/* 自动刷新 start */
gulp.task('browser', function () {
  return browserSync({
    port: 3000,
    open: true,
    startPath: '/',
    server: {
      directory: true,
      routes: {
        '/': '/'
      },
      middleware: function (req, res, next) {
        console.log('middleWare.');
        next();
      },
      baseDir: './'
    },
    //指定浏览器
    browser: 'chrome',
    //延迟刷新，默认为0
    reloadDelay: 1,
    //是否载入css修改，默认true
    injectChanges: true
  });
});

gulp.task('bro', function () {
  return gulp.src('./src/*')
             .pipe(browserSync.reload({
                stream: true
              }));
});
/* 自动刷新 end */




/* 编译LESS    Test test*/
gulp.task('runLess', ['clean-css'], function () {
  return gulp.src([paths.less + '**/*.less', paths.css + '**/*.css'])
           .pipe(less())
           .pipe(concat('main.min.css'))
           .pipe(mincss())
           .pipe(replace({
                      original : {
                        resProxy : /\@{3}RESPREFIX\@{3}/g,
                        prefix : /\@{3}PREFIX\@{3}/g
                      },
                      target : {
                        resProxy : resProxy,
                        prefix : prefix
                      }
                  }))
           .pipe(gulp.dest(paths.build + "/css"))
           .pipe(browserSync.reload({stream:true}));
});

/* 压缩图片 */
gulp.task('images', function () {
  return gulp.src(paths.img + "**/*")
          .pipe(imagemin())
          .pipe(gulp.dest(paths.build + "/images"));
});














// 项目dt 配置==========================================================================
/* 清理js文件(开发环境 )*/
gulp.task('concatJs-dt-clean', function () {
  var tmpProject_paths = getProjectPaths("dt");
  return gulp.src([paths.build_js + tmpProject_paths.dest_js_fileName])
             .pipe(clean());
});
/* 合并、JS(开发环境 ) */
gulp.task('concatJs-dt', ['concatJs-dt-clean','test-concatMinJs-dt'], function () {
  var tmpProject_paths = getProjectPaths("dt");
  var concatCss_src=Component_paths.src_js.concat(tmpProject_paths.src_js);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_js_fileName))
             .pipe(gulp.dest(paths.build_js));
});
/* 合并、JS(开发环境 ) */
gulp.task('test-concatMinJs-dt', function () {
  var project_name="dt";
  var tmpProject_paths = getProjectPaths(project_name);
    var concatJs_src=tmpProject_paths.src_js.concat(Component_paths.src_js);

    return gulp.src(concatJs_src)
               //.pipe(concat('app.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(paths.buildTmp + 'js'));
});

/* 清理css文件((开发环境 ) ) */
gulp.task('concatCss-dt-clean', function () {
  var project_name="dt";
  var tmpProject_paths = getProjectPaths(project_name);
    return gulp.src([paths.build_css + tmpProject_paths.dest_css_fileName])
             .pipe(clean());
});
/*合并css(开发环境 ) 方法 */
gulp.task('concatCss-dt', ['concatCss-dt-clean'], function () {
  var project_name="dt";
  var tmpProject_paths = getProjectPaths(project_name);
  var concatCss_src=getconcatCssPath(project_name);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_css_fileName))
             .pipe(gulp.dest(paths.build_css));

});

// 项目dt 配置==========================================================================


// 项目manage 配置==========================================================================
/* 清理js文件(开发环境 )*/
gulp.task('concatJs-manage-clean', function () {
  var tmpProject_paths = getProjectPaths("manage");
  return gulp.src([paths.build_js + tmpProject_paths.dest_js_fileName])
             .pipe(clean());
});
/* 合并、JS(开发环境 ) */
gulp.task('concatJs-manage', ['concatJs-manage-clean','test-concatMinJs-manage'], function () {
  var tmpProject_paths = getProjectPaths("manage");
  var concatCss_src=Component_paths.src_js.concat(tmpProject_paths.src_js);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_js_fileName))
             .pipe(gulp.dest(paths.build_js));
});
/* 合并、JS(开发环境 ) */
gulp.task('test-concatMinJs-manage', function () {
  var project_name="manage";
  var tmpProject_paths = getProjectPaths(project_name);
    var concatJs_src=tmpProject_paths.src_js.concat(Component_paths.src_js);

    return gulp.src(concatJs_src)
               //.pipe(concat('app.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(paths.buildTmp + 'js'));
});

/* 清理css文件((开发环境 ) ) */
gulp.task('concatCss-manage-clean', function () {
  var project_name="manage";
  var tmpProject_paths = getProjectPaths(project_name);
    return gulp.src([paths.build_css + tmpProject_paths.dest_css_fileName])
             .pipe(clean());
});
/*合并css(开发环境 ) 方法 */
gulp.task('concatCss-manage', ['concatCss-manage-clean'], function () {
  var project_name="manage";
  var tmpProject_paths = getProjectPaths(project_name);
  var concatCss_src=getconcatCssPath(project_name);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_css_fileName))
             .pipe(gulp.dest(paths.build_css));

});

// 项目manage 配置==========================================================================






// 项目project-PG16-H 配置==========================================================================
/* 清理js文件(开发环境 )*/
gulp.task('concatJs-project-PG16-H-clean', function () {
  var tmpProject_paths = getProjectPaths("project-PG16-H");
  return gulp.src([paths.build_js + tmpProject_paths.dest_js_fileName])
             .pipe(clean());
});
/* 合并、JS(开发环境 ) */
gulp.task('concatJs-project-PG16-H', ['concatJs-project-PG16-H-clean','test-concatMinJs-project-PG16-H'], function () {
  var tmpProject_paths = getProjectPaths("project-PG16-H");
  var concatCss_src=Component_paths.src_js.concat(tmpProject_paths.src_js);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_js_fileName))
             .pipe(gulp.dest(paths.build_js));
});
/* 合并、JS(开发环境 ) */
gulp.task('test-concatMinJs-project-PG16-H', function () {
  var project_name="project-PG16-H";
  var tmpProject_paths = getProjectPaths(project_name);
    var concatJs_src=tmpProject_paths.src_js.concat(Component_paths.src_js);

    return gulp.src(concatJs_src)
               //.pipe(concat('app.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(paths.buildTmp + 'js'));
});

/* 清理css文件((开发环境 ) ) */
gulp.task('concatCss-project-PG16-H-clean', function () {
  var project_name="project-PG16-H";
  var tmpProject_paths = getProjectPaths(project_name);
    return gulp.src([paths.build_css + tmpProject_paths.dest_css_fileName])
             .pipe(clean());
});
/*合并css(开发环境 ) 方法 */
gulp.task('concatCss-project-PG16-H', ['concatCss-project-PG16-H-clean'], function () {
  var project_name="project-PG16-H";
  var tmpProject_paths = getProjectPaths(project_name);
  var concatCss_src=getconcatCssPath(project_name);
  return gulp.src(concatCss_src)
  .on('data',function(file){
            console.log(file.history[0])
        })
             .pipe(concat(tmpProject_paths.dest_css_fileName))
             .pipe(gulp.dest(paths.build_css));

});

// 项目project-PG16-H 配置==========================================================================

/* 默认启动任务 */
gulp.task('default',  function (done) {
  condition = false;
    runSequence(
      ['concatJs-dt'],['concatCss-dt'],
      ['concatJs-manage'],['concatCss-manage'],
      ['concatJs-project-PG16-H'],['concatCss-project-PG16-H'],
    ['browser'], ['bro'], done);


    var concatCss_src_all=[];
    var concatJs_src_all=[];
      for(var i=0;i<pg_projects.length;i++){
        var project_name=pg_projects[i];
        var concatCss_src=getconcatCssPath(project_name);
          var concatJs_src=getconcatJsPath(project_name);
          concatCss_src_all.push(concatCss_src);
            concatJs_src_all.push(concatJs_src);



      }
          console.log("concatCss_src_all",concatCss_src_all);
                  console.log("concatJs_src_all",concatJs_src_all);
      //监控所有CSS文件
      gulp.watch(concatCss_src_all, function () {
        runSequence(
          ['concatCss-dt'],
          ['concatCss-manage'],
        ['concatCss-project-PG16-H'],
        ['browser'], ['bro'], done);
      });
      //监控所有JS文件
      gulp.watch(concatJs_src_all, function () {
        runSequence(
          ['concatJs-dt'],
          ['concatJs-manage'],
          ['concatJs-project-PG16-H'],
           ['bro'], done);

      });
  //
  // //监控所有JS文件
  // gulp.watch(['./src/angular/**/**/*.js', './src/angular/*.js'], function () {
  //   runSequence(['handleJsCompress'],['bro']);
  // });
  gulp.watch([
    './src/*.html',
    './src/views/*.html',
    './src/views/**/*.html',
    './src/**/*.html'], ['bro']);
});


/* 生产模式静态文件打包任务，包含css、js的合并、压缩、版本号更新及链接替换 */
gulp.task('pro-server', function (done) {
    condition = false;
    runSequence(
      ['handleCss'],
      ['handleJs'],
      ['revHtml'],
      ['revManageHtml'],
      done);
});
