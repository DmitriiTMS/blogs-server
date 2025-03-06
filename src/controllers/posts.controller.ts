import { Request, Response } from "express";
import { postsRepository } from "../repository/postsRepository";
import { SETTINGS } from "../settings/settings";
import { blogsRepository } from "../repository/blogsRepository";

export const postsController = {
    getAllPosts(req: Request, res: Response) {
        const posts = postsRepository.getAll();
        res.status(SETTINGS.HTTP_STATUS.OK).json(posts);
    },

    createPost(req: Request, res: Response) {

        const { blogId } = req.body;
        const blogById = blogsRepository.getBlog(blogId)

        if (!blogById) {
            res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json({
                errorsMessages: [
                    {
                        message: `Blog by id: ${blogId} not found`,
                        field: "blogId"
                    }
                ]
            });
            return;
        }

        const newPost = postsRepository.createPost(req.body, blogById)
        res.status(SETTINGS.HTTP_STATUS.GREATED).json(newPost);
    },

    getPostById(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.getPost(id);
        if (!post) {
            res.status(SETTINGS.HTTP_STATUS.NOT_FOUND).json();
            return;
        }
        res.status(SETTINGS.HTTP_STATUS.OK).json(post);
    },

    updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.updatePost(id, req.body)

        if (!post) {
            res.status(SETTINGS.HTTP_STATUS.NOT_FOUND).json();
            return;
        }

        const { blogId } = req.body;
        const blogById = blogsRepository.getBlog(blogId)

        if (!blogById) {
            res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json({
                errorsMessages: [
                    {
                        message: `Blog by id: ${blogId} not found`,
                        field: "blogId"
                    }
                ]
            });
            return;
        }

        res.status(SETTINGS.HTTP_STATUS.NO_CONTENT).json();
    },

    deletePost(req: Request, res: Response) {
        const { id } = req.params;
        const post = postsRepository.getPost(id)
        if (!post) {
            res.status(SETTINGS.HTTP_STATUS.NOT_FOUND).json();
            return;
        } else {
            postsRepository.deletePost(id)
            res.status(SETTINGS.HTTP_STATUS.NO_CONTENT).json();
            return;
        }
    },

}