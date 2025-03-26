import { commentsCollection } from "../db/mongoDB";
import { commentsRepository } from "../repository/comments/comments.repository";
import {
  CommentReqQueryFiltersPage,
  CommentRequest,
  CommentResponseRepository,
  RequestCommentUpdate,
} from "../types/comments";

export const commentsService = {
  async getAllCommentsToPostId(
    postId: string,
    queryFilters: CommentReqQueryFiltersPage
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
      items: comments.map((comment: CommentResponseRepository) => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
      })),
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
};
