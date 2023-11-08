import { ResponseService } from "../../utils";
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get user profile
      const { message, data } = await userService.getProfile(userId);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getUserByEmailOrPhone(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get req.query
      const query = req.query as { emailOrPhone: string };

      // get user by email or phone
      const { message, data } = await userService.getUserByEmailOrPhone(query);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async createBusTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get amount from req.body
      const dto = req.body;

      // create bus ticket
      const { message, data } = await userService.createBusTicket(userId, dto);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getUserBusTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get user bus tickets
      const { message, data } = await userService.getUserBusTickets(userId);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getUserBusTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get req.params
      const param = req.params as { ticketId: string };

      // get user bus ticket
      const { message, data } = await userService.getBusTicket(userId, param);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getWalletDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get wallet details
      const { message, data } = await userService.getWalletDetails(userId);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getWalletBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // get services from container
      const container = req.container;
      const userService = container.get<UserService>("service.UserService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      // get user id from req.user
      const userId = req.user["userId"];

      // get wallet balance
      const { message, data } = await userService.getWalletBalance(userId);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }
}
