import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";

export const securityDeviceController = {

    async getAllSessionDevices(req: Request, res: Response) {
         const { refreshToken } = req.cookies;
           if (!refreshToken) {
             res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
             return
           }
      },
}