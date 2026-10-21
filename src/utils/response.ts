import { Response } from "express";

export interface ApiError {
  field?: string;
  message: string;
}

export const sendSuccess = (
  res: Response,
  status: number,
  message: string,
  data: unknown,
) => {
  return res.status(status).json({
    response: { status: "SUCCESS", message, code: status, errors: [] },
    data,
  });
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  errors: ApiError[] = [],
) => {
  return res.status(status).json({
    response: { status: "ERROR", message, code: status, errors },
    data: null,
  });
};
