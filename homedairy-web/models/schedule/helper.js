var QueryBuilder = require("../../lib/queryBuilder");

var scheduleProcedure = {
    "id": "id",
    "customerId": "cust_id",
    "sellerName": "seller_name",
    "occurrence": "occurrence",
    "productName": "product_name",
    "productQuantity": "product_quantity"
};

var scheduleEntryProcedure = {
    "sellerId": "seller_id",
    "sellerName": "seller_name",
    "productId": "product_id",
    "productName": "product_name",
    "productQuantity": "product_quantity",
    "occurrence": "occurrence",
}

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

function getScheduleEntryDefaultValue() {
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

scheduleEntryProcedure.fn = {
    name: () => { return "getCustomerEntry"; },
    getDefaultValue: getScheduleEntryDefaultValue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.scheduleTable = {
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

exports.scheduleEntry = {
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