let HelperFn = require("./helper");
let CommonHepler = require("../../lib/common.helper");
let pool = require("../../lib/mysql").pool;
let DateUtil = require("../../lib/native/date")

let globalValue = 0;

exports.list = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        let headers = [];
        let data = [];
        let connection;

        pool.getSession().then(session => {
            let limit = 10;
            connection = session;
            // console.log("userModel list where: " + whereInArr);
            let table = session.getSchema(process.env.DB_NAME).gettable("Transaction_Tbl");

            pageNo = pageNo * limit;
            table = table.find("_id=:userid").bind("userid", id).offset(pageNo).limit(limit);

            return table.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                console.log("Passbook query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process data */
            let rawresult = CommonHepler.constructResults(headers, data);
            let results = [];
            for(let index in rawresult) {
                let result = HelperFn.transactionTable.fromDBtoParam(rawresult[index]);
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

exports.save= (data) => {
    // console.log("Passbook data: " +JSON.stringify(data));
    return new Promise((resolve, reject) => {
        let connection;
        let millicount = 0;

        pool.getSession().then((session) => {
            let insertCalled = false;

            connection = session;

            let table = session.getSchema(process.env.DB_NAME).getTable("Transaction_Tbl");
            for(let index in data) {
                // let [col, values] = {};
                let millitimestr = "0000000000000000" + DateUtil.getEpochStr();
                
                /* Looking for entry which has similar time */
                if(globalValue === millitimestr) {
                    millicount += 1;
                } else {
                    millicount = 0;
                }
                
                data[index]["id"] = "TRANSAC" + millitimestr.slice(-16) + ("000"+millicount).slice(-3);
                globalValue = millitimestr;

                data[index]["productQuantity"] = parseInt(data[index]["productQuantity"]);

                let [col, values] = CommonHepler.getTableInsert(data[index], HelperFn.transactionTable)
                // console.log("Passbook columns: " +col+ "\nvalues: " +values);
                
                if(!insertCalled) {
                    table = table.insert(col);
                    insertCalled = true;
                }

                table = table.values(values);
            }

            return table.execute();
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            console.error("Passbook save err:" +JSON.stringify(err));
            if(!err.info) {
                err.info = {};
                err.info.code = "FF";
            }
            reject(err)
        }).finally(() => {
            connection.close();
        });
    })
}

/**
 * This function retrieves todays entries made by user
 * 
 * @param {*} customerId 
 * @param {*} sellerid Optional
 * @returns It returns a promise object 
 */
exports.getTodaysTransactionOf = (customerId, sellerid) => {
    return new Promise((resolve, reject) => {
        let connection;
        let headers = [];
        let data = [];

        pool.getSession().then((session) => {
            connection = session;
            let transactionTime = new Date();
            let table = session.getSchema(process.env.DB_NAME).getTable("Transaction_Tbl");

            transactionTime.setHours(0,0,0,0);
            let findstr = "time >= \"" +transactionTime+ "\" and cust_id == \"" +customerId+ "\"";
            if (sellerid) {
                findstr += " and seller_id == \"" +sellerid+ "\"";
            }
            
            return table.select().execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("Passbook getTodayTransaction: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            let rawresult = CommonHepler.constructResults(headers, data);
            let results = [];

            for(let index in rawresult) {
                let result = HelperFn.transactionTable.fromDBtoParam(rawresult[index]);
                results.push(result);
            }

            // console.log("Passbook getTodayTransaction result: " +JSON.stringify(results));
            resolve(results);
        }).catch((err) => {
            // console.error("Passbook getTodayTransaction err: " +JSON.stringify(err));
            if(!err.info) {
                err.info = {};
                err.info.code = "FF";
            }
            reject(err);
        }).finally(() => {
            if (connection)
                connection.close();
        });
    });
}