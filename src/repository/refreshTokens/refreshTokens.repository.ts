import { ObjectId } from "mongodb";
import { refreshTokensCollection } from "../../db/mongoDB";

export const refreshTokensRepository = {
  async addRefreshToken(refreshToken: { refreshToken: string }) {
    return await refreshTokensCollection.insertOne(refreshToken);
  },

  async findByRefreshToken(refreshToken: string) {
    return await refreshTokensCollection.findOne({ refreshToken });
  },

  async deleteRefreshToken(id: string) {
    return await refreshTokensCollection.deleteOne({ _id: id });
  },
};
