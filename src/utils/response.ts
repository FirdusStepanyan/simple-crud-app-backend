import { Response } from "express";

export const sendResponse = (
  res: Response,
  data: any = null,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    message,
    status_code: statusCode,
    data,
  });
};
