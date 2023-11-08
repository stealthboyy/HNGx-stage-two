import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares";
import { TransactionController } from "./transaction.controller";

const router = Router();
const path = "/transaction";

router.get(
  "/all",
  AuthMiddleWare.jwtProtect,
  TransactionController.getAllTransactions
);

router.post(
    "/fund-wallet",
    AuthMiddleWare.jwtProtect,
    TransactionController.fundWallet
  );
  
router.get(
  "/:transactionId",
  AuthMiddleWare.jwtProtect,
  TransactionController.getTransaction
);

router.patch(
  "/pay-for-bus-ticket/:ticketId",
  AuthMiddleWare.jwtProtect,
  TransactionController.payForBusTicket
);

router.post(
  "/send-credit",
  AuthMiddleWare.jwtProtect,
  TransactionController.sendCredit
);

export { router, path };
