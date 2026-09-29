"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ success: false, message });
};
exports.default = errorHandler;
//# sourceMappingURL=error.middleware.js.map