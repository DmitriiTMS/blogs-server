import { usersRepository } from "../repository/users/usersRepository";
import { RequestCreateUser } from "../types/users-types";
import { bcryptService } from "../utils/bcrypt";

export const usersService = {

    async createUser(userDTO: RequestCreateUser): Promise<
        { userId: string } | { errorsMessages: Array<{ message: string, field: string }> }
    > {
        const loginUser = await usersRepository.findByLogin(userDTO.login);
        const emailUser = await usersRepository.findByEmail(userDTO.email);
        if (loginUser || emailUser) {
            return {
                errorsMessages: [
                    {
                        message: `${loginUser ? 'Login already exists in db' :
                            emailUser ? 'Email already exists in db' : null}`,
                        field: `${loginUser ? 'login' : emailUser ? 'email' : null}`
                    }
                ]
            };
        }

        const passwordHash = await bcryptService.generateHash(userDTO.password);

        const newUser = {
            login: userDTO.login,
            password: passwordHash,
            email: userDTO.email,
            createdAt: new Date(),
        };
        const userId = await usersRepository.createUser(newUser);
        return { userId };
    },

    async deleteUser(id: string) {
        await usersRepository.deleteUser(id);
    }

}