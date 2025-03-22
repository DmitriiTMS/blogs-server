import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { fieldValidationUserBody } from "../validation/validationUser";
import { validationResultMiddleware } from "../middlewares/validationResultMiddleware";

export const usersRouter = Router();

usersRouter.post('/',
    authSuperAdminMiddleware,
    fieldValidationUserBody, validationResultMiddleware,
    usersController.createUser)