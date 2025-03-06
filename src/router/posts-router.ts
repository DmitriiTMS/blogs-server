import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";



export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.post("/", fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", postsController.getPostById);
postsRouter.put("/:id", fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", postsController.deletePost);

