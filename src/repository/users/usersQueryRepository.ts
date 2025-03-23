import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";
import { ResponseAllUsers, UserReqQueryFilters } from "../../types/users-types";

export const usersQueryRepository = {
    
    async getAllUsers(queryFilters: UserReqQueryFilters) {
        const searchLoginTerm = queryFilters.searchLoginTerm !== "undefined"
                ? queryFilters.searchLoginTerm
                : "";
        const searchEmailTerm = queryFilters.searchEmailTerm !== "undefined"
                ? queryFilters.searchEmailTerm
                : "";
        const sortBy = (queryFilters.sortBy !== "undefined" && queryFilters.sortBy) || "createdAt";
        const sortDirection = queryFilters.sortDirection !== "undefined"
                ? queryFilters.sortDirection
                : "desc";
        const pageNumber = !Number.isNaN(Number(queryFilters.pageNumber))
            ? Number(queryFilters.pageNumber)
            : 1;
        const pageSize = !Number.isNaN(Number(queryFilters.pageSize))
            ? Number(queryFilters.pageSize)
            : 10;

        const users = await usersCollection
            .find({
                ...(searchLoginTerm && searchEmailTerm
                    ? {
                        $or: [
                            { login: { $regex: searchLoginTerm, $options: "i" } },
                            { email: { $regex: searchEmailTerm, $options: "i" } },
                        ],
                    }
                    : searchLoginTerm
                        ? { login: { $regex: searchLoginTerm, $options: "i" } }
                        : searchEmailTerm
                            ? { email: { $regex: searchEmailTerm, $options: "i" } }
                            : {}),
            })
            .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();

        const resUsers = users.map((user: ResponseAllUsers) => {
            return this.mapUserToResUser(user);
        });

        const filter = searchLoginTerm
            ? { login: { $regex: searchLoginTerm, $options: "i" } }
            : searchEmailTerm
                ? { email: { $regex: searchEmailTerm, $options: "i" } }
                : {};
        const totalCount = await usersCollection.countDocuments(filter);

        const pagesCount = Math.ceil(totalCount / pageSize);

        const resUsersItems = {
            pagesCount: +pagesCount,
            page: totalCount ? +pageNumber : 0,
            pageSize: totalCount ? +pageSize : 0,
            totalCount: +totalCount,
            items: [...resUsers],
        };
        return resUsersItems;
    },

    async getUserById(id: string) {
        return await usersCollection.findOne({ _id: new ObjectId(id) });
    },

    mapUserToResUser(user: ResponseAllUsers) {
        return {
            id: String(user._id),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
};
