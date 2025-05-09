import { Request, Response, NextFunction } from "express";
import { jwtService } from "../adapterServices/jwt.service";
import { SETTINGS } from "../settings/settings";

export const accessTokenReactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers["authorization"]) {
    next();
    return
  }

  if(req.headers["authorization"]) {
    const [authType, token] = req.headers["authorization"].split(" ");
    if (authType !== "Bearer") {
        res.sendStatus(401);
        return;
      }
      const payload = await jwtService.verifyToken(token, SETTINGS.JWT.SECRET_KEY);
      if (payload) {
        const { userId, userLogin } = payload;
    
        req.infoUser = {
          userId,
          userLogin,
        };
    
        next();
        return;
      }
  }

};
