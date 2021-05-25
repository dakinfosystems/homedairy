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
    let unpaidEntries = [];
    let countFlag = true;

    if(req.query && req.query._page) {
        page = req.query._page;
        countFlag = false;
    }

    if(page > 0) {
        page = page - 1;
    }

    PassbookModel.getUnpaidEntries(req.jwt.user.id, page).then((result) => {
        if(countFlag) {
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
        } else {
            res.status(200).send({
                "response": "SUCCESS",
                "entries": result
            }).end();
        }
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
