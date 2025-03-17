import { ObjectId } from "mongodb";
import { blogsRepository } from "../repository/blogsRepository";
import { BlogItems } from "../types/blog-types";

export const blogsServices = {

    async getAll(): Promise<BlogItems> {
        const blogs = await blogsRepository.getAll();
        const resBlogs = blogs.map((blog) => {
            const { _id, ...resBlog } = blog;
            return {
                id: String(blog._id),
                ...resBlog,
            };
        });
        const resBlogItems = {
            pagesCount: 0,
            page: 0,
            pageSize: 0,
            totalCount: 0,
            items: [...resBlogs]
    
        }
        return resBlogItems
    },

    async createPostWithBlogId(post: any, id: ObjectId) {
        const blog = await blogsRepository.getBlog(id);
        if (!blog) {
            return null;
        }
        const newPost = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: String(blog._id),
            blogName: blog.name,
            createdAt: new Date(),
        };
        return await blogsRepository.createPostWithBlogId(newPost)
    }
}