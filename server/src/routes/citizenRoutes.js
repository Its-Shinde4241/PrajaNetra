import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import {
    signupCitizen,
    loginCitizen,
    checkCitizenAuth,
    updateCitizenProfile,
    getAllCitizens,
    getCitizenById,
    deleteMyCitizenAccount
} from '../controllers/citizenController.js';

const router = express.Router();

router.post('/signup', signupCitizen);
router.post('/login', loginCitizen);
router.get('/check', protectRoute, checkCitizenAuth);
router.put('/profile', protectRoute, updateCitizenProfile);
router.get('/', protectRoute, getAllCitizens);
router.get('/:id', protectRoute, getCitizenById);
router.delete('/me', protectRoute, deleteMyCitizenAccount);

export default router;
