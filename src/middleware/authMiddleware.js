const jwt = require ('jsonwebtoken')
const HttpError = require ('../models/error')

const authMiddleware = async (req, res, next) => {
    console.log("gatito", req) 
    const Authorization =req.headers.Authorization || req.headers.authorization;

    if (Authorization && Authorization.startsWith("Bearer")) {
        const token = Authorization.split(' ')[1]
        jwt.verify(token, process.env.JTW_SECRET, (err, info) => {
            if(err) {
                return next (new HttpError("Unauthorized. Invalid token", 403))
            }
            req.author = info;
            next 

        })
    } else {
        return (next(new HttpError("Unauthorized. no token", 402)))
    }
}

module.exports = authMiddleware