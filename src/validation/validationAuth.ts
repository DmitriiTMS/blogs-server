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

export const newPasswordValidation = body("newPassword")
  .exists()
  .withMessage("newPassword is required")
  .trim()
  .notEmpty()
  .withMessage("newPassword cannot be empty")
  .isString()
  .withMessage("The newPassword field must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("The newPassword field must be a minimum 6 characters and maximum of 20 characters");

export const fielldsLoginAuth = [loginValidation, passwordValidation];
