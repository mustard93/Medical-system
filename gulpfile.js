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
    revCollector = require('gulp-rev-collector');       // 替换静态资源链接

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
  gulp.src('./src/*')
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

var resProxy = "项目的真实路径";
var prefix = "项目的真实路径" + jsonObj.name;

if(DEBUGGER) {
    resProxy = "http://localhost:3000/build";
    prefix = "http://localhost:3000/build";
}

/* 清理css文件 */
gulp.task('clean-css', function () {
  gulp.src(paths.build + "css/*.css")
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

/* 合并css文件(不压缩) */
gulp.task('concatCss', ['clean-css'], function () {
  gulp.src([paths.src + 'css/block_css/*.css'])
      .pipe(concat('style.css'))
      .pipe(gulp.dest('.src/css'));
});

/* 合并压缩CSS */
gulp.task('handleCss', ['clean-css'], function() {              //- 创建一个名为 concatCss 的 task
    gulp.src([paths.src + 'css/block_css/*.css'])               //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('style.css'))                              //- 合并后的文件名
        .pipe(gulp.dest('./src/css'))                           // 输出合并后但压缩的CSS文件
        .pipe(mincss())                                         //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(paths.build + 'css'))                   //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css'));                          //- 将 rev-manifest.json 保存到 rev 目录内
});

/* 替换静态资源链接 */
gulp.task('replaceCssLink', ['concatCss'], function() {
    gulp.src(['rev/css/rev-manifest.json', 'src/*.html'])       //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({                                    //- 执行文件内css名的替换
           replaceReved: true
        }))
        .pipe(gulp.dest('./src'));                             //- 替换后的文件输出的目录
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

/* 监控任务 */
gulp.task('watch', function () {
  gulp.watch('./src/css/block_css/*.css', ['concatCss', 'bro']);
});

/* 默认启动任务 */
gulp.task('default', ['runLess', 'html', 'images', 'browserify'], function () {
  gulp.watch(['**/*.less', '**/*.css'], ['runLess']);
  gulp.watch('**/*.html', ['html']);
  gulp.watch('**/*.js', ['browserify']);
});

/* 本地服务,自动刷新 */
gulp.task('server', ['browser', 'handleCss', 'bro'], function () {
  gulp.watch('./src/css/block_css/*.css', ['handleCss', 'bro']);   //监控所有CSS文件
  gulp.watch(['./src/*.html', './src/views/*.html', './src/views/**/*.html'], ['bro']);
});
