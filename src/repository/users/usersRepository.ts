import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";
import { RequestCreateUser } from "../../types/users-types";

export const usersRepository = {
    async createUser(user: RequestCreateUser): Promise<string> {
        const newUser = await usersCollection.insertOne(user);
        return newUser.insertedId.toString();
    },

    async getUserById(id: string) {
        return await usersCollection.findOne({ _id: new ObjectId(id) });
    },

    async findByLogin(login: string ) {
        return await usersCollection.findOne({ login });
    },

    async findByEmail(email: string ) {
        return await usersCollection.findOne({ email });
    },
}