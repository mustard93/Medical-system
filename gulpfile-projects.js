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

//配置项目名（必填项），项目具体目录关注。Project_paths
var project_name="manage";

var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);

//获取需要打包的项目
var pg_projects=jsonObj.pg_projects;
var argvs = process.argv;
console.log( argvs);

//
function getArgvsValueByKey(arr,key){
  for(var i=0;i<arr.length;i++){
    if(arr[i]==key){
      if(arr.length>i){
        return arr[i+1];
      }
    }
  }
}

arg_project_name=getArgvsValueByKey(argvs,"--project_name");
console.log("arg_project_name", arg_project_name);
if(project_name)project_name=arg_project_name;


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
    build_css_min:"src/build/"+project_name+"/css/",
    build_js_min:"src/build/"+project_name+"/js/",
    less      :  'src/less/',
    scripts   :  "src/js/",
    img       :  "src/images/",
    html      :  "src/html/",
     buildTmp :  "../"
  };


  if(project_name=="dt"){//非规范路径
    obj.src_js= [ paths.src+"app.js"];
	}

//  console.log("getProjectPaths",obj);
  return obj;
};

// var Project_paths = getProjectPaths(project_name);

// var concatCss_src=Component_paths.src_css.concat(Project_paths.src_css);
//     console.log('concatCss_src',concatCss_src);
// var concatJs_src=Project_paths.src_js.concat(Component_paths.src_js);
//   console.log('concatJs_src',concatJs_src);
//
function getconcatJsPath(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  return tmpProject_paths.src_js.concat(Component_paths.src_js);
}

function getconcatCssPath(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  return Component_paths.src_css.concat(tmpProject_paths.src_css);
}

/*合并css(开发环境 ) 方法 */
function concatCssTask(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
    // console.log('tmpProject_paths',tmpProject_paths);
  var concatCss_src=getconcatCssPath(project_name);
  return gulp.src(concatCss_src)
             .pipe(concat(tmpProject_paths.dest_css_fileName))
             .pipe(gulp.dest(paths.build_css));
}

/*合并、压缩CSS(发布环境)方法 */
function concatMinCssTask(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  var concatCss_src=Component_paths.src_css.concat(tmpProject_paths.src_css);
  return gulp.src(concatCss_src)
             .pipe(concat(tmpProject_paths.dest_css_fileName))
             .pipe(mincss())
             .pipe(rev())
            //  .pipe(gulp.dest(paths.build + 'css'))
               .pipe(gulp.dest(paths.build_css))
             .pipe(rev.manifest())
             .pipe(gulp.dest(tmpProject_paths.build_css_min));

}

/*合并css(开发环境 ) */
gulp.task('concatCss', ['clean-css'], function () {
  return concatCssTask(project_name);
});

/* 清理css文件(开发环境 ) */
gulp.task('clean-css', function () {
  return gulp.src([paths.build_css+"*.css"])
             .pipe(clean());
});


/*  合并、压缩CSS(发布环境) */
gulp.task('handleCss', ['pro-clean-css'], function () {
  return concatCssTask(project_name);
});

/* 清理css文件(发布环境)*/
gulp.task('pro-clean-css', function () {
  return gulp.src([paths.build_css+"*.*"])
             .pipe(clean());
});

/* 清理js文件(发布环境)*/
gulp.task('pro-clean-js', function () {
  return gulp.src([paths.build_js + "*.*"])
             .pipe(clean());
});

/* 合并、JS(发布环境) */
gulp.task('concatJs', ['pro-clean-js'], function () {
  return gulp.src(concatJs_src)
             .pipe(concat(Project_paths.dest_js_fileName))
            .pipe(gulp.dest(paths.build_js));
});



/*合并js(开发环境 ) 方法 */
function concatJsTask(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  var concatCss_src=Component_paths.src_js.concat(tmpProject_paths.src_js);
  return gulp.src(concatCss_src)
             .pipe(concat(tmpProject_paths.dest_js_fileName))
             .pipe(gulp.dest(paths.build_js));
}






/*合并、压缩jS(发布环境)方法 */
function concatMinJsTask(project_name){
  var tmpProject_paths = getProjectPaths(project_name);
  var concatJs_src=tmpProject_paths.src_js.concat(Component_paths.src_js);
  console.log('concatJs_src',concatJs_src);
     return gulp.src(concatJs_src)
               .pipe(concat(tmpProject_paths.dest_js_fileName))
               .pipe(uglify())
               .pipe(rev())
               .pipe(gulp.dest(paths.build_js))
               .pipe(rev.manifest())
              .pipe(gulp.dest(tmpProject_paths.build_js_min))

}

/*压缩 JS 开发测试压缩是否失败  */
function testConcatMinJsTask(project_name){
    console.log('testConcatMinJsTask',project_name);
  var tmpProject_paths = getProjectPaths(project_name);
  console.log('tmpProject_paths',tmpProject_paths);

  var concatJs_src=tmpProject_paths.src_js.concat(Component_paths.src_js);

    console.log('concatJs_src',concatJs_src);

  return gulp.src(concatJs_src)
             //.pipe(concat('app.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest(paths.buildTmp + 'js'));

}

/* 合并、压缩 JS(发布环境) */
gulp.task('handleJs', ['pro-clean-js'], function () {
  return concatMinJsTask(project_name);
});

/* 压缩 JS 开发测试压缩是否失败 */
gulp.task('handleJsCompress', ['pro-clean-js'], function () {
  return testConcatMinJsTask(project_name)
});


