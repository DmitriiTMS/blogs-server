import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { fieldValidationPost, idValidationPost, idValidationPostID } from "../validation/validationPost";
import { validationPostResultMiddleware } from "../middlewares/validationPostResultMiddleware";
import { authSuperAdminMiddleware } from "../middlewares/authSuperAdminMiddleware";
import { fieldValidationBlogQuery } from "../validation/validationBlog";
import { accessTokenGuard } from "../middlewares/accessTokenGuard";
import { accessTokenReactions } from "../middlewares/accessTokenReactions";




export const postsRouter = Router();

postsRouter.get("/",accessTokenReactions, fieldValidationBlogQuery, validationPostResultMiddleware, postsController.getAllPosts);
postsRouter.post("/", authSuperAdminMiddleware, fieldValidationPost, validationPostResultMiddleware, postsController.createPost);
postsRouter.get("/:id", accessTokenReactions, idValidationPost, validationPostResultMiddleware, postsController.getPostById);
postsRouter.put("/:id", authSuperAdminMiddleware, idValidationPost, fieldValidationPost, validationPostResultMiddleware, postsController.updatePost);
postsRouter.delete("/:id", idValidationPost, validationPostResultMiddleware, authSuperAdminMiddleware, postsController.deletePost);

postsRouter.put(
                "/:postId/like-status",
                accessTokenGuard, 
                idValidationPostID, validationPostResultMiddleware,
                postsController.addReaction
        )

