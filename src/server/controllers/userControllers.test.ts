import { type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcryptjs";
import User from "../../database/models/User";
import { mockLoginRequest, mockLoginResponse } from "../../mocks/loginMocks";
import { loginUser, registerUser } from "./userControllers";
import { type UserCredentials } from "../../database/types";
import { CustomError } from "../../CustomError/CustomError";
import {
  mockBadRegisterRequest as mockInvalidRegisterRequest,
  mockRegisterRequest,
  mockRegisterResponse,
} from "../../mocks/registerMocks";

beforeEach(() => jest.clearAllMocks());

const mockNext: NextFunction = jest.fn();

describe("Given a loginUser controller", () => {
  const userCredentials: UserCredentials = {
    email: "mock@user.com",
    password: "12345678",
  };
  mockLoginRequest.body = userCredentials;

  describe("When it receives a request with a body that includes a correct email address and password combination", () => {
    test("Then it should call the response's status method with code 200", async () => {
      const expectedStatusCode = 200;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(userCredentials),
      }));
      jwt.sign = jest.fn().mockReturnValue({
        token: "abc",
      });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(
        mockLoginRequest,
        mockLoginResponse as Response,
        mockNext
      );

      expect(mockLoginResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's JSON method with a token", async () => {
      const expectedResponseBody = { email: "mock@user.com", token: "abc" };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(userCredentials),
      }));
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValue("abc");

      await loginUser(
        mockLoginRequest,
        mockLoginResponse as Response,
        mockNext
      );

      expect(mockLoginResponse.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives a request with a body that includes an unregistered email address", () => {
    test("Then it should invoke the received next function with status code 401 and message 'User does not exist'", async () => {
      const authError = new CustomError(
        "User does not exist",
        401,
        "Wrong credentials"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(undefined),
      }));

      await loginUser(
        mockLoginRequest,
        mockLoginResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(authError);
    });
  });

  describe("When it receives a request with a body that includes an existing email address with an incorrect password", () => {
    test("Then it should invoke the received next function with status code 401 and message 'Wrong credentials'", async () => {
      const authError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({ userCredentials }),
      }));
      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      await loginUser(
        mockLoginRequest,
        mockLoginResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(authError);
    });
  });

  describe("When there is a general error in the login process", () => {
    test("Then the next function should be invoked with a custom error", async () => {
      const customError = new CustomError(
        "Internal server error",
        500,
        "Internal server error"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error("Internal server error");
      });

      await loginUser(
        mockLoginRequest,
        mockLoginResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a registerUser controller", () => {
  describe("When it receives a request with a valid username, email address and password", () => {
    test("Then it should call the response's status method with code 201", async () => {
      const expectedStatusCode = 201;
      const mockUser = {
        username: "test",
        email: "test@test.com",
        password: "testtesttest",
      };
      const hashedPassword = "hashedTestPassword123";

      mockRegisterRequest.body = mockUser;
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest
        .fn()
        .mockResolvedValue({ ...mockUser, password: hashedPassword });

      await registerUser(
        mockRegisterRequest,
        mockRegisterResponse as Response,
        mockNext
      );

      expect(mockRegisterResponse.status).toHaveBeenCalledWith(
        expectedStatusCode
      );
    });

    test("Then it should call the response's JSON method with the message 'User registered successfully'", async () => {
      const expectedMessage = { message: "User registered successfully" };
      const mockUser = {
        username: "test",
        email: "test@test.com",
        password: "testtest",
      };
      const hashedPassword = "hashedTestPassword123";

      mockRegisterRequest.body = mockUser;
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest
        .fn()
        .mockResolvedValue({ ...mockUser, password: hashedPassword });

      await registerUser(
        mockRegisterRequest,
        mockRegisterResponse as Response,
        mockNext
      );

      expect(mockRegisterResponse.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with a username and a password, without an email address", () => {
    test("Then it should invoke the received next function with status code 500 and error message 'Couldn't register the user'", async () => {
      const mockUser = {
        username: "test",
        password: "testtesttest",
      };

      const error = new Error("Couldn't register the user");
      const registerError = new CustomError(
        error.message,
        500,
        "Couldn't register the user"
      );

      mockInvalidRegisterRequest.body = mockUser;
      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(
        mockRegisterRequest,
        mockRegisterResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(registerError);
    });
  });
});
