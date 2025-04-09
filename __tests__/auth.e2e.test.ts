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
      login: "user1",
      email: "user1@mail.ru",
      password: "123456",
    };

    await usersRepository.createUser(user);
  });

  afterAll(async () => {
    await closeDB();
  });

  it("login: if user not found --- LOGIN", async () => {
    const user = {
      login: "user2",
      email: "user1@mail.ru",
      password: "123456",
    };
    await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({ loginOrEmail: user.login, password: user.password })
      .expect(401);
  });

  it("email: if user not found --- EMAIL", async () => {
    const user = {
      login: "user1",
      email: "user2@mail.ru",
      password: "123456",
    };
    await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({ loginOrEmail: user.email, password: user.password })
      .expect(401);
  });

  it("get me not token", async () => {
    await request(app)
      .get(`${SETTINGS.PATH.AUTH}/me`)
      .auth("", { type: "bearer" })
      .expect(401);

    await request(app)
      .get(`${SETTINGS.PATH.AUTH}/me`)
      .auth("wefwafw13134134", { type: "bearer" })
      .expect(401);
  });
  it("user refresh page", async () => {
    const user = {
      login: "user23231",
      email: "user2424@mail.ru",
      password: "123456",
    };

    await request(app)
      .post(`${SETTINGS.PATH.USERS}`)
      .auth("admin", "qwerty")
      .send({
        login: user.login,
        email: user.email,
        password: user.password,
      })
      .expect(201);

    const resLoginUser = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .expect(200);

    const accessToken = resLoginUser.body.accessToken;
    // const refreshToken = resLoginUser.headers["set-cookie"];

    const userInfo = await request(app)
      .get(`${SETTINGS.PATH.AUTH}/me`)
      .auth(accessToken, { type: "bearer" })
      .expect(200);

      expect(userInfo.body).toEqual({
        userId: expect.any(String),
        email: user.email,
        login: user.login
      })
  });
});
