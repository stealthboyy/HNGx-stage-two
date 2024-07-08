import { Router } from "express";
import { router as userRouter, path as userPath } from "./api/user";
import {
  router as organisationRouter,
  path as organisationPath,
} from "./api/organisation";
import { router as authRouter, path as authPath } from "./api/auth";

const router = Router();
const path = "/api";

router.use(userPath, userRouter);
router.use(organisationPath, organisationRouter);
router.use(authPath, authRouter);

export { router, path };
