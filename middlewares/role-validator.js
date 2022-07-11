const { response } = require("express")

const isAdminRole = (req, res = response, next) => {

    if(!req.user){
        return res.status(500).json({
            msg: 'You need to validate the token before checking the role'
        });
    }

    const {role, name} = req.user;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} is not admin`
        });
    }

    next();
}

const hasRole = (...roles) => {

    return (req, res, next) => {

        if(!req.user){
            return res.status(500).json({
                msg: 'You need to validate the token before checking the role'
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: `The service requires one of these roles ${roles}`
            });
        }


        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole,
}