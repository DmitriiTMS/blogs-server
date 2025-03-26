import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { postsQueryRepository } from "../repository/posts/postsQueryRepository";
import { commentsService } from "../services/comments.service";
import { commentsQueryRepository } from "../repository/comments/commentsQuery.repository";
import {
  CommentReqQueryFiltersPage,
  CommentResponseRepository,
  CommentView,
} from "../types/comments";
import { commentsRepository } from "../repository/comments/comments.repository";

export const commentsController = {
  async getAllCommentsToPostId(req: Request, res: Response) {
    const { postId } = req.params;
    const post = await postsQueryRepository.getPostsById(postId);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const filters: CommentReqQueryFiltersPage = {
      sortBy: String(sortBy),
      sortDirection: String(sortDirection),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const commentsToPostId = await commentsService.getAllCommentsToPostId(
      postId,
      filters
    );
    res.status(SETTINGS.HTTP_STATUS.OK).json({ ...commentsToPostId });
  },

  async createComment(req: Request, res: Response) {
    const { postId } = req.params;
    const post = await postsQueryRepository.getPostsById(postId);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { content } = req.body;
    const { userId, userLogin } = req.infoUser;

    const commentId = await commentsService.createComment({
      userId,
      userLogin,
      content,
      postId,
    });
    const comment = await commentsQueryRepository.getCommentById(commentId);
    const newComment = mapCommentDBToCommentView(comment);

    res.status(SETTINGS.HTTP_STATUS.GREATED).json(newComment);
    return;
  },

  async getOneComment(req: Request, res: Response) {
    const { id } = req.params;
    const commentDB = await commentsQueryRepository.getCommentById(id);
    if (!commentDB) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    const commentView = mapCommentDBToCommentView(commentDB);
    res.status(SETTINGS.HTTP_STATUS.OK).json(commentView);
  },

  async updateComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const commentDB = await commentsQueryRepository.getCommentById(commentId);
    if (!commentDB) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { userId } = req.infoUser;
    if (commentDB.commentatorInfo.userId !== userId) {
      res.sendStatus(SETTINGS.HTTP_STATUS.FORBIDDEN);
      return;
    }

    const { content } = req.body;
    await commentsService.updateComment({commentId,content});
    
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    return;
  },

  async deleteComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const commentDB = await commentsQueryRepository.getCommentById(commentId);
    if (!commentDB) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { userId } = req.infoUser;
    if (commentDB.commentatorInfo.userId !== userId) {
      res.sendStatus(SETTINGS.HTTP_STATUS.FORBIDDEN);
      return;
    }

    await commentsRepository.deleteComment(commentId);
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    return;
  },
};

const mapCommentDBToCommentView = (
  comment: CommentResponseRepository
): CommentView => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
};
