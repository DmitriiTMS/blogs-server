import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { fieldValidationBlog } from "../validation/validationBlog";
import { validationBlogResultMiddleware } from "../middlewares/validationBlogResultMidleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.post("/", authSuperAdminMiddleware,
    fieldValidationBlog, validationBlogResultMiddleware, blogsController.createBlog);
blogsRouter.get("/:id", blogsController.getBlogById);
blogsRouter.put("/:id", authSuperAdminMiddleware,
    fieldValidationBlog, validationBlogResultMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", authSuperAdminMiddleware, blogsController.deleteBlog);
