const { JWT, errors } = require('jose'),
    secret = require("../../configs/auth").auth.key,
    crypto = require('crypto');

exports.hasVaild = {
    refreshBodyField: (req, res, next) => {
        if (req.body && req.body.refresh_token) {
            return next();
        } else {
            return res.status(400).send({error: 'need to pass refresh_token field'});
        }
    },
    loginFields: (req, res, next) => {
        if(req.body) {
            let errors = [];

            if(!req.body.userid) {
                errors.push("User id is required");
            }
            if (!req.body.password) {
                errors.push("Password is required");
            }
            if(errors.length){
                return res.status(400).send({error: errors.join(',')});
            } else {
                next();
            }
        } else {
            return res.status(400).send({error: "UserId and Password are required"});
        }
    }
}

exports.validateRefreshToken = (req, res, next) => {
    let b = new Buffer(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(400).send({error: 'Invalid refresh token'});
    }
};


exports.validTokenNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                var token = Buffer.from(authorization[1], "base64").toString();
                // console.log("Token: " + token);
                req.jwt = JWT.verify(token, secret);
                // console.log("validTokenNeeded => jwt: " + JSON.stringify(req.jwt));
                return next();
            }

        } catch (err) {
            var errmsg = "Error while authorising. code: " + err.code;
            // console.log(err);
            if(err instanceof errors.JOSEError 
                && err.code === "ERR_JWT_EXPIRED") {
                errmsg = "Access token has been expired";
            }
            return res.status(403).send({error: errmsg});
        }
    } else {
        return res.status(401).send({ 
            error: "Missing bearer in request header"
        });
    }
};