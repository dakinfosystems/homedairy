let ScheduleModel = require("../../models/schedule");
let PassbookModel = require("../../models/passbook");
var DateUtil = require("../../lib/native/date");
const { emit } = require("gulp");


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
    let page = 1;
    let limit = 10; 
    let offset = 0;
    let retEntries = [];

    if(req.query && req.query._page) {
        page = req.query._page;
    }

    if(page > 0) {
        page = page - 1;
    }

    PassbookModel.list(req.jwt.user.id, page).then((result) => {
        console.log("fetchPassbook result:" + JSON.stringify(result));
    }).catch((err) => {
        console.error("fetchPassbook error: " + JSON.stringify(err));
    });

    offset = limit * page;
    for(let index = 0; index < limit; index++) {
        let loc = offset + index;
        if(loc < (entries.length)) {
            retEntries.push(entries[ loc ]);
        } else {
            break;
        }
    }

    res.status(200).send({
        "thisMonthCount": "12",
        "entries": retEntries
    }).end();
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

    /* requset Schedule model to send resuts based on qrcode and id.*/
    ScheduleModel.getTodayEntries(where).then((scheduleResults) => {
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
 * This function submit the transaction happened between customer and seller
 * 
 * @param {object} req express request
 * @param {object} res express response
 * @param {function} next express next function
 */
exports.makeEntry = (req, res, next) => {
    let data = [];

    // get data and create data to save
    // console.log("makeEntry entries: " + typeof entries);
    for(let index in req.body.entries) {
        let entry = {};
        for(key in req.body.entries[index]) {
            entry[key] = req.body.entries[index][key];
        }

        entry["custId"] = req.jwt.user.id;
        entry["time"] = DateUtil.mysqlNow();
        data.push(entry);
    }
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

var entries = [
    {
        "id": "283bad9832",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "21 Oct 2020, 19:30"
    },
    {
        "id": "283bad6832",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "20 Oct 2020, 20:23"
    },
    {
        "id": "283bad3947",
        "productName": "Milk",
        "productQuantity": "500mL",
        "sellerName": "Chandere",
        "deliveryTime": "19 Oct 2020, 20:02"
    },
    {
        "id": "283bad2847",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "17 Oct 2020, 20:02"
    },
    {
        "id": "283bad2945",
        "productName": "Panner",
        "productQuantity": "500g",
        "sellerName": "Chandere",
        "deliveryTime": "16 Oct 2020, 20:02"
    },
    {
        "id": "283bahil32",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "15 Oct 2020, 19:30"
    },
    {
        "id": "28slfd6832",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "14 Oct 2020, 20:23"
    },
    {
        "id": "283mdd3947",
        "productName": "Milk",
        "productQuantity": "500mL",
        "sellerName": "Chandere",
        "deliveryTime": "12 Oct 2020, 20:02"
    },
    {
        "id": "283smf2207",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "11 Oct 2020, 20:02"
    },
    {
        "id": "223sdk2345",
        "productName": "Panner",
        "productQuantity": "500g",
        "sellerName": "Chandere",
        "deliveryTime": "10 Oct 2020, 20:02"
    },
    {
        "id": "283smd7832",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "09 Oct 2020, 19:30"
    },
    {
        "id": "288dgm1832",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "08 Oct 2020, 20:23"
    },
    {
        "id": "286sdm2947",
        "productName": "Milk",
        "productQuantity": "500mL",
        "sellerName": "Chandere",
        "deliveryTime": "06 Oct 2020, 20:02"
    },
    {
        "id": "280sdk5847",
        "productName": "Milk",
        "productQuantity": "1L",
        "sellerName": "Chandere",
        "deliveryTime": "05 Oct 2020, 20:02"
    },
    {
        "id": "286sdd0945",
        "productName": "Panner",
        "productQuantity": "500g",
        "sellerName": "Chandere",
        "deliveryTime": "04 Oct 2020, 20:02"
    }
];