import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { fieldValidationBlog, idValidationBlog, fieldValidationBlogQuery, fieldValidationBlogQueryNotSearchName } from "../validation/validationBlog";
import { validationBlogResultMiddleware } from "../middlewares/validationBlogResultMidleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { blogIdValidation, fieldValidationPostNotBlogId } from "../validation/validationPost";

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

blogsRouter.get("/:id/posts", idValidationBlog, fieldValidationBlogQueryNotSearchName,
                                validationBlogResultMiddleware, blogsController.getBlogByIdPost);


blogsRouter.put("/:id", authSuperAdminMiddleware, idValidationBlog, fieldValidationBlog, validationBlogResultMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", authSuperAdminMiddleware, idValidationBlog, validationBlogResultMiddleware, blogsController.deleteBlog);
