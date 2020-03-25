let gulp = require("gulp");
let nodemon = require("./nodemon");


/**
 * Stylesheet tasks
 */
let stylesheet = require("./stylesheet").sass;
let cssbuild = "css:compile"
let cssclean = "css:clean"

gulp.task(cssbuild, (done) => {
    return stylesheet.compile({
        compress: true,
        sourceMaps: true
    });
})

gulp.task(cssclean, (done) => {
    return stylesheet.clean({});
})

/**
 * Image tasks
 */
let imageTask = require("./images").webP
let imgbuild = "image:build"
let imgclean = "image:clean"

gulp.task(imgbuild, (done) => {
    return imageTask.compile({});
})

gulp.task(imgclean, (done) => {
    return imageTask.clean({});
})

/**
 *  Main tasks that needs to be exported
 */
gulp.task("compile", gulp.parallel([
    cssbuild,
    imgbuild
]))

gulp.task("clean", gulp.parallel([
    cssclean,
    imgclean
]))

gulp.task("server:rebuild", gulp.series(["clean", "compile"]));
gulp.task("server", function (done) {
    nodemon({
        "done": done,
        "tasks": ["server:rebuild"],
    });
});

exports.dev = gulp.series(["clean", "compile", "server"]);