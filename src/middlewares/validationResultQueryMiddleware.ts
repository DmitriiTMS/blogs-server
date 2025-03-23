import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { SETTINGS } from "../settings/settings";

export const validationResultQueryMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    const errors = validationResult(req).formatWith((error) => {
        const validationError = error as ValidationError & { path: string };
        return {
          message: validationError.msg, 
          queryParam: validationError.path, 
        };
      });

  if (!errors.isEmpty()) {
    res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json({
      errorsMessages: errors.array({ onlyFirstError: true }),
    });
    return;
  }

  next();
};