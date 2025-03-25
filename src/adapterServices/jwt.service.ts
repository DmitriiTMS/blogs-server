import jwt from "jsonwebtoken";
import { SETTINGS } from "../settings/settings";

export const jwtService = {
  async createToken(userId: string, userLogin: string): Promise<string> {
    return jwt.sign({ userId, userLogin }, SETTINGS.JWT.SECRET_KEY, {
      expiresIn: SETTINGS.JWT.TIME,
    });
  },
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },
  async verifyToken(token: string): Promise<{ userId: string, userLogin: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT.SECRET_KEY) as { userId: string, userLogin: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};