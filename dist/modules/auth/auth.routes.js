"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const response_1 = require("../../utils/response");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_dto_1 = require("./auth.dto");
const router = (0, express_1.Router)();
// Registration and login
router.post("/register", (0, validation_middleware_1.validateBody)(auth_dto_1.RegisterDto), auth_controller_1.AuthController.register);
router.post("/login", (0, validation_middleware_1.validateBody)(auth_dto_1.LoginDto), auth_controller_1.AuthController.login);
router.post("/refresh", auth_controller_1.AuthController.refresh);
router.post("/logout", auth_controller_1.AuthController.logout);
// Protected routes
router.get("/me", auth_middleware_1.authenticateToken, auth_controller_1.AuthController.me);
router.get("/dashboard", auth_middleware_1.authenticateToken, auth_controller_1.AuthController.me); // backward compatible
router.get("/check", auth_middleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    return (0, response_1.sendSuccess)(res, 200, "JWT Token is valid", {
        tokenValid: true,
        user: { id: user?.userId, email: user?.email },
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map