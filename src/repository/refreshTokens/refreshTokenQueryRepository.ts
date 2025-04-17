import { deviceInfoCollection } from "../../db/mongoDB";

export const refreshTokenQueryRepository = {
    async getAllSessions() {
        return await deviceInfoCollection.find({}).toArray();
    },

    async deleteSessions(userId: string, currentRefreshToken: string) {
        return await deviceInfoCollection.deleteMany({
            userId,
            refreshToken: { $ne: currentRefreshToken }
          });
    },

     async deleteSessionByDeviceId(deviceId: string) {
        return await deviceInfoCollection.deleteOne({ deviceId });
      },
}