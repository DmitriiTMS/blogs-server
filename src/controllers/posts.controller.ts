import { Request, Response } from "express";
import { postsRepository } from "../repository/postsRepository";
import { SETTINGS } from "../settings/settings";
import { blogsRepository } from "../repository/blogsRepository";
import { ValidationError, validationResult } from "express-validator";

export const postsController = {
    getAllPosts(req: Request, res: Response) {
        const posts = postsRepository.getAll();
        res.status(SETTINGS.HTTP_STATUS.OK).json(posts);
    },

    createPost(req: Request, res: Response) {

        const { blogId } = req.body;
        const blogById = blogsRepository.getBlog(blogId)

        if(blogById) {
            const newPost = postsRepository.createPost(req.body, blogById)
            res.status(SETTINGS.HTTP_STATUS.GREATED).json(newPost);
            return
        }

    },

    getPostById(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.getPost(id);
        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        }
        res.status(SETTINGS.HTTP_STATUS.OK).json(post);
    },

    updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.updatePost(id, req.body)

        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        }

        res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    },

    deletePost(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.getPost(id)
        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        } else {
            postsRepository.deletePost(id)
            res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
            return;
        }
    },

}