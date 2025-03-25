import { Request, Response } from "express";

import { SETTINGS } from "../settings/settings";
import { blogsRepository } from "../repository/blogsRepository";
import { Blog } from "../types/blog-types";
import { ObjectId } from "mongodb";
import { postsService } from "../services/posts.service";
import { PostReqQueryFilters } from "../types/post-types";
import { postsRepository } from "../repository/posts/postsRepository";

export const postsController = {
  async getAllPosts(req: Request, res: Response) {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const filters: PostReqQueryFilters = {
      sortBy: String(sortBy),
      sortDirection: String(sortDirection),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const postsItems = await postsService.getAll(filters);
    res.status(SETTINGS.HTTP_STATUS.OK).json(postsItems);
  },

  async createPost(req: Request, res: Response) {
    const { blogId }: { blogId: string } = req.body;
    const blogById: Blog = await blogsRepository.getBlog(new ObjectId(blogId));

    if (!blogById) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { description, websiteUrl, createdAt, isMembership, ...resBlogById } =
      blogById;

    if (blogById) {
      const newPost = await postsRepository.createPost(req.body, resBlogById);
      const { _id, ...resPost } = newPost;
      res
        .status(SETTINGS.HTTP_STATUS.GREATED)
        .json({ id: newPost._id, ...resPost });
      return;
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
    return;
  },

  async updatePost(req: Request, res: Response) {
    const { blogId }: { blogId: string } = req.body;
    const blogById: Blog = await blogsRepository.getBlog(new ObjectId(blogId));

    if (!blogById) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const id = new ObjectId(req.params.id);
    const post = await postsRepository.updatePost(id, req.body);

    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  async deletePost(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const post = await postsRepository.getPost(id);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    } else {
      await postsRepository.deletePost(id);
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return;
    }
  },
};
