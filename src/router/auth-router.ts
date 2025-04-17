import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { fielldsLoginAuth } from "../validation/validationAuth";
import { validationResultBodyMiddleware } from "../middlewares/validationResultBodyMiddleware";
import { accessTokenGuard } from "../middlewares/accessTokenGuard";
import { fieldValidationUserBody } from "../validation/validationUser";
import { apiLoggerMiddleware } from "../middlewares/apiLoggerMiddleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  apiLoggerMiddleware(10, 5),
  fielldsLoginAuth,
  validationResultBodyMiddleware,
  authController.login
);

authRouter.get("/me", accessTokenGuard, authController.getMe);

authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);

authRouter.post(
  "/registration",
  apiLoggerMiddleware(10, 5),
  fieldValidationUserBody,
  validationResultBodyMiddleware,
  authController.register
);

authRouter.post(
  "/registration-confirmation",
  apiLoggerMiddleware(10, 5),
  authController.registrationConfirmation
);

authRouter.post(
  "/registration-email-resending",
  apiLoggerMiddleware(10, 5),
  authController.registrationEmailResending
);
