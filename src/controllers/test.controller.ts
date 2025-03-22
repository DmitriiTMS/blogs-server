import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { blogsCollection, postsCollection, usersCollection } from "../db/mongoDB";


export const clearDB = async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    res.status(SETTINGS.HTTP_STATUS.NO_CONTENT).json()
};