/*压缩 JS 开发测试压缩是否失败  */
function revHtmlTask(project_name){
console.log("revHtmlTask.project_name="+project_name);
if(project_name=="dt"){
   return gulp.src(['./src/build/'+project_name+'/**/*.json', './src/*.html']) .on('data',function(file){
    console.log(file.history[0])
})
             .pipe(revCollector())
             .pipe(gulp.dest('./src/'));
}

 return gulp.src(['./src/build/'+project_name+'/**/*.json', './src/'+project_name+'/*.html']).on('data',function(file){
  console.log(file.history[0])
})
           .pipe(revCollector())
           .pipe(gulp.dest('./src/'+project_name));
  //
  //
  // return gulp.src(['./src/build/**/*.json', './src/'+project_name+'/**/*.html'])
  //            .pipe(revCollector())
  //            .pipe(gulp.dest('./src/'+project_name+'/release'));
  //

            //  return gulp.src(['./rev/**/*.json', './src/'+project_name+'/release/**/*.html'])
            //             .pipe(revCollector())
            //             .pipe(gulp.dest('./src/'+project_name+'/release'));

}



//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['./rev/**/*.json', './src/release/**/*.html'])
               .pipe(revCollector())
               .pipe(gulp.dest('./src/release'));
});

// 处理manage目录中的链接替换
gulp.task('revProjectHtml', function () {
  return revHtmlTask(project_name);
});
// 处理manage目录中的链接替换
gulp.task('revManageHtml', function () {
  return revHtmlTask(project_name);
});


/* 监听HTML文件变化 */
gulp.task('html', function () {
  return gulp.src(paths.html + "**/*.html")
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
      .pipe(gulp.dest(paths.build+'/html'))
      .pipe(reload({stream:true}));
});

/* 压缩图片 */
gulp.task('images', function () {
  return gulp.src(paths.img + "**/*")
          .pipe(imagemin())
          .pipe(gulp.dest(paths.build + "/images"));
});

/* 解决js模块化及依赖问题 */
gulp.task('browserify', function () {
  var b = browserify({
        entries: ["./src/js/index.js"],
        debug: true
    });
    return b.bundle()
        .pipe(source("index.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest("./build/js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
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
        .pipe(gulp.dest("./build/js"))
        .pipe(reload({stream:true}));
});

/* Css样式文件监控任务 */
gulp.task('watchCss', function () {
  gulp.watch('./src/css/block_css/*.css', function (done) {
    condition = false;
    runSequence(['handleCss'], ['revHtml'], ['bro'], done);
  });
});

/* 默认启动任务 */
gulp.task('default', ['runLess', 'html', 'images', 'browserify'], function () {
  gulp.watch(['**/*.less', '**/*.css'], ['runLess']);
  gulp.watch('**/*.html', ['html']);
  gulp.watch('**/*.js', ['browserify']);
});

/* 开发模式 */
gulp.task('server', ['pro-clean-css','pro-clean-js'], function (done) {
  condition = false;
  console.log(project_name+" start..");

  var concatCss_src=getconcatCssPath(project_name);
    var concatJs_src=getconcatJsPath(project_name);

    console.log("concatCss_src",concatCss_src);
        console.log("concatJs_src",concatJs_src);

    concatJsTask(project_name);
    concatCssTask(project_name);

  runSequence(['browser'], ['bro'], done);


  //监控所有CSS文件
  gulp.watch(concatCss_src, function () {
      runSequence(['pro-clean-css']);
      concatCssTask(project_name);
  });
  //监控所有JS文件
  gulp.watch(concatJs_src, function () {
        runSequence(['pro-clean-js']);
      concatJsTask(project_name);
      testConcatMinJsTask(project_name);
        runSequence(['bro']);
  });

  gulp.watch([
    './src/*.html',
    './src/views/*.html',
    './src/views/**/*.html',
    './src/**/*.html'], ['bro']);


        console.log(project_name+" end");
});//server task


//不压缩
function release_project(project_name){
      console.log(project_name+" start..");
      concatJsTask(project_name);
      concatCssTask(project_name);
        console.log(project_name+" end");

}



function release_project_min(project_name){
      console.log(project_name+" start..");
      concatMinJsTask(project_name);
      concatMinCssTask(project_name);
      revHtmlTask(project_name);
        console.log(project_name+" end");

}
/* 生产模式静态文件打包任务，包含css、js的合并、压缩、版本号更新及链接替换 */
gulp.task('release-all', ['pro-clean-css','pro-clean-js'],function (done) {
    condition = false;
  // release_project_min("dt");

    var task_arr=[];
    for(var i=0;i<pg_projects.length;i++){
      var project_name=pg_projects[i];

      release_project_min(project_name);
    //   gulp.task('concatMinJsTask'+project_name, function () {
    //     return concatMinJsTask(project_name);
    //   });
    //   task_arr.push('concatMinJsTask'+project_name);
    //
    //
    //   gulp.task('concatMinCssTask'+project_name, function () {
    //     return concatMinCssTask(project_name);
    //   });
    //   task_arr.push('concatMinCssTask'+project_name);
    //
    //
    // gulp.task('revHtmlTask'+project_name, function () {
    //   return revHtmlTask(project_name);
    // });
    // task_arr.push('revHtmlTask'+project_name);
    //
    // runSequence(['concatMinJsTask'+project_name],['concatMinCssTask'+project_name],['revHtmlTask'+project_name],done);
      // release_project_min(project_name);
    }

  // console.log(task_arr);



});



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
