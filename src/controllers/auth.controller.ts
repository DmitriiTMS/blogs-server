import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { SETTINGS } from "../settings/settings";
import { ResultStatus } from "../common/resultError/resultError";

export const authController = {
  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;
    const result = await authService.loginUser({ loginOrEmail, password });
    if (result.status !== ResultStatus.Success) {
      res.status(SETTINGS.HTTP_STATUS.UNAUTHORIZATION).json(...result.extensions);
      return;
    }
    res.status(SETTINGS.HTTP_STATUS.GREATED).json({ accessToken: result.data!.accessToken });
  },
};
