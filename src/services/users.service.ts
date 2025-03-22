import { usersRepository } from "../repository/users/usersRepository";
import { RequestCreateUser } from "../types/users-types";

export const usersService = {

    async createUser(userDTO: RequestCreateUser): Promise<{ userId: string } | { errorsMessages: Array<{ message: string, field: string }> }> {
        const loginUser = await usersRepository.findByLogin(userDTO.login);
        const emailUser = await usersRepository.findByEmail(userDTO.email);
        if (loginUser || emailUser) {
            return {
                errorsMessages: [
                    {
                        message: `${loginUser ? 'Логин уже существует' : emailUser ? 'Email уже существует' : null}`,
                        field: `${loginUser ? 'login' : emailUser ? 'email' : null}`
                    }
                ]
            };
        }

        const newUser = {
            login: userDTO.login,
            password: userDTO.password,
            email: userDTO.email,
            createdAt: new Date(),
        };
        const userId = await usersRepository.createUser(newUser);
        return { userId };
    },


}