import { Request, Response } from "express";

import { SETTINGS } from "../settings/settings";
import { blogsRepository } from "../repository/blogsRepository";
import { Blog } from "../types/blog-types";
import { ObjectId } from "mongodb";
import { postsService } from "../services/posts.service";
import {
  LikePostRequest,
  PostReqQueryFilters,
  ReactionPostType,
} from "../types/post-types";
import { postsRepository } from "../repository/posts/postsRepository";
import { postsQueryRepository } from "../repository/posts/postsQueryRepository";
import { ResultStatus } from "../common/resultError/resultError";
import { usersRepository } from "../repository/users/usersRepository";

interface IPostLike {
  postId: string;
  userId: ObjectId;
  addedAt: Date;
  // другие возможные поля
}

export const postsController = {
  async getAllPosts(req: Request, res: Response) {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const filters: PostReqQueryFilters = {
      sortBy: String(sortBy),
      sortDirection: String(sortDirection),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const userId = req.infoUser?.userId || null;

    const postsItems = await postsService.getAll(filters, userId!);
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

    // if (blogById) {
    // const newPost = await postsRepository.createPost(req.body, resBlogById);
    const newPost = await postsService.createPost(req.body, resBlogById);
    const { _id, ...resPost } = newPost;
    res
      .status(SETTINGS.HTTP_STATUS.GREATED)
      .json({ id: newPost._id, ...resPost });
    return;
    // }
  },

  async getPostById(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const post = await postsRepository.getPost(id);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    const { _id, ...resPost } = post;
    const userId = req.infoUser?.userId || null;
    if (!userId) {
      resPost.extendedLikesInfo.myStatus = ReactionPostType.None;
    } else {
      const findStatusUser = await postsRepository.findReactionByUserIdAndPostId(
          userId,
          String(_id)
        );
      resPost.extendedLikesInfo.myStatus = findStatusUser?.status ?? ReactionPostType.None;
    }

    const likesThree = await postsRepository.getThreeLikes(String(_id));
    const newlikesThree = await Promise.all(
      likesThree.map(async (item: any) => {
        const { addedAt, userId } = item;
        const user = await usersRepository.getUserById(userId);
        return {
          addedAt,
          userId,
          login: user.login,
        };
      })
    );

    resPost.extendedLikesInfo.newestLikes = [...newlikesThree];
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

  async addReaction(req: Request, res: Response) {
    const { postId } = req.params;
    const { userId } = req.infoUser;
    const { likeStatus } = req.body;

    const post = await postsQueryRepository.getPostsById(postId);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const reaction: LikePostRequest = {
      postId,
      userId,
      status: likeStatus,
      addedAt: new Date(),
    };

    const result = await postsService.addReactionService(reaction);
    if (result.status === ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return;
    }
    res
      .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
      .json({ errorsMessages: result.extensions });
    return;
  },
};
