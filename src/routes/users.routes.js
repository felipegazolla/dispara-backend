import { Router } from "express";

export const usersRoutes = Router();

usersRoutes.post("/", (req, res) => {
	const { name, email, password } = req.body;

	res.json({ name, email, password });
});
