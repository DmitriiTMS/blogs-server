import { Request, Response, NextFunction } from "express";
import { accessToApiCollection } from "../db/mongoDB";

export const apiLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const logEntry = {
    ip: userIp,
    url: req.originalUrl,
    date: new Date(),
  };

  await accessToApiCollection.insertOne(logEntry);

  const tenSecondsAgo = new Date(Date.now() - 10000);
  const count = await accessToApiCollection.countDocuments({
    ip: logEntry.ip,
    url: logEntry.url,
    date: { $gte: tenSecondsAgo },
  });

  console.log(count);
  next();
};
