var QueryBuilder = require("../../lib/queryBuilder");
var UserConfig = require("../../configs/user.config").user

var userTblMapping = {
    "userid": "id",
    "name": "name",
    "mobile": "contact",
    "email": "email",
    "houseNo": "flat_no",
    "qrCode": "qr_code"
};

function getUserTblDefaultValue(col) {
    let value = "";

    // console.log(col)
    switch (col) {
        case "name":
            break;
        default:
            break;
    }

    return value;
}

userTblMapping.fn = {
    name: () => { return "User_Tbl"; },
    getDefaultValue: getUserTblDefaultValue
}

var userSecretTblMapping = {
    "userid": "id",
    "password": "auth_string",
    "isVerified": "is_verified",
    "userType": "type",
    "userLevel": "level"
}

function getUserSecretTblDefaultValue(col) {
    let value = "";

    // console.log(attrib)
    switch (col) {
        case "is_verified":
            value = "0";
            break;
        case "type":
            value = UserConfig.type.CUSTOMER;
            break;
        case "level":
            value = UserConfig.level.FREE;
            break;
        default:
            break;
    }

    return value;
}

userSecretTblMapping.fn = {
    name: () => { return "User_Secret_Tbl"; },
    getDefaultValue: getUserSecretTblDefaultValue
}

exports.sortTablewise = (data) => {
    let retVal = {}
    for(col in data) {
        if("userid" === col)
            continue;
        if(userTblMapping[col]) {
            let tname = userTblMapping.fn.name();

            retVal[tname] = retVal[tname] || {};
            retVal[tname][userTblMapping[col]] = data[col];
        } else if(userSecretTblMapping[col]) {
            let tname = userSecretTblMapping.fn.name();

            retVal[tname] = retVal[tname] || {};
            retVal[tname][userSecretTblMapping[col]] = data[col];
        }
    }

    return retVal;
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.usertable = {
    fromDBtoParam : (dbUser, extend) => {
        return QueryBuilder.fromDBtoParam(dbUser, extend, userTblMapping);
    },

    fromParamtoDB: (paramUser, extend) => {
        return QueryBuilder.fromParamtoDB(paramUser, extend, userTblMapping);
    },

    constructWhere: (conditions, alias, extend, forFn) => {
        if(extend && "boolean" === typeof extend) {
            forFn = extend;
            extend = undefined;
        } else if (alias && "boolean" === typeof alias) {
            forFn = alias;
            alias = undefined;
        }
        if(forFn) {
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, userTblMapping);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, userTblMapping);
    },

    getTableName: () => {
        return userTblMapping.fn.name();
    }
};

exports.userSecretTable = {
    fromDBtoParam : (dbUser, extend) => {
        return QueryBuilder.fromDBtoParam(dbUser, extend, userSecretTblMapping);
    },

    fromParamtoDB: (paramUser, extend) => {
        return QueryBuilder.fromParamtoDB(paramUser, extend, userSecretTblMapping);
    },

    constructWhere: (condtions, alias, extend, forFn) => {
        if(extend && "boolean" === typeof extend) {
            forFn = true;
            extend = undefined;
        } else if (alias && "boolean" === typeof alias) {
            forFn = alias;
            alias = undefined;
        }
        if(forFn) {
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, userSecretTblMapping);
        }
        return QueryBuilder.getWhereCondition(condtions, alias, extend, userSecretTblMapping);
    },

    getTableName: () => {
        return userSecretTblMapping.fn.name();
    }
}