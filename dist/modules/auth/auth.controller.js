"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async register(req, res) {
        const { email, password } = req.body ?? {};
        try {
            const user = await auth_service_1.AuthService.register(email, password);
            return res.status(201).json({ success: true, message: 'User registered successfully', data: { user } });
        }
        catch (err) {
            const status = err.status || 500;
            const message = err.message || 'Server error';
            return res.status(status).json({ success: false, message, data: null });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body ?? {};
        try {
            const result = await auth_service_1.AuthService.login(email, password);
            return res.status(200).json({ success: true, message: 'Login successful', data: result });
        }
        catch (err) {
            const status = err.status || 500;
            const message = err.message || 'Server error';
            return res.status(status).json({ success: false, message, data: null });
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Access token required', data: null });
            }
            const user = await auth_service_1.AuthService.me(req.user.userId);
            return res.status(200).json({ success: true, message: 'User profile', data: user });
        }
        catch (err) {
            const status = err.status || 500;
            const message = err.message || 'Server error';
            return res.status(status).json({ success: false, message, data: null });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map