import request from "supertest";
import { app } from "../src/app";
import { SETTINGS } from "../src/settings/settings";
import { MongoMemoryServer } from "mongodb-memory-server";
import { closeDB, runDB, usersCollection } from "../src/db/mongoDB";
import { usersRepository } from "../src/repository/users/usersRepository";

describe("/auth", () => {
    
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await runDB(uri);
    await request(app).delete("/testing/all-data").expect(204);

    const user = {
        login: 'user1',
        email: 'user1@mail.ru',
        password: '123456'
    }

    await usersRepository.createUser(user)
  });

  afterAll(async () => {
    await closeDB();
  });

  it("login: if user not found --- LOGIN", async () => {
    const user = {
        login: 'user2',
        email: 'user1@mail.ru',
        password: '123456'
    }
    await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({ loginOrEmail: user.login,  password: user.password })
      .expect(401);
  });

  it("email: if user not found --- EMAIL", async () => {
    const user = {
        login: 'user1',
        email: 'user2@mail.ru',
        password: '123456'
    }
    await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({ loginOrEmail: user.email,  password: user.password })
      .expect(401);
  });
});
