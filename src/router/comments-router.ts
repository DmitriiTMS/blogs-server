import { Router } from "express";
import { commentsController } from "../controllers/comments.controller";
import { postsRouter } from "./posts-router";
import { idValidationPostID } from "../validation/validationPost";
import { accessTokenGuard } from "../middlewares/accessTokenGuard";
import { contentCommentValidation, fieldValidationComments, idValidationCommentID, idValidationCommment } from "../validation/validationComments";
import { validationResultBodyMiddleware } from "../middlewares/validationResultBodyMiddleware";

export const commentsRouter = Router();

postsRouter.post(
  "/:postId/comments",
  accessTokenGuard, 
  idValidationPostID,
  contentCommentValidation,
  validationResultBodyMiddleware,
  commentsController.createComment
);

postsRouter.get(
  "/:postId/comments",
  idValidationPostID, fieldValidationComments,validationResultBodyMiddleware,
  commentsController.getAllCommentsToPostId
);

commentsRouter.get(
  "/:id",
  idValidationCommment, validationResultBodyMiddleware,
  commentsController.getOneComment
);

commentsRouter.put(
  "/:commentId",
  accessTokenGuard,
  idValidationCommentID, contentCommentValidation, validationResultBodyMiddleware,
  commentsController.updateComment
);


commentsRouter.delete(
  "/:commentId",
  accessTokenGuard,
  idValidationCommentID, validationResultBodyMiddleware,
  commentsController.deleteComment
);



