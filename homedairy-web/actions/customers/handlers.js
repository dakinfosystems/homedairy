let ScheduleModel = require("../../models/schedule");
let PassbookModel = require("../../models/passbook");
let UserModel = require("../../models/users");


exports.fetchSchedule = (req, res, next) => {
    let page = 1;
    // let limit = 10; 
    // let offset = 0;
    let retValues = [];

    if(req.query && req.query._page) {
        page = req.query._page;
    }

    if(page > 0) {
        page = page - 1;
    } else {
        page = 0;
    }

    ScheduleModel.list(req.jwt.user.id, page).then((result) => {
        console.log("Schedule result: " + JSON.stringify(result));
        res.status(200).send({
            "schedules": result
        }).end();
    }). catch((err) => {
        console.log("Schedule error: " + JSON.stringify(err));
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
    } else {
        page = 0;
    }

    PassbookModel.list(req.jwt.user.id, page).then((result) => {
        console.log("fetchPassbook result:" + JSON.stringify(result));
    }).catch((err) => {
        console.log("fetchPassbook error: " + JSON.stringify(err));
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

exports.scanQR = (req, res, next) => {
    let where = {
        "qrCode": {
            "eq": req.params.qrCode
        },
        "id": {
            "eq": req.jwt.user.id
        }
    };
    ScheduleModel.getEntry(where).then((result) => {
        // console.log(JSON.stringify(result));
        res.status(200).send({
            "entries": result
        }).end();
    }).catch((err) => {
        // console.log("" + JSON.stringify(err));
        res.status(401).send({
            "response": "FAILURE",
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