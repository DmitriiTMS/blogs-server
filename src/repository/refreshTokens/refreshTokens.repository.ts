import { deviceInfoCollection, refreshTokensCollection } from "../../db/mongoDB";
import { SeesionDevice } from "../../types/auth-types";

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

  async createSession(session: SeesionDevice) {
    return await deviceInfoCollection.insertOne(session);
  },

  async findByDeviceAndTimeRefreshToken(deviceId: string) {
    return await deviceInfoCollection.findOne({ deviceId });
  },

  async updateSessionLastActiveDate(deviceId: string, lastActiveDate: string) {
    return await deviceInfoCollection.updateOne(
      { deviceId },
      { $set: { lastActiveDate } }
    );
  }
};
