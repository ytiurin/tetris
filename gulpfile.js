var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-html-minifier');
var merge = require('merge-stream');
var replace = require('gulp-replace');

var DEST = './public';
var CDN = "//ytiurin.github.io/tetris/public/";

gulp.task('default', function() {

  var html = gulp.src('src/index.html')
    .pipe(replace(/(src|href)=".\//g, "$1=\"" + CDN ))
    .pipe(minify({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('./'));

  var indexjs = gulp.src('src/index.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST));

  var tetrisjs = gulp.src('src/tetris.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST));


  var css = gulp.src('src/styles.css')
    .pipe(replace(/url\(.\//g, "url(" + CDN ))
    .pipe(cleanCSS())
    .pipe(gulp.dest(DEST));

  return merge(html, indexjs, tetrisjs, css);
});
