import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost, idValidationPost } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";




export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.post("/", authSuperAdminMiddleware,
        fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", idValidationPost, validationPostResultMiddleware, postsController.getPostById);
postsRouter.put("/:id", authSuperAdminMiddleware, idValidationPost,
        fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", idValidationPost, validationPostResultMiddleware, authSuperAdminMiddleware, postsController.deletePost);

