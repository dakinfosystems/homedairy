const { JWT, errors } = require('jose'),
    secret = require("../../configs/auth").auth.key,
    crypto = require('crypto');
let UserModel = require("../../models/users");

function getTokenFromHeader(req) {
    let token;
    if (req.headers['authorization']) {
        let authorization = req.headers['authorization'].split(' ');
        if (authorization[0] == 'Bearer') {
            token = authorization[1];
        }
    }

    return token;
}

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
    },
    verifyFields: (req, res, next) => {
        if(req.body) {
            let errors = [];

            if(!req.body.otpassword) {
                errors.push("OTP is required");
            }
            if(errors.length){
                return res.status(400).send({error: errors.join(',')});
            } else {
                next();
            }
        } else {
            return res.status(400).send({error: "OTP is required"});
        }
    }
}

exports.validateRefreshToken = (req, res, next) => {
    let token = getTokenFromHeader(req);

    if(!token) {
        return res.status(401).send({ 
            error: "Missing/Incorrect bearer in request header"
        });
    } else {
        let thistoken = Buffer.from(token, "base64").toString();

        let payload = JWT.decode(thistoken);
        if (payload && payload.user && payload.user.id) {
            UserModel.findDoc(payload.user.id, ["refresh_token"]).then((result) => {
                let refresh_token = result.refresh_token;
                // onsole.log("From db: " + refresh_token);
                // console.log("From body: " + req.body.refresh_token);
                if(refresh_token === req.body.refresh_token) {
                    req.user = {
                        id: payload.user.id,
                        permission: payload.user.permission,
                        name: payload.sub
                    };
                    return next();
                } else {
                    return res.status(400).send({error: 'Invalid refresh token'});
                }
            });
        } else {
            return res.status(400).send({error: 'Invalid access token'});
        }
    }
};

/**
 * {
 *   "sub":"User name",
 *   "user": {
 *     "id":"user_id",
 *     "permission":number,
 *     "refresh_token":"token"
 *   },
 *   "aud":"audience",
 *   "iss":"",
 *   "iat":,
 *   "exp":expire epoch
 * }
 * 
 * @param {object} req express request
 * @param {object} res express response
 * @param {fucntion} next express next function
 * @returns None but it sends error msg to callee
 */
exports.validTokenNeeded = (req, res, next) => {
    try {
        let token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).send({ 
                error: "Missing/Incorrect bearer in request header"
            });
        } else {
            token = Buffer.from(token, "base64").toString();
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
};