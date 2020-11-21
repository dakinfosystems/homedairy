let HelperFn = require("./helper");
let CommonHepler = require("../../lib/common.helper");
let pool = require("../../lib/mysql").pool;
let NativeDate = require("../../lib/native/date");

exports.list = (id, pageNo) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        var headers = [];
        var data = [];
        var connection;

        pool.getSession().then(session => {
            let limit = 10;
            connection = session;
            // console.log("userModel list where: " + whereInArr);
            let collection = session.getSchema(process.env.DB_NAME).getCollection("Transaction_Tbl");

            pageNo = pageNo * limit;
            collection = collection.find("_id=:userid").bind("userid", id).offset(pageNo).limit(limit);

            return collection.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                console.log("Passbook query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process data */
            var rawresult = CommonHepler.constructResults(headers, data);
            var results = [];
            for(var index in rawresult) {
                var result = HelperFn.subsTable.fromDBtoParam(rawresult[index]);
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
    return new Promise((resolve, reject) => {
        let connection;
        let now = new Date();

        pool.getSession((session) => {
            let millitimestr = "0000000000000000";
            let entry = {};
            let collection = session.getSchema(process.env.DB_NAME).getCollection("Transaction_Tbl");

            connection = session;
            millitimestr += now.getTime()/process.env.DIVIDEND;
            entry["_id"] = "TRANSAC" + millitimestr.slice(-16);

            for(key of [
                "toId",
                "to",
                "fromId",
                "from",
                "description",
                "time",
                "toType",
                "fromType"
            ]) {
                if(data.hasOwnProperty(key)) {
                    entry[key] = data[key]
                }
            }

            collection.add(entry);
            return collection.execute();
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}