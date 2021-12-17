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
    return gulp.src("src/style/sass/**/style.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/style/'));
}

function cleanStyles(cb) {
    rimraf("build/style", cb);
}

function buildHtml() {
    return gulp.src("src/**/index.pug")
        .pipe(pug())
        .pipe(gulp.dest("build/"));
}

function cleanHtml(cb) {
    rimraf("build/**/*.html", cb);
}

function copyImages() {
    return gulp.src("src/img/*.*")
        .pipe(gulp.dest("build/img"));
}

function cleanImages(cb) {
    rimraf("build/img", cb);
}

function copyFonts() {
    return gulp.src("src/fonts/*.*")
        .pipe(gulp.dest("build/fonts"));
}

function cleanFonts(cb) {
    rimraf("build/fonts", cb);
}

function watchSrc() {
    watch("src/img/*.*",  series(cleanImages, copyImages));
    watch("src/fonts/*.*",  series(cleanFonts, copyFonts));
    watch("src/**/*.pug", series(cleanHtml, buildHtml));
    watch("src/style/sass/**/*.sass", series(cleanStyles, buildStyles));
}
