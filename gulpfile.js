const concat = require('gulp-concat')
const extract = require('gulp-html-extract')
const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require("gulp-rename")
const changed = require('gulp-changed')
const debug = require('gulp-debug')
const newer = require('gulp-newer')
const del = require('del')


gulp.task('clean:tmp', function () {
  return del([
    './tmp/**/*'
  ]);
})

gulp.task('sass:critical', function () {
  return gulp
    .src('./sass/**/*.scss')
    .pipe(newer({
      dest: './tmp',
      ext: '.css'
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./tmp'))
})

gulp.task('sass:extract', function () {
  return gulp
    .src('./html/**/*.html')
    .pipe(newer({
      dest: './tmp',
      ext: '.css'
    }))
    .pipe(extract({
      sel: '.scss'
    }))
    .pipe(rename(function (path) {
      path.dirname = "/";
      path.extname = ".scss"
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('tmp'))
})

gulp.task('css:concat', function () {
  return gulp
    .src('./tmp/**/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('css'))
})

gulp.task('css', ['sass:critical', 'sass:extract', 'css:concat'])

gulp.task('default', ['clean:tmp', 'css'], function () {
  gulp.watch('./html/**/*.html', ['sass:extract'])
  gulp.watch('./sass/**/*.scss', ['sass:critical'])
  gulp.watch('./tmp/**/*.css', ['css:concat'])
});
