import { DB_BLOGS } from "../db/DB";
import { Blog } from "../types/blog-types";

export const blogsRepository = {
  getAll(): Blog[] {
    return DB_BLOGS.blogs;
  },

  createBlog(blogDto: Blog):Blog {
    const newBlog = {
      id: Math.random().toString(36).substring(2),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
    };
    DB_BLOGS.blogs.push(newBlog);
    return newBlog;
  },

  getBlog(id: string) {
    return DB_BLOGS.blogs.find((blog) => blog.id === id);
  },

  updateBlog(id: string, blogDto: Blog) {
    const blog = this.getBlog(id);
    if (blog) {
      blog.name = blogDto.name;
      blog.description = blogDto.description;
      blog.websiteUrl = blogDto.websiteUrl;
    }

    return blog;
  },

  deleteBlog(id: string) {
    DB_BLOGS.blogs = DB_BLOGS.blogs.filter((blog) => blog.id !== id);
  },
};
