import { ObjectId } from "mongodb";
import { postsCollection } from "../db/mongoDB";
import { BlogByIdDto } from "../types/blog-types";
import {
  Post,
  PostClient,
  PostDto,
  PostReqQueryFilters,
} from "../types/post-types";

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

  async getOneWithBlogId(queryFilters: PostReqQueryFilters, id: ObjectId): Promise<Post[]> {
    return await postsCollection
    .find({ blogId: id.toString() })
    .sort({ [queryFilters.sortBy]: queryFilters.sortDirection === 'asc' ? 1 : -1 })
    .skip((queryFilters.pageNumber - 1) * queryFilters.pageSize)
    .limit(queryFilters.pageSize)
    .toArray();
  },

  async createPost(postDto: Post, blogDto: BlogByIdDto): Promise<PostClient> {
    const newPost = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: String(blogDto._id),
      blogName: blogDto.name,
      createdAt: new Date(),
    };
    await postsCollection.insertOne(newPost);
    return newPost;
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
};
