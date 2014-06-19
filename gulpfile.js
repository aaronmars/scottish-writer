(function() {
    'use strict';
    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');
    gulp.task('inspect', function() {
        return gulp.src([ 'js/**/*.js', 'gulpfile.js' ])
            .pipe(jshint())
            .on('error', function() {})
            .pipe(jshint.reporter('default'))
            .pipe(jscs())
            .on('error', function() {});
    });
    gulp.task('watch', [ 'inspect' ], function() {
        gulp.watch('**/*.js', [ 'inspect' ]);
    });
    gulp.task('default', [ 'inspect' ]);
})();
