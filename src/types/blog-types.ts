import { ObjectId } from "mongodb"

export type Blog = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string
    createdAt: Date,
    isMembership: boolean
}

export type BlogClient = {
    _id?: ObjectId,
    name: string,
    description: string,
    websiteUrl: string
    createdAt: Date,
    isMembership: boolean
}

export type DBTypeBlogs = {
    blogs: Blog[]
}

export type BlogDto = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogByIdDto = {
    _id: ObjectId,
    name: string,
}
