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
        
        const errorsResult = validationResult(req).formatWith((error) => {
            const validationError = error as ValidationError & { path: string };
            return {
                message: validationError.msg,
                field: validationError.path,
            };
        });

        const { blogId } = req.body;
        const blogById = blogsRepository.getBlog(blogId)

        if (!blogById && !errorsResult.isEmpty()) {
            res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json({
                errorsMessages: errorsResult.array({ onlyFirstError: true }),
            });
            return;
            // res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json({
            //     errorsMessages: [
            //         {
            //             message: `Blog by id: ${blogId} not found`,
            //             field: "blogId"
            //         }
            //     ]
            // });
            // return;
        }

        const newPost = postsRepository.createPost(req.body, blogById!)
        res.status(SETTINGS.HTTP_STATUS.GREATED).json(newPost);
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