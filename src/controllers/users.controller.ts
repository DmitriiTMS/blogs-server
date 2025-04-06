import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { usersService } from "../services/users.service";
import { usersQueryRepository } from "../repository/users/usersQueryRepository";
import { ResponseCreateUser, ResponseCreateViewUser, UserReqQueryFilters } from "../types/users-types";

export const usersController = {

    async getAllUsers(req: Request, res: Response) {
        const {
            searchLoginTerm,
            searchEmailTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        } = req.query;

        const filters: UserReqQueryFilters = {
            searchLoginTerm: String(searchLoginTerm),
            searchEmailTerm: String(searchEmailTerm),
            sortBy: String(sortBy),
            sortDirection: String(sortDirection),
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
        };

        const usersItems = await usersQueryRepository.getAllUsers(filters);
        res.status(SETTINGS.HTTP_STATUS.OK).json(usersItems);
    },

    async createUser(req: Request, res: Response) {
        const { login, password, email } = req.body;

        const result = await usersService.createUser({ login, password, email });
        if ('errorsMessages' in result) {
            res.status(SETTINGS.HTTP_STATUS.BAD_REQUEST).json(result.errorsMessages);
            return
        }

        const newUser = await usersQueryRepository.getUserById(result.userId);
        if (!newUser) {
            res.status(SETTINGS.HTTP_STATUS.NOT_FOUND).json({ message: 'User not found' });
            return
        }
        const userView = mapUserDBToUserView(newUser)
        res.status(SETTINGS.HTTP_STATUS.GREATED).json(userView);
    },

    async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        const user = await usersQueryRepository.getUserById(id);
        if (!user) {
            res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
            return;
        }
        await usersService.deleteUser(id)
        res.sendStatus(SETTINGS.HTTP_STATUS.NO_CONTENT);
        return;
    }

}

const mapUserDBToUserView = (user: ResponseCreateUser): ResponseCreateViewUser => {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
