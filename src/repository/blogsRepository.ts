import { ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../db/mongoDB";
import { Blog, BlogClient, BlogDto } from "../types/blog-types";

export const blogsRepository = {
  async getAll(): Promise<Blog[]> {
    return blogsCollection.find({}).toArray();
  },

  async createBlog(blogDto: BlogDto): Promise<BlogClient> {
    const newBlog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    await blogsCollection.insertOne(newBlog);
    return newBlog;
  },

  async createPostWithBlogId(newPost: any) {
    await postsCollection.insertOne(newPost);
    return newPost;
  },

  async getBlog(id: ObjectId): Promise<Blog> {
    return await blogsCollection.findOne({ _id: id });
  },

  async updateBlog(id: ObjectId, blogDto: BlogDto): Promise<Blog> {
    const blog = await this.getBlog(id);
    if (blog) {
      await blogsCollection.updateOne({ _id: id }, {
        $set: {
          name: blogDto.name,
          description: blogDto.description,
          websiteUrl: blogDto.websiteUrl,
        },
      });
    }
    return blog;
  },

  async deleteBlog(id: ObjectId): Promise<Blog> {
    return await blogsCollection.deleteOne({ _id: id });
  },
};
