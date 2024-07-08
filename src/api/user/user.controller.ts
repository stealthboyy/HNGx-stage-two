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

      // get current logged in user id from req.user
      const cUserId = req.user["userId"];

      // get id from req.params
      const { id } = req.params;

      // get user profile
      const { message, data } = await userService.getProfile(cUserId, id);

      // return response
      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }


}
