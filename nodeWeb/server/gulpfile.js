/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-10-16 16:42:47
 */ 
const gulp = require('gulp');
const minify = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const clean = require('gulp-clean');



gulp.task('clean', () => {
  return gulp.src('public/HD/commonJs/*').pipe(clean());
})

// 压缩js
gulp.task('js', () => {
  return gulp.src([
    // './public/HD/js/test.js',
    './public/HD/js/ajax.js',
    './public/HD/js/common3_4.js',
    './public/HD/js/interface.js',
    './public/HD/js/key3_4.js',
    './public/HD/js/logData.js',
    './public/HD/js/orderJs.js',
    './public/HD/js/videoPlayer.js',
    /*'./public/HD/js/column7DayFree.js',*/
    // '!./public/HD/js/{actiComm.js,loadCommomJs.js}'
    
  ])
    .pipe(concat("main.js"))
    .pipe(uglify({
      mangle:false,//类型：Boolean 默认：true 是否修改变量名
      compress:true,//类型：Boolean 默认：true 是否完全压缩
     // preserveComments:'all'//保留所有注释
     }
))
    .pipe(gulp.dest('public/HD/commonJs'));
});
gulp.task('js2', () => {
  return gulp.src([
    // './public/HD/js/test.js',
    './public/HD/js/ajax.js',
    './public/HD/js/common3_4.js',
    './public/HD/js/interface.js',
    './public/HD/js/key3_4.js',
    './public/HD/js/logData.js',
    './public/HD/js/orderJs.js',
     './public/HD/js/videoPlayer.js',
    // '!./public/HD/js/{actiComm.js,loadCommomJs.js}'
    
  ])
    .pipe(concat("main2.js"))
    .pipe(uglify({
      mangle:false,//类型：Boolean 默认：true 是否修改变量名
      compress:true,//类型：Boolean 默认：true 是否完全压缩
     // preserveComments:'all'//保留所有注释
     }
))
    .pipe(gulp.dest('public/HD/commonJs'));
});

// 启动express
gulp.task('node', ()=>{
  return nodemon({
      script: 'app.js',
      ext: 'js ejs css',
      env: { 'NODE_ENV': 'development' }
  })
})

// 启动服务
gulp.task('serve', gulp.series('node'),() => {
  return browserSync.init({
      proxy: 'localhost:9527', // 指定代理url
      notify: false, // 刷新不弹出提示
      port: 3000, // 端口
  }); 
});

// gulp.watch('public/HD/web/**/*', ['copy']).on('change', reload);

gulp.task("comJs", gulp.series("clean","js","js2"),function(){
  
});
