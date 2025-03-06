import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { fieldValidationBlog } from "../validation/validationBlog";
import { validationBlogResultMiddleware } from "../middlewares/validationBlogResultMidleware";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.post("/", fieldValidationBlog, validationBlogResultMiddleware, blogsController.createBlog);
blogsRouter.get("/:id", blogsController.getBlogById);
blogsRouter.put("/:id", fieldValidationBlog, validationBlogResultMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", blogsController.deleteBlog);
