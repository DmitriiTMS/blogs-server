import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";


export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getAllBlogs);