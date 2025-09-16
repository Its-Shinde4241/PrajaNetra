import bcrypt from 'bcryptjs';
import Citizen from '../models/Citizen.js';
import { generateToken } from '../config/utils.js';

export const signupCitizen = async (req, res) => {
    try {
        const { nickname, name, email, password, phone, address } = req.body;
        if (!nickname || !email || !password) {
            return res.status(400).json({ success: false, message: 'nickname, email and password are required' });
        }
        const existingEmail = await Citizen.findOne({ email });
        if (existingEmail) return res.status(409).json({ success: false, message: 'Email already registered' });
        const existingNickname = await Citizen.findOne({ nickname });
        if (existingNickname) return res.status(409).json({ success: false, message: 'Nickname already taken' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const citizen = await Citizen.create({ nickname, name, email, password: hashed, phone, address });
        const token = generateToken(citizen._id);
        const safe = citizen.toObject();
        delete safe.password;
        res.status(201).json({ success: true, message: 'Account created', token, citizen: safe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create citizen' });
    }
};

export const loginCitizen = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'email and password are required' });
        const citizen = await Citizen.findOne({ email });
        if (!citizen) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, citizen.password);
        if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const token = generateToken(citizen._id);
        const safe = citizen.toObject();
        delete safe.password;
        res.json({ success: true, message: 'Login successful', token, citizen: safe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

export const checkCitizenAuth = (req, res) => {
    const safe = req.user?.toObject ? req.user.toObject() : req.user;
    if (safe) delete safe.password;
    res.json({ success: true, citizen: safe });
};

export const updateCitizenProfile = async (req, res) => {
    try {
        const updates = {};
        const allowed = ['nickname', 'name', 'phone', 'address'];
        allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        if (updates.nickname) {
            const exists = await Citizen.findOne({ nickname: updates.nickname, _id: { $ne: req.user._id } });
            if (exists) return res.status(409).json({ success: false, message: 'Nickname already taken' });
        }
        const updated = await Citizen.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({ success: true, citizen: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
};

export const getAllCitizens = async (_req, res) => {
    try {
        const citizens = await Citizen.find().select('-password');
        res.json(citizens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch citizens' });
    }
};

export const getCitizenById = async (req, res) => {
    try {
        const citizen = await Citizen.findById(req.params.id).select('-password');
        if (!citizen) return res.status(404).json({ message: 'Citizen not found' });
        res.json(citizen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch citizen' });
    }
};

export const deleteMyCitizenAccount = async (req, res) => {
    try {
        await Citizen.findByIdAndDelete(req.user._id);
        res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Deletion failed' });
    }
};
