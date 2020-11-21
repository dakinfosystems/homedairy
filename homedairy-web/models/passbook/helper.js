var QueryBuilder = require("../../lib/queryBuilder");
var UserConfig = require("../../configs/user.config").user

var scheduleProcedure = {
    "id": "id",
    "customerId": "cust_id",
    "sellerName": "seller_name",
    "occurrence": "occurrence",
    "productName": "product_name",
    "productQuantity": "product_quantity"
};

function getScheduleDefaultValue() {
    let value = "";

    console.log(col)
    switch (col) {
        case "name":
            break;
        default:
            break;
    }
}

scheduleProcedure.fn = {
    name: () => { return ""; },
    getDefaultValue: getScheduleDefaultValue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.subsTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, scheduleProcedure);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, scheduleProcedure);
    },

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, scheduleProcedure);
    }
};