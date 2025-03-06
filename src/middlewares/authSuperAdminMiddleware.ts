import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../settings/settings";

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'qwerty';

export const authSuperAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const auth = req.headers['authorization'] as string;

    if (!auth) {
        res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION)
        return;
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Basic') {
        res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
        return;
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
    }

    next()

}