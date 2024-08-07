const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["editor", "viewer", "admin"],
        required: true
    }
});

module.exports = mongoose.model('Role', RoleSchema);
