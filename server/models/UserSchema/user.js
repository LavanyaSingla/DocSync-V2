const {Schema,model} = require('mongoose');

const User = Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:True
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }
});

module.exports = model('User',User);