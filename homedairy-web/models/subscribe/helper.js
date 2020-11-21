var QueryBuilder = require("../../lib/queryBuilder");

var subsTblMapping = {
    "custId": "cust_id",
    "sellerId": "seller_id",
};

function getSubsTblDefaultValue(col) {
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

subsTblMapping.fn = {
    name: () => { return "Subs_Tbl"; },
    getDefaultValue: getSubsTblDefaultValue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.subsTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, subsTblMapping);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, subsTblMapping);
    },

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, subsTblMapping);
    }
};