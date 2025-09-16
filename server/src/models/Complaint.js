import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageurl: {
    type: String,
    required: true
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  department: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }],
  assignedTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  remarks: [{
    text: String,
    by: String,
    date: {
      type: Date,
      default: Date.now
    }
  }] // admin remarks
}, { timestamps: true });

complaintSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
