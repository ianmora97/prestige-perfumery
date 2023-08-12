const jwt = require('jsonwebtoken');
require("dotenv").config();


function isAuthenticatedAdmin(req, res, next) {
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        res.redirect('/');
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) res.redirect('/');
        else tokenName = tokenName.split("=")[1];
        if(tokenName === undefined){
            res.redirect('/');
        }else{
            jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    res.redirect('/');
                } else {
                    if(decoded.rol != undefined){
                        next();
                    }else{
                        res.redirect('/');
                    }
                }
            });
        }
    }
}
function isAuthenticatedClient(req,res,next){
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        res.redirect('/');
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) res.redirect('/');
        else tokenName = tokenName.split("=")[1];
        if(tokenName === undefined){
            res.redirect('/');
        }else{
            jwt.verify(
                tokenName, 
                process.env.SECRET_KEY, 
            (err, decoded) => {
                if (err) {
                    res.redirect('/');
                } else {
                    next();
                }
            });
        }
    }
}

function getRole(req){
    return new Promise((resolve, reject) => {
        let headers = req.headers['cookie'] || req.headers['authorization'];
        if(headers === undefined){
            resolve("noRole")
        }else{
            let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
            if(tokenName === undefined) resolve("noRole")
            else tokenName = tokenName.split("=")[1];
            if(tokenName === undefined){
                resolve("noRole")
            }else{
                jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        resolve("noRole")
                    } else {
                        resolve(decoded.rol);
                    }
                });
            }
        }
    });
}

module.exports = {
    isAuthenticatedAdmin,
    isAuthenticatedClient,
    getRole
}