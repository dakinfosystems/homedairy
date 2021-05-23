var HelperFn = require("./helper");
var CommonHepler = require("../../lib/common.helper");
var pool = require("../../lib/mysql").pool;
var DateUtil = require("../../lib/native/date");


exports.list = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        let headers = [];
        let data = [];
        let connection;

        pool.getSession().then(session => {
            connection = session;
            // console.log("userModel list where: " + whereInArr);

            let query = session.sql(
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
            let rawresult = CommonHepler.constructResults(headers, data);
            let results = [];
            for(let index in rawresult) {
                let result = HelperFn.scheduleProcedure.fromDBtoParam(rawresult[index]);
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

exports.getTodayEntries = (where) => {
    return new Promise((resolve, reject) => {
        let headers = [];
        let data = [];
        let connection;

        pool.getSession().then(session => {
            connection = session;

            let query = session.sql(
                "CALL getCustomerEntry('" 
                + where.qrCode.eq + "', '" 
                + where.id.eq
                +"');"
            );
            
            return query.execute(results => {
                // console.log("Costomer Entry: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                // console.log("getCustomerEntry Header: " + JSON.stringify(meta, null, 4));
                headers = meta;
            });
        }).then(() => {
            let now = new Date();
            let day = DateUtil.toFormat(now, "dd");
            let date = DateUtil.toFormat(now, "DD");
            let fulldate = DateUtil.toFormat(now, "DD, MMM YYYY");

            /** process data */
            let rawresult = CommonHepler.constructResults(headers, data);
            let results = [];
            for(let index in rawresult) {
                let result = HelperFn.scheduleEntry.fromDBtoParam(rawresult[index]);
                // console.log("Raw: " + JSON.stringify(result));
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
            console.error(JSON.stringify(err))
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}

/**
 * This function is to enter schedule in the table so that customer can get product delivery
 * 
 * @param {object} data data object contains information related to schedule
 * @returns {object} Promise object.
 */
exports.save = (data) => {
    return new Promise((resolve, reject) => {
        let connection
        let affectedRows = 0;

        pool.getSession().then(session => {
            let scheduleTbl;

            connection = session;
            scheduleTbl = session.getSchema(process.env.DB_NAME).getTable("Schedule_Tbl");

            let [cols, values] = CommonHepler.getTableInsert(data, HelperFn.scheduleTable);

            return scheduleTbl.insert(cols).values(values).execute();
        }).then((result) => {
            // console.log("Schedule result: " + JSON.stringify(result));
            affectedRows += result.getAffectedItemsCount();
            resolve({
                "affectedRows": affectedRows
            })
        })
        .catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        })
    })
}

/**
 * This function is to remove schedule in the table so that customer can stop product delivery
 * 
 * @param {string} id id of schedule to be removed
 * @returns {object} Promise object.
 */
 exports.remove = (id) => {
    return new Promise((resolve, reject) => {
        let connection
        let affectedRows = 0;

        pool.getSession().then(session => {
            let scheduleTbl;

            connection = session;
            scheduleTbl = session.getSchema(process.env.DB_NAME).getTable("Schedule_Tbl");

            return scheduleTbl.delete().where("`id` == \"" +id+ "\"").execute();
        }).then((result) => {
            // console.log("Schedule result: " + JSON.stringify(result));
            affectedRows += result.getAffectedItemsCount();
            resolve({
                "affectedRows": affectedRows
            })
        })
        .catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        })
    })
}
