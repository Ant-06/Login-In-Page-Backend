"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
exports.registerRoute = registerRoute;
require("reflect-metadata");
const express_1 = require("express");
const app_util_1 = require("../app.util");
const validator_service_1 = require("../validator/validator.service");
function createRouter() {
    return (0, express_1.Router)();
}
function registerRoute(router, method, path, controller, methodName, options = {}) {
    const handler = controller[methodName];
    if (typeof handler !== "function") {
        throw new Error(`Controller method "${methodName}" does not exist.`);
    }
    const dto = (0, validator_service_1.getValidatorDto)(controller, methodName);
    const status = options.status ?? 200;
    const message = options.message ?? "OK";
    const routeHandler = async (req, res, next) => {
        try {
            let body = req.body ?? {};
            if (dto) {
                const result = await (0, validator_service_1.validateDto)(dto, body);
                if (result.errors.length > 0) {
                    (0, app_util_1.sendError)(res, 400, "Validation failed", result.errors);
                    return;
                }
                body = result.instance;
            }
            const input = {
                body,
                params: req.params,
                query: req.query,
                user: req.user,
                cookies: req.cookies ?? {},
                setCookie: (name, value, cookieOptions) => {
                    res.cookie(name, value, cookieOptions);
                },
                clearCookie: (name, cookieOptions) => {
                    res.clearCookie(name, cookieOptions);
                },
            };
            const result = await handler.call(controller, input);
            if (result !== null &&
                typeof result === "object" &&
                "data" in result &&
                ("status" in result || "message" in result)) {
                const routeResult = result;
                (0, app_util_1.sendSuccess)(res, routeResult.status ?? status, routeResult.message ?? message, routeResult.data);
                return;
            }
            (0, app_util_1.sendSuccess)(res, status, message, result);
        }
        catch (error) {
            next(error);
        }
    };
    router[method](path, ...(options.middleware ?? []), routeHandler);
}
//# sourceMappingURL=router.service.js.map