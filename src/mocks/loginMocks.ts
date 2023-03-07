import { type Request, type Response, type NextFunction } from "express";
import { type UserCredentials } from "../database/types";

export const mockRequest = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnValue({ token: "abc" }),
};

export const mockNext: NextFunction = jest.fn();
