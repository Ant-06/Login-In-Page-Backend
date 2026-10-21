"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, status, message, data) => {
    return res.status(status).json({
        response: { status: "SUCCESS", message, code: status, errors: [] },
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, status, message, errors = []) => {
    return res.status(status).json({
        response: { status: "ERROR", message, code: status, errors },
        data: null,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map