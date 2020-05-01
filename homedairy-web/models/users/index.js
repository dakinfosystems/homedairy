var HelperFn = require("./helper");
var pool = require("../../lib/mysql").pool;


function constructResults(headers, data) {
    var results = [];

    for(let xindex in data) {
        let result = {};
        for(let yindex in data[xindex]) {
            result[headers[yindex]["name"]] = data[xindex][yindex];
        }
        // console.log("ConstructResults xindex: " + xindex);
        // console.log("ConstructResults result: " + JSON.stringify(result, null, 4));            
        results.push(result);
    }

    // console.log("constructResults: " + JSON.stringify(results, null, 4));
    return results;
}

exports.findByUserId = (userid) => {
    return new Promise((resolve, reject) => {
        // console.log("Promise cb: " + user);
        // setTimeout(() => {
        //     resolve(user);
        // }, 5);
        var rows = [];
        var headers = [];
        pool.getSession().then(session => {
            var query = session.sql(
                "SELECT t1.id, name, level, type, contact, email, auth_string " 
                + "FROM User_Tbl as t1 "
                + "JOIN User_Secret_Tbl as t2 ON t1.id = t2.id "
                + "WHERE t1.id = " + userid
            );
        
            return query.execute(data => {
                    rows.push(data);
                }, meta => {
                    headers = meta;
                });
        })
        .then(() => {
            var rawresult = constructResults(headers, rows);
            var results = [];

            for(var index in rawresult) {
                results.push(
                    HelperFn.userSecretTable.fromDBtoParam(rawresult[index])
                );
            }

            // console.log("find User then: " + JSON.stringify(results, null, 2));
            resolve(results);
        })
        .catch((err) => {
            reject(err);
        });
    })
}

exports.list = (where) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        var headers = [];
        var data = [];

        pool.getSession().then(session => {
            //var query = userTable.select();
            var whereInArr;
            try {
                whereInArr = HelperFn.usertable.constructWhere(where, "t1");
                whereInArr = HelperFn.userSecretTable.constructWhere(where, "t2", whereInArr);
            } catch(ex) {
                console.error("HERE!! " + ex);
                reject(ex);
                return
            }
            console.log("userModle list where: " + whereInArr);

            var query = session.sql(
                "SELECT t1.id, name, contact, email, level, type, is_verified \
                FROM User_Tbl as t1 \
                JOIN User_Secret_Tbl as t2 ON t1.id = t2.id " + 
                HelperFn.whereToString(whereInArr))

            return query.execute(results => {
                // console.log("User Secret data: " + JSON.stringify(data, null, 4));
                // console.log("User Secret query: " + JSON.stringify(results, null, 4));
                data.push(results);
            }, meta => {
                headers = meta;
            });
        }).then(() => {
            /** process data */
            var rawresult = constructResults(headers, data);
            var results = [];

            for(var index in rawresult) {
                var result = HelperFn.usertable.fromDBtoParam(rawresult[index]);
                result = HelperFn.userSecretTable.fromDBtoParam(
                    rawresult[index], result
                );
                results.push(
                    result
                );
            }

            resolve(results);
        }).catch((err) => {
            reject(err);
        })
    })
}

function getTableInsert(user, table) {
    let cols = [];
    let values = [];
    
    let dbuser = table.fromParamtoDB(user);
    // console.log(dbuser);

    cols = Object.keys(dbuser);
    values = Object.values(dbuser);

    return [cols, values];

}
exports.add = (user) => {
    // console.log(JSON.stringify(user));

    return new Promise((resolve, reject) => {
        var userSecretTable;
        var userAuthCollection;
        var affectedRows = 0;

        /* Send data to database */
        pool.getSession().then(session => {
            var [cols, values] = getTableInsert(user, HelperFn.usertable);
            // console.log(cols + " == " + values);
            var userTable = session.getSchema(process.env.DB_NAME).getTable("User_Tbl");
            
            userSecretTable = session.getSchema(process.env.DB_NAME)
                .getTable("User_Secret_Tbl");
            userAuthCollection = session.getSchema(process.env.DB_NAME)
                .getCollection("User_Auth_Tbl");

            var query = userTable.insert(cols).values(values);

            return query.execute();
        })
        .then((status) => {
            var [cols, values] = getTableInsert(user, HelperFn.userSecretTable);
            // console.log(cols + " == " + values);
            // console.log("1. Affected rows: " + status.getAffectedItemsCount());
            affectedRows += status.getAffectedItemsCount();

            var query = userSecretTable.insert(cols).values(values);

            return query.execute();
        })
        .then((status) => {
            // console.log("2. Affected rows: " + status.getAffectedItemsCount());
            userAuthCollection.add({
                "_id": user.id
            });
            affectedRows += status.getAffectedItemsCount()
            resolve({
                "affectedRows": affectedRows
            });
        })
        .catch((err) => {
            // console.error(err);
            reject(err);
        });
    })
}

exports.saveToken = (id, token) => {
    return new Promise((resolve, reject) => {
        pool.getSession().then(session => {
            var collection = session.getSchema(process.env.DB_NAME)
                .getCollection("User_Auth_Tbl");

            return collection.modify("_id = :userid")
            .bind("userid", id)
            .set("refresh_token", token)
            .execute();
        })
        .then((status) => {
            resolve({
                "affectedRows": status.getAffectedItemsCount()
            })
        })
    })
}
