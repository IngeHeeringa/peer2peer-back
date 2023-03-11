import { type Request, type Response } from "express";
import { type UserData } from "../database/types";

export const mockRegisterRequest = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserData
>;

export const mockBadRegisterRequest = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Pick<UserData, "username" | "password">
>;

export const mockRegisterResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
