var AuthMiddleware = require("../../middlewares/auth.middleware");
var RequestHandler = require("./handlers");
var UserMiddleware = require("../../middlewares/users.middleware");


// TODO: Complete signup flow
exports.handler = {
    getUser: [
        AuthMiddleware.validTokenNeeded,
        UserMiddleware.searchFilterNeeded(false),
        RequestHandler.users.get
    ],
    addCustomer: [
        UserMiddleware.addCustomerUserType(),
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        RequestHandler.users.add
    ],
    addSeller: [
        UserMiddleware.addSellerUserType(),
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        RequestHandler.users.add
    ],
    verify: [
        AuthMiddleware.validTokenNeeded,
        AuthMiddleware.hasVaild.verifyFields,
        UserMiddleware.verifyOTP,
        RequestHandler.users.verify
    ]
}