(function() {
    'use strict';
    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');
    function errorReport() {
        console.log(arguments);
    }
    gulp.task('inspect', function() {
        return gulp.src('js/**/*.js')
            .pipe(jshint())
            .on('error', function() {})
            .pipe(jshint.reporter('default'))
            .pipe(jscs())
            .on('error', function() {});
    });
    gulp.task('build', function() {
        return gulp.src([
                '**/*.js'
            ])
            .pipe(uglify())
            .pipe(gulp.dest('out'));
    });
    gulp.task('watch', ['inspect'], function() {
        gulp.watch('**/*.js', [ 'inspect' ]);
    });
    gulp.task('default', [ 'inspect', 'build' ]);
})();
