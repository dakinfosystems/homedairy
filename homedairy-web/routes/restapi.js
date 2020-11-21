var express = require('express');
var router = express.Router();

var AuthorizationAction = require("../actions/authorization");
var UserAction = require("../actions/users");
var CustomerAction = require("../actions/customers");
var CRMAction = require("../actions/crm");

/* POST Methods */
/* User login and sign up */
router.post("/dologin", AuthorizationAction.handler.login);
router.post("/refreshtoken", AuthorizationAction.handler.refreshToken);

router.post("/verifyUser", UserAction.handler.verify);
router.post("/customer/signup", UserAction.handler.addCustomer);
router.post("/seller/signup", UserAction.handler.addSeller);

router.post("/subscribe", CRMAction.handler.subscribe);
router.post("/linkAccount", CRMAction.handler.linkAccount);
router.post("/linkAccount/:response", CRMAction.handler.linkResponse);

/* GET Methods */
router.get("/get/users", UserAction.handler.getUser);
router.get("/get/users/:userid", UserAction.handler.getUser);
router.get("/get/schedules", CustomerAction.handler.fetchSchedules);
router.get("/get/passbook", CustomerAction.handler.fetchPassbook);
router.get("scan/:qrCode", CustomerAction.handler.scanQR);

module.exports = router;
