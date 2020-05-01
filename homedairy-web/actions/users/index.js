var AuthMiddleware = require("../../middlewares/auth.middleware");
var Handlers = require("./handlers");
var UserMiddleware = require("../../middlewares/users.middleware");

exports.handler = {
    getUser: [
        AuthMiddleware.validTokenNeeded,
        UserMiddleware.searchFilterNeeded(false),
        Handlers.users.get
    ],
    addUser: [
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        Handlers.users.add
    ]
}