import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { fieldValidationBlog, idValidationBlog, fieldValidationBlogQuery } from "../validation/validationBlog";
import { validationBlogResultMiddleware } from "../middlewares/validationBlogResultMidleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { fieldValidationPostNotBlogId } from "../validation/validationPost";

export const blogsRouter = Router();

blogsRouter.get("/", fieldValidationBlogQuery, validationBlogResultMiddleware, blogsController.getAllBlogs);

blogsRouter.post("/", authSuperAdminMiddleware,
    fieldValidationBlog, validationBlogResultMiddleware, blogsController.createBlog);

blogsRouter.post("/:id/posts", authSuperAdminMiddleware,
                                idValidationBlog,
                                fieldValidationPostNotBlogId,
                                validationBlogResultMiddleware,
                                blogsController.createPostWithBlogsId
                            );

blogsRouter.get("/:id", idValidationBlog, validationBlogResultMiddleware, blogsController.getBlogById);
blogsRouter.put("/:id", authSuperAdminMiddleware, idValidationBlog, fieldValidationBlog, validationBlogResultMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", authSuperAdminMiddleware, idValidationBlog, validationBlogResultMiddleware, blogsController.deleteBlog);
