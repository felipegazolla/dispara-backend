import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

export const usersRoutes = Router();

const userController = new UserController();

usersRoutes.post("/", userController.create);
