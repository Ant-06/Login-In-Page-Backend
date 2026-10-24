"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, status, message, data) {
    return res.status(status).json({
        response: {
            status: "SUCCESS",
            message,
            code: status,
            errors: [],
        },
        data,
    });
}
function sendError(res, status, message, errors = []) {
    return res.status(status).json({
        response: {
            status: "ERROR",
            message,
            code: status,
            errors,
        },
        data: null,
    });
}
//# sourceMappingURL=app.util.js.map