import { jwtService } from "../adapterServices/jwt.service";
import { nodemailerService } from "../adapterServices/nodemailer.service";
import { ResultStatus } from "../common/resultError/resultError";
import { usersRepository } from "../repository/users/usersRepository";
import { RequestLoginUser, RequestRegisterUser } from "../types/auth-types";
import { bcryptService } from "../utils/bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";

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
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user)
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "loginOrEmail", message: "Already Registered" }],
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
      )
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  },
};
