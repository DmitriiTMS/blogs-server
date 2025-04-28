import { ObjectId } from "mongodb";

export type CommentRequest = {
  userId: string | null;
  userLogin: string | null;
  content: string;
  postId: string;
};

export type CommentRequestRepository = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentResponseRepository = {
  _id: ObjectId;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus?: ReactionType
  };
};

export type CommentView = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: ReactionType
  },
};

export type CommentReqQueryFiltersPage = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type RequestCommentUpdate = {
  content: string;
  commentId: string;
};

export enum ReactionType {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}


export type LikeCommentRequest = {
  status: ReactionType;
  userId: string | null;
  commentId: string;
  accessToken?: string
};

export type LikeCommentResponse = {
  _id: ObjectId;
  status: ReactionType;
  userId: string | null;
  commentId: string;
  accessToken?: string
};



