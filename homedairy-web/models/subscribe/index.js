var pool = require("../../lib/mysql").pool;
var CommonHelper = require("../../lib/common.helper");
var Helper = require("./helper");


function addAltSubscriber(params) {
    return new Promise((resolve, reject) => {
        var connection;

        pool.getSession().then((session) => {
            connection = session;

            var [cols, values] = CommonHelper.getTableInsert(params, Helper.altSubsTable);
            var table = connection.getSchema(process.env.DB_NAME).getTable(Helper.altSubsTable.getTableName());

            // console.log(JSON.stringify(params));
            return table.insert(cols).values(values).execute();
        }).then((status) => {
            let affectedRows = status.getAffectedItemsCount();

            resolve({
                "affectedRows": affectedRows
            });
        }).catch((err) => {
            console.error("SubscribeModel add catch: " +JSON.stringify(err));
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}

function addSubscriber(params) {
    return new Promise((resolve, reject) => {
        var connection;

        pool.getSession().then((session) => {
            connection = session;

            var [cols, values] = CommonHelper.getTableInsert(params, Helper.subsTable);
            var subsTable = connection.getSchema(process.env.DB_NAME).getTable(Helper.subsTable.getTableName());

            // console.log(JSON.stringify(params));
            return subsTable.insert(cols).values(values).execute();
        }).then((status) => {
            let affectedRows = status.getAffectedItemsCount();

            resolve({
                "affectedRows": affectedRows
            });
        }).catch((err) => {
            console.error("SubscribeModel add catch: " +JSON.stringify(err));
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}

exports.add = {
    subs: addSubscriber,
    altSubs: addAltSubscriber
}
exports.search = (jsonWhere) => {
    return new Promise((resolve, reject) => {
        var connection;
        var data = [];

        pool.getSession().then((session) => {
            connection = session;

            let where = "";

            try {
                let whereInArr = Helper.subsTable.constructWhere(jsonWhere);
                where = Helper.whereToString(whereInArr);
            } catch (ex) {
                reject(ex);
                return;
            }
            // console.log("userModel list where: " + where);

            var query = session.sql(
                "SELECT * \
                FROM " +Helper.subsTable.getTableName()+ " " 
                +where );

            return query.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("User Secret query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            let rawResults = CommonHelper.constructResults(headers, data);
            let results = [];

            for(let index in rawResults) {
                let row = Helper.subsTable.fromDBtoParam(rawResults[index]);

                results.push(row);
            }
            resolve({
                "subscriptions": results
            });
        }).catch((err) => {
            console.error(err);
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}

exports.remove = (conditions) => {
    return new Promise((resolve, reject) => {
        let connection;

        pool.getSession().then((session) => {
            let where = "";
            let table;

            connection = session;
            
            try {
                let conditionArr = Helper.subsTable.constructWhere(conditions, true);
                where = Helper.whereToString(conditionArr);
            } catch (err) {
                reject(err);
                return;
            }
            // console.log("Subscribe remove query: " +where);
            table = session.getSchema(process.env.DB_NAME).getTable(Helper.subsTable.getTableName());

            return table.delete().where(where).execute();
        }).then((status) => {
            // Check: why there is not output
            // console.log("Subscibe remove result: " +JSON.stringify(status.getAffectedItemsCount));
            resolve({
                "affectedRows": 1
            });
        })
        .catch((err) => {
            // console.error("Subscribe remove catch: " +JSON.stringify(err));
            reject(err);
        });
    });
}
