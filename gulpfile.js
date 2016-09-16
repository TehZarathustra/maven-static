"use strict";

var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	flatten = require('gulp-flatten'),
	wiredep = require('wiredep').stream,
	jade = require('gulp-jade'),
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	browserSync = require('browser-sync').create();

var onError = function(err) {
	console.log(err);
}

// default

gulp.task('default', ['bower', 'serve']);

// deploy 

gulp.task('deploy', ['copy'], function () {
	var assets = useref.assets();

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

// copy deploy

gulp.task('copy', ['copyModernizr', 'copyImages', 'copyFonts'], function() {
	var files = ['app/*', 'app/.*'],
		excludes = [
			'!app/.editorconfig',
			'!app/.gitignore',
			'!app/.gitattributes',
			'!app/index.html'
		];
	return gulp
		.src(files.concat(excludes))
		.pipe(flatten())
		.pipe(gulp.dest('./dist'));
});

gulp.task('copyImages', function() {
	return gulp
		.src('app/img/*')
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('copyFonts', function() {
	return gulp
		.src('app/fonts/*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copyModernizr', function() {
	return gulp
		.src('app/vendor/*')
		.pipe(gulp.dest('./dist/vendor'));
});

// browser-sync

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
        	baseDir: "./app",
        	https: true
        }
    });

    gulp.watch(['app/sass/*.sass','app/sass/blocks/*.sass'], ['sass']);
	gulp.watch(['app/jade/*.jade'], ['bower', browserSync.reload]);
	gulp.watch(['app/js/main.js', 'app/js/plugins.js', 'app/js/blocks/*.js'], ['js', browserSync.reload]);
});


// wiredep

gulp.task('bower', ['jade', 'sass'], function () {
	gulp.src('./app/*.html')
		.pipe(wiredep({
			directory: "app/components",
			exclude: ["app/components/jquery"]
		}))
	.pipe(gulp.dest('./app'));
});

// HTML

gulp.task('jade', function() {
  gulp.src('./app/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./app/'))
});

// sass

gulp.task('blocks', function() {
	return gulp.src('./app/sass/blocks/*.sass')
	.pipe(concat('templates.sass'))
	.pipe(gulp.dest('./app/sass'));
});

gulp.task('sass', ['blocks'], function() {
	return sass('./app/sass/main.sass', { style: 'compressed' })
	.pipe(rename('bundle.min.css'))
	.pipe(gulp.dest('./app/css'))
	.pipe(browserSync.stream());
});

// scripts

gulp.task('js', function() {
	browserify('./app/js/main.js')
		.bundle()
		.on('error', function (error) {
			gutil.log(error);
		})
		.pipe(source('main.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./app/js'))
});
