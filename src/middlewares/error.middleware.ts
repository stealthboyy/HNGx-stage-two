import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { ValidationError } from "joi";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ResponseService } from "src/utils";
import { Prisma } from "@prisma/client";
import { Config } from "../config";

export class ErrorMiddleware {
  static globalErrorHandler(
    error: any,
    req: Request,
    res: Response,
    _: NextFunction
  ) {
    const container = req.container;
    const responseService = container.get<ResponseService>(
      "service.ResponseService"
    );

    // handle joi validation errors
    if (error instanceof ValidationError) {
      const errors = [];
      for (const detail of error.details) {
        errors.push({
          field: detail.context.key,
          message: detail.message,
        });
      }
      return responseService.validationErrorResponse(res, errors);
    }

    // handle jwt errors
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError ||
      error instanceof NotBeforeError
    ) {
      return responseService.unauthorizedResponse(res, error.message);
    }

    // handle http errors
    if (error instanceof HttpError) {
      switch (error.statusCode) {
        case 400:
          return responseService.badRequestResponse(res, error.message);
        case 401:
          return responseService.unauthorizedResponse(res, error.message);
        case 403:
          return responseService.forbiddenResponse(res, error.message);
        case 404:
          return responseService.notFoundResponse(res, error.message);
        default:
          return responseService.internalServerErrorResponse(
            res,
            error.message
          );
      }
    }

    // handle prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Prisma Error";
      let errors: any = [];

      if (error.code === "P2002") {
        message = "Unique constraint failed on the fields";
        const error: any[] = [];
        // @ts-expect-error will set it later
        const fields = error.meta.target.map((t: any) => t);
        for (const field of fields) {
          errors.push({
            [field]: `${field} is already in use`,
          });
        }
      } else {
        message = error.message;
        errors = error.meta;
      }

      return responseService.badRequestResponse(res, message, errors);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return responseService.badRequestResponse(
        res,
        Config.appEnv == "PRODUCTION"
          ? "Error occured due to mismatch"
          : error.message
      );
    }
  }
}
