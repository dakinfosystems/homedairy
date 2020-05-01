var UserController = require("../../controllers/user")

exports.users = {
    get: (req, res) => {
        UserController.list(req.filter).then((users) => {
            res.status(200)
                .send(users)
                .end();
        }).catch(err => {
            res.status(500).send({ }).end();
        });
    },

    add: (req, res, next) => {
        req.body.id = req.body.mobile;
        
        UserController.add(req.body)
        .then((results) => {
            // console.log("In then of Add handler := "  + results);
            if (results.length || results !== {}) {
                res.status(200).send(results).end();
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
    }
}