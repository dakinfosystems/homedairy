/**
 * Query Builder - to build query in array format
 *  
 */
let forFnFlag = false;
function operatorToString(obj) {
    let op = ""
    let retStr = "";

    if(typeof obj === "object") {
        op = Object.keys(obj)[0];
    }

    switch(op) {
        case "eq":
            retStr = (forFnFlag? "== '": "= '") + obj["eq"] + "'";
            break;
        case "gt":
            retStr = "> '" + obj["gt"] + "'";
            break;
        case "gte":
            retStr = ">= '" + obj["gte"] + "'";
            break;
        case "lt":
            retStr = "< '" + obj["lt"] + "'";
            break;        
        case "lte":
            retStr = "<= '" + obj["lte"] + "'";
            break;
        case "neq":
            retStr = "<> '" + obj["neq"] + "'";
            break;
        case "is":
            retStr = (forFnFlag? "is '" : "IS '") + obj["is"] + "'";
            break;
        case "isnot":
            retStr = (forFnFlag? "is not '" : "IS NOT '") + obj["isnot"] + "'";
            break;
        case "like":
            retStr = (forFnFlag?  "like '":"LIKE '") + obj["like"] + "'";
            break;
        case "notin":
            retStr = (forFnFlag? "not in": "NOT IN") + obj["notin"].join(", ") + ")";
            break;
        case "in":
            retStr = (forFnFlag? "in (": "IN (") + obj["in"].join(", ") + ")";
            break;
        case "notbetween":
            retStr = (forFnFlag? "not ": "NOT ");
            retStr += (forFnFlag? "between ":"BETWEEN ") + obj["notbetween"]["low"] 
                + (forFnFlag? " and " : " AND ") + obj["notbetween"]["high"];
            break;
        case "between":
            retStr = (forFnFlag? "between ":"BETWEEN ") + obj["between"]["low"] 
                + (forFnFlag? " and " : " AND ") + obj["between"]["high"];
            break;
        default:
            throw new Error("Operator '"+ op +"' not found!!");
    }

    // console.log("2.1 operatorToString: " + retStr);
    return retStr;
}

function conditionToString(col, values, alias, mapping, ele) {
    let condition = ele || [];

    // console.log("1.0 condToString col: " + JSON.stringify(col));
    // console.log("1.0 condToString values: " + JSON.stringify(values));
    // console.log("1.0 condToString alias: " + JSON.stringify(alias));
    // console.log("1.0 condToString ele: " + JSON.stringify(ele));
    switch(col) {
        case "and":
        case "or":
            let index = 1;
            condition[0] = "(";
            for(let name in values) {
                var item = conditionToString(name, values[name], alias, mapping, condition[index]);
                if(index >= 3) {
                    condition[index-1] = (forFnFlag? col : col.toUpperCase());
                }

                condition[index] = item;
                index += 2;
            }
            // console.log("1.1 condToString len: " + condition.length);
            condition[index-1] = ")";
            break; 
        default:
            let expr;
            if(mapping[col] && (expr = operatorToString(values))) {
                condition = (alias ? (alias + ".") : "") + mapping[col] + " " + expr;
            }
    }

    return condition;
}

function exportGetWhereCondition(conditions, alias, extend, mapping) {
    let where;
    let index = 1;

    if(typeof alias !== "string") {
        extend = alias;
        alias = undefined;
    }

    where = extend || [];
    // console.log("0.0 Conditions: " + JSON.stringify(conditions, null, 4));
    for(let col in conditions) {
        let condition = conditionToString(col, conditions[col], alias, mapping, where[index]);
        // console.log("3.0 condition: " + condition);
        if(index >= 3) {
            where[index-1] = (forFnFlag? "and" : "AND")
        }
        where[index] = condition;
        index += 2;
    }

    if(false == forFnFlag && where.length) {
        where[0] = "WHERE";
    } else {
        where[0] = "";
    }

    return where;
}

exports.whereToString = (whereArr) => {
    // console.log("whereArr: " + whereArr);
    for(let index in whereArr) {
        if(Array.isArray(whereArr[index])) {
            whereArr[index] = this.whereToString(whereArr[index]);
        }
    }

    // console.log("whereToString : " + whereArr.join(" "));
    return whereArr.join(" ").trim();
}

exports.getWhereFnCondition = (conditions, alias, extend, mapping) => {
    let where;
    
    forFnFlag = true;
    where = exportGetWhereCondition(conditions, alias, extend, mapping)
    forFnFlag = false;

    return where;
}

exports.getWhereCondition = (conditions, alias, extend, mapping) => {
    return exportGetWhereCondition(conditions, alias, extend, mapping);
}


exports.fromDBtoParam = (dbData, extend, mapping) => {
    var paramUser = extend || {};

    // console.log("dbData: " + JSON.stringify(dbData));
    for( let [paramKey, dbKey] of Object.entries(mapping)) {
        // console.log("tbl: " + paramKey + ":" + dbKey);
        if(dbKey in dbData) {
            // console.log("dbData[" + dbKey + "] = " + dbData[dbKey] 
            //     + ", type = " + typeof dbData[dbKey]);
            paramUser[paramKey] = 
                (dbData[dbKey] && "undefined" !== dbData[dbKey])
                ? dbData[dbKey].toString()
                : mapping.fn.getDefaultValue(dbKey);
        }
    }

    // console.log(paramUser);
    return paramUser;
}

exports.fromParamtoDB = (paramData, extend, mapping) => {
    var dbUser = extend || {};

    // console.log("paramData: " + JSON.stringify(paramData));
    for (let [paramKey, paramVal] of Object.entries(paramData)) {
        let dbKey;
        // console.log(paramKey + ": " + paramVal);
        if((dbKey = mapping[paramKey])) {
            dbUser[dbKey] = paramVal.toString();
        }
    }

    // console.log(dbUser);
    return dbUser;
}