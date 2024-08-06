const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

verifyToken = (req,res,next) =>{
    let token= req.session.token;
    if(!token) return res.status(403).json({"Message":"Token not available"});

    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err) return res.status(401).json({"Message":"Unauthorized"});

        req.userId=decoded.id;
        next();
    })
}

const authjwt = verifyToken;
module.exports=authjwt;