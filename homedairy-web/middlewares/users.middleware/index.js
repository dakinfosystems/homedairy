var UserModel = require("../../models/users");
var UserConfig = require("../../configs/user.config");
var bcrypt = require("bcrypt");

exports.verifyPassword = (req, res, next) => {
    // console.log("verifyPassword");
    UserModel.findByUserId(req.body.userid)
        .then((user) => {
            // console.log("findByUserId => then " + JSON.stringify(user));
            if(!user[0]) {
                res.status(400).send({ error: "User not found"});
            } else {
                // Check password
                var passwordFields = user[0].authstring.split("$");
                var hashed = Buffer.from(passwordFields[1], "base64").toString();
                if ( bcrypt.compareSync(req.body.password, hashed) ) {
                    req.user = {
                        id: user[0].userid,
                        permission: ((user[0].type) | (user[0].level)),
                        name: user[0].name
                    }
                    return next();
                } else {
                    return res.status(400).send({error: "Invalid password"});
                }
            }
        });
}

exports.searchFilterNeeded = (req, res, next) => {
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

    if(req.params) {
        for (let field in req.params) {
            req.filter[field] = req.params[field];
        }
    }

    if(req.query) {
        for (let field in req.query) {
            req.filter[field] = req.query[field];
        }
    }
    next();
}