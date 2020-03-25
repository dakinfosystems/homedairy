let nodemon = require("gulp-nodemon")
/**
 * 
 * @param {*} opts
 * {   
 * done: done function of gulp task   
 * tasks: array of task that needs to run before restarting server   
 * ext: extension to watch
 * } 
 */
function startNodemon(opts) {
    var stream = nodemon({
        script: './bin/www',
        ext: 'js sass scss',
        ignore: [
            "gulpfile.js/**",
            "node_modules/**",
            "session/**"
        ],
        "tasks": opts["tasks"],
        env: { 
            'NODE_ENV': 'development',
            "PORT": "3031"
        },
        done: opts["done"]
    });

    stream.on("restart", ()=> {
        // console.log("Server has restarted!");
    }).on("crash", ()=> {
        // console.log("Server has crashed!!\n");
        stream.emit("restart", 15);
    })
}

module.exports = startNodemon