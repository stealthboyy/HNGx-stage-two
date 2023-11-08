import { Router } from "express";
import { router as userRouter, path as userPath } from "./app/user";
import {
  router as transactionRouter,
  path as transactionPath,
} from "./app/transaction";
import { router as authRouter, path as authPath } from "./app/auth";

const router = Router();
const path = "/api/v1";

router.use(userPath, userRouter);
router.use(transactionPath, transactionRouter);
router.use(authPath, authRouter);

export { router, path };
