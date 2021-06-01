let SubscribeModel = require("../../models/subscribe");

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

exports.unsubscribe = (req, res, next) => {
    let conditions = {
        "custId": {
            "eq": req.jwt.user.id
        },
        "sellerId": {
            "eq": req.body.sellerId
        }
    };

    SubscribeModel.remove(conditions).then((status) => {
        // console.log("Subcribe remove status: " +JSON.stringify(status));
        res.status(200).send({
            "response": "SUCCESS",
            "numOfDeletedRecord": status.affectedRows
        }).end();
    })
    .catch((err) => {
        console.error("Subscribe remove error: " +JSON.stringify(err));
        res.status(500).send({
            "response": "FAILURE",
            "msg": err
        }).end();
    });
}

exports.linkIt = (req, res, next) => {
    let record = {
        "altCustId": req.body.altCustId,
        "custId": req.jwt.user.id,
        "sellerId": req.body.sellerId
    }
    SubscribeModel.add.altSubs(record).then((status) => {
        res.status(200).send({
            "response": "SUCCESS",
            "numOfRecordsAdded": status.affectedRows
        }).end();
    })
    .catch((err) => {
        console.error("Subscribe linkIt catch: " +JSON.stringify(err));
        res.status(500).send({
            response: "FAILURE",
            msg: ((err.info && err.info.msg)? err.info.msg : "") + " Error while storing information."
        }).end();
    })
}
