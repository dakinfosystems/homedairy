var bcrypt = require("bcrypt");
var UserConfig = require("../../configs/user.config")
var HelperFn = require("./helper");

const saltRounds = 10;
var salt;
var encDone = false;
var users = [
    {
        userid: "admin",
        authstring: "hi",
        level: UserConfig.user.level.ADMIN,
        type: UserConfig.user.type.ADMIN,
        name: "Admin"
    },
    {
        userid: "sellerp",
        authstring: "paid",
        level: UserConfig.user.level.PAID,
        type: UserConfig.user.type.SELLER,
        name: "Seller Paid"
    },
    {
        userid: "sellerf",
        authstring: "free",
        level: UserConfig.user.level.FREE,
        type: UserConfig.user.type.SELLER,
        name: "Seller Free"
    },
    {
        userid: "customerp",
        authstring: "paid",
        level: UserConfig.user.level.PAID,
        type: UserConfig.user.type.CUSTOMER,
        name: "Customer Paid"
    },
    {
        userid: "customerf",
        authstring: "free",
        level: UserConfig.user.level.FREE,
        type: UserConfig.user.type.CUSTOMER,
        name: "Customer Free"
    }
];

(() => {
    if( false === encDone){
        encDone = true;
        salt = bcrypt.genSaltSync(saltRounds);

        for(var i = 0; i < users.length; i++) {
            var hash = bcrypt.hashSync(users[i].authstring, salt);
            users[i].authstring = 
                (Buffer.from(salt)).toString("base64") 
                + "$" 
                + (Buffer.from(hash)).toString("base64");
            // console.log(users[i].authstring);
        }
    }
})();

exports.findByUserId = (userid) => {
    var user = [];

    for(index in users) {
        if (userid === users[index].userid) {
            user.push(users[index]);
        }
    }
    return new Promise((resolve, reject) => {
        // console.log("Promise cb: " + user);
        setTimeout(() => {
            resolve(user);
        }, 5);
    })
}

exports.list = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let retUser=[];
            for(let index in users) {
                let user = HelperFn.fromDBtoParam(users[index])
                retUser.push(user);
            }
            resolve(retUser);
        }, 5)
    })
}
