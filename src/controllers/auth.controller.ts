import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { SETTINGS } from "../settings/settings";
import { ResultStatus } from "../common/resultError/resultError";
import { usersQueryRepository } from "../repository/users/usersQueryRepository";

export const authController = {
  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;
    const result = await authService.loginUser({ loginOrEmail, password });
    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.UNAUTHORIZATION)
        .json(...result.extensions);
      return;
    }
    res
      .status(SETTINGS.HTTP_STATUS.OK)
      .json({ accessToken: result.data!.accessToken });
  },

  async getMe(req: Request, res: Response) {
    const user = await usersQueryRepository.getUserById(req.infoUser.userId!);
    if (!user) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(SETTINGS.HTTP_STATUS.OK).json({
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    });
  },

  async register(req: Request, res: Response) {
    
    const { login, email, password } = req.body;

    const result = await authService.registerUser({ login, password, email });
    if (result.status === ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return
    }
    res.sendStatus(SETTINGS.HTTP_STATUS.BAD_REQUEST);
    return
  },
};
