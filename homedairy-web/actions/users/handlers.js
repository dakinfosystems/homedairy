var UserController = require("../../controllers/user")

exports.users = {
    get: (req, res) => {
        UserController.list(req.filter).then((users) => {
            res.status(200)
                .send(users)
                .end();
        })
    }
}