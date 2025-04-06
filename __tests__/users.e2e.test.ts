import request from "supertest";
import { app } from "../src/app";
import { SETTINGS } from "../src/settings/settings";
import { MongoMemoryServer } from "mongodb-memory-server";
import { closeDB, runDB } from "../src/db/mongoDB";
import { usersRepository } from "../src/repository/users/usersRepository";
import { usersQueryRepository } from "../src/repository/users/usersQueryRepository";

describe("/users", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await runDB(uri);
    await request(app).delete("/testing/all-data").expect(204);
  });

  afterAll(async () => {
    await closeDB();
  });

  it("create user 201", async () => {
    const user = {
      login: "user1",
      email: "user1@mail.ru",
      password: "123456",
    };

    const newUser = await request(app)
      .post(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty")
      .send({
        login: user.login,
        email: user.email,
        password: user.password,
      })
      .expect(201);

    expect(newUser.body).toEqual({
      id: expect.any(String),
      login: user.login,
      email: user.email,
      createdAt: expect.any(String),
    });
  });

  it('shouldn`t create user with incorrect login: STATUS 400', async () => {
    const userDto = {
        login: '',
        email: 'user1@mail.ru',
        password: '123456',
    };
    await request(app)
      .post(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty")
      .send({ login: userDto.login, email: userDto.email, password: userDto.password })
      .expect(400);
  });
  it('shouldn`t create user with incorrect email: STATUS 400', async () => {
    const userDto = {
        login: 'user1',
        email: '',
        password: '123456',
    };
    await request(app)
      .post(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty")
      .send({ login: userDto.login, email: userDto.email, password: userDto.password })
      .expect(400);
  });

  it('shouldn`t create user with incorrect password: STATUS 400', async () => {
    const userDto = {
        login: 'user1',
        email: 'user1@mail.ru',
        password: '',
    };
    await request(app)
      .post(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty")
      .send({ login: userDto.login, email: userDto.email, password: userDto.password })
      .expect(400);
  });

//   it("user not created if user with login already exists", async () => {
//     const firstUser = {
//       login: "existingUser",
//       email: "user1@mail.com",
//       password: "Password123",
//     };

//     await request(app)
//       .post(SETTINGS.PATH.USERS)
//       .auth("admin", "qwerty")
//       .send(firstUser)
//       .expect(201);

//     const duplicateUser = {
//       login: "existingUser",
//       email: "user2@mail.com",
//       password: "Password456",
//     };

//     await request(app)
//       .post(SETTINGS.PATH.USERS)
//       .auth("admin", "qwerty")
//       .send(duplicateUser)
//       .expect(400);
//   });
});
