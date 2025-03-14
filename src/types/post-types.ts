import { ObjectId } from "mongodb"

export type Post = {
    _id?: ObjectId
    id?: string,
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