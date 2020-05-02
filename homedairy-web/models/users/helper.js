var QueryBuilder = require("../../lib/queryBuilder");
var UserConfig = require("../../configs/user.config").user

var userTblMapping = {
    "userid": "id",
    "name": "name",
    "mobile": "contact",
    "email": "email",
    "houseNo": "flat_no"
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
    getDefaultValue: getUserSecretTblDefaultValue
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

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, userTblMapping);
    }
};

exports.userSecretTable = {
    fromDBtoParam : (dbUser, extend) => {
        return QueryBuilder.fromDBtoParam(dbUser, extend, userSecretTblMapping);
    },

    fromParamtoDB: (paramUser, extend) => {
        return QueryBuilder.fromParamtoDB(paramUser, extend, userSecretTblMapping);
    },

    constructWhere(condtions, alias, extend) {
        return QueryBuilder.getWhereCondition(condtions, alias, extend, userSecretTblMapping);
    }
}