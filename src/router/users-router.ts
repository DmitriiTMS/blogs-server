import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { fieldValidationUserBody, fieldValidationUserQuery, idValidationUser } from "../validation/validationUser";
import { validationResultBodyMiddleware } from "../middlewares/validationResultBodyMiddleware";
import { validationResultQueryMiddleware } from "../middlewares/validationResultQueryMiddleware";
import { validationResultParamMiddleware } from "../middlewares/validationResultParamMiddleware";

export const usersRouter = Router();

usersRouter.get('/',
    authSuperAdminMiddleware,
    fieldValidationUserQuery, validationResultQueryMiddleware,
    usersController.getAllUsers)

usersRouter.post('/',
    authSuperAdminMiddleware,
    fieldValidationUserBody, validationResultBodyMiddleware,
    usersController.createUser)

usersRouter.delete('/:id',
    authSuperAdminMiddleware,
    idValidationUser, validationResultParamMiddleware,
    usersController.deleteUser)