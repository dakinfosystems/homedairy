SubscribeModel = require("../../models/subscribe");

exports.subscribe = (req, res, next) => {
    let param = {
        custId: req.jwt.user.id,
        sellerId: req.body.sellerId
    }

    SubscribeModel.add(param).then((status) => {
        // console.log("Status: " + status);
        res.status(200).send({
            response: "SUCCESS",
            msg: "You subscribed to Seller"
        }).end();
    }).catch((error) => {
        // console.log("Error: " + JSON.stringify(error));
        let details = "";
        if(error.info.code === 1062) {
            details = "Already subscribed"
        }
        res.status(200).send({
            response: "FAILURE",
            msg: details === "" ? "Error while subscribing!" : details,
            code: error.code
        }).end();
    });
}
