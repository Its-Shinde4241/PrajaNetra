import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true // store hashed 
    },
    phone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// auto-update updatedAt
citizenSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Citizen = mongoose.model('Citizen', citizenSchema);
export default Citizen;
