var QueryBuilder = require("../../lib/queryBuilder");
var UserConfig = require("../../configs/user.config").user

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

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, TransactionTbl);
    }
};