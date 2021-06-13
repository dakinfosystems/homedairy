var AuthMiddleware = require("../../middlewares/auth.middleware");
var AutherizationHandler = require("../authorization/handlers")
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
        RequestHandler.add.customer,
        AutherizationHandler.login
    ],
    addSeller: [
        UserMiddleware.addSellerUserType(),
        UserMiddleware.checkSignUpParamter,
        UserMiddleware.encryptPassword,
        RequestHandler.add.seller,
        AutherizationHandler.login
    ],
    verify: [
        AuthMiddleware.validTokenNeeded,
        AuthMiddleware.hasVaild.verifyFields,
        UserMiddleware.verifyOTP,
        RequestHandler.users.verify
    ],
    resendOtp: [
        AuthMiddleware.validTokenNeeded,
        RequestHandler.users.resendOtp
    ]
}