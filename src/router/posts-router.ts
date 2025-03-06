import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";



export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.post("/",authSuperAdminMiddleware,
        fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", postsController.getPostById);
postsRouter.put("/:id", authSuperAdminMiddleware,
        fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", authSuperAdminMiddleware, postsController.deletePost);

