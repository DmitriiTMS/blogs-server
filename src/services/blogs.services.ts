import { ObjectId } from "mongodb";
import { blogsRepository } from "../repository/blogsRepository";
import { BlogItems, BlogReqQueryFilters } from "../types/blog-types";
import { blogsCollection } from "../db/mongoDB";

export const blogsServices = {

    async getAll(queryFilters: BlogReqQueryFilters): Promise<BlogItems> {

        const searchNameTerm = queryFilters.searchNameTerm !== 'undefined' ? queryFilters.searchNameTerm : "";
        const sortBy = queryFilters.sortBy !== 'undefined' ? queryFilters.sortBy : 'createdAt';
        const sortDirection = queryFilters.sortDirection !== 'undefined' ? queryFilters.sortDirection : 'desc';
        const pageNumber = queryFilters.pageNumber || 1;
        const pageSize = queryFilters.pageSize || 10;
        const resQueryDto = { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize }

        const blogs = await blogsRepository.getAll(resQueryDto);
        const totalCount = await blogsCollection.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);

        const resBlogs = blogs.map((blog) => {
            const { _id, ...resBlog } = blog;
            return {
                id: String(blog._id),
                ...resBlog,
            };
        });
        const resBlogItems = {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
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