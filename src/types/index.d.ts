import express from "express";

declare global {
    namespace Express {
        export interface Request {
            infoUser: {
                userId: string | null,
                userLogin: string | null,
            }
        }
    }
}