import { NextFunction, Request, Response } from "express";
import { JwtService } from "../utils";
import { BadRequest } from "http-errors";

export class AuthMiddleWare {
  static async jwtProtect(req: Request, _: Response, next: NextFunction) {
    try {
      // get auth from header
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new BadRequest("No Authorization Header found");

      // get token from auth header
      const [_, token] = authHeader.split(" ");
      if (!token)
        throw new BadRequest("No Token found in Authorization Header");

      // get jwt service
      const jwtService = req.container.get<JwtService>("service.JwtService");

      // verify token
      const user = await jwtService.verifyJWT(token);

      // set user to req
      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  }
}
