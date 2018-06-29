// include modules
var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    babel           = require('gulp-babel'),
    babelify        = require('babelify'),
    buffer          = require('vinyl-buffer'),
    browserify      = require('browserify'),
    browserSync     = require('browser-sync').create(),
    criticalCss     = require('gulp-penthouse'),
    cleanCSS        = require('gulp-clean-css'),
    concat          = require('gulp-concat'),
    htmlmin         = require('gulp-htmlmin'),
    jest            = require('gulp-jest').default,
    rename          = require('gulp-rename'),
    runSequence     = require('run-sequence'),
    sass            = require('gulp-sass'),
    source          = require('vinyl-source-stream'),
    sourcemaps      = require('gulp-sourcemaps'),
    through         = require('through-gulp'),
    uglify          = require('gulp-uglify'),
    vueify          = require('vueify');
    
// disable minification
var devMode = false;

// js (browser)
gulp.task('js', function()
{
    return browserify({
            entries: ['./_js/script.js']
        })
        /* configuration is in .babelrc */
        .transform(babelify)
        .transform(vueify)
        .bundle()
        .on('error', function(err) { console.log(err.toString()); this.emit('end'); })
        .pipe(source('chefcookie.min.js'))
        .pipe(buffer())
        .pipe(devMode ? through() : uglify()).on('error', function(e){ console.log(e); })
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({stream: true}));
});

// js (babel)
gulp.task('js-babel', function()
{
    /* use this, if you want to export js as a module that
    can be published on npm and/or imported via "import" */
    return gulp
        .src('./_js/*.js')
        .pipe(babel({
            presets : ['es2015', 'es2017'],
            plugins : ['transform-runtime']
        }))
        .on('error', function(err) { console.log(err.toString()); this.emit('end'); })
        .pipe(gulp.dest('./_js/_build'));
});

// watch
gulp.task('watch', function()
{
    gulp.watch(['./_js/*.js'], function() { runSequence('js','js-babel'); });
});

// default
gulp.task('default', function()
{
    runSequence('js','js-babel','watch');
});

// dev
gulp.task('dev', function()
{
    devMode = true;
    runSequence('default');    
});