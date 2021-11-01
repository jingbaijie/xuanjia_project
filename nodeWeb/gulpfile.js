/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-08-07 13:39:21
 */ 
const gulp = require('gulp');

const clean = require('gulp-clean');
const zip = require("gulp-zip");
const gulpIf = require("gulp-if");

const condition = function(file){
    console.log(file.path)
    if((/buildServer/g).test(file.path)){
      return true;
    }
    return false;

}


gulp.task("build",()=>{
  return gulp.src([
    "server/**/*",
    '!./server/{log/**,.editorconfig,.eslintrc.js,.gitignore,README.md}'
    
  ]).pipe(gulp.dest("buildServer/"));

})



gulp.task('buildClean', () => {
  return gulp.src(["./buildServer/*","./buildServer.zip"],{allowEmpty: true}).pipe(gulpIf(condition,clean()));
})

gulp.task('buildZip', () => {
  return gulp.src('buildServer/**/*').pipe(zip("buildServer.zip")).pipe(gulp.dest("./"));
})

gulp.task("test",()=>{
  return gulp.src(["./buildServer","./buildServer.zip"],{allowEmpty: true}).pipe(gulpIf(condition,clean()))
})






 gulp.task("default", gulp.series("buildClean","build","buildZip"),function(){
  });
