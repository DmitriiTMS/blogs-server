import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

const searchNameTermValidationQuery = query("searchNameTerm")
  .optional()
  .isString()
  .withMessage("The SearchNameTerm field must be a string")

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
  .isInt({ min: 0, max: 4294967295 })
  .withMessage("Page pageNumber must be a number");

const pageSizeValidationQuery = query("pageSize")
  .optional()
  .isInt({ min: 0, max: 4294967295 })
  .withMessage("Page pageSize must be a number");


export const idValidationBlog = param("id")
  .custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new Error('ID not type ObjectId blog');
    }
    return true
  });

  export const idValidationBlogID = param("blogId")
  .custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new Error('BLOGID not type ObjectId blog');
    }
    return true
  });

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

export const fieldValidationBlogQuery = [
  searchNameTermValidationQuery,
  sortByValidationQuery,
  sortDirectionValidationQuery,
  pageNumberValidationQuery,
  pageSizeValidationQuery
]

export const fieldValidationBlogQueryNotSearchName = [
  sortByValidationQuery,
  sortDirectionValidationQuery,
  pageNumberValidationQuery,
  pageSizeValidationQuery
]