import { usersRepository } from "../repository/users/usersRepository";
import { RequestLoginUser } from "../types/auth-types";
import { bcryptService } from "../utils/bcrypt";

export const authService = {

    async loginUser(loginDTO: RequestLoginUser) {
        const result = await usersRepository.findByLoginOrEmail(loginDTO.loginOrEmail);
        if (!result) {
            return false
        }
        const checkPasswordUser = await bcryptService.checkPassword(loginDTO.password, result.password)
        if (!checkPasswordUser) {
            return false
        }
        return true
    }

}