var RequestHandler = require("./handlers");
var AuthMiddleware = require("../../middlewares/auth.middleware");
var PermissionMiddleware = require("../../middlewares/permission.middleware");
var UserConfig = require("../../configs/user.config");

function printMiddlerware(req, res, next) {
    // console.log(JSON.stringify(req.headers));
    next();
}

exports.handler = {
    fetchSchedules: [
        printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        //CRMMiddleware.check.subscribe.parameter,
        RequestHandler.fetchSchedule
    ],
    fetchPassbook: [
        printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        //CRMMiddleware.check.subscribe.parameter,
        RequestHandler.fetchPassbook
    ],
    scanQR: [
        printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        RequestHandler.scanQR
    ]
}