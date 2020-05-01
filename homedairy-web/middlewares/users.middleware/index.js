var UserModel = require("../../models/users");
var UserConfig = require("../../configs/user.config");
var bcrypt = require("bcrypt");

const saltRounds = 10;

exports.verifyPassword = (req, res, next) => {
    // console.log("verifyPassword");
    UserModel.findByUserId(req.body.userid)
        .then((user) => {
            // console.log("findByUserId => then " + JSON.stringify(user));
            if(!user[0]) {
                res.status(400).send({ error: "User not found"});
            } else {
                // Check password
                var passwordFields = user[0].password.split("$");
                var hashed = Buffer.from(passwordFields[1], "base64").toString();
                if ( bcrypt.compareSync(req.body.password, hashed) ) {
                    req.user = {
                        id: user[0].id,
                        permission: (
                            parseInt(user[0].userType) 
                            | parseInt(user[0].userLevel)
                        ),
                        name: user[0].name
                    }
                    return next();
                } else {
                    return res.status(400).send({error: "Invalid password"});
                }
            }
        });
}

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