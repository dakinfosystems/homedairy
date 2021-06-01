var express = require('express');
var router = express.Router();

var AuthorizationAction = require("../actions/authorization");
var UserAction = require("../actions/users");
var CustomerAction = require("../actions/customers");
var CRMAction = require("../actions/crm");

/* POST Methods */
/* Let user login */
router.post("/dologin", AuthorizationAction.handler.login);
/* let refresh token of already logged in user */
router.post("/refreshtoken", AuthorizationAction.handler.refreshToken);
/* User will verify its single existence */
router.post("/verifyUser", UserAction.handler.verify);

/**
 *  Customer apis starts
 */
/* Let the customer or the consumer signup */
router.post("/customer/signup", UserAction.handler.addCustomer);
/* let the consumer subscirbe to the producer */
router.post("/subscribe", CRMAction.handler.subscribe);
/* let the customer unsubscribe to the producer */
router.post("/unsubscribe", CRMAction.handler.unsubscribe);
/* let two consumer link thier account togetheer */ // TODO: to be implemented
router.post("/linkAccount", CRMAction.handler.linkAccount);
/* */ // TODO: I dont know what it is  to be implemented
router.post("/linkAccount/:response", CRMAction.handler.linkResponse);
/* let user submit a transaction happened today */
router.post("/submitTransaction", CustomerAction.handler.makeEntry);
/* let user make schedule a product */
router.post("/scheduleIt", CustomerAction.handler.scheduleIt);
/* let user make unschedule a product */
router.post("/unscheduleIt", CustomerAction.handler.unScheduleIt);
/* GET Methods */
/* Let user search for other user but opposite type */
router.get("/get/users", UserAction.handler.getUser);
/* let user fetch details of one user */
router.get("/get/users/:userid", UserAction.handler.getUser);
/* let user fetch schedules */
router.get("/get/schedules", CustomerAction.handler.fetchSchedules);
/* let user fetch their passbook of enteries */
router.get("/get/passbook", CustomerAction.handler.fetchPassbook);
/* let user fetch their passbook of enteries */
router.get("/get/passbook/:type", CustomerAction.handler.fetchPassbook);
/* let user get it todays entried by scanning QR */
router.get("/scan/:qrCode", CustomerAction.handler.scanQR);
/* Customer apis ends */

/**
 * Seller Api starts
 */
/* let the seller sign up to serve */
router.post("/seller/signup", UserAction.handler.addSeller);

module.exports = router;
