import { Router } from "express";
import { commentsController } from "../controllers/comments.controller";
import { postsRouter } from "./posts-router";
import { idValidationPostID } from "../validation/validationPost";
import { validationResultParamMiddleware } from "../middlewares/validationResultParamMiddleware";
import { accessTokenGuard } from "../middlewares/accessTokenGuard";

export const commentsRouter = Router();

postsRouter.post(
  "/:postId/comments",
  accessTokenGuard,
  idValidationPostID,
  validationResultParamMiddleware,
  commentsController.createComments
);
