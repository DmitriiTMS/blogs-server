import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "test",
  COLLECTIONS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
  },
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TEST: "/testing/all-data",
  },
  HTTP_STATUS: {
    OK: 200,
    GREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZATION: 401,
    NOT_FOUND: 404,
  },
};
