import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { SETTINGS } from "../settings/settings";
import { ResultStatus } from "../common/resultError/resultError";
import { usersQueryRepository } from "../repository/users/usersQueryRepository";
import { refreshTokensRepository } from "../repository/refreshTokens/refreshTokens.repository";
import { jwtService } from "../adapterServices/jwt.service";

export const authController = {
  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;
    const { ip } = req;
    const title = req.headers["user-agent"];
    const result = await authService.loginUser({
      loginOrEmail,
      password,
      title,
      ip,
    });
    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.UNAUTHORIZATION)
        .json(...result.extensions);
      return;
    }

    res.cookie("refreshToken", result.data!.refreshToken, {
      httpOnly: true,
      secure: true,
    });
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

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }
    
    const decodeRefreshToken = await jwtService.decodeToken(refreshToken);
    const tokenInDb = await refreshTokensRepository.findByDevice(
      decodeRefreshToken.deviceId
    );

    if (!tokenInDb) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }

    const result = await authService.verifyRefreshToken(refreshToken);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }
    res.cookie("refreshToken", result.data!.newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(SETTINGS.HTTP_STATUS.OK).json({
      accessToken: result!.data!.newAccessToken,
    });
  },

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }

    const decodeRefreshToken = await jwtService.decodeToken(refreshToken);
    const tokenInDb = await refreshTokensRepository.findByDevice(
      decodeRefreshToken.deviceId
    );

    if (!tokenInDb) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }

    const result = await authService.logout(refreshToken);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }

    await refreshTokensRepository.deleteRefreshToken(result.data._id);

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    return;
  },

  async register(req: Request, res: Response) {
    const { login, email, password } = req.body;

    const result = await authService.registerUser({ login, password, email });
    if (result.status === ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
      return;
    }
    res
      .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
      .json({ errorsMessages: result.extensions });
    return;
  },

  async registrationConfirmation(req: Request, res: Response) {
    const { code } = req.body;

    const result = await authService.registrationConfirmationUser(code);

    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  async registrationEmailResending(req: Request, res: Response) {
    const { email } = req.body;

    const result = await authService.registrationEmailResendingUser(email);

    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  async passwordRecovery(req: Request, res: Response) {
    const { email } = req.body;

    const result = await authService.passwordRecoveryService(email)

    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    
  },

  async newPassword(req: Request, res: Response) {
    const { newPassword, recoveryCode } = req.body;
     const result = await authService.newPasswordService(newPassword, recoveryCode)

    if (result.status !== ResultStatus.Success) {
      res
        .status(SETTINGS.HTTP_STATUS.BAD_REQUEST)
        .json({ errorsMessages: result.extensions });
      return;
    }

    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    
  },
};
