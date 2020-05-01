var UserModel = require("../../models/users");

exports.list = (filters) => {
    return new Promise((resolve, reject) => {
        let where = {}
        
        // console.log("filters: " + JSON.stringify(filters));
        for(let attr in filters) {
            switch(attr) {
                case "mobile":
                    filters[attr] =  "%" + filters[attr];
                case "name":
                case "userid":
                    where["or"] = where["or"] || {};
                    where["or"][attr] = {
                        "like": filters[attr] + "%"
                    };
                    break;
                default:
                    where[attr] = {
                        "eq": filters[attr]
                    };
                    break;
            }
        }

        UserModel.list(where).then((users) => {
            // Resolve
            // console.log("Users: " + JSON.stringify(users, null, 4));
            resolve(users);
        }, (err) => {
            // Reject
            // console.error("Caught in User Controller list reject")
            reject(err);
        })
    })
}

exports.add = (user) => {
    return UserModel.add(user)
}