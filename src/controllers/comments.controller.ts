import { Request, Response } from "express";
import { SETTINGS } from "../settings/settings";
import { postsQueryRepository } from "../repository/posts/postsQueryRepository";

export const commentsController = {
  async createComments(req: Request, res: Response) {
    const { postId } = req.params;
    const post = await postsQueryRepository.getPostsById(postId);
    if (!post) {
      res.sendStatus(SETTINGS.HTTP_STATUS.NOT_FOUND);
      return;
    }

    console.log(req.infoUser);
    

    const { content } = req.body;
    
    res.status(SETTINGS.HTTP_STATUS.GREATED).json({ content });
    return;
  },
};
