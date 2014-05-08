(function() {
    'use strict';
    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');

    gulp.task('inspect', function() {
        return gulp.src('js/**/*.js')
            .pipe(jshint()).pipe(jshint.reporter('default'))
            .pipe(jscs());
    });
    gulp.task('build', function() {
        return gulp.src('js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('out'));
    });
    gulp.task('default', [ 'inspect', 'build' ]);
})();