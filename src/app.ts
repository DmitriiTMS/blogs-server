import express from 'express'
import { SETTINGS } from './settings/settings'
import { blogsRouter } from './router/blogs-router'
import { testRouter } from './router/test-router'
import { postsRouter } from './router/posts-router'
import { usersRouter } from './router/users-router'
import { authRouter } from './router/auth-router'
import { commentsRouter } from './router/comments-router'
import cookieParser from 'cookie-parser'
import { apiLoggerMiddleware } from './middlewares/apiLoggerMiddleware'



export const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(apiLoggerMiddleware)


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.TEST, testRouter)