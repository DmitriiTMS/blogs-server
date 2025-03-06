import { DB_POSTS } from "../db/DB";
import { BlogDto } from "../types/blog-types";
import { Post, PostDto } from "../types/post-types";


export const postsRepository = {
    getAll() {
        return DB_POSTS.posts;
    },

    createPost(postDto: Post, blogDto: BlogDto) {
        const newPost = {
            id: Math.random().toString(36).substring(2),
            title: postDto.title,
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            blogId: blogDto.id,
            blogName: blogDto.name
        };
        DB_POSTS.posts.push(newPost);
        return newPost;
    },

    getPost(id: string) {
        return DB_POSTS.posts.find((post) => post.id === id);
    },

    updatePost(id: string, postDto: PostDto) {

        const postFind = this.getPost(id)

        if (postFind) {
            postFind.title = postDto.title
            postFind.shortDescription = postDto.shortDescription
            postFind.content = postDto.content
            postFind.blogId = postDto.blogId
        }
        return postFind;
    },

    deletePost(id: string) {
        DB_POSTS.posts = DB_POSTS.posts.filter((post) => post.id !== id);
    },
}