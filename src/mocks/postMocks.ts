import { type Request, type Response } from "express";

export const mockPostRequest = {
  params: {},
  query: { page: "0" },
} as Partial<Request>;

export const mockPostResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
