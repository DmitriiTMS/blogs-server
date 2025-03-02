import express from 'express'
import { SETTINGS } from './settings/settings'
import { blogsRouter } from './router/blogs-router'
import { testRouter } from './router/test-router'


export const app = express()
app.use(express.json())


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.TEST, testRouter)