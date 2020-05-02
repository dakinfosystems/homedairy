var UserModel = require("../../models/users");

exports.list = (filters) => {
    return new Promise((resolve, reject) => {
        let where = {}
        
        // console.log("filters: " + JSON.stringify(filters));
        for(let attr in filters) {
            switch(attr) {
                case "q":
                    where["or"] =  {
                        "name": {
                            "like": "%" + filters[attr] + "%"
                        },
                        "mobile": {
                            "like": filters[attr] + "%",
                        }
                    };
                    break;
                case "userType":
                    where[attr] = {
                        "eq": filters[attr]
                    }
                    break;
                default:
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
    /* Add user id same as mobile number */
    user.userid = user.mobile;
    return UserModel.add(user)
}