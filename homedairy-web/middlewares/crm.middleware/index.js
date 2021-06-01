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
                    response: "FAILURE",
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
                    response: "FAILURE",
                    msg: "Seller id is required"
                }).end();
            }
        }
    },
    linkAccount: {
        parameter: (req, res, next) => {
            let errors = [];
            if(req.body && !req.body.altCustId) {
                errors.push("Customer Id");
            }
            if(req.body && !req.body.sellerId) {
                errors.push("Seller Id required");
            }

            if(0 === errors.length) {
                next();
            } else {
                res.status(200).send({
                    response: "FAILURE",
                    msg: "Required missing parameters: " +errors.join(" ")
                }).end();
            }
        }
    }
}
