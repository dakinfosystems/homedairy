var pool = require("../../lib/mysql").pool;
var CommonHelper = require("../../lib/common.helper");
var Helper = require("./helper");

exports.add = (params) => {
    return new Promise((resolve, reject) => {
        var connection;

        pool.getSession().then((session) => {
            connection = session;

            var [cols, values] = CommonHelper.getTableInsert(params, Helper.subsTable);
            var subsTable = connection.getSchema(process.env.DB_NAME).getTable("Subs_Tbl");

            // console.log(JSON.stringify(params));
            return subsTable.insert(cols).values(values).execute();
        }).then((status) => {
            let affectedRows = status.getAffectedItemsCount();

            resolve({
                "affectedRows": affectedRows
            });
        }).catch((err) => {
            // console.error(err);
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
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
            }
            // console.log("userModel list where: " + where);

            var query = session.sql(
                "SELECT * \
                FROM Subs_Tbl " + 
                where);

            return query.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("User Secret query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            let found = data.length? true: false;

            resolve({
                "isSubscribed": found
            });
        }).catch((err) => {
            // console.error(err);
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
}
