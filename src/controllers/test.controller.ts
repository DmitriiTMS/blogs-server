import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { DB_BLOGS } from "../db/DB";


export const clearDB = (req: Request, res: Response) => {
    DB_BLOGS.blogs = []
    res.status(SETTINGS.HTTP_STATUS.NO_CONTENT).json()
};