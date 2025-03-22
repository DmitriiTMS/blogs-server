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
