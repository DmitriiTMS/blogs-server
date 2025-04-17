import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { authService } from "../services/auth.service";
import { ResultStatus } from "../common/resultError/resultError";
import { refreshTokenQueryRepository } from "../repository/refreshTokens/refreshTokenQueryRepository";
import { refreshTokensRepository } from "../repository/refreshTokens/refreshTokens.repository";
import { jwtService } from "../adapterServices/jwt.service";

export const securityDeviceController = {
  async getAllSessionDevices(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    const result = await authService.veryfyRefreshTokenSession(refreshToken);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(SETTINGS.HTTP_STATUS.UNAUTHORIZATION);
      return;
    }

    res.status(SETTINGS.HTTP_STATUS.OK).json(result.data);
    return;
  },

  async closeAllSessions(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    const checkRefreshToken = await authService.checkRefreshSessionToken(
      refreshToken
    );

    if (checkRefreshToken.status !== ResultStatus.Success) {
      res.status(SETTINGS.HTTP_STATUS.UNAUTHORIZATION).json(checkRefreshToken);
      return;
    }

    const decodeRefreshToken = await jwtService.decodeToken(refreshToken);

    await refreshTokenQueryRepository.deleteSessions(decodeRefreshToken.userId, refreshToken);
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
  },

  async closeSession(req: Request, res: Response) {
    const { deviceId } = req.params;
    const session = await refreshTokensRepository.findByDevice(deviceId);

    if (!session) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    const { refreshToken } = req.cookies;
    const checkRefreshToken = await authService.checkRefreshSessionToken(
      refreshToken
    );

    if (checkRefreshToken.status !== ResultStatus.Success) {
      res.status(SETTINGS.HTTP_STATUS.UNAUTHORIZATION).json(checkRefreshToken);
      return;
    }

    const decodeRefreshToken = await jwtService.verifyToken(
      refreshToken,
      SETTINGS.JWT.SECRET_KEY
    );

    if (session.userId !== decodeRefreshToken?.userId!) {
      res.sendStatus(SETTINGS.HTTP_STATUS.FORBIDDEN);
      return;
    }

    await refreshTokenQueryRepository.deleteSessionByDeviceId(deviceId);
    res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
    return;
  },
};
