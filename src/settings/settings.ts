import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/blogs',
        TEST: '/testing/all-data'
    },
    STATUS: {
        OK: 200,
        GREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
    }
}