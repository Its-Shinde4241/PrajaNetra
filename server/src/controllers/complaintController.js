import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, department, image, priority } = req.body;
    if (!title || !description || !department || !image) {
      return res.status(400).json({ message: 'title, description, department, and image are required.' });
    }

    let imageurl;
    try {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageurl = uploadResponse.secure_url;
    } catch (err) {
      return res.status(500).json({ message: 'Image upload to Cloudinary failed.', error: err.message });
    }

    const departments = Array.isArray(department) ? department : [department];
    const payload = {
      citizen: req.user._id,
      title,
      description,
      imageurl,
      department: departments
    };
    if (priority) payload.priority = priority;
    const newComplaint = await Complaint.create(payload);

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: newComplaint
    });

  } catch (error) {
    console.error('Error while creating complaint:', error);
    res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('citizen', 'email')
      .populate('department', 'name code');
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints.' });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .populate('department', 'name code');
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Failed to fetch your complaints.' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.status(200).json({
      message: 'Complaint status updated.',
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Complaint id is required.' });

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    if (String(complaint.citizen) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint.' });
    }

    await Complaint.findByIdAndDelete(id);
    res.status(200).json({ message: 'Complaint deleted successfully.' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Failed to delete complaint.' });
  }
};

