import Citizen from "../models/Citizen.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const accountId = decoded.userId || decoded.id || decoded._id;

        let account = await Citizen.findById(accountId).select("-password");
        let userType = "citizen";
        if (!account) {
            account = await Admin.findById(accountId).select("-password");
            userType = account ? "admin" : null;
        }

        if (!account) return res.status(404).json({ success: false, message: "Account not found" });

        req.user = account;
        req.userType = userType;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: error.message });
    }
}