let gulp = require("gulp");
let sass = require("gulp-sass");
// let uglify = require("gulp-")
let sourcemaps = require('gulp-sourcemaps');
let gulpclean = require("gulp-clean");
let config = require("./gulp.config")

let srcfolder = config.paths.styles.src;
let destfolder = config.paths.styles.dest;

sass.compiler = require("sass");

function sourceMapsInit(stream, flag) {
    let retStream = stream;
    if (flag) {
        retStream = stream.pipe(sourcemaps.init());
    }
    return retStream;
}

function sourceMapsFin(stream, flag) {
    let retStream = stream;
    if (flag) {
        retStream = stream.pipe(sourcemaps.write("."));
    }
    return retStream;
}

/**
 * 
 * @param {*} opts
 * opts = {    
 *      compress: ture to compress    
 *      sourceMaps: true to write map file    
 * }
 */
function compileit(opts) {
    let stream = gulp.src(srcfolder + "/*.s[ac]ss")
    let opStyle = "expanded"

    if( opts.compress ) {
        opStyle = "compressed"
    } else {
        opts.sourceMaps = false;
    }
    stream = sourceMapsInit(stream, opts.sourceMaps)
    .pipe(sass({
        outputStyle: opStyle,
    }).on('error', sass.logError))

    
    stream =  sourceMapsFin(stream, opts.sourceMaps)
    .pipe(gulp.dest(destfolder));

    return stream;
}
/**
 * 
 * @param {*} opts 
 * opts = {   
 * 
 * }
 */
function cleanit(opts) {
    let stream;
    
    stream = gulp.src([
        destfolder + "/*.css",
        destfolder + "/*.css.map"
    ], { read: false })
    .pipe(gulpclean({ force: true }))

    return stream;
}

module.exports = {
    "sass": {
        "compile": compileit,
        "clean": cleanit
    }
}