import { body } from "express-validator";

const loginValidation = body("login")
    .exists()
    .withMessage("Login is required")
    .trim()
    .notEmpty()
    .withMessage("Login cannot be empty")
    .isString()
    .withMessage("The Login field must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("The Login field must be a minimum 3 characters and maximum of 10 characters")
    .custom((value) => {
        const urlPattern = /^[a-zA-Z0-9_-]*$/;
        if (!urlPattern.test(value)) {
            throw new Error('The Login must be a valid ^[a-zA-Z0-9_-]*$');
        }
        return true;
    });

const passwordValidation = body("password")
    .exists()
    .withMessage("Password is required")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isString()
    .withMessage("The Password field must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("The Password field must be a minimum 6 characters and maximum of 20 characters");


const emailValidation = body("email")
    .exists()
    .withMessage("Email is required")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isString()
    .withMessage("The Email field must be a string")
    .isLength({ min: 6, max: 20 })
    .withMessage("The Login field must be a minimum 6 characters and maximum of 20 characters")
    .custom((value) => {
        const urlPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!urlPattern.test(value)) {
            throw new Error('The Login must be a valid ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
        }
        return true;
    });

export const fieldValidationUserBody = [
    loginValidation,
    passwordValidation,
    emailValidation
]