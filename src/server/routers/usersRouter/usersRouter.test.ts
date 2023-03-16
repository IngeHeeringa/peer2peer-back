import "../../../loadEnvironment";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import User from "../../../database/models/User";
import connectDatabase from "../../../database/connectDatabase";
import { app } from "../..";
import { type UserData, type UserCredentials } from "../../../database/types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const userData: UserData = {
  username: "user",
  password: "12345678",
  email: "mock@user.com",
};

const userCredentials: UserCredentials = {
  email: userData.email,
  password: userData.password,
};

describe("Given a POST '/users/login' endpoint", () => {
  describe("When it receives a request with email 'mock@user.com' and password '12345678'", () => {
    beforeAll(async () => {
      await User.create(userData);
    });

    test("Then it should respond with status code 200 and a token", async () => {
      const pathLogin = "/users/login";
      const expectedStatusCode = 200;
      const expectedProperty = "token";
      jwt.sign = jest.fn().mockReturnValue({
        token: "abc",
      });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      const response = await request(app)
        .post(pathLogin)
        .send(userCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(expectedProperty);
    });
  });

  describe("When it receives a request with email 'mock@user.com' and wrong password '87654321'", () => {
    beforeAll(async () => {
      await User.create(userData);
    });

    test("Then it should respond with status code 401 and error message 'Wrong credentials'", async () => {
      const userCredentialsWrongPassword: UserCredentials = {
        email: "mock@user.com",
        password: "87654321",
      };
      const endpoint = "/users/login";
      const expectedStatusCode = 401;
      const expectedErrorMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post(endpoint)
        .send(userCredentialsWrongPassword)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });

  describe("When it receives a request with an email from a user that doesn't exist in the database", () => {
    test("Then it should respond with status code 401 and error message 'Wrong credentials'", async () => {
      const endpoint = "/users/login";
      const expectedStatusCode = 401;
      const expectedErrorMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post(endpoint)
        .send(userCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe("Given a POST '/users/register' endpoint", () => {
  const pathRegister = "/users/register";

  describe("When it receives a request with username 'user', password '12345678' and email 'user@user.com'", () => {
    test("Then the response body should include the message 'User registered successfully'", async () => {
      const expectedStatusCode = 201;
      const expectedResponseBody = {
        message: "User registered successfully",
      };

      const response = await request(app)
        .post(pathRegister)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request and the user already exists in the database", () => {
    beforeEach(async () => {
      await User.create(userData);
    });

    test("Then it should respond with status code 500", async () => {
      const expectedStatusCode = 500;

      const response = await request(app)
        .post(pathRegister)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.status).toBe(expectedStatusCode);
    });

    test("Then it should respond with error message 'Couldn't register the user'", async () => {
      const expectedStatusCode = 500;
      const expectedErrorMessage = { error: "Couldn't register the user" };

      const response = await request(app)
        .post(pathRegister)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});
