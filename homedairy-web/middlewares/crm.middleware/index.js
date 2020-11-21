/**
 * CRM middleware
 */
exports.check = {
    subscribe: {
        parameter: (req, res, next) => {
            // console.log("Next: " + next);
            if(req.body.sellerId) {
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
            if(!req.body.custId) {
                errors.push("Customer id is required!");
            }
            if(!req.body.sellerId) {
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
