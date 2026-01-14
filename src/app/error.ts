import { Request, Response, NextFunction } from "express";
import multer from "multer";
import httpStatus from "http-status-codes";

/**
 * ==== Not Found ====
 * @param {express.Request}_req
 * @param {express.Response}_res
 * @param {express.NextFunction} next
 */

// region Not found Handle
const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new Error("Resource Not Found");
  (error as any).status = 404;
  next(error);
};

/**
 * ==== Error Handler ====
 * @param {Error} error
 * @param {express.Request}_req
 * @param {express.Response}_res
 * @param {express.NextFunction} next
 * @returns
 */

// region Error handle
const errorHandlerMiddleware = (
  error: any,
  _req: Request,
  _res: Response | any,
  next: NextFunction
) => {
  console.log("I am who is responsible for this error", error);
  if (_res.headersSent) {
    return next(error);
  }

  const status = (error as any).status || 500;
  const message = error.message || "Something went wrong!";
  return _res.status(status).json({ message });
};

/**
 * ==== Multer Error Handler ====
 * @param error
 * @param _req
 * @param res
 * @param next
 */
// region Multer-Error Handle
const multerErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(httpStatus.EXPECTATION_FAILED).json({
        message:
          'Unexpected field name. Please use "avatar" as the field name for file upload.',
        error: error.message,
        name: error.name,
      });
    } else {
      res.status(httpStatus.EXPECTATION_FAILED).json({
        message: "File Upload Failed!",
        error: error.message,
        name: error.name,
      });
    }
  }

  return next(error);
};

export { notFoundMiddleware, errorHandlerMiddleware, multerErrorHandler };
