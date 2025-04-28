import { ObjectId } from "mongodb";
import { commentsCollection, likeCollection } from "../../db/mongoDB";
import {
  CommentReqQueryFiltersPage,
  CommentRequestRepository,
  LikeCommentRequest,
  LikeCommentResponse,
  ReactionType,
} from "../../types/comments";


export const commentsRepository = {
  async createComment(dtoComment: CommentRequestRepository) {
    const newComment = await commentsCollection.insertOne(dtoComment);
    return newComment.insertedId.toString();
  },

  async getCommentsToPostId(
    queryFilters: CommentReqQueryFiltersPage,
    id: string
  ) {
    return await commentsCollection
      .find({ postId: id })
      .sort({
        [queryFilters.sortBy]: queryFilters.sortDirection === "asc" ? 1 : -1,
      })
      .skip((queryFilters.pageNumber - 1) * queryFilters.pageSize)
      .limit(queryFilters.pageSize)
      .toArray();
  },

  async updateComment(id: string, commentDto: string) {
    return await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: commentDto,
        },
      }
    );
  },

  async getCommentById(id: string) {
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
  },

  async deleteComment(id: string) {
    return await commentsCollection.deleteOne({ _id: new ObjectId(id) });
  },

  async createLikeInfo(dtoReaction: LikeCommentRequest) {
    const result = await likeCollection.insertOne(dtoReaction);
    return await likeCollection.findOne({ _id: result.insertedId });
  },

  async findOneAndUpdateLikeInfo(dtoReaction: LikeCommentRequest) {
    const result =  await likeCollection.findOneAndUpdate(
      { userId: dtoReaction.userId },
      {
        $set: {
          commentId: dtoReaction.commentId,
          status: dtoReaction.status
        },
      }
    );
    return result
  },

  async findLikeByUserId(userId: string, commentId: string): Promise<LikeCommentResponse> {
    const result = await likeCollection.findOne({ userId, commentId });
    return result;
  },



  async logoutUpdateRemoveAccessToken(userId: string): Promise<LikeCommentResponse> {
    return await likeCollection.updateMany(
      { userId },
      { $set: { accessToken: null } }
  );
  },


  async updateLikeByUserId(id: string, likeStatus: ReactionType) {
    return await likeCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: likeStatus,
        },
      }
    );
  },

  async likeCountUpdate(id: string, count: number) {
    return await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "likesInfo.likesCount": count,
        },
      }
    );
  },

  async dislikeCountUpdate(id: string, count: number) {
    return await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "likesInfo.dislikesCount": count,
        },
      }
    );
  },
};
