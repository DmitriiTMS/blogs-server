import { ObjectId } from "mongodb";
import { likePostCollection, postsCollection } from "../../db/mongoDB";
import { BlogByIdDto } from "../../types/blog-types";
import {
  LikePostRequest,
  LikePostResponse,
  Post,
  PostClient,
  PostDto,
  PostReqQueryFilters,
  ReactionPostType,
} from "../../types/post-types";

interface PostLike {
  userId: string;
  addedAt: Date;
}

interface PostLikesGroup {
  postId: string;
  likes: PostLike[];
}

export const postsRepository = {
  async getAll(queryFilters: PostReqQueryFilters): Promise<Post[]> {
    return postsCollection
      .find({})
      .sort({
        [queryFilters.sortBy]: queryFilters.sortDirection === "asc" ? 1 : -1,
      })
      .skip((+queryFilters.pageNumber - 1) * +queryFilters.pageSize)
      .limit(+queryFilters.pageSize)
      .toArray();
  },


  async getOneWithBlogId(
    queryFilters: PostReqQueryFilters,
    id: ObjectId
  ): Promise<Post[]> {
    return await postsCollection
      .find({ blogId: id.toString() })
      .sort({
        [queryFilters.sortBy]: queryFilters.sortDirection === "asc" ? 1 : -1,
      })
      .skip((queryFilters.pageNumber - 1) * queryFilters.pageSize)
      .limit(queryFilters.pageSize)
      .toArray();
  },

  // async createPost(postDto: Post, blogDto: BlogByIdDto): Promise<PostClient> {
  //   const newPost = {
  //     title: postDto.title,
  //     shortDescription: postDto.shortDescription,
  //     content: postDto.content,
  //     blogId: String(blogDto._id),
  //     blogName: blogDto.name,
  //     createdAt: new Date(),
  //   };
  //   await postsCollection.insertOne(newPost);
  //   return newPost;
  // },

  async createPost(newPost: any): Promise<PostClient> {
    const post = await postsCollection.insertOne(newPost);
    return await postsCollection.findOne({ _id: post.insertedId });
  },

  async getPost(id: ObjectId): Promise<Post> {
    return await postsCollection.findOne({ _id: id });
  },

  async updatePost(id: ObjectId, postDto: PostDto): Promise<Post> {
    const postFind = await this.getPost(id);

    if (postFind) {
      await postsCollection.updateOne(
        { _id: id },
        {
          $set: {
            title: postDto.title,
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            blogId: postDto.blogId,
          },
        }
      );
    }
    return postFind;
  },

  async deletePost(id: ObjectId): Promise<Post> {
    return await postsCollection.deleteOne({ _id: id });
  },

  async findReactionByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<LikePostResponse> {
    return await likePostCollection.findOne({ userId, postId });
  },

   async findManyReactionByUserIdAndPostId(
    userId: string,
    postIds: string[]
  ): Promise<LikePostResponse[]> {    
    return await likePostCollection.find({ userId, postId: { $in:  postIds} }).toArray();
  },

  async createPostLikeInfo(dtoReaction: LikePostRequest) {
    const result = await likePostCollection.insertOne(dtoReaction);
    return await likePostCollection.findOne({ _id: result.insertedId });
  },

  async updateReactionPost(id: string, likeStatus: ReactionPostType) {
    return await likePostCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: likeStatus,
        },
      }
    );
  },

  async likeCountUpdate(id: string, count: number) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "extendedLikesInfo.likesCount": count,
        },
      }
    );
  },

  async dislikeCountUpdate(id: string, count: number) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "extendedLikesInfo.dislikesCount": count,
        },
      }
    );
  },

  async getThreeLikes(postId: string) {
    const likes = await likePostCollection
      .find({
        postId,
        status: ReactionPostType.Like,
      })
      .sort({ _id: -1 })
      .limit(3)
      .toArray();

    return likes
  },

   async getManyThreeLikes(postIds: string[]) {
    const likes = await likePostCollection
      .find({
        postId: { $in:  postIds},
        status: ReactionPostType.Like,
      })
      .sort({ _id: -1 })
      // .limit(3)
      .toArray();

    return likes
  },
 
};
