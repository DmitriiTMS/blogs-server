import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost, idValidation } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";




export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.post("/", authSuperAdminMiddleware,
        fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", idValidation, validationPostResultMiddleware, postsController.getPostById);
postsRouter.put("/:id", authSuperAdminMiddleware, idValidation,
        fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", idValidation, validationPostResultMiddleware, authSuperAdminMiddleware, postsController.deletePost);

