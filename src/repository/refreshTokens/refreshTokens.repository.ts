import {
  deviceInfoCollection,
  refreshTokensCollection,
} from "../../db/mongoDB";
import { SeesionDevice, SessionDEviceDB } from "../../types/auth-types";

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

  async findByDevice(deviceId: string) {
    return await deviceInfoCollection.findOne({ deviceId });
  },

  async updateSessionLastActiveDate(deviceId: string,
    oldRefreshToken: string,
    newRefreshToken: string,
    lastActiveDate: string) {
    return await deviceInfoCollection.updateOne(
      { deviceId, refreshToken: oldRefreshToken },
      { $set: { refreshToken: newRefreshToken, lastActiveDate } }
    );
  },

  async deleteRefreshTokenSession(refreshToken: string) {
    return await deviceInfoCollection.deleteOne({ refreshToken });
  },

  async getAllSessions(userId: string): Promise<SessionDEviceDB[]> {
    return await deviceInfoCollection.find({userId}).toArray();
  },
};
