var UserModel = require("../../models/users");

exports.list = (filters) => {
    return new Promise((resolve, reject) => {
        UserModel.list().then((users) => {
            // Resolve
            var retValue = [];

            // console.log("Users: " + users);
            for(index in users) {
                var tempUser  = Object.assign({}, users[index]);
                var found = false;
                delete tempUser.password;
                
                for(attr in filters) {
                    let attrVal = filters[attr];
                    // console.log(attr + ": " + attrVal + "=> " + tempUser[attr]);

                    if ( Array.isArray(attrVal) 
                    && -1 !== attrVal.indexOf(tempUser[attr]) ) {
                        console.log("found in array");
                        found = true;
                    } else if (attrVal === tempUser[attr]) {
                        console.log("found in db");
                        found = true;
                    } else {
                        console.log("Not found, " + typeof attrVal + "=" + typeof tempUser[attr]);
                        found = false;
                        break;
                    }
                }

                console.log("Is user found: " + found);
                if (found) {
                    retValue.push(tempUser);
                }
            }
            resolve(retValue);
        }, (err) => {
            // Reject
            reject(err);
        })
    })
}