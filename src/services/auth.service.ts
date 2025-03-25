import { jwtService } from "../adapterServices/jwt.service";
import { ResultStatus } from "../common/resultError/resultError";
import { usersRepository } from "../repository/users/usersRepository";
import { RequestLoginUser } from "../types/auth-types";
import { bcryptService } from "../utils/bcrypt";

export const authService = {
  async loginUser(loginDTO: RequestLoginUser) {

    const user = await usersRepository.findByLoginOrEmail(loginDTO.loginOrEmail);
    if (!user)
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not Found",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };

    const checkPasswordUser = await bcryptService.checkPassword(loginDTO.password, user.password);
    if (!checkPasswordUser) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };
    }
    
   const accessToken = await jwtService.createToken(user._id.toString(), user.login);
    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },
};
