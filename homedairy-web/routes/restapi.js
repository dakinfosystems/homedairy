var express = require('express');
var router = express.Router();

/* POST login. */
router.post('/dologin', function(req, res, next) {
    console.log(JSON.stringify(req.body));

    res.send("OK");
    res.end();
});

module.exports = router;