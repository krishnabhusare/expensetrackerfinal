const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const authenticate = async(req,res,next)=>{
    try{
    const token = req.headers.authorization;
    const decryptedToken = jwt.verify(token,process.env.BCRYPT_SECRETE_KEY);

    await User.findByPk(decryptedToken.userId).then(user=>{
        req.user=user;
        next();
    })
    }catch(err){
        res.status(500).json({message:'failed to authenticate',err});
    }
}

module.exports = {
    authenticate
}