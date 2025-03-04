import { Blog, DB_BLOGS } from "../db/DB";

export const blogsRepository = {
  getAll() {
    return DB_BLOGS.blogs;
  },

  createBlog(blogDto: Blog) {
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
    const blog = DB_BLOGS.blogs.find((blog) => blog.id === id);

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
