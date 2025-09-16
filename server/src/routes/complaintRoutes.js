
import express from 'express';
const router = express.Router();
import { protectRoute } from '../middleware/auth.js';

import {
    createComplaint,
    getAllComplaints,
    updateComplaintStatus,
    getMyComplaints,
    deleteComplaint
} from '../controllers/complaintController.js';

router.post('/', protectRoute, createComplaint);
router.get('/', protectRoute, getAllComplaints);
router.get('/my', protectRoute, getMyComplaints);
router.put('/:id', protectRoute, updateComplaintStatus);
router.delete('/:id', protectRoute, deleteComplaint);

export default router;
