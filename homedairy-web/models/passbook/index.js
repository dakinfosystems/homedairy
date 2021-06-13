let HelperFn = require("./helper");
let CommonHepler = require("../../lib/common.helper");
let pool = require("../../lib/mysql").pool;
let DateUtil = require("../../lib/native/date");

let globalValue = 0;


/**
 * This functions is to get all paid entries enteries of passbook.
 * 
 * @param {string} id customer id
 * @param {number} pageNo page number of entier which user wants
 * @returns Promise object
 */
 exports.getPaidEntries = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        let headers = [];
        let paidEntries = [];
        let connection;

        pool.getSession().then(session => {
            let limit = 10;
            let conditions = "";            
            let table = session.getSchema(process.env.DB_NAME).getTable("PaidTransaction_View");
            
            connection = session;
            pageNo = pageNo * limit;

            conditions = "`cust_id` == \"" +id+ "\"";
            table = table.select().where(conditions).offset(pageNo).limit(limit);

            // console.log("Passbook getPaidEntries: ");
            return table.execute(row => {
                // console.log("Passbook getPaidEntries: " + JSON.stringify(results, null, 4));
                paidEntries.push(row);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process unpaidEntries */
            let rawresults = CommonHepler.constructResults(headers, paidEntries);
            let results = [];
            for(let index in rawresults) {
                let result = HelperFn.transactionTable.fromDBtoParam(rawresults[index]);
                results.push(
                    result
                );
            }

            resolve(results);
        }).catch((err) => {
            console.error("Passbook getPaidEntries catch: " +JSON.stringify(err));
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}

/**
 * This functions is to get all unpaid entries enteries of passbook.
 * 
 * @param {string} id customer id
 * @param {number} pageNo page number of entier which user wants
 * @returns Promise object
 */
 exports.getUnpaidCountOf = (id) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        let unpaidEntriesCount = [];
        let connection;

        pool.getSession().then(session => {
            let conditions = "";            
            let table = session.getSchema(process.env.DB_NAME).getTable("Transaction_Tbl");
            
            connection = session;

            conditions = "`cust_id` == \"" +id+ "\"";
            table = table.select('count(id)').where(conditions)

            // console.log("Passbook getUnpaidEntries: ");
            return table.execute(row => {
                // console.log("Passbook getUnpaidEntries: " + JSON.stringify(row, null, 4));
                unpaidEntriesCount.push(row[0]);
            });
        }).then(() => {
            /** process unpaidEntries */
            // console.log("getUnpaidCountOf count: " +unpaidEntriesCount[0]);
            resolve({
                count: unpaidEntriesCount[0]
            });
        }).catch((err) => {
            console.error("Passbook getUnpaidEntries catch: " +JSON.stringify(err));
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}

/**
 * This functions is to get all unpaid entries enteries of passbook.
 * 
 * @param {string} id customer id
 * @param {number} pageNo page number of entier which user wants
 * @returns Promise object
 */
exports.getUnpaidEntries = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        let headers = [];
        let unpaidEntries = [];
        let connection;

        pool.getSession().then(session => {
            let limit = 10;
            let conditions = "";            
            let table = session.getSchema(process.env.DB_NAME).getTable("Transaction_Tbl");
            
            connection = session;
            pageNo = pageNo * limit;

            conditions = "`cust_id` == \"" +id+ "\"";
            table = table.select().where(conditions).offset(pageNo).limit(limit);

            // console.log("Passbook getUnpaidEntries: ");
            return table.execute(row => {
                // console.log("Passbook getUnpaidEntries: " + JSON.stringify(results, null, 4));
                unpaidEntries.push(row);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process unpaidEntries */
            let rawresults = CommonHepler.constructResults(headers, unpaidEntries);
            let results = [];
            for(let index in rawresults) {
                let result = HelperFn.transactionTable.fromDBtoParam(rawresults[index]);
                results.push(
                    result
                );
            }

            resolve(results);
        }).catch((err) => {
            console.error("Passbook getUnpaidEntries catch: " +JSON.stringify(err));
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
            let table;
            let findstr = "";
            let transactionTime = new Date();

            connection = session;            
            table = connection.getSchema(process.env.DB_NAME).getTable("Transaction_Tbl");

            transactionTime.setHours(0,0,0,0);
            findstr = "time >= \"" +transactionTime+ "\"";
            if (customerId) {
                findstr += " and cust_id == \"" +customerId+ "\"";
            }
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