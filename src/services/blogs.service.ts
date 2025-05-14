import { ObjectId } from "mongodb";
import { blogsRepository } from "../repository/blogsRepository";
import {
  Blog,
  BlogItems,
  BlogReqQueryFilters,
  BlogReqQueryFiltersPage,
} from "../types/blog-types";
import { blogsCollection, postsCollection } from "../db/mongoDB";
import { postsRepository } from "../repository/posts/postsRepository";
import { ReactionPostType } from "../types/post-types";
import { usersRepository } from "../repository/users/usersRepository";

type ReactionDictionary = Record<string, "Like" | "Dislike" | "None">;


interface IPostLike {
  postId: string;
  userId: ObjectId;
  addedAt: Date;
  // другие возможные поля
}

interface IUser {
  _id: any;
  id: string;
  login: string;
  // другие поля пользователя
}

export const blogsServices = {
  async getAll(queryFilters: BlogReqQueryFilters): Promise<BlogItems> {
    const searchNameTerm =
      queryFilters.searchNameTerm !== "undefined"
        ? queryFilters.searchNameTerm
        : "";
    const sortBy =
      queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection =
      queryFilters.sortDirection !== "undefined"
        ? queryFilters.sortDirection
        : "desc";
    const pageNumber = !Number.isNaN(Number(queryFilters.pageNumber))
      ? queryFilters.pageNumber
      : 1;
    const pageSize = !Number.isNaN(Number(queryFilters.pageSize))
      ? Number(queryFilters.pageSize)
      : 10;
    const resQueryDto = {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };

    const blogs = await blogsRepository.getAll(resQueryDto);
    const resBlogs = blogs.map((blog) => {
      return this.mapBlogToResBlog(blog);
    });

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};
    const totalCount = await blogsCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      items: [...resBlogs],
    };
    return resBlogItems;
  },

  async getOneBlogPost(
    blogId: ObjectId,
    queryFilters: BlogReqQueryFiltersPage,
    userId: string
  ) {
    const blog = await blogsRepository.getBlog(blogId);
    if (!blog) {
      return null;
    }

    const sortBy =
      queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection =
      queryFilters.sortDirection !== "undefined"
        ? queryFilters.sortDirection
        : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const totalCount = await postsCollection.countDocuments({
      blogId: blogId.toString(),
    });

    const resQueryDto = {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };

    // Получение массива реакций + userId для myStatus
     const postsAllWithBlogId = await postsRepository.getOneWithBlogId(resQueryDto, blogId);
    // const postsAll = await postsRepository.getAllBlog(resQueryDto);
    const postIds = postsAllWithBlogId.map((p) => p._id.toString());
    const postsReactions = await postsRepository.findManyReactionByUserIdAndPostId(userId, postIds);
    const reactionDictionary = postsReactions.reduce((acc, reaction) => {
      return {
        ...acc,
        [reaction.postId]: reaction.status,
      };
    }, {} as ReactionDictionary);

    const items = await Promise.all(
      postsAllWithBlogId.map(async (post) => {
        const { _id, extendedLikesInfo, ...resPost } = post;
        const likesThree = await postsRepository.getThreeLikes(String(_id));
        const newlikesThree = await Promise.all(
          likesThree.map(async (item: any) => {
            const { addedAt, userId } = item;
            const user = await usersRepository.getUserById(userId);
            return {
              addedAt,
              userId,
              login: user.login,
            };
          })
        );
        return {
          id: String(post._id),
          ...resPost,
          extendedLikesInfo: {
            ...extendedLikesInfo,
            myStatus:
              reactionDictionary[post._id.toString()] ?? ReactionPostType.None,
            newestLikes: [...newlikesThree],
          },
        };
      })
    );

   
    const pagesCount = Math.ceil(totalCount / pageSize);
    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      // items: posts.map((post: any) => ({
      //   id: post._id.toString(),
      //   title: post.title,
      //   shortDescription: post.shortDescription,
      //   content: post.content,
      //   blogId: post.blogId,
      //   blogName: post.blogName,
      //   createdAt: post.createdAt,
      // })),
      items: [...items],
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ReactionPostType.None,
        newestLikes: [],
      },
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
      isMembership: blog.isMembership,
    };
  },
};
