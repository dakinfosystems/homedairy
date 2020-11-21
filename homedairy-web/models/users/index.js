var HelperFn = require("./helper");
var CommonHepler = require("../../lib/common.helper");
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
        var connection;
        pool.getSession().then(session => {
            connection = session;
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
                var result = HelperFn.userSecretTable.fromDBtoParam(rawresult[index]);
                results.push(
                    HelperFn.usertable.fromDBtoParam(rawresult[index],result)
                );
            }

            // console.log("find User then: " + JSON.stringify(results, null, 2));
            resolve(results);
        })
        .catch((err) => {
            console.error(err);
            reject(err);
        }).finally(() => {
            if(connection)
                connection.close();
        });
    })
}

exports.list = (where) => {
    // console.log("UserModel list: " + JSON.stringify(where));
    return new Promise((resolve, reject) => {
        var headers = [];
        var data = [];
        var connection;

        pool.getSession().then(session => {
            var whereInArr;
            connection = session;
            try {
                whereInArr = HelperFn.usertable.constructWhere(where);
                whereInArr = HelperFn.userSecretTable.constructWhere(where, whereInArr);
            } catch(ex) {
                console.error("Error in constructing where clause! Here: " + ex);
                reject(ex);
                return;
            }
            // console.log("userModel list where: " + whereInArr);

            var query = session.sql(
                "SELECT * \
                FROM User_Info_View " + 
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
        }).finally(() => {
            connection.close();
        });
    })
}

// function getTableInsert(user, table) {
//     let cols = [];
//     let values = [];
    
//     let dbuser = table.fromParamtoDB(user);
//     // console.log(dbuser);

//     cols = Object.keys(dbuser);
//     values = Object.values(dbuser);

//     return [cols, values];

// }
exports.add = (user) => {
    // console.log(JSON.stringify(user));

    return new Promise((resolve, reject) => {
        var userSecretTable;
        var userAuthCollection;
        var affectedRows = 0;
        var connection;

        /* Send data to database */
        pool.getSession().then(session => {
            var [cols, values] = CommonHepler.getTableInsert(user, HelperFn.usertable);
            var userTable = session.getSchema(process.env.DB_NAME).getTable("User_Tbl");

            // console.log(cols + " == " + values);
            connection = session;
            userSecretTable = session.getSchema(process.env.DB_NAME)
                .getTable("User_Secret_Tbl");
            userAuthCollection = session.getSchema(process.env.DB_NAME)
                .getCollection("User_Auth_Tbl");

            return userTable.insert(cols).values(values).execute();
        })
        .then((status) => {
            var [cols, values] = CommonHepler.getTableInsert(user, HelperFn.userSecretTable);
            // console.log(cols + " == " + values);
            // console.log("1. Affected rows: " + status.getAffectedItemsCount());
            affectedRows += status.getAffectedItemsCount();

            var query = userSecretTable.insert(cols).values(values);

            return query.execute();
        })
        .then((status) => {
            // console.log("2. Affected rows: " + status.getAffectedItemsCount());
            userAuthCollection.add({
                "_id": user.userid,
                "refresh_token": ""
            }).execute();
            affectedRows += status.getAffectedItemsCount()
            resolve({
                "affectedRows": affectedRows
            });
        })
        .catch((err) => {
            // console.error(err);
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}

/**
 * It update table 
 */
exports.update = (where, data) => {
    return new Promise((resolve, reject) => {
        /** Update table */
        var connection;
        pool.getSession().then(session => {
            let sortedData = HelperFn.sortTablewise(data);

            connection = session;
            console.log("UserModel update sortedData: " + sortedData);
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
            resolve({
                "affectedRows": 1
            });
        });
    });
}

/**
 * It save data in collection like refresg_token and otp
 * @param {string} id
 * user id
 * @param {object} data
 * data to be save in collection
 */
exports.save = (id, data) => {
    return new Promise((resolve, reject) => {
        var connection;
        // console.log("id: " + id + "\nToken: " + token);
        pool.getSession().then(session => {
            var collection = session.getSchema(process.env.DB_NAME)
                .getCollection("User_Auth_Tbl");
            
                connection = session;

            return collection.modify("_id = :userid")
            .bind("userid", id)
            .patch(data)
            .execute();
        }).then((status) => {
            resolve({
                "affectedRows": status.getAffectedItemsCount()
            });
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        });
    });
};

/**
 * It finds data from collection
 * @param {string} id
 * User id
 * @param {Array} fields
 * fields or columns to be retrieved 
 */
exports.findDoc = (id, fields) => {
    return new Promise((resolve, reject) => {
        var connection
        var retData = [];
        pool.getSession().then((session) => {
            var collection = session.getSchema("homedairy").getCollection("User_Auth_Tbl");
            var find = collection.find("_id = :userid");

            connection = session
    
            if(fields) {
                find = find.fields(fields)
            }

            return find.bind("userid", id)
            .execute((doc) => {
                // console.log("find doc: " + JSON.stringify(doc));
                retData.push(doc);
            });
        }).then(() => {
            // console.log("find retData " + JSON.stringify(retData));
            if(0 < retData.length) {
                resolve(retData[0]);
            } else {
                resolve({
                    "refresh_token": ""
                });
            }
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            connection.close();
        });
    })
}