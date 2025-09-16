import mongoose from "mongoose";

const Commentschema = new mongoose.Schema({
    citizen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Citizen',
        required: true
    },
    complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", Commentschema);
export default Comment;
