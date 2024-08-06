const config = require('../config/config.js');
const User = require('../models/UserSchema/user.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signUp = (req,res)=>{
    const user = User({
        username:req.body.username,
        email:req.body.email,
        role:req.body.role,
        password:bcrypt.hashSync(req.body.password,8)
    });

    user.save((err,user)=>{
        if(err) return res.status(500).json({"Message":err});
        return res.status(200).json({"Message":"User signup Successfully!","data":user});
    })
};

exports.signIn = (req,res)=>{
    User.findOne({username:req.body.username}).exec((err,user)=>{
        if(err){
            return res.status(500).json({"Message":err});
        }
        if(!user) return res.status(400).json({"Message":"User not found."});

        var validatePassword = bcrypt.compareSync(req.body.password,user.password);
        if(!validatePassword) return res.status(401).json({"Messaga":"Invalid Passowrd"});
    })
};