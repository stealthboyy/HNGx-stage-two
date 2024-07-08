import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ResponseService } from "../../utils";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const container = req.container;
      const authService = container.get<AuthService>("service.AuthService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const dto = req.body;

      const { message, data } = await authService.signup(dto);

      return responseService.createdResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const container = req.container;
      const authService = container.get<AuthService>("service.AuthService");
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const dto = req.body;

      const { message, data } = await authService.login(dto);

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }
}
