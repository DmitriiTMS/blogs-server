export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}


export type DBTypePosts = {
    posts: Post[]
}

export type PostDto = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}