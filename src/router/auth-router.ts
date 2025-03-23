import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { fielldsLoginAuth } from "../validation/validationAuth";
import { validationResultBodyMiddleware } from "../middlewares/validationResultBodyMiddleware";

export const authRouter = Router();

authRouter.post('/login', fielldsLoginAuth, validationResultBodyMiddleware, authController.login)