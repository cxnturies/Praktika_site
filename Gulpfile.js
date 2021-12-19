const gulp = require("gulp");
const { series, parallel } = require("gulp");
const { watch } = require("gulp");

const rimraf = require("rimraf");

const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");

const browserSync = require("browser-sync").create();

exports.default = series(cleanBuild, buildSrc, parallel(watchSrc, sync));

function sync() {
    browserSync.init({
        server: {
            baseDir: "build"
        },
        files: "build/**/*.*"
    });
}

function buildSrc(cb) {
    parallel(buildStyles, buildHtml, copyImages, copyFonts)();
    cb();
}

function cleanBuild(cb) {
    rimraf("build", cb);
}

function buildStyles() {
    return gulp.src("source/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/'));
}

function cleanStyles(cb) {
    rimraf("build/style.css", cb);
}

function buildHtml() {
    return gulp.src("source/*.pug")
        .pipe(pug())
        .pipe(gulp.dest("build/"));
}

function cleanHtml(cb) {
    rimraf("build/**/*.html", cb);
}

function copyImages() {
    return gulp.src("source/img/*.*")
        .pipe(gulp.dest("build/img"));
}

function cleanImages(cb) {
    rimraf("build/img", cb);
}

function copyFonts() {
    return gulp.src("source/fonts/*.*")
        .pipe(gulp.dest("build/fonts"));
}

function cleanFonts(cb) {
    rimraf("build/fonts", cb);
}

function watchSrc() {
    watch("source/img/*.*",  series(cleanImages, copyImages));
    watch("source/fonts/*.*",  series(cleanFonts, copyFonts));
    watch("source/**/*.pug", series(cleanHtml, buildHtml));
    watch("source/**/*.scss", series(cleanStyles, buildStyles));
}
