import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { postsQueryRepository } from "../repository/posts/postsQueryRepository";
import { commentsService } from "../services/comments.service";
import { commentsQueryRepository } from "../repository/comments/commentsQuery.repository";
import {
  CommentReqQueryFiltersPage,
  CommentResponseRepository,
  CommentView,
  LikeCommentRequest,
  ReactionType,
} from "../types/comments";
import { commentsRepository } from "../repository/comments/comments.repository";
import { ResultStatus } from "../common/resultError/resultError";

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
    const userId = req.infoUser?.userId || null;
    // const { userId } = req.infoUser

    const commentsToPostId = await commentsService.getAllCommentsToPostId(
      postId,
      filters,
      userId!
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
 
    const newComment = mapCommentDBToCommentView(comment, ReactionType.None);

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

    if (!req.headers.authorization) {
      const commentView = mapCommentDBToCommentView(commentDB, ReactionType.None);
      res.status(SETTINGS.HTTP_STATUS.OK).json(commentView);
      return;
    }  
  
    let reactionStatus = ReactionType.None;
    
    try {
      if (req.infoUser?.userId) {
        const userReaction = await commentsQueryRepository.findByUserAndCommentId(
          req.infoUser.userId, 
          id
        );
        reactionStatus = userReaction?.status || ReactionType.None;
      }
    } catch (error) {
      console.error('Error getting user reaction:', error);
      reactionStatus = ReactionType.None;
    }
  
    const commentView = mapCommentDBToCommentView(commentDB, reactionStatus);
    res.status(SETTINGS.HTTP_STATUS.OK).json(commentView);
  },

    
  //   const { id } = req.params;
  //   const commentDB = await commentsQueryRepository.getCommentById(id);
  //   if (!commentDB) {
  //     res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
  //     return;
  //   }


  //   if (!req.headers.authorization) {
  //     const commentView = mapCommentDBToCommentView(commentDB, ReactionType.None);
  //     res.status(SETTINGS.HTTP_STATUS.OK).json(commentView);
  //     return
  // }  

  //   let commentView;
  //   let reactionStatus = ReactionType.None;

    
  //   const infoReactionsAll = await commentsQueryRepository.findAllReactions();

      
  //   if (infoReactionsAll && infoReactionsAll.length > 0) {
     
  //     for (const element of infoReactionsAll) {          
  //         if (element.accessToken) {
  //             const userReaction = await commentsQueryRepository.findByUserAndCommentId(req.infoUser.userId!, id);
  //             if (userReaction) {
  //                   reactionStatus = userReaction.status;
  //                   break;
  //             }
  //         }

  //         if (!element.accessToken) {
  //           const userReaction = await commentsQueryRepository.findByCommentIdMany(id);
  //           if (userReaction) {
  //                 reactionStatus = ReactionType.None;
  //                 break;
  //           }

           
  //       }
  //     }
  //     commentView = mapCommentDBToCommentView(commentDB, reactionStatus);
  //     res.status(SETTINGS.HTTP_STATUS.OK).json(commentView);
  //     return
  // }

  // },

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
    await commentsService.updateComment({ commentId, content });

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

  async addReactions(req: Request, res: Response) {
    const { commentId } = req.params;
    const { likeStatus } = req.body;
    const { userId } = req.infoUser;

    const commentDB = await commentsQueryRepository.getCommentById(commentId);
    if (!commentDB) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const dtoReaction: LikeCommentRequest = {
      status: likeStatus,
      userId,
      commentId,
    };

    const result = await commentsService.addReactionsService(dtoReaction);

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

const mapCommentDBToCommentView = (
  comment: CommentResponseRepository,
   status: ReactionType
): CommentView => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: status
    },
  };
};
