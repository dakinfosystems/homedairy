let ScheduleModel = require("../../models/schedule");
let PassbookModel = require("../../models/passbook");
let SubscribeModel = require("../../models/subscribe");
let DateUtil = require("../../lib/native/date");
let ProductModel = require("../../models/product");


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUnpaidTransaction(req, res) {
    let page = 1;

    if(req.query && req.query._page) {
        page = req.query._page;
        countFlag = false;
    }

    if(page > 0) {
        page = page - 1;
    }
    // Start from here
    PassbookModel.getUnpaidEntries(req.jwt.user.id, page).then((result) => {
        res.status(200).send({
            "response": "SUCCESS",
            "entries": result
        }).end();
    })
    .catch((err) => {
        console.error("getUnpaidTransaction error: " + JSON.stringify(err));
        res.status(500).send({
            "response": "FAILURE",
            "msg": "Some error has occurred while retrieving."
        }).end();
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
 function getPaidTransaction(req, res) {
    let page = 1;

    if(req.query && req.query._page) {
        page = req.query._page;
        countFlag = false;
    }

    if(page > 0) {
        page = page - 1;
    }
    // Start from here
    PassbookModel.getPaidEntries(req.jwt.user.id, page).then((result) => {
        res.status(200).send({
            "response": "SUCCESS",
            "entries": result
        }).end();
    })
    .catch((err) => {
        console.error("getPaidTransaction error: " + JSON.stringify(err));
        res.status(500).send({
            "response": "FAILURE",
            "msg": "Some error has occurred while retrieving."
        }).end();
    });
}

/**
 * This function is final function to be called in the chain of schedule it 
 * request.
 * 
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next function
 */
exports.schedule = (req, res, next) => {
    let epochstr = "0000000000000000";

    epochstr += DateUtil.getEpochStr();
    req.body.id = "schedule" + epochstr.slice(-16);
    
    ScheduleModel.save(req.body).then((result) => {
        res.status(200).send({
            "response": "SUCCESS",
            "msg": "Scheduled " +result.affectedRows+ " of your request!"
        }).end();
    }).catch((err) => {
        console.error("Customer schedule catch: " +JSON.stringify(err));
        res.status(500).send({
            "response": "FAILURE",
            "msg": "Error occured while storing",
            "code": err.info.code
        }).end();
    })
};

/**
 * This function is final function to be called in the chain of unschedule it 
 * request.
 * 
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next function
 */
 exports.unSchedule = (req, res, next) => {    
    ScheduleModel.remove(req.body.scheduleId).then((result) => {
        res.status(200).send({
            "response": "SUCCESS",
            "msg": "Unscheduled " +result.affectedRows+ " of your request!"
        }).end();
    }).catch((err) => {
        res.status(500).send({
            "response": "FAILURE",
            "msg": "Error occured while deleting",
            "code": err.info.code
        }).end();
    })
};

/**
 * This function is final function to be called in the chain of fetching schedule
 * 
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next function
 */
exports.fetchSchedule = (req, res, next) => {
    let page = 1;

    if(req.query && req.query._page) {
        page = req.query._page;
    }

    if(page > 0) {
        page = page - 1;
    }

    ScheduleModel.list(req.jwt.user.id, page).then((result) => {
        // console.log("Schedule result: " + JSON.stringify(result));
        res.status(200).send({
            response: "SUCCESS",
            "schedules": result
        }).end();
    }). catch((err) => {
        console.error("Schedule error: " + JSON.stringify(err));
        res.status(500).send({
            response: "FAILURE",
            msg: "Error occured while getting users",
            code: err.info.code
        }).end();
    });
}

exports.fetchPassbook = (req, res, next) => {
    let unpaidEntries = [];

    if(req.query && req.query._page) {
        if (req.params && req.params.type && "unpaid" == req.params.type) {
            getUnpaidTransaction(req, res);
        } else if(req.params && req.params.type && "paid" === req.params.type) {
            getPaidTransaction(req, res);
        } else {
            res.status(403).send({
                "response": "FAILURE",
                "msg": "Missing type of transaction"
            }).end();
        }
        return;
    }

    PassbookModel.getUnpaidEntries(req.jwt.user.id, 0).then((result) => {
        unpaidEntries = [].concat(result);
        PassbookModel.getUnpaidCountOf(req.jwt.user.id).then((unpaidEntry) => {
            // console.log("fetchPassbook count:" +typeof unpaidCount);
            // console.log("fetchPassbook result:" +JSON.stringify(result));
            res.status(200).send({
                "response": "SUCCESS",
                "thisMonthCount": unpaidEntry.count,
                "entries": unpaidEntries
            }).end();
        });
    })
    .catch((err) => {
        console.error("fetchPassbook error: " + JSON.stringify(err));
        res.status(500).send({
            "response": "FAILURE",
            "msg": "Some error has occurred while retrieving."
        }).end();
    });
}

/**
 * This function checks qrcode and id of user who has requested. And sends the 
 * response based in inputs.
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next function} next 
 */
exports.scanQR = (req, res, next) => {
    let scheduleResult = [];
    let where = {
        "qrCode": {
            /* qr code to identify the seller */
            "eq": req.params.qrCode
        },
        "id": {
            /* id of the user who has requested the enteries */
            "eq": req.jwt.user.id
        }
    };

    /* Check if it is altnate number by getting details of customer id */
    SubscribeModel.search.altSubs({'altCustId': { "eq": req.jwt.user.id }}).then((resultset) => {
        if(0 != resultset.subscriptions.length) {
            where.id.eq = resultset.subscriptions[0].custId;
        }
        /* requset Schedule model to send resuts based on qrcode and id.*/
        return ScheduleModel.getTodayEntries(where);    
    }).then((scheduleResults) => {
        // console.log(JSON.stringify(scheduleResults));
        // get today transaction then compare and send
        scheduleResult= [].concat(scheduleResults);
        return PassbookModel.getTodaysTransactionOf(where.id.eq)

    }).then((passbookResults) => {
        let finalResult = [];
        // console.log("Passbook: " + JSON.stringify(passbookResults));
        // console.log("Schedule: " + JSON.stringify(scheduleResult));
        // remove entries which are already registered
        for(let sindex in scheduleResult) {
            let found = false;
            for (let tindex in passbookResults) {
                if(passbookResults[tindex]["scheduleId"] === scheduleResult[sindex]["scheduleId"]) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                finalResult.push(scheduleResult[sindex]);
            }
        }

        res.status(200).send({
            "response": "SUCCESS",
            "entries": finalResult
        }).end();
    }).catch((err) => {
        // console.error("" + JSON.stringify(err));
        res.status(401).send({
            "response": "FAILURE",
            "code": err.info.code
        }).end();
    });
}

/**
 * This function just save the data
 * @param {object} res express response
 * @param {object} data all entries from user 
 */
function savePassbookEntry(res, data) {
    // Send data to Passbook model
    PassbookModel.save(data).then((results) => {
        // console.log("make entry then: " + results);
        res.status(200).send({
            "response": "SUCCESS",
        }).end();
    }).catch((err) => {
        console.error("make entry catch: " + err);
        res.status(401).send({
            "response": "FAILURE",
            "msg": "Error occurred while making entry",
            "code": err.info.code
        }).end();
    });
}

function getUnitList(conditions) {
    return ProductModel.unit.list(conditions);
}

function getProductPrice(conditions) {
    return ProductModel.product.price(conditions);
}

/**
 * This function submit the transaction happened between customer and seller
 * 
 * @param {object} req express request
 * @param {object} res express response
 * @param {function} next express next function
 */
exports.makeEntry = (req, res, next) => {
    let data = [];
    let unitDataset;
    let unitWhere = {
        "fromUnit": {
            "in": []
        }
    };
    let productWhere = {
        "id": {
            "in": []
        }
    }

    SubscribeModel.search.altSubs({ 
        "altCustId": { "eq": req.jwt.user.id }
    }).then((resultset) => {
        // Extract all unit of entries amd product's base unit and price
        for(let index in req.body.entries) {
            let unit = req.body.entries[index]["productUnit"]
            let productId = req.body.entries[index]["productId"]
            let entry = {};

            for(key in req.body.entries[index]) {
                entry[key] = req.body.entries[index][key];
            }

            entry["custId"] = (resultset.subscriptions.length) ?
                resultset.subscriptions[0].custId :
                req.jwt.user.id;
            entry["time"] = DateUtil.mysqlNow();
            data.push(entry);
            // console.log("Product makeEntry data: " +JSON.stringify(data));

            unitWhere["fromUnit"]["in"].push("\"" +unit+ "\"");
            productWhere["id"]["in"].push("\"" +productId+ "\"");
            // console.log("Product makeEntry unitWhere: " +JSON.stringify(unitWhere));
            // console.log("Product makeEntry productWhere: " +JSON.stringify(productWhere));
        }
        // Get unit conversion from table
        return getUnitList(unitWhere)
    })
    .then((resultset) => {
        unitDataset = resultset;
        // console.log("Product makeEntry units: " +JSON.stringify(unitDataset));
        // get product price
        return getProductPrice(productWhere);
    }).then((resultset) => {
        // console.log("Customer makeEntry price: " +JSON.stringify(resultset));
        // Calculate price of product taken create data to save
        for(let index in data) {
            let product;
            let unit;

            for(let index2 in resultset) {
                if(data[index]["productId"] == resultset[index2]["id"]) {
                    product = resultset[index2];
                    if(product["baseUnit"] == data[index]["productUnit"]) {
                        data[index]["productPrice"] = 
                            (parseInt(data[index]["productQuantity"])
                            * product["costPerUnit"]);
                    }
                    break;
                }
            }

            if(data[index]["productPrice"]) {
                // console.log("Customer makeEntry price: " +data[index]["productPrice"]);
                continue;
            }

            for(let index2 in unitDataset) {
                if(data[index]["productUnit"] == unitDataset[index2]["fromUnit"]
                    && product["baseUnit"] == unitDataset[index2]["toUnit"]) {

                    unit = unitDataset[index2];
                    break;
                }
            }

            data[index]["productPrice"] = (parseInt(data[index]["productQuantity"])
             * unit["multiplicand"] / unit["denominator"])
             * product["costPerUnit"];

            // console.log("Customer makeEntry price: " +data[index]["productPrice"]);
        }
        savePassbookEntry(res, data);
    })
    .catch((err) => {
        console.error("Product makeEntry catch: " +JSON.stringify(err));
        res.status(500).send({
            response: "FAILURE",
            msg: "Couldn't process due to internal error."
        }).end();
    })
}
