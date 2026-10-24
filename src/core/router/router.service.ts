import "reflect-metadata";

import {
  NextFunction,
  Request,
  Response,
  Router,
  RequestHandler,
} from "express";

import { sendSuccess, sendError } from "../app.util";
import {
  getValidatorDto,
  validateDto,
} from "../validator/validator.service";

export interface RouteInput {
  body: any;
  params: Request["params"];
  query: Request["query"];
  user?: any;
  cookies: Request["cookies"];
  setCookie: (name: string, value: string, options?: any) => void;
  clearCookie: (name: string, options?: any) => void;
}

export interface RouteResult {
  data: unknown;
  status?: number;
  message?: string;
}

type ControllerMethod = (
  input: RouteInput,
) => Promise<unknown> | unknown;

export interface RouteOptions {
  status?: number;
  message?: string;
  middleware?: RequestHandler[];
}

export function createRouter(): Router {
  return Router();
}

export function registerRoute(
  router: Router,
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  controller: object,
  methodName: string,
  options: RouteOptions = {},
): void {
  const handler = (controller as any)[methodName] as ControllerMethod;

  if (typeof handler !== "function") {
    throw new Error(`Controller method "${methodName}" does not exist.`);
  }

  const dto = getValidatorDto(controller, methodName);
  const status = options.status ?? 200;
  const message = options.message ?? "OK";

  const routeHandler: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let body = req.body ?? {};

      if (dto) {
        const result = await validateDto(dto, body);

        if (result.errors.length > 0) {
          sendError(res, 400, "Validation failed", result.errors);
          return;
        }

        body = result.instance;
      }

      const input: RouteInput = {
        body,
        params: req.params,
        query: req.query,
        user: (req as any).user,
        cookies: req.cookies ?? {},
        setCookie: (name, value, cookieOptions) => {
          res.cookie(name, value, cookieOptions);
        },
        clearCookie: (name, cookieOptions) => {
          res.clearCookie(name, cookieOptions);
        },
      };

      const result = await handler.call(controller, input);

      if (
        result !== null &&
        typeof result === "object" &&
        "data" in result &&
        ("status" in result || "message" in result)
      ) {
        const routeResult = result as RouteResult;

        sendSuccess(
          res,
          routeResult.status ?? status,
          routeResult.message ?? message,
          routeResult.data,
        );
        return;
      }

      sendSuccess(res, status, message, result);
    } catch (error) {
      next(error);
    }
  };

  (router as any)[method](
  path,
  ...(options.middleware ?? []),
  routeHandler,
);
}