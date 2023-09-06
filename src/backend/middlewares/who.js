const jwt = require('jsonwebtoken');

function who(req, res, next) {
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        req.who = "Unknown";
        next();
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) req.who = "Unknown";
        else tokenName = tokenName.split("=")[1];
        jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                req.who = "Unknown";
            } else {
                req.who = decoded.user;
            }
        });
        next();
    }
}

module.exports = {
    who
}