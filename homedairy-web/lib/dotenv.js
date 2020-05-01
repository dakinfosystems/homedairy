/*
 * Config module is to read env file and update environment variable.
 */

var fs = require('fs');
var path = require('path');

function parse(content) {
    var obj = {};
    content.toString().split('\n').forEach(function(line, index){
        var pairArr = line.match(/^([\s\#]*).*/);

        /** Commented line */
        if(pairArr && pairArr[1].trim()) {
            return;
        }

        pairArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
        /** key value */
        if(null != pairArr) {
            var key = pairArr[1];
            var value = pairArr[2];
            var m;

            if ( (m = value.match(/^\s*"(.*)"(\s*.*)$/)) ) {
                /* Get value between double qoute */
                value = m[1].trim();

            } else if( (m = value.match(/(.*)#.*/)) ) {
                /* saperate out with comment */
                value = m[1].trim();
            }

            obj[key] = value;
        }
    });
    return obj;
}

function readConfig(filepath, options) {
    try {
        // specifying an encoding returns a string instead of a buffer
        var envObj = parse(fs.readFileSync(filepath));

        Object.keys(envObj).forEach(function (key) {
            if (!process.env.hasOwnProperty(key.toUpperCase())) {
                process.env[key.toUpperCase()] = envObj[key];
            } else {
                /* "${key}" is already defined in process.env and will not be overwritten */
                if(options && options.overwrite) {
                    process.env[key.toUpperCase()] = envObj[key];
                }
            }
        });

        return { envObj }
    } catch (e) {
        console.error(e);
        return { error: e }
    }
}

module.exports.read = readConfig;