import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost, idValidationPost } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { fieldValidationBlogQuery } from "../validation/validationBlog";




export const postsRouter = Router();

postsRouter.get("/", fieldValidationBlogQuery, validationPostResultMiddleware, postsController.getAllPosts);
postsRouter.post("/", authSuperAdminMiddleware,
        fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", idValidationPost, validationPostResultMiddleware, postsController.getPostById);
postsRouter.put("/:id", authSuperAdminMiddleware, idValidationPost,
        fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", idValidationPost, validationPostResultMiddleware, authSuperAdminMiddleware, postsController.deletePost);

