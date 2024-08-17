import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["editor", "viewer", "admin"],
        required: true
    }
});

const roleModel = mongoose.model('Role', RoleSchema);
export default roleModel;
