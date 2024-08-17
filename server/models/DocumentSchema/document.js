import mongoose, { Mongoose } from 'mongoose';

const Document = mongoose.Schema(
    {
        _id: {
            type: String
        },
        name: {
            type: String,
        },
        content: {
            type: String,
            default: ""
        },
        collaborators: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
)

const docModel = mongoose.model('Document', Document);
export default docModel;