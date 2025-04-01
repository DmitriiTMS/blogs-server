import { jwtService } from "../adapterServices/jwt.service";
import { nodemailerService } from "../adapterServices/nodemailer.service";
import { ResultStatus } from "../common/resultError/resultError";
import { usersRepository } from "../repository/users/usersRepository";
import { RequestLoginUser, RequestRegisterUser } from "../types/auth-types";
import { bcryptService } from "../utils/bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";

export const emailExamples = {
  registrationEmail(code: string) {
      return ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:<br>
                <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>`
  },
  passwordRecoveryEmail(code: string) {
      return `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
  }
}

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
      user._id.toString(),
      user.login
    );
    return {
      status: ResultStatus.Success,
      data: { accessToken },
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
        extensions: [{ message: "Not Found user by email", field: "email" }],
      };

    const userLogin = await usersRepository.findByLogin(login);
    if (userLogin)
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ message: "Not Found user by login", field: "login" }],
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
      .sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode, emailExamples.registrationEmail)
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

    // const codeUser = user.emailConfirmation.confirmationCode ? user.emailConfirmation.confirmationCode : randomUUID()

    nodemailerService
      .sendEmail(user.email, randomUUID(), emailExamples.passwordRecoveryEmail)
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};
