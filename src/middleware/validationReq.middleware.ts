import { Request, Response, NextFunction } from "express";
import { ValidatorAdapter } from "../lib/shared";
import { ValidationError } from "../lib/shared/validator/validator.adaptor";
import { StatusCodes } from "http-status-codes";

/**
 * VALIDATION MIDDLEWARE
 * @param schema
 * @returns
 */
function validationReq(schema: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = ValidatorAdapter.validate(schema, req.body);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Send validation error response
        res.status(StatusCodes.BAD_REQUEST).json({
          error: error.name,
          message: error.message,
          details: error.details.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      // Handle unexpected errors
      console.error("Unexpected Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    }
  };
}

export default validationReq;
