export type CommentRequest = {
  userId: string | null;
  userLogin: string | null;
  content: string;
  postId: string
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
  _id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentView = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentReqQueryFiltersPage = {
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

export type RequestCommentUpdate = {
  content: string;
  commentId: string
};
