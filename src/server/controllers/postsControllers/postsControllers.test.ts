/* eslint-disable max-nested-callbacks */
import "../../../loadEnvironment";
import { type Response, type NextFunction, type Request } from "express";
import fs from "fs/promises";
import Post from "../../../database/models/Post";
import { type PostData } from "../../../database/types";
import { mockPostRequest, mockPostResponse } from "../../../mocks/postMocks";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "./postsControllers";

export const mockNext = jest.fn() as NextFunction;
jest.mock("sharp", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    resize: jest.fn(() => ({
      webp: jest.fn(() => ({
        toBuffer: jest.fn(() => "optimizedImageBuffer"),
      })),
    })),
  })),
}));

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
    test("Then it should call the response's JSON method", async () => {
      Post.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getPosts(mockPostRequest, mockPostResponse as Response, mockNext);

      expect(mockPostResponse.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response and Post.find returns an error", () => {
    test("Then it should call the next function", async () => {
      Post.find = jest.fn().mockReturnValue(new Error());

      await getPosts(mockPostRequest, mockPostResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe("Given a getPostById controller", () => {
  describe("When it receives a response and Post.findById returns a post", () => {
    test("Then it should call the response's status method with code 200", async () => {
      Post.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getPostById(
        mockPostRequest,
        mockPostResponse as Response,
        mockNext
      );

      expect(mockPostResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe("When it receives a response and Post.findById returns a post", () => {
    test("Then it should call the response's JSON method", async () => {
      Post.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getPostById(
        mockPostRequest,
        mockPostResponse as Response,
        mockNext
      );

      expect(mockPostResponse.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response and Post.findById returns an error", () => {
    test("Then it should call next function with getPostById error with status code 404", async () => {
      Post.findById = jest.fn().mockReturnValue(new Error());

      await getPostById(
        mockPostRequest,
        mockPostResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
        })
      );
    });
  });
});

describe("Given a deletePostById controller", () => {
  describe("When it receives a response and Post.findByIdAndDelete returns the deleted post", () => {
    test("Then it should call the response's status method with code 200", async () => {
      Post.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({}),
      }));

      await deletePostById(
        mockPostRequest,
        mockPostResponse as Response,
        mockNext
      );

      expect(mockPostResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe("When it receives a response and Post.findByIdAndDelete returns an error", () => {
    test("Then it should call the next function", async () => {
      Post.findByIdAndDelete = jest.fn().mockReturnValue(new Error());

      await deletePostById(
        mockPostRequest,
        mockPostResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe("Given a createPost controller", () => {
  describe("When it receives a response and Post.create returns the created post", () => {
    const file = {
      filename: "uploadedImage",
    };

    const mockPost = {
      projectTitle: "Test Project",
      image: "url",
      backupImage: "url",
      shortDescription: "Mock short description",
      fullDescription: "Mock full description",
      stack: "Back End",
      technologies: ["Fake", "Test"],
      yearsOfExperience: "1-3 years",
    };

    test("Then it should call the response's status method with code 201", async () => {
      const mockRequest = {
        body: { ...mockPost, technologies: "React,TypeScript" },
        file,
      } as unknown as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        PostData
      >;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const expectedStatus = 201;

      fs.readFile = jest.fn().mockImplementationOnce(() => file.filename);

      Post.create = jest.fn().mockReturnValue({});

      await createPost(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its JSON method with message 'Post created successfully' and the URL of the uploaded image", async () => {
      const expectedResponseBody = {
        message: "Post created successfully",
        imageUrl:
          "https://lqcnsazbhhkxovvryvfj.supabase.co/storage/v1/object/public/images/uploadedImage",
      };
      const mockRequest = {
        body: { ...mockPost, technologies: "React,TypeScript" },
        file,
      } as unknown as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        PostData
      >;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      fs.readFile = jest.fn().mockImplementationOnce(() => file.filename);

      Post.create = jest.fn().mockReturnValue({});

      await createPost(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives a response and Post.create returns an error", () => {
    test("Then it should call the net function", async () => {
      const mockRequest = {} as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        PostData
      >;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      Post.create = jest.fn().mockRejectedValue(new Error());

      await createPost(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
