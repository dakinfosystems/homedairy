var QueryBuilder = require("../../lib/queryBuilder");

let unit_tbl = {
    "type": "type",
    "fromUnit": "from_unit",
    "toUnit": "to_unit",
    "fromOffset": "from_offset",
    "multiplicand": "multiplicand",
    "denominator": "denominator",
    "toOffset": "to_offset",
    "unitSystem": "unit_system"
}

let product_tbl = {
    "id": "id",
    "productName": "name",
    "sellerId": "seller_id",
    "unitType": "unittype",
    "baseUnit": "baseunit",
    "costPerUnit": "costperunit"
}

unit_tbl.fn = {
    name: () => { return "Unit_Tbl"; },
    getDefaultValue: (col) => {
        let value;

        switch(col) {
            default:
                break;
        }

        return value;
    }
}

product_tbl.fn = {
    name: () => { return "Product_Tbl"; },
    getDefaultValue: (col) => {
        let value;

        switch(col) {
            default:
                break;
        }

        return value;
    }
}

/**
 * This function converts array condition in string format
 * 
 * @param {array} whereArr where condition in array format
 * @returns {string} where condition in string formate
 */
exports.whereToString = (whereArr) => {
    return QueryBuilder.whereToString(whereArr);
}

exports.unitTable = {
    /**
     * This function converts db name colum name to paramter names
     * 
     * @param {object} dbRow rows with column name same as db
     * @param {object} extend [optional] any thing to concat
     * @returns {object} rows with column name same as parameter
     */
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, unit_tbl);
    },

    /**
     * This function converts parameter name colum name to db names
     * 
     * @param {object} paramRow rows with column name same as parameter
     * @param {object} extend [optional] any thing to concat
     * @returns {object} rows with column name same as db
     */
    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, unit_tbl);
    },

    /**
     * This function converts where condition in oject form to where condition in array formate acceptable by SQL
     * 
     * @param {ojbect} conditions where conditions in object type
     * @param {string} alias [optional] alternate name of table for query
     * @param {object} extend [optional] where condition in array form
     * @param {boolean} forFn [optional] if query is for where function
     * @returns where condition in array formate
     */
     constructWhere(conditions, alias, extend, forFn) {
        if(extend && "boolean" === typeof extend) {
            forFn = true;
            extend = undefined;
        } else if (alias && "boolean" === typeof alias) {
            forFn = alias;
            alias = undefined;
        }
        if(forFn) {
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, unit_tbl);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, unit_tbl);
    },

    /**
     * This function returns the name of table
     * 
     * @returns {string} nam of table
     */
    getTableName: () => {
        return unit_tbl.fn.name();
    }
}

exports.productTable = {
    /**
     * This function converts db name colum name to paramter names
     * 
     * @param {object} dbRow rows with column name same as db
     * @param {object} extend [optional] any thing to concat
     * @returns {object} rows with column name same as parameter
     */
    fromDBtoParam : (dbRow, extend) => {
        return QueryBuilder.fromDBtoParam(dbRow, extend, product_tbl);
    },

    /**
     * This function converts parameter name colum name to db names
     * 
     * @param {object} paramRow rows with column name same as parameter
     * @param {object} extend [optional] any thing to concat
     * @returns {object} rows with column name same as db
     */
    fromParamtoDB: (paramRow, extend) => {
        return QueryBuilder.fromParamtoDB(paramRow, extend, product_tbl);
    },

    /**
     * This function converts where condition in oject form to where condition in array formate acceptable by SQL
     * 
     * @param {ojbect} conditions where conditions in object type
     * @param {string} alias [optional] alternate name of table for query
     * @param {object} extend [optional] where condition in array form
     * @param {boolean} forFn [optional] if query is for where function
     * @returns where condition in array formate
     */
     constructWhere(conditions, alias, extend, forFn) {
        if(extend && "boolean" === typeof extend) {
            forFn = true;
            extend = undefined;
        } else if (alias && "boolean" === typeof alias) {
            forFn = alias;
            alias = undefined;
        }
        if(forFn) {
            return QueryBuilder.getWhereFnCondition(conditions, alias, extend, product_tbl);
        }
        return QueryBuilder.getWhereCondition(conditions, alias, extend, product_tbl);
    },

    /**
     * This function returns the name of table
     * 
     * @returns {string} nam of table
     */
    getTableName: () => {
        return product_tbl.fn.name();
    }
}
