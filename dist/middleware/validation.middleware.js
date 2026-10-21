"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const response_1 = require("../utils/response");
const validateBody = (dto) => async (req, res, next) => {
    const input = req.body && typeof req.body === "object" ? req.body : {};
    const instance = (0, class_transformer_1.plainToInstance)(dto, input);
    const errors = await (0, class_validator_1.validate)(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
        const details = errors.flatMap((error) => {
            const messages = Object.values(error.constraints ?? {});
            return messages.map((message) => ({ field: error.property, message }));
        });
        return (0, response_1.sendError)(res, 400, "Validation failed", details);
    }
    req.body = instance;
    next();
};
exports.validateBody = validateBody;
//# sourceMappingURL=validation.middleware.js.map