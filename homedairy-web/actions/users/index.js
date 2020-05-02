var AuthMiddleware = require("../../middlewares/auth.middleware");
var Handlers = require("./handlers");
var UserMiddleware = require("../../middlewares/users.middleware");

exports.handler = {
    getUser: [
        AuthMiddleware.validTokenNeeded,
        UserMiddleware.searchFilterNeeded(false),
        Handlers.users.get
    ],
    addCustomer: [
        UserMiddleware.addCustomerUserType(),
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        Handlers.users.add
    ],
    addSeller: [
        UserMiddleware.addSellerUserType(),
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        Handlers.users.add
    ]
}