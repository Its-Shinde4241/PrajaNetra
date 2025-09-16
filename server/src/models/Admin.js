import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, trim: true
    },
    email: {
        type: String,
        required: true, unique: true, lowercase: true
    },
    password: {
        type: String,
        required: true
    }, // hashed
    role: {
        type: String,
        enum: ['superadmin', 'manager', 'operator'],
        default: 'manager'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
