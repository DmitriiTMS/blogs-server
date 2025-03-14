import { ObjectId } from "mongodb"

export type Blog = {
    id?: ObjectId,
    _id?: string,
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
    _id: string,
    name: string
}
