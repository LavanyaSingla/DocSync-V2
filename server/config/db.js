import mongoose from "mongoose";

const connectDb = async () => {
    const res = await mongoose.connect("mongodb://localhost:27017/Group-Docs");
    if (res) console.log("connected to the db successfully");
};

export default connectDb;