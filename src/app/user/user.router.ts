import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares";
import { UserController } from "./user.controller";

const router = Router();
const path = "/user";

router.get("/profile", AuthMiddleWare.jwtProtect, UserController.getProfile);

router.get(
  "/get-user-by-email-or-phone",
  AuthMiddleWare.jwtProtect,
  UserController.getUserByEmailOrPhone
);

router.post(
  "/ticket",
  AuthMiddleWare.jwtProtect,
  UserController.createBusTicket
);
router.get(
  "/ticket/all",
  AuthMiddleWare.jwtProtect,
  UserController.getUserBusTickets
);

router.get(
  "/ticket/:ticketId",
  AuthMiddleWare.jwtProtect,
  UserController.getUserBusTicket
);

router.get(
  "/wallet/details",
  AuthMiddleWare.jwtProtect,
  UserController.getWalletDetails
);

router.get(
  "/wallet/balance",
  AuthMiddleWare.jwtProtect,
  UserController.getWalletBalance
);

export { router, path };
