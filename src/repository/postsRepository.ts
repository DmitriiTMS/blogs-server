import { ObjectId } from "mongodb";
import { DB_POSTS } from "../db/DB";
import { postsCollection } from "../db/mongoDB";
import { BlogDto } from "../types/blog-types";
import { Post, PostDto } from "../types/post-types";


export const postsRepository = {
    async getAll(): Promise<Post[]> {
        return postsCollection.find({}).toArray();
    },

    async createPost(postDto: Post, blogDto: BlogDto): Promise<Post> {
        const newPost = {
            title: postDto.title,
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            blogId: blogDto._id,
            blogName: blogDto.name,
            createdAt: new Date(),
        };
        await postsCollection.insertOne(newPost);
        return newPost;
    },

    async getPost(id: ObjectId) {
        return await postsCollection.findOne(id);
    },

    async updatePost(id: ObjectId, postDto: PostDto): Promise<Post> {
        const postFind: Post = await this.getPost(id)

        if (postFind) {
            await postsCollection.updateOne({ _id: id }, {
                $set: {
                    title: postDto.title,
                    shortDescription: postDto.shortDescription,
                    content: postDto.content,
                    blogId: postDto.blogId,
                },
            });
        }
        return postFind;
    },

    async deletePost(id: ObjectId) {
        await postsCollection.deleteOne({ _id: id })
    },
}