var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
    return gulp.src('./public/javascripts/**/_*.js')
        .pipe(concat('game.js'))
        .pipe(gulp.dest('./public/javascripts/'));
})

gulp.task('watch', function () {
    // Watch partial js files
    gulp.watch("./public/javascripts/**/_*.js", ['scripts']);
})

// default task
gulp.task('default', ['scripts', 'watch']);