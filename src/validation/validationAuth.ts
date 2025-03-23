import { body } from "express-validator";

const loginValidation = body("loginOrEmail")
    .exists()
    .withMessage("LoginOrEmail is required")
    .trim()
    .notEmpty()
    .withMessage("LoginOrEmail cannot be empty")
    .isString()
    .withMessage("The LoginOrEmail field must be a string");

const passwordValidation = body("password")
    .exists()
    .withMessage("Password is required")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isString()
    .withMessage("The Password field must be a string");

export const fielldsLoginAuth = [
    loginValidation,
    passwordValidation
]