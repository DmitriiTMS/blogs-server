import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { SETTINGS } from "../settings/settings";

export const authController = {
    async login(req: Request, res: Response) {
        const { loginOrEmail, password } = req.body;
        const result = await authService.loginUser({ loginOrEmail, password });                
        if (!result) {
            res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
            return;
        }
        res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    }
}