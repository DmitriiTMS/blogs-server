import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "test",
  COLLECTIONS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
    COMMENTS: "/comments"
  },
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    COMMENTS: "/comments",
    USERS: "/users",
    AUTH: "/auth",
    TEST: "/testing/all-data",
  },
  HTTP_STATUS: {
    OK: 200,
    GREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZATION: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  },
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET as string,
    TIME: 3600
  }
};
