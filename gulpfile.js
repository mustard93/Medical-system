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
    runSequence = require('run-sequence');              // 顺序执行

/* 自动刷新 start */
gulp.task('browser', function () {
  browserSync({
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
  css       :  'src/common/css/',
  less      :  'src/less/',
  scripts   :  "src/js/",
  img       :  "src/images/",
  html      :  "src/html/",
  build     :  "src/build/",
  src       :  'src/'
};

/* 项目资源文件目录 */
var cssSrc = paths.src + 'css/block_css/*.css',
    jsSrc = paths.src + 'angular/modules/**/*.js';

if(DEBUGGER) {
    resProxy = "http://localhost:3000/build";
    prefix = "http://localhost:3000/build";
}

/* 清理css文件 */
gulp.task('clean-css', function () {
  return gulp.src([paths.build + "css/*.css", paths.src + "css/style.min.css"])
             .pipe(clean());
});

/* 清理js文件 */
gulp.task('clean-js', function () {
  return gulp.src([paths.build + "js/*.js"])
             .pipe(clean());
});

/* 编译LESS */
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

/* 合并、压缩CSS */
gulp.task('handleCss', ['clean-css'], function () {
  return gulp.src([paths.src + 'css/block_css/*.css'])
             .pipe(concat('style.min.css'))
             .pipe(mincss())
             .pipe(gulp.dest('./src/css'))
             .pipe(rev())
             .pipe(gulp.dest(paths.build + 'css'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('./rev/css'));
});

/* 合并、压缩 JS */
gulp.task('handleJs', ['clean-js'], function () {
  return gulp.src([paths.src + 'angular/app.js', paths.src + 'angular/modules/**/*.js'])
             .pipe(concat('app.min.js'))
             .pipe(uglify())
             .pipe(rev())
             .pipe(gulp.dest(paths.build + 'js'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('./rev/js'));
});

/* CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射 */
gulp.task('revCss', ['handleCss'], function(){
    return gulp.src('./src/css/style.min.css')
               .pipe(rev())
               .pipe(gulp.dest(paths.src + 'build/css'))
               .pipe(rev.manifest())
               .pipe(gulp.dest(paths.src + 'rev/css'));
});

/* js生成文件hash编码并生成 rev-manifest.json文件名对照映射 */
// gulp.task('revJs', function(){
//     return gulp.src(jsSrc)
//         .pipe(rev())
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('rev/js'));
// });


//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['./rev/**/*.json', './src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./src'));
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

/* 本地服务,自动刷新 */
gulp.task('server', function (done) {
    condition = false;
    runSequence(['browser'], ['handleCss'], ['handleJs'], ['revHtml'], ['bro'], done);
    gulp.watch('./src/css/block_css/*.css', function () {     //监控所有CSS文件
      runSequence(['handleCss'], ['revHtml'], ['bro'], done);
    });
    gulp.watch(['./src/angular/**/*.js', './src/angular/*.js'], function () {     //监控所有JS文件
      runSequence(['handleJs'], ['revHtml'], ['bro'], done);
    });
    gulp.watch(['./src/*.html', './src/views/*.html', './src/views/**/*.html'], ['bro']);
});
