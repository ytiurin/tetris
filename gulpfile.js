var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-html-minifier');
var merge = require('merge-stream');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var jsonminify = require('gulp-jsonminify');

var DEST = './public';

gulp.task('default', function() {

  var html = gulp.src('./dev.html')
    .pipe(replace(/\/src/g, "/public" ))
    .pipe(minify({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./'));

  var css = gulp.src('src/styles.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(DEST));

  var playjs = gulp.src('src/play.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST));

  var tetrisjs = gulp.src('src/tetris.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST));

  var sw = gulp.src('src/sw.js')
    .pipe(uglify())
    .pipe(gulp.dest('./'));

  var poly = gulp.src('src/serviceworker-cache-polyfill.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST));

  return merge(html, css, playjs, tetrisjs, sw, poly);
});
