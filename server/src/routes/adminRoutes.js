import express from 'express';
import {
    createAdmin,
    loginAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/signup', createAdmin);
router.post('/login', loginAdmin);
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
