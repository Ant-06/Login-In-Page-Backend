"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access token required', tokenValid: false });
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ success: false, message: 'Invalid authorization format', tokenValid: false });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token', tokenValid: false });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map