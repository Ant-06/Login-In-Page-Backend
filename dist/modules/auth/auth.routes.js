"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Registration and login
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
// Protected routes
router.get('/me', auth_middleware_1.authenticateToken, auth_controller_1.AuthController.me);
router.get('/dashboard', auth_middleware_1.authenticateToken, auth_controller_1.AuthController.me); // backward compatible
router.get('/check', auth_middleware_1.authenticateToken, async (req, res) => {
    // req.user set by middleware
    // @ts-ignore
    const user = req.user;
    return res.status(200).json({
        success: true,
        message: 'JWT Token is valid',
        tokenValid: true,
        user: { id: user?.userId, email: user?.email }
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map