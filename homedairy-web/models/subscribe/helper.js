var QueryBuilder = require("../../lib/queryBuilder");

var subsTblMapping = {
    "custId": "cust_id",
    "sellerId": "seller_id",
};

let altSubsTbl = {
    "altCustId": "alt_cust_id",
    "custmerId": "cust_id",
    "sellerId": "seller_id"
}

function getSubsTblDefaultValue(col) {
    let value = "";

    // console.log(col)
    switch (col) {
        default:
            break;
    }

    return value;
}

function getAltSubsTblDefaultValue(col) {
    let value = "";

    // console.log(col)
    switch (col) {
        default:
            break;
    }

    return value;
}

subsTblMapping.fn = {
    name: () => { return "Subs_Tbl"; },
    getDefaultValue: getSubsTblDefaultValue
}

altSubsTbl.fn = {
    name: () => { return "Alt_Subs_Tbl"; },
    getDefaultValue: getAltSubsTblDefaultValue
}

exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
};

exports.subsTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, subsTblMapping);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, subsTblMapping);
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
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, subsTblMapping);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, subsTblMapping);
    },

    getTableName: () => {
        return subsTblMapping.fn.name();
    }
};
exports.altSubsTable = {
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, altSubsTbl);
    },

    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, altSubsTbl);
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
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, altSubsTbl);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, altSubsTbl);
    },

    getTableName: () => {
        return altSubsTbl.fn.name();
    }
};
