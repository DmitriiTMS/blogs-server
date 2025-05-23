import { jwtService } from "../adapterServices/jwt.service";
import { nodemailerService } from "../adapterServices/nodemailer.service";
import { ResultStatus } from "../common/resultError/resultError";
import { commentsRepository } from "../repository/comments/comments.repository";
import { refreshTokenQueryRepository } from "../repository/refreshTokens/refreshTokenQueryRepository";
import { refreshTokensRepository } from "../repository/refreshTokens/refreshTokens.repository";
import { usersRepository } from "../repository/users/usersRepository";
import { SETTINGS } from "../settings/settings";
import { RequestLoginUser, RequestRegisterUser } from "../types/auth-types";
import { bcryptService } from "../utils/bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { LikeCommentRequest, ReactionType } from "../types/comments";

export const emailExamples = {
  registrationEmail(code: string) {
    return `<h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:<br>
                <a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a>
            </p>`;
  },
};

export const emailPasswordRecovery = {
  passwordEmail(recoveryCode: string) {
    return `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;
  },
};

export const authService = {
  async loginUser(loginDTO: RequestLoginUser) {
    const user = await usersRepository.findByLoginOrEmail(
      loginDTO.loginOrEmail
    );
    if (!user)
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not Found",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };

    const checkPasswordUser = await bcryptService.checkPassword(
      loginDTO.password,
      user.password
    );

    if (!checkPasswordUser) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "Bad Request",
        extensions: [{ field: "password", message: "Wrong password" }],
      };
    }

    const accessToken = await jwtService.createToken(
      SETTINGS.JWT.TIME,
      user._id.toString(),
      user.login
    );

    const deviceId = randomUUID();
    const refreshToken = await jwtService.createToken(
      SETTINGS.JWT.TIME_REFRESH,
      user._id.toString(),
      user.login,
      deviceId
    );

    await refreshTokensRepository.addRefreshToken({ refreshToken });
    await this.createDeviceUsers(refreshToken, loginDTO.ip!, loginDTO.title!);
    const dtoReaction: LikeCommentRequest = {
          status: ReactionType.None,
          userId: user._id.toString(),
          commentId: '',
          accessToken
        };
    await commentsRepository.createLikeInfo(dtoReaction);

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },

  async createDeviceUsers(refreshToken: string, ip: string, title: string) {
    const decodeRefreshToken = await jwtService.verifyToken(
      refreshToken,
      SETTINGS.JWT.SECRET_KEY
    );

    if (!decodeRefreshToken || !ip || !title) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: "!decodeRefreshToken || !ip || !title" }],
      };
    }

    const session = {
      ip: ip === "::1" ? "127.0.0.1" : ip,
      title,
      lastActiveDate: new Date(decodeRefreshToken.iat! * 1000).toISOString(),
      deviceId: decodeRefreshToken?.deviceId,
      userId: decodeRefreshToken.userId,
      refreshToken,
    };

    await refreshTokensRepository.createSession(session);
    return true;
  },

  async veryfyRefreshTokenSession(refreshToken: string) {
    const checkRefreshToken = await this.checkRefreshSessionToken(refreshToken);
    if (checkRefreshToken.status !== ResultStatus.Success) {
      return checkRefreshToken;
    }

    const token = await jwtService.decodeToken(refreshToken);

    const sessions = await refreshTokensRepository.getAllSessions(token.userId);
    const resSessions = sessions.map((item) => {
      return {
        ip: item.ip,
        title: item.title,
        lastActiveDate: item.lastActiveDate,
        deviceId: item.deviceId,
      };
    });

    return {
      status: ResultStatus.Success,
      data: resSessions,
      extensions: [],
    };
  },

  async verifyRefreshToken(refreshToken: string) {
    const decodeRefreshToken = await jwtService.verifyToken(
      refreshToken,
      SETTINGS.JWT.SECRET_KEY
    );

    if (!decodeRefreshToken) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ code: "INVALID_REFRESH_TOKEN" }],
      };
    }
    const token = await refreshTokensRepository.findByRefreshToken(
      refreshToken
    );

    if (!token) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: null,
      };
    }

    await refreshTokensRepository.deleteRefreshToken(token._id);

    const newAccessToken = await jwtService.createToken(
      SETTINGS.JWT.TIME,
      decodeRefreshToken.userId,
      decodeRefreshToken.userLogin
    );
    const newRefreshToken = await jwtService.createToken(
      SETTINGS.JWT.TIME_REFRESH,
      decodeRefreshToken.userId,
      decodeRefreshToken.userLogin,
      decodeRefreshToken.deviceId
    );

    await refreshTokensRepository.addRefreshToken({
      refreshToken: newRefreshToken,
    });

    const decodeNewRefreshToken = await jwtService.decodeToken(newRefreshToken);

    await refreshTokensRepository.updateSessionLastActiveDate(
      decodeRefreshToken.deviceId!,
      refreshToken, // старый refreshToken (для проверки)
      newRefreshToken, // новый refreshToken
      new Date(decodeNewRefreshToken.iat! * 1000).toISOString() // новое lastActiveDate
    );

    return {
      status: ResultStatus.Success,
      data: { newAccessToken, newRefreshToken },
      extensions: [],
    };
  },

  async logout(refreshToken: string) {
    const decodeRefreshToken = await jwtService.verifyToken(
      refreshToken,
      SETTINGS.JWT.SECRET_KEY
    );
    if (!decodeRefreshToken) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ code: "INVALID_REFRESH_TOKEN" }],
      };
    }
    const token = await refreshTokensRepository.findByRefreshToken(
      refreshToken
    );
    if (!token) {
      return {
        status: ResultStatus.NotFound,
        data: [],
        extensions: [],
      };
    }

    await refreshTokenQueryRepository.deleteSessionByDeviceId(
      decodeRefreshToken.deviceId!
    );

    await commentsRepository.logoutUpdateRemoveAccessToken(decodeRefreshToken.userId)
    return {
      status: ResultStatus.Success,
      data: token,
      extensions: [],
    };
  },

  async registerUser(registerUserDTO: RequestRegisterUser) {
    const { login, email } = registerUserDTO;
    const userEmail = await usersRepository.findByEmail(email);
    if (userEmail)
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "user by email", field: "email" }],
      };

    const userLogin = await usersRepository.findByLogin(login);
    if (userLogin)
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "user by login", field: "login" }],
      };

    const passwordHash = await bcryptService.generateHash(
      registerUserDTO.password
    );

    const newUser = {
      login: registerUserDTO.login,
      password: passwordHash,
      email: registerUserDTO.email,
      createdAt: new Date(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    await usersRepository.createUser(newUser);

    nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail
      )
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  },

  async registrationConfirmationUser(code: string) {
    const isUuid = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ).test(code);

    if (!isUuid) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "Incorrect code", field: "code" }],
      };
    }

    const resultUser = await usersRepository.findBYCodeEmail(code);
    if (!resultUser) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "NotFound",
        extensions: [{ message: "Confirmation code NotFound", field: "code" }],
      };
    }

    if (resultUser.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "BadRequest",
        extensions: [{ message: "Confirmation code expired", field: "code" }],
      };
    }

    if (resultUser.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "BadRequest",
        extensions: [{ message: "Confirmation code true", field: "code" }],
      };
    }

    await usersRepository.updateUserIsConfirmed(resultUser._id.toString());

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async registrationEmailResendingUser(email: string) {
    const isEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(email);

    if (!isEmail) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "Incorrect email", field: "email" }],
      };
    }

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "NotFound",
        extensions: [{ message: "User be email NotFound", field: "email" }],
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "Confirmation code true", field: "email" }],
      };
    }

    const newConfirmationCode = randomUUID();

    await usersRepository.updateUserСonfirmationCode(
      user._id.toString(),
      newConfirmationCode
    );

    nodemailerService
      .sendEmail(
        user.email,
        newConfirmationCode,
        emailExamples.registrationEmail
      )
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async checkRefreshSessionToken(refreshToken: string) {
    if (!refreshToken) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ message: "RefreshToken not found" }],
      };
    }

    const decodeRefreshToken = await jwtService.verifyToken(
      refreshToken,
      SETTINGS.JWT.SECRET_KEY
    );

    if (!decodeRefreshToken) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ message: "INVALID_REFRESH_TOKEN" }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: [],
      extensions: [],
    };
  },

  async passwordRecoveryService(email: string) {
    const isEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(email);
    if (!isEmail) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "Incorrect email", field: "email" }],
      };
    }

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    const recoveryCode = randomUUID();

    nodemailerService
      .sendEmail(user.email, recoveryCode, emailPasswordRecovery.passwordEmail)
      .catch((er) => console.error("error in send email:", er));

    await usersRepository.updateUserСonfirmationCode(
      user._id.toString(),
      recoveryCode
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async newPasswordService(newPassword: string, recoveryCode: string) {
    const isUuid = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ).test(recoveryCode);

    if (!isUuid) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [
          { message: "Incorrect recoveryCode", field: "recoveryCode" },
        ],
      };
    }

    const resultUser = await usersRepository.findBYCodeEmail(recoveryCode);
    if (!resultUser) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "NotFound",
        extensions: [
          {
            message: "Confirmation recoveryCode NotFound",
            field: "recoveryCode",
          },
        ],
      };
    }

    if (resultUser.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "BadRequest",
        extensions: [
          {
            message: "Confirmation recoveryCode expired",
            field: "recoveryCode",
          },
        ],
      };
    }

    const passwordHash = await bcryptService.generateHash(newPassword);
    await usersRepository.updateUserPassword(
      resultUser._id.toString(),
      passwordHash
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};
