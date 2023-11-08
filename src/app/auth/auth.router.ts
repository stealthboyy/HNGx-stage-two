import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const path = "/auth";

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

export { router, path };
