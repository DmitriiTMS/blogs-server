import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";


export const usersQueryRepository = {
    async getUserById(id: string) {
        return await usersCollection.findOne({ _id: new ObjectId(id) });
    }
}