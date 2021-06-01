var UserModel = require("../../models/users");
var SubscribeModel = require("../../models/subscribe");
// var AutherizationController = require("../authorization");
var AutherizationHandler = require("../authorization/handlers")
var UserConfig = require("../../configs/user.config").user;
const { auth } = require("../../configs/auth");
var bcrypt = require("bcrypt");
var Util = require("../../lib/util");
const { addSellerUserType } = require("../../middlewares/users.middleware");


function addUser(req, res, next) {
    req.body.userid = req.body.mobile;
    req.body.qrCode = Util.genRandomString(16, "0Aa");
    
    UserModel.add(req.body).then((results) => {
        // console.log("In then of Add handler := "  + (results !== {}));
        if (results.length || results !== {}) {
            var salt = bcrypt.genSaltSync(10);
            var refresh_token = Buffer.from(
                bcrypt.hashSync(req.body.userid + auth.key, salt)
            ).toString("base64");
            
            req.user = {
                "name": req.body.name,
                "id": req.body.userid,
                "permission": (
                    parseInt(req.body.userType) 
                    | parseInt(req.body.userLevel)
                ),
                "refresh_token": refresh_token
            };

            // console.log("req.user: "  + JSON.stringify(req.user) + "\n" + refresh_token);
            UserModel.save(req.user.id, {
                "refresh_token": refresh_token
            }).then(() => {
                // console.log("refresh token saved");
                AutherizationHandler.login(req, res);
            }).catch((err) => {
                // console.error("catch of save req.user: "  + JSON.stringify(req.user));
                res.status(400).send({
                    response: "FAILURE",
                    msg: "User added but cannot login."
                }).end();
            });
        } else {
            // console.error("else req.user: "  + JSON.stringify(req.user));
            res.status(400).send({
                response: "FAILURE",
                msg: "No result"
            }).end();
        }
    })
    .catch((err) => {
        // console.error("In catch of Add handler. " + err.info);
        if(err && err.info && err.info.code && 1062 === err.info.code) {
            addUser(req, res, next);
            return;
        }
        res.status(400).send({
            error: err.info
        }).end();
    });
}

function getUserSearchCondition(filters) {
    let where = {};
    for(let attr in filters) {
        switch(attr) {
            case "q":
                where["or"] =  {
                    "name": {
                        "like": "%" + filters[attr] + "%"
                    },
                    "mobile": {
                        "like": filters[attr] + "%",
                    }
                };
                break;
            case "userType":
                where[attr] = {
                    "eq": filters[attr]
                }
                break;
            default:
                where[attr] = {
                    "eq": filters[attr]
                };
        }
    }

    return where;
}

function getSubscribeConditions(req) {
    let where = {};
    if(req.jwt.user.permission & UserConfig.type.SELLER) {
        where = {
            "sellerId": {
                "eq": req.jwt.user.id
            },
            "custId": {
                "eq": req.filter["userid"]
            }
        }
    } else {
        where = {
            "custId": {
                "eq": req.jwt.user.id
            },
            "sellerId": {
                "eq": req.filter["userid"]
            }
        }
    }

    return where;
}

exports.users = {
    get: (req, res) => {
        let where = {};
        let users = [];
        
        // console.log("filters: " + JSON.stringify(req.filter));
        where = getUserSearchCondition(req.filter);

        UserModel.list(where).then((resultset) => {
            let where = {};

            users = resultset;
            // console.log("Users: " + JSON.stringify(users));
            if("q" in req.filter || 0 === users.length) {
                res.status(200)
                    .send({
                        response: "SUCCESS",
                        users: users
                    }).end();
                return;
            }

            where = getSubscribeConditions(req);console.log("Where: " + JSON.stringify(where));
            return SubscribeModel.search(where).then((result) => {
                users[0]["isSubscribed"] = (result.subscriptions.length) ? true: false;
    
                // console.log("Subscriptions: " + JSON.stringify(result));
                res.status(200)
                    .send({
                        response: "SUCCESS",
                        from: "Here",
                        user: users
                    }).end();
            });
        })
        .catch(err => {
            console.log("Users catch: " + JSON.stringify(err));
            res.status(500).send({
                response: "FAILURE",
                msg: "Error occured while getting users",
                code: err.info
             }).end();
        });
    },

    add: (req, res, next) => {
        /* Add user id same as mobile number */
        addSellerUserType(req, res, next);
    },

    verify: (req, res, next) => {
        UserModel.verifyUser({ 
            "userid": {
                "eq": req.jwt.user.id
            }
        }, {
            "isVerified": 1
        }).then((results) => {
            let response = {};
            if(results.afftectedRows) {
                response = {
                    response: "SUCCESS",
                    msg: "User is verified!"
                }
            } else {
                response = {
                    response: "FAILURE",
                    msg: "User is not verified! Due to internal error."
                }
            }
            /* Send response */
            res.status(200).send(response).end();
        });
    }
}
// https://tests.mettl.com/authenticateKey/22aaxh6gw0