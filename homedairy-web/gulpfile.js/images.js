let gulp = require("gulp");
let imagemin = require("gulp-imagemin");
let webp = require("gulp-webp");

let gulpclean = require("gulp-clean");
let path = require("./gulp.config").paths.images;

function progessiveCompile(opts) {
    return gulp.src(path.src + "/**/*.jpg")
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(path.dest))
}

function webpCompile(opts) {
    return gulp.src(path.src + "/**/*.jpg")
    .pipe(webp({
        quality: 80,
        preset: "photo",
        method: 6
    }))
    .pipe(gulp.dest(path.dest))
}

function webpClean(opts) {
    commonClean();
    return gulp.src([
        path.dest + "/**/*.webp"
    ], { read: false })
    .pipe(gulpclean({
        force: true
    }));
}

function commonClean(opts) {
    return gulp.src([
        path.dest + "/**/*.jpg"
    ], { read: false })
    .pipe(gulpclean({
        force: true
    }));
}

module.exports = {
    "progressive": {
        "compile": progessiveCompile,
        "clean": commonClean
    },
    "webP": {
        "compile": webpCompile,
        "clean": webpClean
    }
}
