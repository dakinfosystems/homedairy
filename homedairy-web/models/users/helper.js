var UserConfig = require("../../configs/user.config").user

var userTblMapping = {
    "id": "userid",
    "password": "authstring",
    "userType": "type",
    "userLevel": "level",
    "name": "name"
}

function getDefaultValue(attrib) {
    let value = "";

    switch (attrib) {
        case "type":
            value = UserConfig.type.CUSTOMER;
            break;
        case "level":
            value = UserConfig.level.FREE;
            break;
        default:
            break;
    }
}

exports.fromDBtoParam = (dbUser, extend) => {
    var paramUser = extend || {};

    // console.log("DBUser: " + JSON.stringify(dbUser));
    for( let [paramKey, dbKey] of Object.entries(userTblMapping)) {
        // console.log("tbl: " + paramKey + ":" + dbKey);
        if(dbKey in dbUser) {
            // console.log(">> " + dbUser[dbKey]);
            paramUser[paramKey] = 
                (dbUser[dbKey] && "undefined" !== dbUser[dbKey])
                ? dbUser[dbKey].toString()
                : getDefaultValue(paramKey);
        }
    }

    // console.log(paramUser);
    return paramUser;
}

exports.fromParamtoDB = (paramUser, extend) => {
    var dbUser = extend || {};

    // console.log("ParamUser: " + JSON.stringify(paramUser));
    for (let [paramKey, paramVal] of Object.entries(paramUser)) {
        let dbKey;
        if((dbKey = userTblMapping[paramKey])) {
            dbUser[dbKey] = paramVal.toString();
        }
    }

    // console.log(dbUser);
    return dbUser;
}