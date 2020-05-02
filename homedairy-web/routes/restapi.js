var express = require('express');
var router = express.Router();

var AuthorizationAction = require("../actions/authorization");
var UserAction = require("../actions/users");

/* POST Methods */
/* User login and sign up */
router.post("/dologin", AuthorizationAction.handler.login);
router.post("/customer/signup", UserAction.handler.addCustomer);
router.post("/seller/signup", UserAction.handler.addSeller);


/* GET Methods */
router.get("/get/users", UserAction.handler.getUser);
router.get("/get/users/:userid", UserAction.handler.getUser);

module.exports = router;
