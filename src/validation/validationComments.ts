import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

export const idValidationCommentID = param("commentId").custom((value) => {
  if (!ObjectId.isValid(value)) {
    throw new Error("CommentId not type ObjectId post");
  }
  return true;
});


export const idValidationCommment = param("id").custom((value) => {
  if (!ObjectId.isValid(value)) {
    throw new Error("ID comment not type ObjectId post");
  }
  return true;
});

export const contentCommentValidation = body("content")
  .exists()
  .withMessage("Content is required")
  .trim()
  .notEmpty()
  .withMessage("Content cannot be empty")
  .isString()
  .withMessage("The Content field must be a string")
  .isLength({ min: 20, max: 300 })
  .withMessage(
    "The Content field must be a minimum 20 characters and maximum of 300 characters"
  );

const sortByValidationQuery = query("sortBy")
  .optional()
  .isString()
  .withMessage("The sortBy field must be a string");

const sortDirectionValidationQuery = query("sortDirection")
  .optional()
  .isIn(["asc", "desc", ""])
  .withMessage("The sortBy field must be a 'asc' or'desc");

const pageNumberValidationQuery = query("pageNumber")
  .optional()
  .custom((value) => {
    if (value === undefined || value === "") return true;
    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 4294967295) {
      throw new Error(
        "Page number must be a positive integer between 1 and 4294967295"
      );
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
      throw new Error(
        "Page size must be a positive integer between 1 and 4294967295"
      );
    }
    return true;
  })
  .toInt();

export const fieldValidationComments = [
  sortByValidationQuery,
  sortDirectionValidationQuery,
  pageNumberValidationQuery,
  pageSizeValidationQuery,
];
