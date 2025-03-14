import { Request, Response } from "express";
import { postsRepository } from "../repository/postsRepository";
import { SETTINGS } from "../settings/settings";
import { blogsRepository } from "../repository/blogsRepository";
import { ValidationError, validationResult } from "express-validator";
import { BlogDto } from "../types/blog-types";
import { ObjectId } from "mongodb";

export const postsController = {
    async getAllPosts(req: Request, res: Response) {
        const posts = await postsRepository.getAll();
        const resPosts = posts.map((post) => {
            const { _id, ...resPost } = post;
            return {
                id: post._id,
                ...resPost,
            };
        });
        res.status(SETTINGS.HTTP_STATUS.OK).json(resPosts);
    },

    async createPost(req: Request, res: Response) {

        const { blogId } = req.body;
        const blogById: BlogDto = await blogsRepository.getBlog(blogId)

        if (blogById) {
            const newPost = await postsRepository.createPost(req.body, blogById)
            const { _id, ...resPost } = newPost;
            res.status(SETTINGS.HTTP_STATUS.GREATED).json({ id: newPost._id, ...resPost });
            return
        }
    },

    async getPostById(req: Request, res: Response) {
        const id = new ObjectId(req.params.id);
        const post = await postsRepository.getPost(id);
        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        }
        const { _id, ...resPost } = post;
        res.status(SETTINGS.HTTP_STATUS.OK).json({ id: post._id, ...resPost });
        return

    },

    async updatePost(req: Request, res: Response) {
        const id = new ObjectId(req.params.id);
        const post = await postsRepository.updatePost(id, req.body)

        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        }

        res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    },

    async deletePost(req: Request, res: Response) {
        const id = new ObjectId(req.params.id);
        const post = await postsRepository.getPost(id)
        if (!post) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        } else {
            await postsRepository.deletePost(id)
            res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
            return;
        }
    },

}