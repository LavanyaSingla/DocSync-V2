import { v4 as uuidv4 } from "uuid";
import docModel from "../models/DocumentSchema/document.js";
import mongoose from "mongoose";
import userModel from "../models/UserSchema/user.js";

class docController {
    static createDocument = async (req, res) => {
        const _id = uuidv4();
        try {
            const owner = req.user._id;
            const newDocument = new docModel({ _id, owner });
            const result = await newDocument.save();
            if (result) {
                return res.status(200).json({ message: "Document created", document: result });
            }
            return res.status(500).json({ message: "some problem happened at the backedn" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    };

    static fetchDocuments = async (req, res) => {
        try {
            const user = req.user._id;
            const docs = await docModel.find({
                $or: [{ owner: user }, { collaborators: user }]
            });
            return res.status(200).json({ documents: docs });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    };
    static fetchDocumentById = async (req, res) => {
        try {
            const docId = req.params.id;
            const document = await docModel.findOne({ _id: docId });
            if (!document) return res.status(404).json({ message: 'Document not found' });
            res.json(document);
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    };
    static renameDoc = async (req, res) => {
        try {
            const docId = req.params.id;
            const { docName } = req.body;
            const response = await docModel.findByIdAndUpdate({ _id: docId }, { name: docName });
            return res.status(200).json({ message: response });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    };
    static shareDoc = async (req, res) => {
        try {
            const docId = req.params.id;
            const { email } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) return res.status(400).json({ message: "user not found" });
            const updatedDoc = await docModel.findByIdAndUpdate({ _id: docId }, { $addToSet: { collaborators: user._id } }, { new: true });
            if (!updatedDoc) return res.status(404).json({ message: "document not found" });
            return res.status(200).json({ message: "User added" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

export default docController;