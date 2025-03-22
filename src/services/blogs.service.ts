import { ObjectId } from "mongodb";
import { blogsRepository } from "../repository/blogsRepository";
import {
  Blog,
  BlogItems,
  BlogReqQueryFilters,
  BlogReqQueryFiltersPage,
} from "../types/blog-types";
import { blogsCollection, postsCollection } from "../db/mongoDB";
import { postsRepository } from "../repository/postsRepository";

export const blogsServices = {
  async getAll(queryFilters: BlogReqQueryFilters): Promise<BlogItems> {

    const searchNameTerm = queryFilters.searchNameTerm !== "undefined" ? queryFilters.searchNameTerm : "";
    const sortBy = queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection = queryFilters.sortDirection !== "undefined" ? queryFilters.sortDirection : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const resQueryDto = {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };

    const blogs = await blogsRepository.getAll(resQueryDto);

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};
    const totalCount = await blogsCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const resBlogs = blogs.map((blog) => {
      return this.mapBlogToResBlog(blog);
    });
    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      items: [...resBlogs],
    };
    return resBlogItems;
  },

  async getOneBlogPost(id: ObjectId, queryFilters: BlogReqQueryFiltersPage) {
    const blog = await blogsRepository.getBlog(id);
    if (!blog) {
      return null;
    }

    const sortBy = queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection = queryFilters.sortDirection !== "undefined" ? queryFilters.sortDirection : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const totalCount = await postsCollection.countDocuments({
      blogId: id.toString(),
    });

    const resQueryDto = {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };

    const posts = await postsRepository.getOneWithBlogId(resQueryDto, id)
    const pagesCount = Math.ceil(totalCount / pageSize);
    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      items: posts.map((post: any) => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })),
    };
    return resBlogItems;
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
    return await blogsRepository.createPostWithBlogId(newPost);
  },

  mapBlogToResBlog(blog: Blog) {
    return {
      id: String(blog._id),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    }
  }
};
