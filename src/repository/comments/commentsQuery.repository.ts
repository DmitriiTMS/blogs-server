import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/mongoDB";

export const commentsQueryRepository = {
  async getCommentById(id: string) {
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
  },

  async getCommentByUserId(userId: string) {
    return await commentsCollection.findOne({ commentatorInfo: {userId} });
  },

};
