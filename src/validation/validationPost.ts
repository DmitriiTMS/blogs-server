import { body, param } from "express-validator";
import { blogsRepository } from "../repository/blogsRepository";
import { ObjectId } from "mongodb";

export const idValidationPost = param("id")
    .custom((value) => {
        if (!ObjectId.isValid(value)) {
            throw new Error("ID not type ObjectId post");
        }
        return true;
    })

const titleValidation = body("title")
    .exists()
    .withMessage("Title is required")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isString()
    .withMessage("The Title field must be a string")
    .isLength({ max: 30 })
    .withMessage("The Title field must be a maximum of 30 characters");

const shortDescriptionValidation = body("shortDescription")
    .exists()
    .withMessage("ShortDescription is required")
    .trim()
    .notEmpty()
    .withMessage("ShortDescription cannot be empty")
    .isString()
    .withMessage("The ShortDescription field must be a string")
    .isLength({ max: 100 })
    .withMessage(
        "The ShortDescription field must be a maximum of 100 characters"
    );

export const contentValidation = body("content")
    .exists()
    .withMessage("Content is required")
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isString()
    .withMessage("The Content field must be a string")
    .isLength({ max: 1000 })
    .withMessage("The Content field must be a maximum of 1000 characters");


export const blogIdValidation = body("blogId")
    .exists()
    .withMessage("BlogId is required")
    .trim()
    .notEmpty()
    .withMessage("BlogId cannot be empty")
    .isString()
    .withMessage("The BlogId field must be a string")
    .custom(async (value: string) => {
        if (!ObjectId.isValid(value)) {
            throw new Error("BlogId not ObjectId");
        }
        const blogExists = await blogsRepository.getBlog(new ObjectId(value));
        if (!blogExists) {
            throw new Error("BlogId Not found");
        }
        return true;
    })

export const fieldValidationPost = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    // blogIdValidation,
];

export const fieldValidationPostNotBlogId = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
];

