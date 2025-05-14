import { ObjectId } from "mongodb";
import { ResultStatus } from "../common/resultError/resultError";
import { likePostCollection, postsCollection } from "../db/mongoDB";
import { postsRepository } from "../repository/posts/postsRepository";
import { usersRepository } from "../repository/users/usersRepository";
import { BlogByIdDto } from "../types/blog-types";

import {
  LikePostRequest,
  Post,
  PostReqQueryFilters,
  ReactionPostType,
} from "../types/post-types";

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

export const postsService = {
  async getAll(queryFilters: PostReqQueryFilters, userId: string) {
    const sortBy =
      queryFilters.sortBy !== "undefined" ? queryFilters.sortBy : "createdAt";
    const sortDirection =
      queryFilters.sortDirection !== "undefined"
        ? queryFilters.sortDirection
        : "desc";
    const pageNumber = queryFilters.pageNumber || 1;
    const pageSize = queryFilters.pageSize || 10;
    const resQueryDto = { sortBy, sortDirection, pageNumber, pageSize };

    const totalCount = await postsCollection.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    // Получение массива реакций + userId для myStatus
    const posts = await postsRepository.getAll(resQueryDto);
    const postIds = posts.map((p) => p._id.toString());
    const postsReactions =
      await postsRepository.findManyReactionByUserIdAndPostId(userId, postIds);
    const reactionDictionary = postsReactions.reduce((acc, reaction) => {
      return {
        ...acc,
        [reaction.postId]: reaction.status,
      };
    }, {} as ReactionDictionary);

    // Получение массива 3 реакций
    // const allLikes: IPostLike[] = await postsRepository.getManyThreeLikes(
    //   postIds
    // );
    // const userIds: ObjectId[] = [
    //   ...new Set(allLikes.map((like: IPostLike) => like.userId)),
    // ];
    // const userObjectIds = userIds.map((id) => new ObjectId(id));
    // const users: IUser[] = await usersRepository.getUsersByIds(userObjectIds);
    // const usersMap = new Map(
    //   users.map((user) => [user._id.toString(), user.login])
    // );
  

    // const items = posts.map((post) => {
    //   const { _id, extendedLikesInfo, ...resPost } = post;
    //   const postId = _id.toString();

    //   // Фильтруем лайки для текущего поста и берем 3 последних
    //   const newestLikes = allLikes
    //     .filter((like) => like.postId === postId)
    //     .sort(
    //       (a, b) =>
    //         new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    //     )
    //     .slice(0, 3)
    //     .map((like) => ({
    //       addedAt: like.addedAt,
    //       userId: like.userId,
    //       login: usersMap.get(like.userId) || "unknown",
    //     }));

    //   return {
    //     id: postId,
    //     ...resPost,
    //     extendedLikesInfo: {
    //       ...extendedLikesInfo,
    //       myStatus: reactionDictionary[postId] ?? ReactionPostType.None,
    //       newestLikes,
    //     },
    //   };
    // });

    const items = await Promise.all(posts.map(async (post) => {
        const { _id, extendedLikesInfo, ...resPost } = post;

        const likesThree = await postsRepository.getThreeLikes(String(_id));
        const newlikesThree = await Promise.all(likesThree.map(async (item: any) => {
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
            myStatus:reactionDictionary[post._id.toString()] ?? ReactionPostType.None,
            newestLikes: [...newlikesThree],
          },
        };
      })
    );

    // console.log(items);
    // const resPosts = await Promise.all(
    //   posts.map(async (post) => {
    //     const { _id, ...resPost } = post;

    //     if (!userId) {
    //       resPost.extendedLikesInfo.myStatus = ReactionPostType.None;
    //     } else {
    //       const findStatusUser =
    //         await postsRepository.findReactionByUserIdAndPostId(
    //           userId,
    //           String(_id)
    //         );
    //       resPost.extendedLikesInfo.myStatus =
    //         findStatusUser?.status ?? ReactionPostType.None;
    //     }

    //     const likesThree = await postsRepository.getThreeLikes(String(_id));
    //     const newlikesThree = await Promise.all(
    //       likesThree.map(async (item: any) => {
    //         const { addedAt, userId } = item;
    //         const user = await usersRepository.getUserById(userId);
    //         return {
    //           addedAt,
    //           userId,
    //           login: user.login,
    //         };
    //       })
    //     );
    //     resPost.extendedLikesInfo.newestLikes = [...newlikesThree];

    //     return {
    //       id: String(post._id),
    //       ...resPost,
    //     };
    //   })
    // );

    const resBlogItems = {
      pagesCount: +pagesCount,
      page: totalCount ? +pageNumber : 0,
      pageSize: totalCount ? +pageSize : 0,
      totalCount: +totalCount,
      // items: [...resPosts],
      items: [...items],
    };
    return resBlogItems;
  },

  async createPost(postDto: Post, blogDto: BlogByIdDto) {
    const newPost = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: String(blogDto._id),
      blogName: blogDto.name,
      createdAt: new Date(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ReactionPostType.None,
        newestLikes: [],
      },
    };
    return await postsRepository.createPost(newPost);
  },

  async addReactionService(reactionDto: LikePostRequest) {
    if (!Object.values(ReactionPostType).includes(reactionDto.status)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [
          {
            message: "likeStatus no [ None, Like, Dislike ]",
            field: "likeStatus",
          },
        ],
      };
    }

    const findReactionByUserIdAndPostId =
      await postsRepository.findReactionByUserIdAndPostId(
        reactionDto.userId!,
        reactionDto.postId
      );

    if (!findReactionByUserIdAndPostId) {
      await postsRepository.createPostLikeInfo(reactionDto);
      const [totalCountLike, totalCountDislike] = await Promise.all([
        likePostCollection.countDocuments({
          status: ReactionPostType.Like,
          postId: reactionDto.postId,
        }),
        likePostCollection.countDocuments({
          status: ReactionPostType.Dislike,
          postId: reactionDto.postId,
        }),
      ]);
      Promise.all([
        await postsRepository.likeCountUpdate(
          reactionDto.postId,
          totalCountLike
        ),
        await postsRepository.dislikeCountUpdate(
          reactionDto.postId,
          totalCountDislike
        ),
      ]);
      return {
        status: ResultStatus.Success,
        data: reactionDto,
        extensions: [],
      };
    }

    if (reactionDto.status !== findReactionByUserIdAndPostId.status) {
      await postsRepository.updateReactionPost(
        String(findReactionByUserIdAndPostId._id),
        reactionDto.status
      );
      const [totalCountLike, totalCountDislike] = await Promise.all([
        likePostCollection.countDocuments({
          status: ReactionPostType.Like,
          postId: reactionDto.postId,
        }),
        likePostCollection.countDocuments({
          status: ReactionPostType.Dislike,
          postId: reactionDto.postId,
        }),
      ]);
      Promise.all([
        await postsRepository.likeCountUpdate(
          reactionDto.postId,
          totalCountLike
        ),
        await postsRepository.dislikeCountUpdate(
          reactionDto.postId,
          totalCountDislike
        ),
      ]);
      return {
        status: ResultStatus.Success,
        data: reactionDto,
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      data: reactionDto,
      extensions: [],
    };
  },
};
