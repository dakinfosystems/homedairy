/**
 * It checks input parameter of entry api
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express next function
 */
exports.checkEntryParamter = function(req, res, next) {
    if (req.body && req.body.entries) {
        // console.log("checkEntryParameter: " +req.body.entries);
        let errors = [];
        try {
            let entries = JSON.parse(req.body.entries);
            req.body.entries = entries;
        } catch (err) {
            console.error("makeEntry parse catch: " +JSON.stringify(err));
            res.status(403).send({
                response: "FAILURE",
                msg: "JSON string is in invalid format"
            }).end();
            return;
        }

        for( let index in req.body.entries) {
            let entry = req.body.entries[index];
            if(!entry.sellerId) {
                errors.push("Seller ID");
                break;
            }
            if(!entry.productId) {
                errors.push("Product ID");
                break;
            }
            if(!entry.productQuantity) {
                errors.push("Product quantity");
                break;
            }
        }

        if(!errors.length) {
            next();
        } else {
            res.status(403).send({
                response: "FAILURE",
                msg: "Required parameters are missing. " +errors.join(", ")
            }).end();
        }
    } else {
        res.status(403).send({
            "status": "FAILURE",
            "error": "Required paramters are missing"
        });
    }
}

/**
 * It checks input parameter of schedule api
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express next function
 */
exports.checkScheduleParameter = function(req, res, next) {
    let errors = [];

    if(!req.body) {
        errors.concate(["Seller", "Product", "Interval", "Quantity"]);
    } else {
        if(!req.body.sellerId) {
            errors.push("Seller");
        }
        if(!req.body.productId) {
            errors.push("Product");
        }
        if(!req.body.interval && !req.body.fixday) {
            errors.push("Interval");
        }
        if(!req.body.productQuantity) {
            errors.push("Quantity");
        }
        if(!req.body.productUnit) {
            errors.push("Unit");
        }
    }

    if (!errors.length) {
        req.body.customerId = req.jwt.user.id;
        next();
    } else {
        res.status(403).send({
            "status": "FAILURE",
            "error": "Required paramters are missing! List: " + errors.join(", ")
        }).end();
    }
}

/**
 * It checks input parameter of unschedule api
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express next function
 */
 exports.checkUnscheduleParameter = function(req, res, next) {
    if (req.body && req.body.scheduleId) {
        next();
    } else {
        res.status(403).send({
            "status": "FAILURE",
            "error": "Required paramters are missing"
        });
    }
}

/**
 * It checks input parameter of scan qr api
 * 
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express next function
 */
 exports.checkscanQRParamter = function(req, res, next) {
    if (req.params && req.params.qrCode) {
        next();
    } else {
        res.status(403).send({
            "status": "FAILURE",
            "error": "Required parameters are missing"
        });
    }
}
