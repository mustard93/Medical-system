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

var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);

var argv = process.argv.pop();
var DEBUGGER = (argv === '-D' || argv === '-d') ? true : false;

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
var project_name="project-PG16-H";
var Project_paths = {
  src_css       :   [paths.src + 'css/project-PG16-H/**/*.css'],
  dest_css_fileName:"style.min.css",

  src_js     :   [ paths.src+project_name+"/app.js",paths.src + 'angular/modules/'+project_name+'/*.js'],
  dest_js_fileName:"app.min.js",

  build     :  "src/build/",//编译路径
  build_js       :  paths.build+'js/',

  less      :  'src/less/',
  scripts   :  "src/js/",
  img       :  "src/images/",
  html      :  "src/html/",
   buildTmp :  "../"
};

var concatCss_src=Component_paths.src_css.concat(Project_paths.src_css);
    console.log('concatCss_src',concatCss_src);
var concatJs_src=Project_paths.src_js.concat(Component_paths.src_js);
console.log('concatJs_src',concatJs_src);


/*合并css(开发环境 ) */
gulp.task('concatCss', ['clean-css'], function () {
  return gulp.src(concatCss_src)
             .pipe(concat(Project_paths.dest_css_fileName))
             .pipe(gulp.dest(paths.build_css));
});

/* 清理css文件(开发环境 ) */
gulp.task('clean-css', function () {
  return gulp.src([paths.build_css+"*.css"])
             .pipe(clean());
});
/*  合并、压缩CSS(发布环境) */
gulp.task('handleCss', ['pro-clean-css'], function () {
  return gulp.src(concatCss_src)
             .pipe(concat(Project_paths.dest_css_fileName))
             .pipe(mincss())
             .pipe(rev())
            //  .pipe(gulp.dest(paths.build + 'css'))
               .pipe(gulp.dest(paths.build_css))
             .pipe(rev.manifest())
             .pipe(gulp.dest(paths.build_css));
});

/* 清理css文件(发布环境)*/
gulp.task('pro-clean-css', function () {
  return gulp.src([paths.build_css+"*.css"])
             .pipe(clean());
});

/* 清理js文件(发布环境)*/
gulp.task('pro-clean-js', function () {
  return gulp.src([paths.build_js + "*.js"])
             .pipe(clean());
});

/* 合并、JS(发布环境) */
gulp.task('concatJs', ['pro-clean-js'], function () {
  return gulp.src(concatJs_src)
             .pipe(concat(Project_paths.dest_js_fileName))
            .pipe(gulp.dest(paths.build_js));
});
/* 合并、压缩 JS(发布环境) */
gulp.task('handleJs', ['pro-clean-js'], function () {
  return gulp.src(concatJs_src)
             .pipe(concat(Project_paths.dest_js_fileName))
             .pipe(uglify())
             .pipe(rev())
             .pipe(gulp.dest(paths.build_js))
             .pipe(rev.manifest())
            .pipe(gulp.dest(paths.build_js))
});

/* 压缩 JS 开发测试压缩是否失败 */
gulp.task('handleJsCompress', ['pro-clean-js'], function () {
  return gulp.src(concatJs_src)
             //.pipe(concat('app.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest(paths.buildTmp + 'js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['./rev/**/*.json', './src/release/**/*.html'])
               .pipe(revCollector())
               .pipe(gulp.dest('./src/release'));
});

// 处理manage目录中的链接替换
gulp.task('revManageHtml', function () {
  return gulp.src(['./rev/**/*.json', './src/manage/release/**/*.html'])
             .pipe(revCollector())
             .pipe(gulp.dest('./src/manage/release'));
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
gulp.task('server', function (done) {
  condition = false;
  runSequence(['handleJsCompress'],['browser'], ['concatCss'],['concatJs'], ['bro'], done);
  //监控所有CSS文件
  gulp.watch(concatCss_src, function () {
    runSequence(['concatCss'], ['bro'], done);
  });
  //监控所有JS文件
  gulp.watch(concatJs_src, function () {
    runSequence(['handleJsCompress'],['concatJs'],['bro']);
  });
  gulp.watch([
    './src/*.html',
    './src/views/*.html',
    './src/views/**/*.html',
    './src/manage/*.html'], ['bro']);
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
