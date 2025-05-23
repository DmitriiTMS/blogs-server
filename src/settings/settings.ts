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
    COMMENTS: "/comments",
    REFRESH_TOKEN:"/refresh_tokens",
    ACCESS_TO_API:"/access_to_api",
    DEVICE_INFO:"/device_info",
    LIKE_INFO:"/like_info",
    LIKE_INFO_POST:"/like_info_post"
  },
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    COMMENTS: "/comments",
    USERS: "/users",
    AUTH: "/auth",
    SECURITY_DEVICES: "/security",
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
    TIME: 8 * 60 * 1000,
    TIME_REFRESH: 7 * 24 * 60 * 60 * 1000,
  },
  MAIL: {
    EMAIL: "chunosov.dmitrij@bk.ru",
    EMAIL_PASSWORD: "AU4vPai3YmTSkcK6gshm"
  }
};
