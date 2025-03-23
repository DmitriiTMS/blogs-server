import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";
import { RequestCreateUser } from "../../types/users-types";

export const usersRepository = {
    async createUser(user: RequestCreateUser): Promise<string> {
        const newUser = await usersCollection.insertOne(user);
        return newUser.insertedId.toString();
    },
    async findByLogin(login: string): Promise<string> {
        return await usersCollection.findOne({ login });
    },

    async findByEmail(email: string): Promise<string> {
        return await usersCollection.findOne({ email });
    },

    async deleteUser(id: string) {
        return await usersCollection.deleteOne({ _id: new ObjectId(id) });
    },
}