import { ObjectId } from "mongodb";
import { postsCollection } from "../../db/mongoDB";

export const postsQueryRepository = {
  async getPostsById(id: string) {
    return await postsCollection.findOne({ _id: new ObjectId(id) });
  },
};
