import { AppError } from "../utils/AppError.js";

export class UserController {
	create(req, res) {
		const { name, email, password } = req.body;

		if (!name) {
			throw new AppError("Nome obrigatório.");
		}

		res.status(201).json({ name, email, password });
	}
}
