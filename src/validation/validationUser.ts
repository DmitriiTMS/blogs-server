import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

export const idValidationUser = param("id")
    .custom((value) => {
        if (!ObjectId.isValid(value)) {
            throw new Error('ID not type ObjectId user');
        }
        return true
    });

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
    .custom((value) => {
        const urlPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!urlPattern.test(value)) {
            throw new Error('The Login must be a valid ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
        }
        return true;
    });



const searchLoginTermValidationQuery = query("searchLoginTerm")
    .optional()
    .isString()
    .withMessage("The searchLoginTerm field must be a string")

const searchEmailTermValidationQuery = query("searchEmailTerm")
    .optional()
    .isString()
    .withMessage("The searchEmailTerm field must be a string")

const sortByValidationQuery = query("sortBy")
    .optional()
    .isString()
    .withMessage("The sortBy field must be a string")

const sortDirectionValidationQuery = query("sortDirection")
    .optional()
    .isIn(['asc', 'desc', ''])
    .withMessage("The sortBy field must be a 'asc' or'desc")

const pageNumberValidationQuery = query("pageNumber")
    .optional()
    .custom((value) => {
        if (value === undefined || value === "") return true;
        const parsedValue = Number(value);
        if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 4294967295) {
            throw new Error("Page number must be a positive integer between 1 and 4294967295");
        }
        return true;
    })
    .toInt();

const pageSizeValidationQuery = query("pageSize")
    .optional()
    .custom((value) => {
        if (value === undefined || value === "") return true;
        const parsedValue = Number(value);
        if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 4294967295) {
            throw new Error("Page size must be a positive integer between 1 and 4294967295");
        }
        return true;
    })
    .toInt();

export const fieldValidationUserQuery = [
    searchLoginTermValidationQuery,
    searchEmailTermValidationQuery,
    sortByValidationQuery,
    sortDirectionValidationQuery,
    pageNumberValidationQuery,
    pageSizeValidationQuery
]

export const fieldValidationUserBody = [
    loginValidation,
    passwordValidation,
    emailValidation
]