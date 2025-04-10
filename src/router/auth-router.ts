import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { fielldsLoginAuth } from "../validation/validationAuth";
import { validationResultBodyMiddleware } from "../middlewares/validationResultBodyMiddleware";
import { accessTokenGuard } from "../middlewares/accessTokenGuard";
import { fieldValidationUserBody } from "../validation/validationUser";

export const authRouter = Router();

authRouter.post(
  "/login",
  fielldsLoginAuth,
  validationResultBodyMiddleware,
  authController.login
);

authRouter.get("/me", accessTokenGuard, authController.getMe);

authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);

authRouter.post(
  "/registration",
  fieldValidationUserBody,
  validationResultBodyMiddleware,
  authController.register
);

authRouter.post(
  "/registration-confirmation",
  authController.registrationConfirmation
);

authRouter.post(
  "/registration-email-resending",
  authController.registrationEmailResending
);
