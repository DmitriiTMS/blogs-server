import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDB";
import { RequestCreateUser } from "../../types/users-types";
import { ResponseCodeUser } from "../../types/auth-types";

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

  async findBYCodeEmail(code: string): Promise<ResponseCodeUser> {
    const resultUser = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return resultUser;
  },

  async updateUserIsConfirmed(id: string) {
    return await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
        },
      }
    );
  },

  async updateUserPassword(id: string, password: string) {
    return await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password,
        },
      }
    );
  },

  async updateUserСonfirmationCode(id: string, code: string) {
    return await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
        },
      }
    );
  },

  async findByEmail(email: string): Promise<ResponseCodeUser> {
    return await usersCollection.findOne({ email });
  },
  async findByLogin(login: string): Promise<ResponseCodeUser> {
    return await usersCollection.findOne({ login });
  },

  // ------------------------------------------------------
 async getUsersByIds(userIds: ObjectId[]) {
  return await usersCollection
    .find({ _id: { $in: userIds } })
    .toArray();
  }
};
