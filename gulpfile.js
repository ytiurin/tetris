var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-html-minifier');
var merge = require('merge-stream');
var replace = require('gulp-replace');

var DEST = './';
var CDN = "//cdn.rawgit.com/ytiurin/tetris/master/";

gulp.task('default', function() {

  var html = gulp.src('src/index.html')
    .pipe(replace(/src="/g, "src=\"" + CDN))
    .pipe(minify({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(DEST));

  var indexjs = gulp.src('src/index.js')
      .pipe(uglify())
      .pipe(gulp.dest(DEST));

  var tetrisjs = gulp.src('src/tetris.js')
      .pipe(uglify())
      .pipe(gulp.dest(DEST));

    return merge(html, indexjs, tetrisjs);
});
