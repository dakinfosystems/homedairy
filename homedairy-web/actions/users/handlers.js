var UserModel = require("../../models/users");
var SubscribeModel = require("../../models/subscribe");
var UserConfig = require("../../configs/user.config").user;
const { auth } = require("../../configs/auth");
var bcrypt = require("bcrypt");
var Util = require("../../lib/util");
var SmsLib = require("../../lib/sms");


function geneateOtp() {
    let otp = "";
    let length = parseInt(process.env.OTP_LENGTH)

    while(length) {
        otp += Math.floor(Math.random() * 10);
        length--;
    }

    return otp;
}

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
            // generate OTP and save to database
            req.otp = geneateOtp();
            UserModel.save.authData(req.user.id, {
                "refresh_token": refresh_token,
                "otp": req.otp,
                "createdOn": Date.now()
            }).then(() => {
                // console.log("refresh token saved");
                SmsLib.send.otp(req.body.mobile, req.otp, "verification");
                next();
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


function getUsers(req, res) {
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
                from: "Here",
                users: users
            }).end();

            return Promise.resolve({responseSent: true});
        }

        where = getSubscribeConditions(req);
        // console.log("Where: " + JSON.stringify(where));
        
        return SubscribeModel.search.subs(where);
    }).then((result) => {
        // console.log("Here..." +JSON.stringify(result));
        if(!!result.responseSent) {
            return null;
        }
        users[0]["isSubscribed"] = (result.subscriptions.length) ? true: false;

        // console.log("Subscriptions: " + JSON.stringify(result));
        res.status(200)
        .send({
            response: "SUCCESS",
            user: users
        }).end();
    })
    .catch(err => {
        console.log("Users catch: " + JSON.stringify(err));
        res.status(500).send({
            response: "FAILURE",
            msg: "Error occured while getting users",
            code: err.info
            }).end();
    });
}

function verifyUser(req, res) {
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

function resendOtp(req, res) {
    let otp = geneateOtp();
    let now = Date.now();
    UserModel.save.authData(req.jwt.user.id, {
        "opt": otp,
        "createdOn": now
    }).then(() =>{
        SmsLib.send.otp(req.jwt.user.id, otp, "verification");
        res.status(200).send({
            response: "SUCCESS",
            msg: "OTP has been sent to your registerd number."
        })
    })
    .catch((err) => {
        res.status(500).send({
            response: "FAILURE",
            msg: "Error occured while sending OTP"
        }).end();
    });
}

exports.users = {
    get: (req, res) => {
        getUsers(req, res);
    },
    verify: (req, res, next) => {
        verifyUser(req, res);
    },
    resendOtp: (req, res) => {
        resendOtp(req, res)
    }
}

exports.add = {
    seller: (req, res, next) => {
        addUser(req, res, next);
    },
    customer: (req, res, next) => {
        addUser(req, res, next);
    }
}
