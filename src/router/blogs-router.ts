import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { fieldValidationBlog, idValidationBlog } from "../validation/validationBlog";
import { validationBlogResultMiddleware } from "../middlewares/validationBlogResultMidleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.post("/", authSuperAdminMiddleware,
    fieldValidationBlog, validationBlogResultMiddleware, blogsController.createBlog);
blogsRouter.get("/:id", idValidationBlog, validationBlogResultMiddleware, blogsController.getBlogById);
blogsRouter.put("/:id", authSuperAdminMiddleware, idValidationBlog, fieldValidationBlog, validationBlogResultMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", authSuperAdminMiddleware, idValidationBlog, validationBlogResultMiddleware, blogsController.deleteBlog);
