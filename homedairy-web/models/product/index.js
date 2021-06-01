let HelperFn = require("./helper");
let CommonHepler = require("../../lib/common.helper");
let pool = require("../../lib/mysql").pool;

/**
 * This function gets the data from product database based in condition
 * @param {object} condition condition to search product price
 */
function getProductPrice(where, resolve, reject) {
    let connection;
    let productDataset = [];
    let productHeader = [
        "id",
        "baseunit",
        "costperunit"
    ];

    pool.getSession().then(session => {
        let table;
        let condition = "";

        connection = session;
        table = connection.getSchema(process.env.DB_NAME).getTable(HelperFn.productTable.getTableName());
        try {
            let conditionArr = HelperFn.productTable.constructWhere(where, true);
            condition = HelperFn.whereToString(conditionArr);
            // console.log("ProductModel getProductPrice condition: " +condition);
        } catch (err) {
            reject({
                "msg": "Error in condition parsing"
            });
            return;
        }

        return table.select(productHeader).where(condition).execute((dataset) => {
            // console.log("ProductModel getProductPrice data: " +JSON.stringify(dataset));
            productDataset.push(dataset);
        },(meta) => {
            productHeader = meta;
            // console.log("ProductModel getProductPrice meta: " +JSON.stringify(productHeader));
        })
    }).then(() => {
        let resultSet = [];
        let rawResultSet = CommonHepler.constructResults(productHeader, productDataset);
        for(let index in rawResultSet) {
            let result = HelperFn.productTable.fromDBtoParam(rawResultSet[index]);
            resultSet.push(result);
        }
        // console.log("ProductModel getProductPrice: " +JSON.stringify(resultSet));
        resolve(resultSet);
    })
    .catch((err) => {
        console.error("ProductModel getProductPrice catch: " +JSON.stringify(err));
        reject(err);
    })
    .finally(() => {
        connection.close();
    })
}

/**
 * This function gets the list of unit from database based in condition
 * @param {object} condition condition to search unit
 */
function getUnitList(condition, resolve, reject) {
    let connection;
    let unitDataset = [];
    let unitHeader = [
        "from_unit",
        "to_unit",
        "from_offset",
        "to_offset",
        "multiplicand",
        "denominator"
    ];

    pool.getSession().then(session => {
        let table;
        let where = "";

        connection = session;
        table = connection.getSchema(process.env.DB_NAME).getTable(HelperFn.unitTable.getTableName());

        try {
            let whereArr = HelperFn.unitTable.constructWhere(condition, true);
            where = HelperFn.whereToString(whereArr);
            // console.log("ProductModel getUnitList where: " +where);
        } catch (err) {
            reject(err);
            return;
        }

        return table.select(unitHeader).where(where).execute((dataset) => {
            // console.log("ProductModel dataset: " +JSON.stringify(dataset));
            unitDataset.push(dataset);
        }, (meta) => {
            // console.log("ProductModel meta: " +JSON.stringify(meta));
            unitHeader = meta;
        });
    }).then(() => {
        let resultSet = [];
        let rawResultSet = CommonHepler.constructResults(unitHeader, unitDataset);
        // console.log("ProductModel send data: " +JSON.stringify(rawResultSet));
        for(index in rawResultSet) {
            let result = HelperFn.unitTable.fromDBtoParam(rawResultSet[index]);
            resultSet.push(result);
        }
        // console.log("ProductModel send data: " +JSON.stringify(resultSet));
        resolve(resultSet);
    })
    .catch(err => {
        console.error("ProductModel unit list catch: " +JSON.stringify(err));

    })
    .finally(() => {
        connection.close();
    });
}

/**
 * This function save data in product table
 * 
 * @param {object} data product details to be stored in database
 */
function saveProduct(data, resolve , reject) {
    // TODO: save data in product table
    let connection;

    pool.getSession().then(session => {
        connection = session;
    })
    .catch(err => {
        console.error("ProductModel unit list catch: " +JSON.stringify(err));

    })
    .finally(() => {
        connection.close();
    });
}

/**
 * This contains function related to Product
 * 
 * @property {function} price - returns price of product
 * @property {function} save - save product details in DB
 */
exports.product = {
    /**
     * This function gets the data from product database based in condition
     * @param {object} condition condition to search product price
     */
    price: (conditions) => {
        return new Promise((resolve, reject) => {
            getProductPrice(conditions, resolve, reject)
        });
    },
    /**
     * This function gets the data from product database based in condition
     * @param {object} data data of product to save in DB
     */
    save: (data) => {
        return new Promise((resolve, reject) => {
            saveProduct(data, resolve, reject)
        });
    }
}

/**
 * This contains function related to Units
 */
exports.unit = {
    /**
     * This function gets the list of unit from database based in condition
     * 
     * @param {object} condition condition to search unit
     */
    list: (conditions) => {
        return new Promise((resolve, reject) => {
            getUnitList(conditions, resolve, reject)
        });
    }
}
