var express = require('express');
var router = express.Router();

var AuthorizationAction = require("../actions/authorization");
var UserAction = require("../actions/users");

/* POST login. */
router.post('/dologin', AuthorizationAction.handler.login);

router.get("/get/users", UserAction.handler.getUser);
router.get("/get/users/:id", UserAction.handler.getUser);

module.exports = router;
