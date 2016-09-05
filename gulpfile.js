/*
 *  盘谷医疗项目后台管理系统模板
 */

'use strict';

var gulp = require('gulp'),
    browserSync = require("browser-sync");

// 自动刷新 browser-sync start
gulp.task('browser',function(){
  browserSync({
    port: 3000,
    open: true,
    startPath: "/src",
    server: {
      directory: true,
      routes: {
        '/src': "./src/index.html"
      },
      middleware: function(req,res,next){
        console.log("中间件");
        next();
      },
      baseDir: './'
    },
    // 指定浏览器
    // browser: "google chrome" // 或  ["google chrome","firefox"]
    // 延迟刷新，默认0
    reloadDelay: 1,
    // 是否载入css修改，默认true
    injectChanges: false
  });
});
gulp.task('bro',function(){
  gulp.src('./src/**')
  .pipe(browserSync.reload({stream:true}));
});
// 自动刷新 browser-sync end

gulp.task('default',['bro','browser'],function(){
  gulp.watch('./src/**',['bro']);
});
