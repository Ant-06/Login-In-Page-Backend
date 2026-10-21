import { NextFunction, Request, Response } from "express";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";
import { sendError } from "../utils/response";

export const validateBody =
  (dto: ClassConstructor<object>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body && typeof req.body === "object" ? req.body : {};
    const instance = plainToInstance(dto, input);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = errors.flatMap((error) => {
        const messages = Object.values(error.constraints ?? {});
        return messages.map((message) => ({ field: error.property, message }));
      });
      return sendError(res, 400, "Validation failed", details);
    }

    req.body = instance;
    next();
  };
