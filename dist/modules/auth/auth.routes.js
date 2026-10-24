"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router_service_1 = require("../../core/router/router.service");
const router = (0, router_service_1.createRouter)();
(0, router_service_1.registerRoute)(router, "post", "/register", auth_controller_1.AuthController, "register", {
    status: 201,
    message: "User registered successfully",
});
(0, router_service_1.registerRoute)(router, "post", "/login", auth_controller_1.AuthController, "login", {
    status: 200,
    message: "Login successful",
});
(0, router_service_1.registerRoute)(router, "post", "/refresh", auth_controller_1.AuthController, "refresh", {
    status: 200,
    message: "Token refreshed",
});
(0, router_service_1.registerRoute)(router, "post", "/logout", auth_controller_1.AuthController, "logout", {
    status: 200,
    message: "Logout successful",
});
(0, router_service_1.registerRoute)(router, "get", "/me", auth_controller_1.AuthController, "me", {
    middleware: [auth_middleware_1.authenticateToken],
    status: 200,
    message: "User profile",
});
(0, router_service_1.registerRoute)(router, "get", "/dashboard", auth_controller_1.AuthController, "me", {
    middleware: [auth_middleware_1.authenticateToken],
    status: 200,
    message: "User profile",
});
(0, router_service_1.registerRoute)(router, "get", "/check", auth_controller_1.AuthController, "check", {
    middleware: [auth_middleware_1.authenticateToken],
    status: 200,
    message: "JWT Token is valid",
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map