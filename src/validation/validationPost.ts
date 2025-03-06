import { body } from "express-validator";

const titleValidation = body("title")
    .exists()
    .withMessage("Title is required")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isString()
    .withMessage("The Title field must be a string")
    .trim()
    .isLength({ max: 30 })
    .withMessage("The Title field must be a maximum of 30 characters");


const shortDescriptionValidation = body("shortDescription")
    .exists()
    .withMessage("ShortDescription is required")
    .notEmpty()
    .withMessage("ShortDescription cannot be empty")
    .isString()
    .withMessage("The ShortDescription field must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("The ShortDescription field must be a maximum of 100 characters");

const contentValidation = body("content")
    .exists()
    .withMessage("Content is required")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isString()
    .withMessage("The Content field must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("The Content field must be a maximum of 1000 characters");


const blogIdValidation = body("blogId")
    .exists()
    .withMessage("BlogId is required")
    .notEmpty()
    .withMessage("BlogId cannot be empty")
    .isString()
    .withMessage("The BlogId field must be a string")
    .trim()


export const fieldValidationPost = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];

