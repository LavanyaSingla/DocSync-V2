const mongoose = require('mongoose');

const Role = new mongoose.Schema({type:String,enum:["editor","viewer","admin"]});
module.exports= mongoose.model('Role',Role);