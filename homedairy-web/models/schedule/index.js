var HelperFn = require("./helper");
var CommonHepler = require("../../lib/common.helper");
var pool = require("../../lib/mysql").pool;
var DateUtil = require("../../lib/native/date");

exports.list = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        var headers = [];
        var data = [];
        var connection;

        pool.getSession().then(session => {
            connection = session;
            // console.log("userModel list where: " + whereInArr);

            var query = session.sql(
                "CALL getCustomerSchedule(" 
                + id + ", " 
                + ((pageNo === null || pageNo === undefined) ? "null" : pageNo) 
                +");"
            );

            return query.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("User Secret query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process data */
            var rawresult = CommonHepler.constructResults(headers, data);
            var results = [];
            for(var index in rawresult) {
                var result = HelperFn.scheduleTable.fromDBtoParam(rawresult[index]);
                results.push(
                    result
                );
            }

            resolve(results);
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}

exports.getEntry = (where) => {
    return Promise((resolve, reject) => {
        var headers = [];
        var data = [];
        var connection;

        pool.getSession().then(session => {
            connection = session;

            var query = session.sql(
                "CALL getCustomerEntry(" 
                + where.id.eq + ", " 
                + where.qrCode.eq
                +");"
            );

            return query.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("User Secret query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            let now = new Date();
            let day = DateUtil.toFormat(now, "dd");
            let date = DateUtil.toFormat(now, "DD");
            let fulldate = DateUtil.toFormat(now, "DD, MMM YYYY");

            /** process data */
            var rawresult = CommonHepler.constructResults(headers, data);
            var results = [];
            for(var index in rawresult) {
                var result = HelperFn.scheduleEntry.fromDBtoParam(rawresult[index]);
                if(result.occurrence === day 
                    || result.occurrence === date 
                    || result.occurrence === fulldate 
                    || result.occurrence === "Everyday") 
                {
                    results.push(result);
                }
            }

            resolve(results);
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}