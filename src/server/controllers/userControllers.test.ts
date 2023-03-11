import { type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import { mockNext, mockRequest, mockResponse } from "../../mocks/loginMocks";
import loginUser from "./userControllers";
import { type UserCredentials } from "../../database/types";
import { CustomError } from "../../CustomError/CustomError";

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const userCredentials: UserCredentials = {
    email: "mock@user.com",
    password: "12345678",
  };
  mockRequest.body = userCredentials;

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

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's JSON method with a token", async () => {
      const expectedResponseBody = { email: "mock@user.com", token: "abc" };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(userCredentials),
      }));
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValue("abc");

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseBody);
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

      await loginUser(mockRequest, mockResponse as Response, mockNext);

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

      await loginUser(mockRequest, mockResponse as Response, mockNext);

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

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(customError);
    });
  });
});
