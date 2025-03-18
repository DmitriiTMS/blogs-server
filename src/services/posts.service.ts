import { postsCollection } from "../db/mongoDB";
import { postsRepository } from "../repository/postsRepository";
import { PostReqQueryFilters } from "../types/post-types";

export const postsService = {
  async getAll(queryFilters: PostReqQueryFilters) {
    const sortBy = queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection = queryFilters.sortDirection !== "undefined" ? queryFilters.sortDirection : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const resQueryDto = {sortBy, sortDirection, pageNumber, pageSize};

    const posts = await postsRepository.getAll(resQueryDto);

    const totalCount = await postsCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    const resPosts = posts.map((post) => {
      const { _id, ...resPost } = post;
      return {
        id: String(post._id),
        ...resPost,
      };
    });
    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      items: [...resPosts],
    };
    return resBlogItems;
  },
};
