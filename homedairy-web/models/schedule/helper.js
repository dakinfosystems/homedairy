var QueryBuilder = require("../../lib/queryBuilder");

var scheduleProcedure = {
    "id": "id",
    "customerId": "cust_id",
    "sellerName": "seller_name",
    "occurrence": "occurrence",
    "productName": "product_name",
    "productQuantity": "product_quantity"
};

var schedule_tbl = {
    "id": "id",
    "customerId": "cust_id",
    "sellerId": "seller_id",
    "productId": "product_id",
    "interval": "interval",
    "fixday": "fixday",
    "quantity": "quantity"
}

var scheduleEntryProcedure = {
    "scheduleId": "schedule_id",
    "sellerId": "seller_id",
    "sellerName": "seller_name",
    "productId": "product_id",
    "productName": "product_name",
    "productQuantity": "product_quantity",
    "occurrence": "occurrence",
}

function getScheduleDefaultValue(col) {
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

function getScheduleEntryDefaultValue(col) {
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

function getScheduleTblDefaultvalue(col) {
    let value = "";

    return value;
}

scheduleProcedure.fn = {
    name: () => { return "getCustomerEntry"; },
    getDefaultValue: getScheduleDefaultValue
}

scheduleEntryProcedure.fn = {
    name: () => { return "getCustomerEntry"; },
    getDefaultValue: getScheduleEntryDefaultValue
}

schedule_tbl.fn = {
    name: () => { return "Schedule_Tbl"; },
    getDefaultValue: getScheduleTblDefaultvalue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.scheduleTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, schedule_tbl);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, schedule_tbl);
    },

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, schedule_tbl);
    }
};

exports.scheduleProcedure = {
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
        return QueryBuilder.fromDBtoParam(dbRow, extend, scheduleEntryProcedure);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, scheduleEntryProcedure);
    },

    constructWhere(conditions, alias, extend) {
        return QueryBuilder.getWhereCondition(conditions, alias, extend, scheduleEntryProcedure);
    }
};
