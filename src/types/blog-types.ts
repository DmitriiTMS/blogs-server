export type Blog = {
    id?: string,
    _id?: string,
    name: string,
    description: string,
    websiteUrl: string
}


export type DBTypeBlogs = {
    blogs: Blog[]
}

export type BlogDto = {
    id: string,
    name: string
}
