var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('scripts', function () {
    return gulp.src('./public/javascripts/**/_*.js')
        .pipe(concat('game.js'))
        .pipe(gulp.dest('./public/javascripts/'));
})

gulp.task('compress', function (cb) {
  pump([
        gulp.src('./public/javascripts/*.js'),
        uglify(),
        gulp.dest('./public/javascripts/min/')
    ],
    cb
  );
});

gulp.task('watch', function () {
    // Watch partial js files
    gulp.watch("./public/javascripts/**/_*.js", ['scripts', 'compress']);
})

// default task
gulp.task('default', ['scripts', 'compress', 'watch']);