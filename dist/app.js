"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const createApp = () => {
    const app = (0, express_1.default)();
    // CORS with allowed origins from env
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'];
    app.use((0, cors_1.default)({ origin: allowedOrigins }));
    app.use(express_1.default.json());
    // routes
    app.use('/api/auth', auth_routes_1.default);
    // error handling
    app.use(error_middleware_1.default);
    // health route
    app.get('/', (req, res) => {
        res.json({ success: true, message: 'Angular Login API is running' });
    });
    return app;
};
exports.default = createApp;
//# sourceMappingURL=app.js.map