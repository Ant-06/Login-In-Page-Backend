"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = Validator;
exports.getValidatorDto = getValidatorDto;
exports.validateDto = validateDto;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const VALIDATOR_METADATA_KEY = "app:validator:dto";
function Validator(dto) {
    return (target, propertyKey) => {
        Reflect.defineMetadata(VALIDATOR_METADATA_KEY, dto, target, propertyKey);
    };
}
function getValidatorDto(target, propertyKey) {
    return Reflect.getMetadata(VALIDATOR_METADATA_KEY, target, propertyKey);
}
async function validateDto(dto, input) {
    const safeInput = input && typeof input === "object" && !Array.isArray(input)
        ? input
        : {};
    const instance = (0, class_transformer_1.plainToInstance)(dto, safeInput);
    const validationErrors = await (0, class_validator_1.validate)(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    const errors = validationErrors.flatMap((error) => {
        const messages = Object.values(error.constraints ?? {});
        return messages.map((message) => ({
            field: error.property,
            message,
        }));
    });
    return { instance, errors };
}
//# sourceMappingURL=validator.service.js.map