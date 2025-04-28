import { jwtService } from "../adapterServices/jwt.service";
import { ResultStatus } from "../common/resultError/resultError";
import { commentsCollection, likeCollection } from "../db/mongoDB";
import { commentsRepository } from "../repository/comments/comments.repository";
import { commentsQueryRepository } from "../repository/comments/commentsQuery.repository";

import {
  CommentReqQueryFiltersPage,
  CommentRequest,
  CommentResponseRepository,
  LikeCommentRequest,
  ReactionType,
  RequestCommentUpdate,
} from "../types/comments";

const getUserCommentReaction = async (
  userId: string,
  commentId: string
): Promise<ReactionType> => {
  if (!userId || !commentId) return ReactionType.None;

  try {
    const userReaction = await commentsQueryRepository.findByUserAndCommentId(userId, commentId);
    return userReaction?.status || ReactionType.None;
  } catch (error) {
    console.error('Error getting user reaction:', error);
    return ReactionType.None;
  }
};

export const commentsService = {
  async getAllCommentsToPostId(
    postId: string,
    queryFilters: CommentReqQueryFiltersPage,
    userId: string
  ) {
    const sortBy =
      queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection =
      queryFilters.sortDirection !== "undefined"
        ? queryFilters.sortDirection
        : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const totalCount = await commentsCollection.countDocuments({ postId });

    const resQueryDto = {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };

    const comments = await commentsRepository.getCommentsToPostId(
      resQueryDto,
      postId
    );

    const pagesCount = Math.ceil(totalCount / pageSize);
    const resCommentItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      items: await Promise.all(comments.map( async (comment: CommentResponseRepository) => ({
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
          myStatus: await getUserCommentReaction(userId, comment._id.toString())
        },
      }))),
    };
    return resCommentItems;
  },

  async createComment(dtoComment: CommentRequest): Promise<string> {
    const newComment = {
      content: dtoComment.content,
      commentatorInfo: {
        userId: dtoComment.userId!,
        userLogin: dtoComment.userLogin!,
      },
      postId: dtoComment.postId,
      createdAt: new Date(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    const commentId = await commentsRepository.createComment(newComment);
    return commentId;
  },

  async updateComment(dtoCommentUpdate: RequestCommentUpdate) {
    const updateComment = {
      content: dtoCommentUpdate.content,
    };
    return await commentsRepository.updateComment(
      dtoCommentUpdate.commentId,
      updateComment.content
    );
  },

  async addReactionsService(dtoReaction: LikeCommentRequest) {
    if (!Object.values(ReactionType).includes(dtoReaction.status)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [
          {
            message: "likeStatus no [ None, Like, Dislike ]",
            field: "likeStatus",
          },
        ],
      };
    }


    let likeByUserId;
    likeByUserId = await commentsRepository.findLikeByUserId(dtoReaction.userId!, dtoReaction.commentId);
  

    if (!likeByUserId) {
      likeByUserId = await commentsRepository.createLikeInfo(dtoReaction);      

      if(dtoReaction.status === ReactionType.Like) {
        const totalCounLike = await likeCollection.countDocuments({status: "Like", commentId: dtoReaction.commentId})
        await commentsRepository.likeCountUpdate(String(dtoReaction.commentId), totalCounLike) 
        const totalCounDislike = await likeCollection.countDocuments({status: "Dislike", commentId: dtoReaction.commentId})
        await commentsRepository.dislikeCountUpdate(String(dtoReaction.commentId), totalCounDislike)  

        return {
          status: ResultStatus.Success,
          data: null,
          extensions: [],
        };
      }

      if(dtoReaction.status === ReactionType.Dislike) {

        const totalCounLike = await likeCollection.countDocuments({status: "Like", commentId: dtoReaction.commentId})
        await commentsRepository.likeCountUpdate(String(dtoReaction.commentId), totalCounLike) 

        const totalCounDislike = await likeCollection.countDocuments({status: "Dislike", commentId: dtoReaction.commentId})
        await commentsRepository.dislikeCountUpdate(String(dtoReaction.commentId), totalCounDislike)  
         
        return {
          status: ResultStatus.Success,
          data: null,
          extensions: [],
        };
      }

    }

    if (dtoReaction.status !== likeByUserId.status) {
      await commentsRepository.updateLikeByUserId(String(likeByUserId._id), dtoReaction.status);
    
      if(dtoReaction.status === ReactionType.None) {
        const totalCounLike = await likeCollection.countDocuments({status: "Like", commentId: dtoReaction.commentId})
        await commentsRepository.likeCountUpdate(String(dtoReaction.commentId), totalCounLike) 
        const totalCounDislike = await likeCollection.countDocuments({status: "Dislike", commentId: dtoReaction.commentId})
        await commentsRepository.dislikeCountUpdate(String(dtoReaction.commentId), totalCounDislike)  
        return {
          status: ResultStatus.Success,
          data: null,
          extensions: [],
        };

      }

      if(dtoReaction.status === ReactionType.Like) {
        const totalCounLike = await likeCollection.countDocuments({status: "Like", commentId: dtoReaction.commentId})
        await commentsRepository.likeCountUpdate(String(dtoReaction.commentId), totalCounLike) 
        const totalCounDislike = await likeCollection.countDocuments({status: "Dislike", commentId: dtoReaction.commentId})
        await commentsRepository.dislikeCountUpdate(String(dtoReaction.commentId), totalCounDislike)  
        return {
          status: ResultStatus.Success,
          data: null,
          extensions: [],
        };
      }

      if(dtoReaction.status === ReactionType.Dislike) {
        const totalCounLike = await likeCollection.countDocuments({status: "Like", commentId: dtoReaction.commentId})
        await commentsRepository.likeCountUpdate(String(dtoReaction.commentId), totalCounLike) 
        const totalCounDislike = await likeCollection.countDocuments({status: "Dislike", commentId: dtoReaction.commentId})
        await commentsRepository.dislikeCountUpdate(String(dtoReaction.commentId), totalCounDislike)  
        return {
          status: ResultStatus.Success,
          data: null,
          extensions: [],
        };
      }

    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};
