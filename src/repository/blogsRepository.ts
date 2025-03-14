import { ObjectId } from "mongodb";
import { blogsCollection } from "../db/mongoDB";
import { Blog } from "../types/blog-types";

export const blogsRepository = {
  async getAll(): Promise<Blog[]> {
    return blogsCollection.find({}).toArray();
  },

  async createBlog(blogDto: Blog): Promise<Blog> {
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

  async getBlog(id: ObjectId) {
    return await blogsCollection.findOne(new ObjectId(id));
  },

  async updateBlog(id: ObjectId, blogDto: Blog): Promise<Blog> {
    const blog = await this.getBlog(new ObjectId(id));
    if (blog) {
      await blogsCollection.updateOne( { _id: id }, {
        $set: {
          name: blogDto.name,
          description: blogDto.description,
          websiteUrl: blogDto.websiteUrl,
        },
      });
    }
    return blog;
  },

  async deleteBlog(id: ObjectId) {
    await blogsCollection.deleteOne({ _id: id })
  },
};
