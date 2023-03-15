import { type Request, type Response } from "express";

export const mockPostRequest = {
  params: {},
} as Request;

export const mockPostResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
