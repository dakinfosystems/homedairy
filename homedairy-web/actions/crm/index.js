var AuthMiddleware = require("../../middlewares/auth.middleware");
var CRMMiddleware = require("../../middlewares/crm.middleware");
var PermissionMiddleware = require("../../middlewares/permission.middleware");
var UserConfig = require("../../configs/user.config");
var RequestHandler = require("./handler");

exports.handler = {
    subscribe: [
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CRMMiddleware.check.subscribe.parameter,
        RequestHandler.subscribe
    ],
    unsubscribe: [
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CRMMiddleware.check.unsubscribe.parameter,
        RequestHandler.unsubscribe
    ],
    linkAccount: [
        AuthMiddleware.validTokenNeeded,
    ],
    linkResponse: [
        AuthMiddleware.validTokenNeeded,
    ]
}