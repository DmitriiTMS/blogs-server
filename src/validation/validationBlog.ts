import { body } from "express-validator";

const nameValidation = body("name")
  .exists()
  .withMessage("Name is required")
  .trim()
  .notEmpty()
  .withMessage("Name cannot be empty")
  .isString()
  .withMessage("The Name field must be a string")
  .isLength({ max: 15 })
  .withMessage("The Name field must be a maximum of 15 characters");

const descriptionValidation = body("description")
  .exists()
  .withMessage("Description is required")
  .trim()
  .notEmpty()
  .withMessage("Description cannot be empty")
  .isString()
  .withMessage("The Description field must be a string")
  .isLength({ max: 500 })
  .withMessage("The Description field must be a maximum of 500 characters");

const websiteUrlValidation = body("websiteUrl")
  .exists()
  .withMessage("WebsiteUrl is required")
  .trim()
  .notEmpty()
  .withMessage("WebsiteUrl cannot be empty")
  .isString()
  .withMessage("The WebsiteUrl field must be a string")
  .isLength({ max: 100 })
  .withMessage("The WebsiteUrl field must be a maximum of 100 characters")
  .custom((value) => {
    const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    if (!urlPattern.test(value)) {
      throw new Error();
    }
    return true;
  })
  .withMessage('The WebsiteUrl must be a valid URL starting with https://');

export const fieldValidationBlog = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
