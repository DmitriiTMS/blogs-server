import { ObjectId } from "mongodb";

type PostNewestLikes = {
  addedAt: string,
  userId: string,
  login: string
}

export type Post = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: ReactionPostType,
    newestLikes: PostNewestLikes[]
  }
};

export type PostClient = {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type DBTypePosts = {
  posts: Post[];
};

export type PostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
};

export type PostReqQueryFilters = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export enum ReactionPostType {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikePostRequest = {
  postId: string;
  userId: string | null;
  status: ReactionPostType;
  addedAt: Date
};

export type LikePostResponse = {
  _id: ObjectId;
  postId: string;
  userId: string | null;
  status: ReactionPostType;
};
