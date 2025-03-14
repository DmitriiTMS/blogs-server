import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { blogsCollection, postsCollection } from "../db/mongoDB";


export const clearDB = (req: Request, res: Response) => {
    blogsCollection.drop()
    postsCollection.drop()
    res.status(SETTINGS.HTTP_STATUS.NO_CONTENT).json()
};