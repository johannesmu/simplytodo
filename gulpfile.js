var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var pug = require('gulp-pug');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
// var beautify = require('gulp-beautify');
var prettify = require('gulp-prettify');
var runsequence = require('run-sequence');
var image = require('gulp-image-resize');

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
  // .pipe(beautify({indentSize: 2}))
	.pipe(prettify())
  .pipe(browserSync.reload({stream: true}))
  .pipe(gulp.dest('./build'));
});
gulp.task('js', function(){
  return gulp.src('js/*.js')
  .pipe(minify())
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
  runsequence('less','pug','js','image','browserSync',function(e){
  });
  gulp.watch('less/*.less',['less']);
  gulp.watch('templates/*.pug',['pug']);
  gulp.watch('js/*.js',['js']);
	gulp.watch('build/**');
});

//move to app
gulp.task('cordova',function(){
	return gulp.src('./build/**')
	.pipe(gulp.dest('./app/www'));
});
// gulp icons
gulp.task("icon36",function(){
	return gulp.src('assets/icon.png')
	.pipe(image({width:36,height:36}))
	.pipe(gulp.dest('app/platforms/android/res/drawable-ldpi'))
});
gulp.task("icon48",function(){
	return gulp.src('assets/icon.png')
	.pipe(image({width:48,height:48}))
	.pipe(gulp.dest('app/platforms/android/res/drawable-mdpi'))
});
gulp.task("icon72",function(){
	return gulp.src('assets/icon.png')
	.pipe(image({width:72,height:72}))
	.pipe(gulp.dest('app/platforms/android/res/drawable-hdpi'))
});
gulp.task("icon96",function(){
	return gulp.src('assets/icon.png')
	.pipe(image({width:96,height:96}))
	.pipe(gulp.dest('app/platforms/android/res/drawable-xhdpi'))
});
gulp.task('logo',function(){
	return gulp.src('assets/icon.png')
	.pipe(image({width:128,height:128}))
	.pipe(gulp.dest('build/images/'))
});
gulp.task('image',function(){
	runsequence('icon36','icon48','icon72','icon96','logo');
});
