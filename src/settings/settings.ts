import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TEST: '/testing/all-data'
    },
    HTTP_STATUS: {
        OK: 200,
        GREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZATION: 401,
        NOT_FOUND: 404,
    }
}