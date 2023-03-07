import { type Request, type Response, type NextFunction } from "express";

export const mockRequest = {} as Request;

export const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnValue({}),
};

export const mockNext: NextFunction = jest.fn();
