import { ObjectId } from "mongodb";
import { commentsCollection, likeCollection } from "../../db/mongoDB";
import { LikeCommentResponse } from "../../types/comments";

export const commentsQueryRepository = {
  async getCommentById(id: string) {
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
  },

  async getCommentByUserId(userId: string) {
    return await commentsCollection.findOne({ commentatorInfo: {userId} });
  },

    async findByUserAndCommentId(userId: string, commentId: string, ): Promise<LikeCommentResponse> {
      const result = await likeCollection.findOne({ userId, commentId });
      return result;
    },

    async findByCommentId(commentId: string): Promise<LikeCommentResponse> {
      const result = await likeCollection.findOne({ commentId });
      return result;
    },

    async findByCommentIdMany(commentId: string): Promise<LikeCommentResponse[]> {
      const result = await likeCollection.find({ commentId }).toArray();
      return result;
    },

    async findAllReactions(): Promise<LikeCommentResponse[]> {
      const result = await likeCollection.find({}).toArray();
      return result;
    },

};
