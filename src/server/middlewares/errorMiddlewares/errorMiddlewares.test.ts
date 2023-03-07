import { type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import {
  mockNext,
  mockRequest,
  mockResponse,
} from "../../../mocks/errorMocks.js";
import { generalError, notFoundError } from "./errorMiddlewares.js";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response and a next function", () => {
    test("Then it should invoke the received next function with status code 404", () => {
      notFoundError(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
        })
      );
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives a response and an error that has status code 500", () => {
    test("Then it should respond with status code 500", () => {
      const error = new CustomError("", 500, "Default error message");

      generalError(error, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe("When it receives a response and an error with an invalid status code", () => {
    test("Then it should respond with status code 500", () => {
      const invalidStatusCode = NaN;
      const error = new CustomError(
        "",
        invalidStatusCode,
        "Default error message"
      );

      generalError(error, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe("When it receives a response with the public message 'Something went wrong'", () => {
    test("Then it should respond with the error message 'Something went wrong'", () => {
      const errorMessage = "Something went wrong";
      const error = new CustomError("", 500, errorMessage);

      generalError(error, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe("When it receives a response without a public message", () => {
    test("Then it should respond with the default error message 'Something went wrong'", () => {
      const error = new CustomError("", 500, "");
      const defaultErrorMessage = "Something went wrong";

      generalError(error, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: defaultErrorMessage,
      });
    });
  });
});
