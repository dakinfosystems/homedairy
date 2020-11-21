var UserMiddleware = require("../../middlewares/users.middleware");
var RequestHandler = require("./handlers");
var AuthMiddleware = require("../../middlewares/auth.middleware");

exports.handler = {
    login: [
        AuthMiddleware.hasVaild.loginFields,
        UserMiddleware.verifyPassword,
        RequestHandler.login
    ],
    refreshToken: [
        AuthMiddleware.hasVaild.refreshBodyField,
        AuthMiddleware.validateRefreshToken,
        RequestHandler.login
    ]
}
