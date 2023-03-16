import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { type CustomRequest } from "../../types";
import auth from "./auth";
import jwt from "jsonwebtoken";

const mockNext = jest.fn() as NextFunction;
const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given an auth middleware", () => {
  describe("When it receives a request with an 'Authorization' header including a Bearer with a token", () => {
    test("Then it should invoke the received next function without an auth error", () => {
      const mockRequest = {
        header: jest
          .fn()
          .mockReturnValue(
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJtb2NrQHVzZXIuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.YPuy12VqswmM868VyJGPrrNSUWfyTC7GldVz2gLx9vU"
          ),
      } as Partial<CustomRequest>;

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const authError = new CustomError(
        "Missing authorization header",
        403,
        "Missing token"
      );

      jwt.verify = jest.fn().mockReturnValue("1234567890");

      mockRequest.userId = "1234567890";

      auth(mockRequest as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalledWith(authError);
    });
  });

  describe("When it receives a request without an 'Authorization' header", () => {
    test("Then it should invoke the received next function with an auth error with status code 403 and message 'Missing authorization header'", () => {
      const mockRequest = {
        header: jest.fn().mockReturnValue(""),
      } as Partial<CustomRequest>;

      const authError = new CustomError(
        "Missing authorization header",
        403,
        "Missing token"
      );

      auth(mockRequest as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(authError);
    });
  });

  describe("When it receives a request with am 'Authorization' header without a bearer", () => {
    test("Then it should invoke the received next function with an auth error with status code 403 and message 'Missing authorization header'", () => {
      const mockRequest = {
        header: jest.fn().mockReturnValue("Authorization"),
      } as Partial<CustomRequest>;

      const authError = new CustomError(
        "Missing authorization header",
        403,
        "Missing token"
      );

      auth(mockRequest as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(authError);
    });
  });
});
