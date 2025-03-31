import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";
import { RequestCreateUser } from "../../types/users-types";

export const usersRepository = {
  async createUser(user: RequestCreateUser): Promise<string> {
    const newUser = await usersCollection.insertOne(user);
    return newUser.insertedId.toString();
  },

  async deleteUser(id: string) {
    return await usersCollection.deleteOne({ _id: new ObjectId(id) });
  },

  async getUserById(id: string) {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise<boolean> {
    const user = await usersCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },
};
