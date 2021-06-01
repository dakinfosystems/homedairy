/**
 * CRM middleware
 */
exports.check = {
    subscribe: {
        /**
         * This checks parameter of subscribe call
         * 
         * @param {object} req express request object
         * @param {object} res express response object
         * @param {function} next express next function
         */
        parameter: (req, res, next) => {
            // console.log("Next: " + next);
            if(req.body && req.body.sellerId) {
                next();
            } else {
                res.status(200).send({
                    response: "FAIL",
                    msg: "Seller id is required"
                }).end();
            }
        }
    },
    unsubscribe: {
        /**
         * This checks parameter of unsubscribe call
         * 
         * @param {object} req express request object
         * @param {object} res express response object
         * @param {function} next express next function
         */
         parameter: (req, res, next) => {
            // console.log("Next: " + next);
            if(req.body && req.body.sellerId) {
                next();
            } else {
                res.status(200).send({
                    response: "FAIL",
                    msg: "Seller id is required"
                }).end();
            }
        }
    },
    linkAccount: {
        parameter: () => {
            let errors = [];
            if(req.body && !req.body.custId) {
                errors.push("Customer id is required!");
            }
            if(req.body && !req.body.sellerId) {
                errors.push("Seller id is required!");
            }

            if(0 === errors.length) {
                return next();
            } else {
                res.status(200).send({
                    response: "FAIL",
                    msg: errors.join(" ")
                }).end();
            }
        }
    }
}
