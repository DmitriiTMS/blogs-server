import { ObjectId } from "mongodb"

export type Post = {
    _id: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
}

export type PostClient = {
    _id?: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
}



export type DBTypePosts = {
    posts: Post[]
}

export type PostDto = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
}

export type PostReqQueryFilters = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}