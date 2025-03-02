import { DB_BLOGS } from "../db/DB"

export const blogsRepository = {
    getAll() {
        return DB_BLOGS.blogs;
    }
}