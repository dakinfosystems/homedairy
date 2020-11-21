var UserModel = require("../../models/users");
var UserConfig = require("../../configs/user.config");
var bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * It verifies user password. If password is correct then next handle will be called, If false than error response
 * will be sent.
 * @param {object} req
 * Request object
 * @param {object} res
 * Response Object
 * @param {object} next
 * Function to call next request handler
 */
exports.verifyPassword = (req, res, next) => {
    // console.log("verifyPassword");
    let user;
    UserModel.findByUserId(req.body.userid)
        .then((users) => {
            // console.log("findByUserId => then " + JSON.stringify(user));

            if(!users || !users[0]) {
                res.status(400).send({ error: "User not found"});
            } else {
                // Check password
                user = users[0];
                var passwordFields = user.password.split("$");
                var hashed = Buffer.from(passwordFields[1], "base64").toString();
                if ( bcrypt.compareSync(req.body.password, hashed) ) {
                    req.user = {
                        id: user.userid,
                        permission: (
                            parseInt(user.userType) 
                            | parseInt(user.userLevel)
                        ),
                        name: user.name
                    }
                    // return next();
                    UserModel.findDoc(req.body.userid, ["refresh_token"]).then((results) => {
                        req.user.refresh_token = results.refresh_token;
                        next();
                    });
                    return;
                } else {
                    return res.status(400).send({error: "Invalid password"});
                }
            }
        })
        .catch((err) => {
            // console.log("Here " + JSON.stringify(req.body));
            //return res.status(400).send({});
            return res.status(400).send({error: "Unknown error occurred"});
        });
}

/**
 * It encrypts password which will be stored in database.
 * @param {object} req
 * Request object
 * @param {object} res
 * Response Object
 * @param {object} next
 * Function to call next request handler
 */
exports.encryptPassword = (req, res, next) => {
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(req.body.password, salt);

    // var testing =
    req.body.password = 
        (Buffer.from(salt)).toString("base64") 
        + "$" 
        + (Buffer.from(hash)).toString("base64");
    
    // console.log("encrypt password length: " + testing.length);
    next();
}

/**
 * It adds search filter before fetching data.
 * @param {boolean} onlyUserType
 * set true if only user type is to be set
 */
exports.searchFilterNeeded = (onlyUserType) => {
    return (req, res, next) => {
        var userType = (req.jwt.user.permission & (15 << 4))

        req.filter = req.filter || {};

        if (UserConfig.user.type.SELLER === userType) {
            req.filter.userType = UserConfig.user.type.CUSTOMER.toString();
        } else if (UserConfig.user.type.CUSTOMER === userType) {
            req.filter.userType = UserConfig.user.type.SELLER.toString();
        } else {
            req.filter.userType = [
                UserConfig.user.type.SELLER.toString(),
                UserConfig.user.type.CUSTOMER.toString()
            ];
        }

        if(onlyUserType) {
            next();
            return;
        }

        // console.log("ReqBody: " + JSON.stringify(req.body));
        if(req.body) {
            for (let field in req.body) {
                req.filter[field] = req.body[field];
            }
        }

        // console.log("ReqParam: " + JSON.stringify(req.params));
        if(req.params) {
            for (let field in req.params) {
                req.filter[field] = req.params[field];
            }
        }

        // console.log("ReqQuery: " + JSON.stringify(req.query));
        if(req.query) {
            for (let field in req.query) {
                req.filter[field] = req.query[field];
            }
        }
        next();
    }
}

/**
 * It checks required parameter is sent by user or not.
 * @param {object} req
 * Request object
 * @param {object} res
 * Response Object
 * @param {object} next
 * Function to call next request handler
 */
exports.checkSignUpParamter = (req, res, next) => {
    let msg = "";
    if(req.body) {
        let errors = [];
        if(!req.body.mobile) {
            errors.push("Mobile number is required");
        } 
        if(!req.body.name) {
            errors.push("Name is required");
        }
        if(!req.body.password) {
            errors.push("Password is required");
        } 
        
        if(errors.length === 0) { 
            return next();
        } else {
            msg = errors.join(" ");
        }
    } else {
        msg = "Please enter sign up details!!"
    }

    res.status(403).send({error: msg}).end();
}

/**
 * It add user type and user level in the req.body
 * @param {string} type 
 * User type
 */
function addUserTypeAndLevel(type) {
    return ((req, res, next) => {
        if(req.body) {
            req.body["userType"] = type;
            req.body["userLevel"] = UserConfig.user.level.FREE.toString();
        }
        next();
    })
}

/**
 * It add user type to customer
 */
exports.addCustomerUserType = () => {
    return addUserTypeAndLevel(UserConfig.user.type.CUSTOMER.toString());
}

/**
 * It add user type to seller
 */
exports.addSellerUserType = () => {
    return addUserTypeAndLevel(UserConfig.user.type.SELLER.toString());
}

/**
 * It veirfy OTP from user
 * @param {object} req
 * Request object
 * @param {object} res
 * Response object
 * @param {function} next
 * Function to call next request handler
 */
exports.verifyOTP = (req, res, next) => {
    // console.log("User: " + JSON.stringify(req.jwt));
    // console.log("Body: " + JSON.stringify(req.body));
    UserModel.findDoc(req.jwt.user.id, "otp")
    .then((user) => {
        // console.log("findByUserId => then " + JSON.stringify(user));
        if(user[0]) {
            // Check OTP
            if(user[0].otp === req.body.otpassword) {
                UserModel.save(req.jwt.user.id, {"otp" : "-"}).then(() => {});
                next();
            } else {
                res.status(200).send({
                    response: "FAIL",
                    msg: "OTP is invalid"
                }).end();
            }
        } else {
            res.status(400).send({ error: "User not found"});
        }
    }).catch((err) => {
        res.status(500).send(err).end();
    });
};
