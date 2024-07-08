import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares";
import { UserController } from "./user.controller";

const router = Router();
const path = "/users";

router.get("/:id", AuthMiddleWare.jwtProtect, UserController.getProfile);

export { router, path };
