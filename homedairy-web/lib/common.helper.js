
exports.getTableInsert = (row, table) => {
    let cols = [];
    let values = [];
    
    let dbuser = table.fromParamtoDB(row);
    // console.log(dbuser);

    cols = Object.keys(dbuser);
    values = Object.values(dbuser);

    return [cols, values];

}

exports.constructResults = (headers, data) => {
    var results = [];

    //console.log("ConstructResults headers: " +JSON.stringify(headers));
    // console.log("ConstructResults data: " +JSON.stringify(data));
    for(let xindex in data) {
        let result = {};
        for(let yindex in data[xindex]) {
            result[headers[yindex]["name"]] = data[xindex][yindex];
        }
        // console.log("ConstructResults xindex: " + xindex);
        // console.log("ConstructResults result: " + JSON.stringify(result, null, 4));            
        results.push(result);
    }

    // console.log("constructResults: " + JSON.stringify(results, null, 4));
    return results;
}