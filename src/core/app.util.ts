import { Response } from "express";

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse {
  status: "SUCCESS" | "ERROR";
  message: string;
  code: number;
  errors: ApiError[];
}

export function sendSuccess(
  res: Response,
  status: number,
  message: string,
  data: unknown,
): Response {
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

export function sendError(
  res: Response,
  status: number,
  message: string,
  errors: ApiError[] = [],
): Response {
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