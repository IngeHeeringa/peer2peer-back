import { type Response, type NextFunction } from "express";
import Post from "../../../database/models/Post";
import { mockPostRequest, mockPostResponse } from "../../../mocks/postMocks";
import { getPosts } from "./postsController";

export const mockNext = jest.fn() as NextFunction;

describe("Given a getPosts controller", () => {
  describe("When it receives a response and Post.find returns a collection of Posts", () => {
    test("Then it should call the response's status method with code 200", async () => {
      Post.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getPosts(mockPostRequest, mockPostResponse as Response, mockNext);

      expect(mockPostResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe("When it receives a response and Post.find returns a collection of Posts", () => {
    test("Then it should call response's JSON method with that collection of Posts", async () => {
      Post.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getPosts(mockPostRequest, mockPostResponse as Response, mockNext);

      expect(mockPostResponse.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response and Post.find returns an error", () => {
    test("Then it should call next function with getPosts error with status code 500", async () => {
      Post.find = jest.fn().mockReturnValue(new Error());

      await getPosts(mockPostRequest, mockPostResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
        })
      );
    });
  });
});
