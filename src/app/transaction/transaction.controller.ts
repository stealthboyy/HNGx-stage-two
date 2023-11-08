import { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service";
import { ResponseService } from "../../utils";
export class TransactionController {
  static async getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const transactionService = container.get<TransactionService>(
        "service.TransactionService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const query = req.query as {
        page: string;
        limit: string;
        startDate?: string;
        endDate?: string;
      };

      const { message, data } = await transactionService.getAllTransactions(
        userId,
        query
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const container = req.container;
      const transactionService = container.get<TransactionService>(
        "service.TransactionService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const params = req.params as { transactionId: string };

      const { message, data } = await transactionService.getTransaction(
        userId,
        params
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async fundWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const container = req.container;
      const transactionService = container.get<TransactionService>(
        "service.TransactionService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const dto = req.body;

      const { message, data } = await transactionService.fundWallet(
        userId,
        dto
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async payForBusTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const transactionService = container.get<TransactionService>(
        "service.TransactionService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const params = req.params as { ticketId: string };

      const { message, data } = await transactionService.payForBusTicket(
        userId,
        params
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async sendCredit(req: Request, res: Response, next: NextFunction) {
    try {
      const container = req.container;
      const transactionService = container.get<TransactionService>(
        "service.TransactionService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const dto = req.body;

      const { message, data } = await transactionService.sendCredit(
        userId,
        dto
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }
}
