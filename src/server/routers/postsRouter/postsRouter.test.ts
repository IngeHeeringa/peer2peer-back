import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDatabase from "../../../database/connectDatabase.js";
import Post from "../../../database/models/Post.js";
import { app } from "../../index.js";

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
    shortDescription: "Mock short description",
    fullDescription: "Mock full description",
    stack: "Full Stack",
    technologies: ["Mock", "Test", "Fake"],
    yearsOfExperience: "<1 year",
  },
  {
    projectTitle: "Test Project",
    image: "url",
    shortDescription: "Mock short description",
    fullDescription: "Mock full description",
    stack: "Back End",
    technologies: ["Fake", "Test"],
    yearsOfExperience: "1-3 years",
  },
];
describe("Given a GET '/posts' endpoint", () => {
  const endpoint = "/posts";
  describe("When it receives a valid request and there are 2 posts in the database", () => {
    beforeAll(async () => {
      await Post.create(posts);
    });
    test("Then the response body should include those 2 posts", async () => {
      const expectedProperty = "posts";
      const expectedListLength = 2;
      const expectedStatusCode = 200;

      const response = await request(app)
        .get(endpoint)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(expectedProperty);
      expect(response.body.posts).toHaveLength(expectedListLength);
    });
  });

  describe("When it receives a request and there are no posts in the database", () => {
    test("Then the response body should include status code 500 and error message 'Sorry, we could not get any posts'", async () => {
      const expectedErrorMessage = {
        error: "Sorry, we could not get any posts",
      };
      const expectedStatusCode = 500;

      const response = await request(app)
        .get(endpoint)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});
