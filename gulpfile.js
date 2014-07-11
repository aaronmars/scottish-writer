(function() {
    'use strict';
    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');
    var browserSync = require('browser-sync');
    gulp.task('inspect', function() {
        return gulp.src([ 'js/**/*.js', 'gulpfile.js' ])
            .pipe(jshint({ camelcase: false }))
            .on('error', function() {})
            .pipe(jshint.reporter('default'))
            .pipe(jscs())
            .on('error', function() {});
    });
    gulp.task('watch', [ 'inspect' ], function() {
        gulp.watch('**/*.js', [ 'inspect' ]);
    });
    gulp.task('browserReload', function() {
        browserSync.reload();
    });
    gulp.task('serve', function() {
        browserSync.init(null, {
            server: {
                baseDir: './'
            }
        });
        gulp.watch([ 'elements/*', 'js/*' ], [ 'browserReload' ]);
    });
    gulp.task('default', [ 'inspect' ]);
})();
