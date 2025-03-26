import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/mongoDB";
import {
  CommentReqQueryFiltersPage,
  CommentRequestRepository,
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

  async deleteComment(id: string) {
    return await commentsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
