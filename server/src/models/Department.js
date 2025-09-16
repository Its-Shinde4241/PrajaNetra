const departmentSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }, // department head
    services: [{
        type: String
    }], // services provided
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
