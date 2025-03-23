export type RequestCreateUser = {
    login: string;
    password: string;
    email: string;
};

export type ResponseCreateUser = {
    _id: string;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
};

export type ResponseCreateViewUser = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
};


export type UserReqQueryFilters = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

export type ResponseAllUsers = {
    _id: string;
    login: string;
    email: string;
    createdAt: Date;
};