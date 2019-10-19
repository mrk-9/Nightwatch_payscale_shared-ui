var gulp = require('gulp');
var del = require('del');

gulp.task('default', function() {
    // copy sass files to lib, preserving relative path
    gulp.src('./src/**/style/*.scss')
        .pipe(gulp.dest('./lib'));

    // delete js files in types directory
    del(['./lib/Types/*.js']);
});
