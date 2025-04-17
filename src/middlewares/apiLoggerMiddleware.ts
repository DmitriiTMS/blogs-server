import { Request, Response, NextFunction } from "express";
import { accessToApiCollection } from "../db/mongoDB";

export const apiLoggerMiddleware = (sec: number, countReq: number) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const originalUrl = req.originalUrl;

  const logEntry = {
    ip: userIp,
    url: originalUrl,
    date: new Date(),
  };

  await accessToApiCollection.insertOne(logEntry);

  const tenSecondsAgo = new Date(Date.now() - sec * 1000);
  const count = await accessToApiCollection.countDocuments({
    ip: logEntry.ip,
    url: logEntry.url,
    date: { $gte: tenSecondsAgo },
  });

  console.log("Count apiLoggerMiddleware = ", count);

  if(count > countReq) {
    res.sendStatus(429)
    return
  }


  next();
};
