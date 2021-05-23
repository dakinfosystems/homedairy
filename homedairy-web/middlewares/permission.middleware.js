exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.user.permission);
        
        // console.log(user_permission_level + " & " + required_permission_level + " = " + (user_permission_level & required_permission_level));
        
        if ((user_permission_level & required_permission_level) 
        === required_permission_level) {
            return next();
        } else {
            return res.status(403).send({
                error: "Access Denied"
            });
        }
    };
};

exports.onlyPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.user.permission);
        
        // console.log(user_permission_level + " & " + required_permission_level + " = " + (user_permission_level & required_permission_level));
        
        if ((user_permission_level & required_permission_level)) {
            return next();
        } else {
            return res.status(403).send({
                error: "Access Denied"
            });
        }
    };
};

exports.onlyUserTypeRequired = (required_user_type) => {
    return (req, res, next) => {
        let user_type = (parseInt(req.jwt.user.permission));

        // console.log(user_type + " & " + required_user_type + " = " + (user_type & required_user_type));
        if ((user_type & required_user_type)) {
            return next();
        } else {
            return res.status(403).send({
                error: "Access Denied"
            });
        }
    }
};
