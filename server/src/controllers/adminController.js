import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { generateToken } from '../config/utils.js';

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;
        if (!name || !email || !password || !department) return res.status(400).json({ message: 'name, email, password, department required' });
        const exists = await Admin.findOne({ email });
        if (exists) return res.status(409).json({ message: 'Email already in use' });
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ name, email, password: hashed, role, department });
        const safe = admin.toObject();
        delete safe.password;
        res.status(201).json({ message: 'Admin created', admin: safe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create admin' });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken(admin._id);
        const safe = admin.toObject();
        delete safe.password;
        res.json({ message: 'Login successful', token, admin: safe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
};

export const getAdmins = async (_req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch admins' });
    }
};

export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch admin' });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const updates = {};
        const allowed = ['name', 'role', 'department'];
        allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
        const updated = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update admin' });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete admin' });
    }
};
