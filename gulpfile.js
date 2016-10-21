var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var pug = require('gulp-pug');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
var cached = require('gulp-cached');
var beautify = require('gulp-beautify');
var gulpPugBeautify = require('gulp-pug-beautify');
var runsequence = require('run-sequence');

//paths
var buildpath = './build';

gulp.task('less', function(){
	return gulp.src('less/*.less')
		.pipe(less())
		.pipe(browserSync.reload({
		  stream: true
		}))
		.pipe(gulp.dest('./build'));
});
gulp.task('pug', function(){
  return gulp.src('./templates/*.pug')
  .pipe(pug())
	.pipe(gulpPugBeautify({ omit_empty: true }))
  //.pipe(beautify({indentSize: 2}))
  .pipe(browserSync.reload({stream: true}))
  .pipe(gulp.dest('./build'));
});
gulp.task('js', function(){
  return gulp.src('js/main.js')
  //.pipe(minify())
  .pipe(browserSync.reload({stream: true}))
  .pipe(gulp.dest('./build'));
});
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
  })
});
gulp.task('watch',function(){
  runsequence('less','pug','js','browserSync',function(e){
  });
  gulp.watch('less/*.less',['less']);
  gulp.watch('templates/*.pug',['pug']);
  gulp.watch('js/*.js',['js']);
	gulp.watch('build/**.**',['cordova']);
});
gulp.task('cordova',function(){
	return gulp.src('build/**.**')
	.pipe(gulp.dest('./cordova/simplytodo/www'));
});
