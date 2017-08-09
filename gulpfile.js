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
        gulp.src('./public/javascripts/**/_*.js'),
        concat('game.js'),
        uglify({
            mangle: {
                keep_fnames: false,
            },
            toplevel: true,
        }),
        gulp.dest('./public/javascripts/')
    ],
    cb
  );
});

gulp.task('watch', function () {
    // Watch partial js files
    gulp.watch("./public/javascripts/**/_*.js", ['compress']);
})

// default task
gulp.task('default', ['compress', 'watch']);