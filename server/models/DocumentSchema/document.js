import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        name: {
            type: String,
        },
        content: {
            type: Object,
            default: { ops: [] }
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
);

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
