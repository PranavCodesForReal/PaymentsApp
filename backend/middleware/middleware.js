const JWT_SECRET = require('../config');
const jwt= require('jsonwebtoken');
const { User } = require('../db');

async function authMiddleWare(req,res,next){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
    try{
        const decode = jwt.verify(token , JWT_SECRET);
        req.userId = decode.userId;
        const response = await User.findOne({_id : req.userId});
        req.name= response.firstName;
        next();
    } catch(error){
        res.status(403).json({})
    }
}
module.exports = authMiddleWare;