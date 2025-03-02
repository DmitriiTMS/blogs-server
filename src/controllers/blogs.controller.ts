import { Request, Response } from "express";
import { blogsRepository } from "../repository/blogsRepository";
import { SETTINGS } from "../settings/settings";


export const blogsController = {
    getAllBlogs(req: Request, res: Response) {
        const blogs = blogsRepository.getAll();
        res.status(SETTINGS.STATUS.OK).json(blogs);
    }
}