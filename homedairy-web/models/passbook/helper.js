var QueryBuilder = require("../../lib/queryBuilder");

/**
 * 
 */
var TransactionTbl = {
    "id": "id",
    "scheduleId": "schedule_id",
    "custId": "cust_id",
    "sellerId": "seller_id",
    "productId": "product_id",
    "productQuantity": "quantity",
    "time": "time",
    "productUnit": "unit_type",
    "productPrice": "price"
};

/**
 * This function return default value of Table
 * 
 * @param {string} col column name of transaction table in DB
 * @returns default value of given colums
 */
function getTransactionDefaultValue(col) {
    let value = "";

    // console.log(col)
    switch (col) {
        case "schedule_id":
            break;
        default:
            break;
    }
    return value;
}

TransactionTbl.fn = {
    name: () => { return "Transcation_Tbl"; },
    getDefaultValue: getTransactionDefaultValue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.transactionTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, TransactionTbl);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, TransactionTbl);
    },

    constructWhere(conditions, alias, extend, forFn) {
        if(extend && "boolean" === typeof extend) {
            forFn = true;
            extend = undefined;
        } else if (alias && "boolean" === typeof alias) {
            forFn = alias;
            alias = undefined;
        }
        if(forFn) {
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, TransactionTbl);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, TransactionTbl);
    },
    getTableValue: () => {
        return TransactionTbl.fn.name();
    }
};