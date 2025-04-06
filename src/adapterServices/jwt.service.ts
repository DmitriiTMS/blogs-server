import jwt from "jsonwebtoken";
import { SETTINGS } from "../settings/settings";

export const jwtService = {
  async createToken(time: number, userId?: string, userLogin?: string): Promise<string> {
    return jwt.sign({ userId, userLogin }, SETTINGS.JWT.SECRET_KEY, {
      expiresIn: time,
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
  async verifyToken(token: string, secretKey: string): Promise<{ userId: string, userLogin: string } | null> {
    try {
      return jwt.verify(token, secretKey, {ignoreExpiration: false}) as { userId: string, userLogin: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};