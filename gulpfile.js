var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-html-minifier');
var merge = require('merge-stream');
var replace = require('gulp-replace');

var DEST = './';

gulp.task('default', function() {

  var html = gulp.src('src/index.html')
    .pipe(replace(/src="/g, "src=\"//cdn.rawgit.com/ytiurin/tetris/master/"))
    .pipe(minify({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(DEST));

  var js = gulp.src('src/tetris.js')
      .pipe(uglify())
      .pipe(gulp.dest(DEST));

    return merge(html, js);
});
