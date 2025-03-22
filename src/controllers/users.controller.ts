import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { usersService } from "../services/users.service";
import { usersQueryRepository } from "../repository/users/usersQueryRepository";
import { ResponseCreateUser, ResponseCreateViewUser } from "../types/users-types";

export const usersController = {

    async createUser(req: Request, res: Response) {
        const { login, password, email } = req.body;

        const result = await usersService.createUser({ login, password, email });
        if('errorsMessages' in result) {
            res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json(result.errorsMessages);
            return
        }
        
        const newUser = await usersQueryRepository.getUserById(result.userId);
        if (!newUser) {
            res.status(SETTINGS.HTTP_STATUS.NOT_FOUND).json({ message: 'User no found' });
        }
        const userView = mapUserDBToUserView(newUser)
        res.status(SETTINGS.HTTP_STATUS.GREATED).json(userView);
    },

}

const mapUserDBToUserView = (user: ResponseCreateUser): ResponseCreateViewUser => {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
