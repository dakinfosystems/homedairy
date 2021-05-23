var RequestHandler = require("./handlers");
var AuthMiddleware = require("../../middlewares/auth.middleware");
var PermissionMiddleware = require("../../middlewares/permission.middleware");
var CustomerActionMiddleware = require("../../middlewares/customerAction.middleware");
var UserConfig = require("../../configs/user.config");

function printMiddlerware(req, res, next) {
    console.log(JSON.stringify(req.headers));
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.params));
    console.log(JSON.stringify(req.query));
    next();
}

exports.handler = {
    fetchSchedules: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        //CRMMiddleware.check.subscribe.parameter,
        RequestHandler.fetchSchedule
    ],
    fetchPassbook: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        //CRMMiddleware.check.subscribe.parameter,
        RequestHandler.fetchPassbook
    ],
    scanQR: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CustomerActionMiddleware.checkscanQRParamter,
        RequestHandler.scanQR
    ],
    makeEntry: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CustomerActionMiddleware.checkEntryParamter,
        RequestHandler.makeEntry
    ],
    scheduleIt: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CustomerActionMiddleware.checkScheduleParameter,
        RequestHandler.schedule
    ],
    unScheduleIt: [
        // printMiddlerware,
        AuthMiddleware.validTokenNeeded,
        PermissionMiddleware.onlyUserTypeRequired(UserConfig.user.type.CUSTOMER),
        CustomerActionMiddleware.checkUnscheduleParameter,
        RequestHandler.unSchedule
    ],
}