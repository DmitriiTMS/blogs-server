export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export type DBTypeBlogs = {
    blogs: Blog[]
}


export const DB_BLOGS: DBTypeBlogs = {
    blogs: [
        // {
        //     id: "string",
        //     name: "string",
        //     description: "string",
        //     websiteUrl: "string"
        // }
    ],
}