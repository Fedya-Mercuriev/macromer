const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const { parallel, series } = require('gulp');

exports.scripts = function() {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('common.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

exports.scriptsVendor = function() {
    return gulp.src('src/js/vendor/*.js')
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

exports.styles = function() {
    return gulp.src('src/css/**/*.scss')
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('common.css'))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

if (process.env.NODE_ENV === 'production') {
    //exports.build = series(transpile, minify);
} else {
    exports.default = function() {
        browserSync.init({
            server: {
                baseDir: "./"
            }
        });
        series('scriptsVendor', 'scripts', 'styles');
        gulp.watch('src/js/vendor/*.js', series('scriptsVendor'));
        gulp.watch(['src/js/**/*.js', '!src/js/vendor/*.js'], series('scripts'));
        gulp.watch(['src/css/**/*.scss', '!src/css/vendor/*.scss'], series('styles'));
    };
}