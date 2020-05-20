var UserModel = require("../../models/users");
var AutherizationController = require("../authorization");

exports.users = {
    get: (req, res) => {
        let filters = req.filter;
        let where = {};
        
        // console.log("filters: " + JSON.stringify(filters));
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
                    break;
            }
        }

        UserModel.list(where).then((users) => {
            res.status(200)
                .send(users)
                .end();
        }).catch(err => {
            res.status(500).send({ }).end();
        });
    },

    add: (req, res, next) => {
        /* Add user id same as mobile number */
        req.body.userid = req.body.mobile;
        
        UserModel.add(req.body)
        .then((results) => {
            // console.log("In then of Add handler := "  + results);
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
                }

                UserModel.save(req.user.id, {"refresh_token": refresh_token}).then(() => {
                    AutherizationController.handler.login(req, res);
                });
                // res.status(200).send(results).end();
            } else {
                res.status(400).send({
                    error: "No result"
                }).end();
            }
        })
        .catch((err) => {
            // console.log("In catch of Add handler");
            res.status(400).send({
                error: err.info
            }).end();
        });
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
                    status: "SUCCESS",
                    msg: "User is verified!"
                }
            } else {
                response = {
                    status: "FAIL",
                    msg: "User is not verified! Due to internal error."
                }
            }
            /* Send response */
            res.status(200).send(response).end();
        });
    }
}
