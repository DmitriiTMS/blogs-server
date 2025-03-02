import { Router } from "express";
import { clearDB } from "../controllers/test.controller";

export const testRouter = Router();

testRouter.delete('/', clearDB)