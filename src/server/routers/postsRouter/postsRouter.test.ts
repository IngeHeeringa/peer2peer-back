import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import connectDatabase from "../../../database/connectDatabase.js";
import Post from "../../../database/models/Post.js";
import { type PostDataWithId, type UserData } from "../../../database/types.js";
import { app } from "../../index.js";
import User from "../../../database/models/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await Post.deleteMany();
});

const posts = [
  {
    projectTitle: "Mock Project",
    image: "url",
    backupImage: "url",
    shortDescription: "Mock short description",
    fullDescription: "Mock full description",
    stack: "Full Stack",
    technologies: ["Mock", "Test", "Fake"],
    yearsOfExperience: "<1 year",
  },
  {
    projectTitle: "Test Project",
    image: "url",
    backupImage: "url",
    shortDescription: "Mock short description",
    fullDescription: "Mock full description",
    stack: "Back End",
    technologies: ["Fake", "Test"],
    yearsOfExperience: "1-3 years",
  },
];
describe("Given a GET '/posts' endpoint", () => {
  const pathGetAll = "/posts";
  describe("When it receives a valid request and there are 2 posts in the database", () => {
    beforeAll(async () => {
      await Post.create(posts);
    });
    test("Then the response body should include those 2 posts", async () => {
      const expectedProperty = "posts";
      const expectedListLength = 2;
      const expectedStatusCode = 200;

      const response = await request(app)
        .get(pathGetAll)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(expectedProperty);
      expect(response.body.posts).toHaveLength(expectedListLength);
    });
  });

  describe("When it receives a request and there are no posts in the database", () => {
    test("Then the response body should include status code 500 and error message 'Sorry, we could not get any posts'", async () => {
      const expectedErrorMessage = {
        error: "No posts found",
      };
      const expectedStatusCode = 500;

      const response = await request(app)
        .get(pathGetAll)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe("Given a DELETE '/posts/delete/:id' endpoint", () => {
  const pathDelete = "/posts/delete/";

  const userData: UserData = {
    username: "user",
    password: "12345678",
    email: "mock@user.com",
  };

  let token: string;

  beforeEach(async () => {
    await User.create(userData);

    const user = await User.findOne({ username: userData.username });
    token = jwt.sign({ sub: user?._id }, process.env.JWT_SECRET!);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with an id of a post in the database", () => {
    let mockPosts: PostDataWithId[];
    beforeAll(async () => {
      mockPosts = await Post.create(posts);
    });

    test("Then the response body should include the message 'Post deleted successfully'", async () => {
      const expectedResponseBody = { message: "Post deleted successfully" };
      const expectedStatusCode = 200;

      const post = mockPosts[0];

      const response = await request(app)
        .delete(`${pathDelete}${post._id.toString()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request with a non-existent id", () => {
    beforeAll(async () => {
      await Post.deleteMany();
    });

    test("Then the response body should include the message 'Post could not be deleted'", async () => {
      const expectedResponseBody = { error: "Post could not be deleted" };
      const expectedStatusCode = 500;

      const response = await request(app)
        .delete(`${pathDelete}3`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request from an unauthenticated user", () => {
    let mockPosts: PostDataWithId[];
    beforeAll(async () => {
      mockPosts = await Post.create(posts);
    });

    test("Then the access should be forbidden with status code 403 and error message 'Missing token'", async () => {
      const expectedResponseBody = { error: "Missing token" };
      const expectedStatusCode = 403;

      const post = mockPosts[0];

      const response = await request(app)
        .delete(`${pathDelete}${post._id.toString()}`)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});

describe("Given a POST '/posts/submit' endpoint", () => {
  const pathCreate = "/posts/submit";

  const userData: UserData = {
    username: "user",
    password: "12345678",
    email: "mock@user.com",
  };

  let token: string;

  beforeEach(async () => {
    await User.create(userData);

    const user = await User.findOne({ username: userData.username });
    token = jwt.sign({ sub: user?._id }, process.env.JWT_SECRET!);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with data to create a post", () => {
    test("Then the response body should include the message 'Post created successfully' and the URL of the uploaded image", async () => {
      const expectedStatusCode = 201;
      const suffix = "abc";

      crypto.randomUUID = jest.fn().mockReturnValue(suffix);

      const expectedResponseBody = {
        message: "Post created successfully",
        imageUrl: `https://lqcnsazbhhkxovvryvfj.supabase.co/storage/v1/object/public/images/uploadedImage-${suffix}.png`,
      };

      const response = await request(app)
        .post(pathCreate)
        .set("Authorization", `Bearer ${token}`)
        .field("projectTitle", "Test")
        .field("shortDescription", "Test")
        .field("fullDescription", "Test")
        .field("stack", "Test")
        .field("technologies", "Test")
        .field("yearsOfExperience", "Test")
        .attach("image", Buffer.from("uploads"), {
          filename: "uploadedImage.png",
        })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});
